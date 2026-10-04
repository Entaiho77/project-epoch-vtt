//! Starts and talks to the peer-to-peer helper (apps/desktop/swarm/helper.js,
//! running on the bundled Bare runtime).
//!
//! The helper does all the Hyperswarm networking. This side:
//!  - launches it once, on the first host/join, with this install's key seed;
//!  - listens on 127.0.0.1 for it to connect back (a random port plus a one-time
//!    token, so no other program can pose as the helper);
//!  - forwards commands from the app as JSON lines, and turns the helper's events
//!    into the same `relay:status` / `relay:message` events the old WebSocket relay
//!    produced, so the screens don't need to know what's underneath.

use std::path::{Path, PathBuf};
use std::process::Stdio;
use std::sync::{Arc, Mutex};
use std::time::Duration;

use serde_json::{json, Value};
use tauri::{AppHandle, Emitter, Manager, Runtime};
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpListener;
use tokio::process::{Child, Command};
use tokio::sync::mpsc;

/// A running helper: send commands through `tx`.
struct Running {
    tx: mpsc::UnboundedSender<String>,
    _child: Child, // dropped (and killed) with this struct
}

pub struct Swarm {
    running: Arc<Mutex<Option<Running>>>,
    /// Held while starting, so two quick commands can't launch two helpers.
    starting: tokio::sync::Mutex<()>,
    /// 32-byte seed (hex) for this install's key pair; players are recognised by it.
    seed_hex: String,
}

fn status<R: Runtime>(app: &AppHandle<R>, s: &str) {
    let _ = app.emit("relay:status", s);
}

fn error_message<R: Runtime>(app: &AppHandle<R>, text: &str) {
    let _ = app.emit(
        "relay:message",
        json!({ "type": "error", "payload": { "message": text } }),
    );
}

/// Read this install's key seed, creating it on first use.
pub fn load_or_create_seed(dir: &Path) -> std::io::Result<String> {
    let path = dir.join("swarm.key");
    if let Ok(existing) = std::fs::read_to_string(&path) {
        let s = existing.trim().to_string();
        if s.len() == 64 && s.bytes().all(|b| b.is_ascii_hexdigit()) {
            return Ok(s);
        }
    }
    let seed = format!(
        "{}{}",
        uuid::Uuid::new_v4().simple(),
        uuid::Uuid::new_v4().simple()
    );
    std::fs::write(&path, &seed)?;
    Ok(seed)
}

/// Where the Bare runtime and the helper bundle live. Tauri puts the sidecar
/// next to the app's own executable, and resources under the resource folder.
fn helper_paths<R: Runtime>(app: &AppHandle<R>) -> Result<(PathBuf, PathBuf), String> {
    let exe_dir = std::env::current_exe()
        .map_err(|e| e.to_string())?
        .parent()
        .ok_or("no executable folder")?
        .to_path_buf();
    let mut bare = exe_dir.join(if cfg!(windows) { "bare.exe" } else { "bare" });
    let resources = app.path().resource_dir().map_err(|e| e.to_string())?;
    let mut bundle = resources.join("swarm").join("helper.bundle");
    // Dev/test builds only: let tests point at the prepared files directly.
    if cfg!(debug_assertions) {
        if let Ok(p) = std::env::var("EPOCH_SWARM_BARE") {
            bare = PathBuf::from(p);
        }
        if let Ok(p) = std::env::var("EPOCH_SWARM_BUNDLE") {
            bundle = PathBuf::from(p);
        }
    }
    if !bare.is_file() {
        return Err(format!("peer-to-peer runtime missing at {}", bare.display()));
    }
    if !bundle.is_file() {
        return Err(format!("peer-to-peer helper missing at {}", bundle.display()));
    }
    Ok((bare, bundle))
}

impl Swarm {
    pub fn new(seed_hex: String) -> Self {
        Self { running: Arc::new(Mutex::new(None)), starting: tokio::sync::Mutex::new(()), seed_hex }
    }

    /// Send one command to the helper, starting it first if needed.
    pub async fn command<R: Runtime>(&self, app: &AppHandle<R>, cmd: Value) -> Result<(), String> {
        let line = cmd.to_string();
        let _starting = self.starting.lock().await;
        if let Some(r) = self.running.lock().map_err(|_| "lock")?.as_ref() {
            if r.tx.send(line.clone()).is_ok() {
                return Ok(());
            }
        }
        let tx = self.start(app).await?;
        tx.send(line).map_err(|_| "peer-to-peer helper stopped".to_string())
    }

    /// Commands that only make sense if the helper is already running.
    pub fn command_if_running(&self, cmd: Value) {
        if let Ok(guard) = self.running.lock() {
            if let Some(r) = guard.as_ref() {
                let _ = r.tx.send(cmd.to_string());
            }
        }
    }

