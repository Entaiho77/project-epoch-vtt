// Prevents additional console window on Windows in release
#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

mod relay;
mod store;

use std::sync::Mutex;

use serde::Serialize;
use serde_json::{Map, Value};
use tauri::{AppHandle, Emitter, Manager, State};

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

// --- App ----------------------------------------------------------------------

#[tauri::command]
fn app_get_version(app: AppHandle) -> String {
    app.package_info().version.to_string()
}

fn main() {
    tauri::Builder::default()
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
            app_get_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
