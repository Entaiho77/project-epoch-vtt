// Prevents additional console window on Windows in release
#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod assets;
mod relay;
mod store;

use std::sync::Mutex;

use serde::Serialize;
use serde_json::{Map, Value};
use tauri::{AppHandle, Emitter, Manager, State};

use assets::Assets;
use relay::{RelayHandle, RelayIdentity};
use store::KvStore;

/// Native capabilities exposed to the renderer. The frontend bridge
/// (src/renderer/native/tauriBridge.ts) wraps these as `window.db`,
/// `window.relay` and `window.epochApp`, the same shape the Electron
/// preload exposed, so the data layer above it is unchanged.
struct Db(Mutex<KvStore>);
struct Relay(Mutex<Option<RelayHandle>>);

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

// --- Relay --------------------------------------------------------------------

#[tauri::command]
fn relay_connect(
    app: AppHandle,
    relay: State<Relay>,
    url: String,
    identity: RelayIdentity,
) -> CmdResult<()> {
    let mut slot = lock(&relay.0)?;
    if let Some(old) = slot.take() {
        old.disconnect();
    }
    *slot = Some(relay::start(app, url, identity));
    Ok(())
}

#[tauri::command]
fn relay_disconnect(relay: State<Relay>) -> CmdResult<()> {
    if let Some(old) = lock(&relay.0)?.take() {
        old.disconnect();
    }
    Ok(())
}

#[tauri::command]
fn relay_send(relay: State<Relay>, message: Value) -> CmdResult<()> {
    if let Some(handle) = lock(&relay.0)?.as_ref() {
        handle.send(&message);
    }
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
        None => builder.status(404).body(Vec::new()),
    }
    .unwrap_or_else(|_| tauri::http::Response::new(Vec::new()))
}

// --- App ----------------------------------------------------------------------

#[tauri::command]
fn app_get_version(app: AppHandle) -> String {
    app.package_info().version.to_string()
}

fn main() {
    tauri::Builder::default()
        .register_uri_scheme_protocol("epoch-asset", |ctx, request| {
            serve_asset(ctx.app_handle(), &request)
        })
        .setup(|app| {
            // e.g. C:\Users\<you>\AppData\Roaming\com.epoch.vtt\epoch.db
            let dir = app.path().app_data_dir()?;
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
            app.manage(Relay(Mutex::new(None)));
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
            asset_put,
            app_get_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
