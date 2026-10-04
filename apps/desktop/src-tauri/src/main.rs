// Prevents additional console window on Windows in release
#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod assets;
mod store;
mod swarm;

use std::sync::Mutex;

use serde::Serialize;
use serde_json::{Map, Value};
use tauri::{AppHandle, Emitter, Manager, State};

use assets::Assets;
use store::KvStore;
use swarm::Swarm;

/// Native capabilities exposed to the renderer. The frontend bridge
/// (src/renderer/native/tauriBridge.ts) wraps these as `window.db`,
/// `window.relay` and `window.epochApp`. `window.relay` keeps the shape the
/// old WebSocket relay had, but is now backed by the peer-to-peer helper.
struct Db(Mutex<KvStore>);

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DbUpdate {
    path: String,
    value: Value,
    sub_id: String,
}

type CmdResult<T> = Result<T, String>;

fn lock<T>(m: &Mutex<T>) -> CmdResult<std::sync::MutexGuard<'_, T>> {
    m.lock().map_err(|_| "storage lock poisoned".to_string())
}

// --- Storage ------------------------------------------------------------------

#[tauri::command]
fn db_read(db: State<Db>, path: String) -> CmdResult<Value> {
    lock(&db.0)?.read(&path)
}

#[tauri::command]
fn db_write(db: State<Db>, path: String, value: Value) -> CmdResult<()> {
    lock(&db.0)?.write(&path, value)
}

#[tauri::command]
fn db_update(db: State<Db>, path: String, value: Map<String, Value>) -> CmdResult<()> {
    lock(&db.0)?.update(&path, value)
}

#[tauri::command]
fn db_multi_update(db: State<Db>, updates: Map<String, Value>) -> CmdResult<()> {
    lock(&db.0)?.multi_update(updates)
}

#[tauri::command]
fn db_delete(db: State<Db>, path: String) -> CmdResult<()> {
    lock(&db.0)?.remove(&path)
}

#[tauri::command]
fn db_new_key() -> String {
    uuid::Uuid::new_v4().to_string()
}

#[tauri::command]
fn db_subscribe(db: State<Db>, path: String, id: String) -> CmdResult<()> {
    lock(&db.0)?.subscribe(&id, &path)
}

#[tauri::command]
fn db_unsubscribe(db: State<Db>, id: String) -> CmdResult<()> {
    lock(&db.0)?.unsubscribe(&id);
    Ok(())
}

// --- Sessions (peer-to-peer) -------------------------------------------------------

/// Host or join. `identity` is {mode: 'host'|'join', uid, displayName, roomCode}.
/// (`_url` is left over from the relay server days and ignored.)
#[tauri::command]
async fn relay_connect(
    app: AppHandle,
    swarm: State<'_, Swarm>,
    _url: Option<String>,
    identity: Value,
) -> CmdResult<()> {
    let cmd = swarm::connect_command(&identity)?;
    if let Err(e) = swarm.command(&app, cmd).await {
        swarm::report_error(&app, &e);
        return Err(e);
    }
    Ok(())
}

#[tauri::command]
fn relay_disconnect(swarm: State<'_, Swarm>) -> CmdResult<()> {
    swarm.command_if_running(serde_json::json!({ "cmd": "leave" }));
    Ok(())
}

/// `message` is {type: 'game-message', payload: {data, to?}}; `to` (GM only)
/// sends to one player instead of everyone.
#[tauri::command]
fn relay_send(swarm: State<'_, Swarm>, message: Value) -> CmdResult<()> {
    let payload = message.get("payload").cloned().unwrap_or(Value::Null);
    let mut cmd = serde_json::json!({ "cmd": "send", "data": payload.get("data").cloned().unwrap_or(Value::Null) });
    if let Some(to) = payload.get("to").and_then(Value::as_str) {
        cmd["to"] = Value::String(to.to_string());
    }
    swarm.command_if_running(cmd);
    Ok(())
}

/// GM: let a waiting player in (or turn them away).
#[tauri::command]
fn relay_approve(swarm: State<'_, Swarm>, peer_key: String, allow: bool) -> CmdResult<()> {
    swarm.command_if_running(serde_json::json!({ "cmd": "approve", "peerKey": peer_key, "allow": allow }));
    Ok(())
}

/// GM: remove a player from this session; their device can't rejoin on this code.
#[tauri::command]
fn relay_kick(swarm: State<'_, Swarm>, player_id: String) -> CmdResult<()> {
    swarm.command_if_running(serde_json::json!({ "cmd": "kick", "playerId": player_id }));
    Ok(())
}

/// GM: switch the hosted game to a new room code (after regenerating it).
/// Players already connected stay connected.
#[tauri::command]
fn relay_set_code(swarm: State<'_, Swarm>, room_code: String) -> CmdResult<()> {
    swarm.command_if_running(serde_json::json!({ "cmd": "retopic", "roomCode": room_code }));
    Ok(())
}

/// Send one encoded voice frame (base64 Opus). Players' frames go to the GM, the
/// GM's to every player. Dropped quietly if not in a session.
#[tauri::command]
fn relay_voice(swarm: State<'_, Swarm>, seq: u32, data: String) -> CmdResult<()> {
    if data.len() <= 2048 {
        swarm.command_if_running(serde_json::json!({ "cmd": "voice", "seq": seq & 0xffff, "data": data }));
    }
    Ok(())
}

