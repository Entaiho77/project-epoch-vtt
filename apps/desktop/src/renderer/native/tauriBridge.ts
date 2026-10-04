import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

/**
 * Installs `window.db`, `window.relay`, `window.epochAssets` and `window.epochApp`
 * on top of the Rust commands in src-tauri/src/main.rs. db/relay match the old
 * Electron preload exactly, so data/realtime.ts and everything above it is unchanged.
 *
 * Event listeners are registered once, up front, and every command waits for
 * them first: otherwise the immediate value Rust sends back on `subscribe` could
 * arrive before the listener exists and be lost.
 *
 * Outside Tauri (plain browser via `npm run dev:web`, or tests) this does
 * nothing, and the data layer falls back to its no-bridge behavior.
 */

type DbUpdateCb = (path: string, value: unknown, subId: string) => void;
type MessageCb = (message: unknown) => void;
type StatusCb = (status: string) => void;

interface DbUpdatePayload {
  path: string;
  value: unknown;
  subId: string;
}

export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export function installTauriBridge(): void {
  if (!isTauri() || window.db) return;

  const dbCallbacks: DbUpdateCb[] = [];
  let messageCallbacks: MessageCb[] = [];
  let statusCallbacks: StatusCb[] = [];

  const ready = Promise.all([
    listen<DbUpdatePayload>('db:update', ({ payload }) => {
      for (const cb of dbCallbacks) cb(payload.path, payload.value ?? null, payload.subId);
    }),
    listen<unknown>('relay:message', ({ payload }) => {
      for (const cb of messageCallbacks) cb(payload);
    }),
    listen<string>('relay:status', ({ payload }) => {
      for (const cb of statusCallbacks) cb(payload);
    }),
  ]);
  ready.catch((error: unknown) => {
    // Usually a missing permission in src-tauri/capabilities/default.json.
    console.error('[tauriBridge] could not register native event listeners:', error);
  });

  const call = async <T>(cmd: string, args?: Record<string, unknown>): Promise<T> => {
    await ready;
    return invoke<T>(cmd, args);
  };

  window.db = {
    read: (path) => call('db_read', { path }),
    write: (path, value) => call('db_write', { path, value: value ?? null }),
    update: (path, value) => call('db_update', { path, value }),
    multiUpdate: (updates) => call('db_multi_update', { updates }),
    delete: (path) => call('db_delete', { path }),
    newKey: () => call('db_new_key'),
    subscribe: (path, id) => call('db_subscribe', { path, id }),
    unsubscribe: (id) => call('db_unsubscribe', { id }),
    onUpdate: (cb) => {
      dbCallbacks.push(cb);
    },
  };

  window.relay = {
    connect: (url, identity) => call('relay_connect', { url, identity }),
    disconnect: () => call('relay_disconnect'),
    approve: (peerKey, allow) => call('relay_approve', { peerKey, allow }),
    kick: (playerId) => call('relay_kick', { playerId }),
    setCode: (roomCode) => call('relay_set_code', { roomCode }),
    send: (message) => call('relay_send', { message }),
    onMessage: (cb) => {
      messageCallbacks.push(cb);
    },
    onStatus: (cb) => {
      statusCallbacks.push(cb);
    },
    removeListeners: () => {
      messageCallbacks = [];
      statusCallbacks = [];
    },
  };

  // Raw bytes as the request body: no base64 round-trip for large maps.
  const putBytes = (bytes: Uint8Array, mime: string): Promise<string> =>
    invoke<string>('asset_put', bytes, { headers: { 'x-mime': mime } });

  window.epochAssets = {
    put: async (file) => putBytes(new Uint8Array(await file.arrayBuffer()), file.type),
    putBytes,
    has: (name) => invoke<boolean>('asset_has', { name }),
    get: (name) => invoke<ArrayBuffer>('asset_get', { name }),
    url: (name) => convertFileSrc(name, 'epoch-asset'),
  };

  window.epochApp = {
    getVersion: () => call('app_get_version'),
  };
}
