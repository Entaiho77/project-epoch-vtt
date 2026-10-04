//! WebSocket client to the relay server (apps/relay). On connect it introduces
//! itself with a `host` or `join` message (per @epoch/protocol); every server
//! frame is decoded and forwarded to the renderer as a `relay:message` event.
//! Auto-reconnects a few times with the same identity so a blip doesn't kill
//! the session. Mirrors the old Electron `RelayConnection`.

use std::time::Duration;

use futures_util::{SinkExt, StreamExt};
use serde::Deserialize;
use serde_json::{json, Value};
use tauri::{AppHandle, Emitter};
use tokio::sync::{mpsc, watch};
use tokio_tungstenite::{connect_async, tungstenite::Message};

const MAX_RECONNECT: u32 = 3;
const RECONNECT_DELAY: Duration = Duration::from_millis(1500);

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RelayIdentity {
    pub mode: String, // "host" | "join"
    pub uid: String,
    pub display_name: String,
    pub room_code: Option<String>,
}

impl RelayIdentity {
    fn hello(&self) -> Value {
        if self.mode == "host" {
            json!({ "type": "host", "payload": { "gmId": self.uid, "displayName": self.display_name } })
        } else {
            json!({
                "type": "join",
                "payload": {
                    "roomCode": self.room_code.clone().unwrap_or_default(),
                    "playerId": self.uid,
                    "displayName": self.display_name,
                }
            })
        }
    }
}

/// A live connection: outgoing messages go through `tx`; flipping `stop` ends it.
pub struct RelayHandle {
    tx: mpsc::UnboundedSender<String>,
    stop: watch::Sender<bool>,
}

impl RelayHandle {
    pub fn send(&self, message: &Value) {
        let _ = self.tx.send(message.to_string());
    }

    pub fn disconnect(&self) {
        let _ = self.stop.send(true);
    }
}

fn status(app: &AppHandle, s: &str) {
    let _ = app.emit("relay:status", s);
}

pub fn start(app: AppHandle, url: String, identity: RelayIdentity) -> RelayHandle {
    let (tx, mut rx) = mpsc::unbounded_channel::<String>();
    let (stop_tx, mut stop_rx) = watch::channel(false);

    tauri::async_runtime::spawn(async move {
        let mut attempts: u32 = 0;
        loop {
            status(&app, "connecting");
            match connect_async(url.as_str()).await {
                Ok((ws, _)) => {
                    attempts = 0;
                    let (mut sink, mut stream) = ws.split();
                    // Messages queued while we weren't connected are dropped,
                    // matching the old client (it only sent while OPEN).
                    while rx.try_recv().is_ok() {}
                    if sink.send(Message::Text(identity.hello().to_string().into())).await.is_err() {
                        status(&app, "error");
                    } else {
                        status(&app, "open");
                        loop {
                            tokio::select! {
                                _ = stop_rx.changed() => {
                                    let _ = sink.send(Message::Close(None)).await;
                                    status(&app, "closed");
                                    return;
                                }
                                outgoing = rx.recv() => match outgoing {
                                    Some(text) => {
                                        if sink.send(Message::Text(text.into())).await.is_err() { break; }
                                    }
                                    None => return, // handle dropped
                                },
                                incoming = stream.next() => match incoming {
                                    Some(Ok(Message::Text(text))) => {
                                        // The relay only sends JSON; ignore anything malformed.
                                        if let Ok(msg) = serde_json::from_str::<Value>(text.as_str()) {
                                            let _ = app.emit("relay:message", msg);
                                        }
                                    }
                                    Some(Ok(Message::Close(_))) | None => break,
                                    Some(Ok(_)) => {}
                                    Some(Err(_)) => { status(&app, "error"); break; }
                                },
                            }
                        }
                    }
                }
                Err(_) => status(&app, "error"),
            }

            status(&app, "closed");
            if *stop_rx.borrow() || attempts >= MAX_RECONNECT {
                return;
            }
            attempts += 1;
            tokio::select! {
                _ = tokio::time::sleep(RECONNECT_DELAY) => {}
                _ = stop_rx.changed() => return,
            }
        }
    });

    RelayHandle { tx, stop: stop_tx }
}