/// GM: mute or unmute a player's voice for everyone.
#[tauri::command]
fn relay_voice_mute(swarm: State<'_, Swarm>, player_id: String, muted: bool) -> CmdResult<()> {
    swarm.command_if_running(serde_json::json!({ "cmd": "voice-mute", "playerId": player_id, "muted": muted }));
    Ok(())
}

// --- Images -------------------------------------------------------------------

/// Save an uploaded image to disk. The renderer sends the raw file bytes as the
/// request body (no base64 round-trip) and its MIME type in an `x-mime` header.
/// Returns the short reference to store in the save file.
#[tauri::command]
fn asset_put(assets: State<Assets>, request: tauri::ipc::Request<'_>) -> CmdResult<String> {
    let tauri::ipc::InvokeBody::Raw(bytes) = request.body() else {
        return Err("expected raw image bytes".into());
    };
    let mime = request
        .headers()
        .get("x-mime")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    assets.put(bytes, mime)
}

#[tauri::command]
fn asset_has(assets: State<Assets>, name: String) -> bool {
    assets.has(&name)
}

/// Raw bytes of a stored image (sent to other players who don't have it yet).
#[tauri::command]
fn asset_get(assets: State<Assets>, name: String) -> CmdResult<tauri::ipc::Response> {
    assets
        .read(&name)
        .map(tauri::ipc::Response::new)
        .ok_or_else(|| format!("image not found: {name}"))
}

/// Serves `epoch-asset://localhost/<name>` (on Windows:
/// `http://epoch-asset.localhost/<name>`) from the assets folder.
fn serve_asset(app: &AppHandle, request: &tauri::http::Request<Vec<u8>>) -> tauri::http::Response<Vec<u8>> {
    let name = request.uri().path().trim_start_matches('/');
    let found = app.try_state::<Assets>().and_then(|a| a.read(name));
    let builder = tauri::http::Response::builder().header("Access-Control-Allow-Origin", "*");
    match found {
        Some(bytes) => builder
            .status(200)
            .header("Content-Type", assets::mime_for_name(name))
            // Names are content hashes, so a given URL never changes: cache forever.
            .header("Cache-Control", "public, max-age=31536000, immutable")
            .body(bytes),
        // Not here (yet): it may be on its way from another player, so never cache the miss.
        None => builder.status(404).header("Cache-Control", "no-store").body(Vec::new()),
    }
    .unwrap_or_else(|_| tauri::http::Response::new(Vec::new()))
}

// --- App ----------------------------------------------------------------------

#[tauri::command]
fn app_get_version(app: AppHandle) -> String {
    app.package_info().version.to_string()
}

/// Profile from the EPOCH_PROFILE environment variable, limited to letters,
/// digits, '-' and '_' so it can only ever name a folder inside the app's own.
fn profile_name() -> Option<String> {
    let raw = std::env::var("EPOCH_PROFILE").ok()?;
    let clean: String = raw
        .trim()
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || *c == '-' || *c == '_')
        .take(32)
        .collect();
    (!clean.is_empty()).then_some(clean)
}

fn main() {
    tauri::Builder::default()
        .register_uri_scheme_protocol("epoch-asset", |ctx, request| {
            serve_asset(ctx.app_handle(), &request)
        })
        .setup(|app| {
            // e.g. C:\Users\<you>\AppData\Roaming\com.epoch.vtt\epoch.db
            let mut dir = app.path().app_data_dir()?;
            // EPOCH_PROFILE=<name> runs a separate copy with its own save and
            // images (profiles\<name>\), e.g. to play GM and player on one PC.
            if let Some(profile) = profile_name() {
                dir = dir.join("profiles").join(&profile);
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.set_title(&format!("Project Epoch VTT ({profile})"));
                }
            }
            std::fs::create_dir_all(&dir)?;
            let handle = app.handle().clone();
            let kv = KvStore::open(
                &dir.join("epoch.db"),
                Box::new(move |sub_id, path, value| {
                    let _ = handle.emit(
                        "db:update",
                        DbUpdate {
                            path: path.to_string(),
                            value: value.clone(),
                            sub_id: sub_id.to_string(),
                        },
                    );
                }),
            )
            .map_err(|e| format!("could not open the save file: {e}"))?;
            let mut kv = kv;
            let images = Assets::open(&dir.join("assets"))
                .map_err(|e| format!("could not open the images folder: {e}"))?;
            // Move any images still stored inside the save file out to disk.
            match kv.convert_inline_images(|data_url| images.put_data_url(data_url)) {
                Ok(0) => {}
                Ok(n) => println!("[epoch] moved {n} inline image(s) out of the save file"),
                Err(e) => eprintln!("[epoch] image conversion skipped: {e}"),
            }
            app.manage(images);
            app.manage(Db(Mutex::new(kv)));
            let seed = swarm::load_or_create_seed(&dir)
                .map_err(|e| format!("could not create this computer's session key: {e}"))?;
            app.manage(Swarm::new(seed, dir.join("swarm.log")));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            db_read,
            db_write,
            db_update,
            db_multi_update,
            db_delete,
            db_new_key,
            db_subscribe,
            db_unsubscribe,
            relay_connect,
            relay_disconnect,
            relay_send,
            relay_approve,
            relay_kick,
            relay_set_code,
            relay_voice,
            relay_voice_mute,
            asset_put,
            asset_has,
            asset_get,
            app_get_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