    async fn start<R: Runtime>(&self, app: &AppHandle<R>) -> Result<mpsc::UnboundedSender<String>, String> {
        let (bare, bundle) = helper_paths(app)?;
        let listener = TcpListener::bind("127.0.0.1:0").await.map_err(|e| e.to_string())?;
        let port = listener.local_addr().map_err(|e| e.to_string())?.port();
        let token = uuid::Uuid::new_v4().simple().to_string();

        let mut command = Command::new(&bare);
        command
            .arg(&bundle)
            .args(["--port", &port.to_string(), "--token", &token, "--seed", &self.seed_hex])
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::inherit())
            .kill_on_drop(true);
        // Tests and local experiments can point the helper at a private network.
        if let Ok(bootstrap) = std::env::var("EPOCH_SWARM_BOOTSTRAP") {
            command.args(["--bootstrap", &bootstrap]);
        }
        #[cfg(windows)]
        {
            // Don't flash a console window for the helper.
            const CREATE_NO_WINDOW: u32 = 0x0800_0000;
            command.creation_flags(CREATE_NO_WINDOW);
        }
        let child = command
            .spawn()
            .map_err(|e| format!("could not start the peer-to-peer helper: {e}"))?;

        // The helper connects back and proves it's ours with the token.
        let (socket, _) = tokio::time::timeout(Duration::from_secs(15), listener.accept())
            .await
            .map_err(|_| "the peer-to-peer helper didn't start in time".to_string())?
            .map_err(|e| e.to_string())?;
        drop(listener);
        let (read_half, mut write_half) = socket.into_split();
        let mut lines = BufReader::new(read_half).lines();
        let first = tokio::time::timeout(Duration::from_secs(5), lines.next_line())
            .await
            .map_err(|_| "the peer-to-peer helper didn't say hello".to_string())?
            .map_err(|e| e.to_string())?
            .unwrap_or_default();
        let hello: Value = serde_json::from_str(&first).unwrap_or(Value::Null);
        if hello.get("token").and_then(Value::as_str) != Some(token.as_str()) {
            return Err("unexpected program on the helper port".into());
        }

        let (tx, mut rx) = mpsc::unbounded_channel::<String>();

        // App → helper.
        tauri::async_runtime::spawn(async move {
            while let Some(mut line) = rx.recv().await {
                line.push('\n');
                if write_half.write_all(line.as_bytes()).await.is_err() {
                    break;
                }
            }
        });

        // Helper → app.
        let app_for_reader = app.clone();
        let running = self.running.clone();
        tauri::async_runtime::spawn(async move {
            while let Ok(Some(line)) = lines.next_line().await {
                let Ok(ev) = serde_json::from_str::<Value>(&line) else { continue };
                match ev.get("ev").and_then(Value::as_str) {
                    Some("status") => {
                        if let Some(s) = ev.get("status").and_then(Value::as_str) {
                            status(&app_for_reader, s);
                        }
                    }
                    Some("message") => {
                        if let Some(m) = ev.get("message") {
                            let _ = app_for_reader.emit("relay:message", m.clone());
                        }
                    }
                    _ => {}
                }
            }
            // The helper went away (crash or app shutdown): forget it so the next
            // host/join starts a fresh one.
            if let Ok(mut guard) = running.lock() {
                *guard = None;
            }
            status(&app_for_reader, "closed");
        });

        *self.running.lock().map_err(|_| "lock")? = Some(Running { tx: tx.clone(), _child: child });
        Ok(tx)
    }
}

/// Map the app's connect call onto a helper command.
pub fn connect_command(identity: &Value) -> Result<Value, String> {
    let mode = identity.get("mode").and_then(Value::as_str).unwrap_or("");
    let s = |k: &str| identity.get(k).and_then(Value::as_str).unwrap_or("").to_string();
    let room_code = s("roomCode");
    if room_code.is_empty() {
        return Err("A room code is required.".into());
    }
    let cmd = match mode {
        "host" => "host",
        "join" => "join",
        _ => return Err(format!("unknown session mode: {mode}")),
    };
    Ok(json!({ "cmd": cmd, "roomCode": room_code, "uid": s("uid"), "displayName": s("displayName") }))
}

/// Report a failure to the screens in the same shape as other session errors.
pub fn report_error<R: Runtime>(app: &AppHandle<R>, text: &str) {
    status(app, "error");
    error_message(app, text);
}

#[cfg(test)]
mod tests {
    //! Runs the real helper (bundled, on Bare) through this module, on a private
    //! HyperDHT network started with Node. Needs `node scripts/prepare-swarm.mjs`
    //! to have run, and Node on PATH; skipped otherwise.
    use super::*;
    use std::sync::mpsc as std_mpsc;
    use tauri::Listener;

    fn manifest() -> PathBuf {
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
    }

    /// Start a private network; returns its bootstrap list and the process.
    fn testnet() -> Option<(String, std::process::Child)> {
        use std::io::BufRead;
        let script = "const t=require('hyperdht/testnet');t(3,{host:'127.0.0.1'}).then(n=>{console.log(n.bootstrap.map(b=>b.host+':'+b.port).join(','))})";
        let mut child = std::process::Command::new("node")
            .args(["-e", script])
            .current_dir(manifest().join(".."))
            .stdout(Stdio::piped())
            .spawn()
            .ok()?;
        let mut line = String::new();
        std::io::BufReader::new(child.stdout.take()?).read_line(&mut line).ok()?;
        Some((line.trim().to_string(), child))
    }

    fn app_with_events() -> (tauri::App<tauri::test::MockRuntime>, std_mpsc::Receiver<(String, Value)>) {
        let app = tauri::test::mock_builder()
            .build(tauri::test::mock_context(tauri::test::noop_assets()))
            .unwrap();
        let (tx, rx) = std_mpsc::channel();
        for name in ["relay:status", "relay:message"] {
            let tx = tx.clone();
            app.listen_any(name, move |e| {
                let v: Value = serde_json::from_str(e.payload()).unwrap_or(Value::Null);
                let _ = tx.send((name.to_string(), v));
            });
        }
        (app, rx)
    }

    fn wait(rx: &std_mpsc::Receiver<(String, Value)>, what: &str, pred: impl Fn(&str, &Value) -> bool) -> Value {
        let deadline = std::time::Instant::now() + Duration::from_secs(20);
        while std::time::Instant::now() < deadline {
            if let Ok((name, v)) = rx.recv_timeout(Duration::from_millis(200)) {
                if pred(&name, &v) {
                    return v;
                }
            }
        }
        panic!("timed out waiting for {what}");
    }

    fn is_msg(t: &'static str) -> impl Fn(&str, &Value) -> bool {
        move |n, v| n == "relay:message" && v["type"] == t
    }

    #[test]
    fn host_and_join_through_the_real_helper() {
        let triple_bin = std::fs::read_dir(manifest().join("binaries"))
            .ok()
            .and_then(|mut d| d.next())
            .and_then(|e| e.ok())
            .map(|e| e.path());
        let bundle = manifest().join("swarm-dist").join("helper.bundle");
        let (Some(bare), true) = (triple_bin, bundle.is_file()) else {
            eprintln!("skipped: run `node scripts/prepare-swarm.mjs` first");
            return;
        };
        let Some((bootstrap, mut net)) = testnet() else {
            eprintln!("skipped: node not available");
            return;
        };
        std::env::set_var("EPOCH_SWARM_BARE", &bare);
        std::env::set_var("EPOCH_SWARM_BUNDLE", &bundle);
        std::env::set_var("EPOCH_SWARM_BOOTSTRAP", &bootstrap);

        let (gm_app, gm_rx) = app_with_events();
        let (pl_app, pl_rx) = app_with_events();
        let gm = Swarm::new("11".repeat(32));
        let pl = Swarm::new("22".repeat(32));
        let host = connect_command(&json!({"mode":"host","uid":"gm","displayName":"GM","roomCode":"RUST-TEST"})).unwrap();
        let join = connect_command(&json!({"mode":"join","uid":"p1","displayName":"Thomas","roomCode":"rust-test"})).unwrap();

        tauri::async_runtime::block_on(gm.command(gm_app.handle(), host)).unwrap();
        wait(&gm_rx, "hosted", is_msg("hosted"));
        tauri::async_runtime::block_on(pl.command(pl_app.handle(), join)).unwrap();
        let req = wait(&gm_rx, "join-request", is_msg("join-request"));
        assert_eq!(req["payload"]["playerId"], "p1");

        gm.command_if_running(json!({"cmd":"approve","peerKey":req["payload"]["peerKey"],"allow":true}));
        wait(&pl_rx, "player open", |n, v| n == "relay:status" && v == "open");

        pl.command_if_running(json!({"cmd":"send","data":{"hello":"gm"}}));
        let m = wait(&gm_rx, "player message", is_msg("game-message"));
        assert_eq!(m["payload"]["from"], "p1");
        assert_eq!(m["payload"]["data"]["hello"], "gm");

        gm.command_if_running(json!({"cmd":"send","to":"p1","data":{"hello":"player"}}));
        let m = wait(&pl_rx, "gm message", is_msg("game-message"));
        assert_eq!(m["payload"]["data"]["hello"], "player");

        gm.command_if_running(json!({"cmd":"leave"}));
        wait(&pl_rx, "gm-disconnected", is_msg("gm-disconnected"));
        let _ = net.kill();
    }

    #[test]
    fn seed_is_created_once_and_reused() {
        let dir = std::env::temp_dir().join(format!("epoch-seed-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&dir).unwrap();
        let a = load_or_create_seed(&dir).unwrap();
        let b = load_or_create_seed(&dir).unwrap();
        assert_eq!(a, b);
        assert_eq!(a.len(), 64);
    }

    #[test]
    fn connect_command_requires_a_room_code_and_known_mode() {
        assert!(connect_command(&json!({"mode":"host","roomCode":""})).is_err());
        assert!(connect_command(&json!({"mode":"spectate","roomCode":"ABCD"})).is_err());
    }
}
