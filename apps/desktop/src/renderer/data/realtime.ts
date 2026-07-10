import { useEffect, useState } from 'react';

/**
 * The ONE sync mechanism, re-homed from Firebase RTDB to the desktop stack:
 * local SQLite (window.db, main process) is the source of truth, and a live
 * session mirrors writes across the WebSocket relay (window.relay).
 *
 * The API is signature-identical to the Firebase version, so every data module
 * and screen above this file is unchanged:
 *   subscribe / readValue / writeValue / updateValue / multiUpdate / newKey / useValue
 *
 * Sync model (GM-authoritative):
 * - Any local mutation (outside `local/…`, which never leaves the machine) is
 *   applied to SQLite and — while in a session — broadcast over the relay.
 * - The GM applies player ops and re-broadcasts them so every player converges
 *   (the relay only routes player→GM and GM→players).
 * - A joining player receives a snapshot of the hosted game from the GM; anything
 *   else resolves on demand via read-requests answered by the GM.
 */

export type Unsubscribe = () => void;

// ---------------------------------------------------------------------------
// Local subscriptions (renderer-side registry; main pushes db:update by sub id)
// ---------------------------------------------------------------------------

interface Sub {
  path: string;
  cb: (value: unknown) => void;
}

const subs = new Map<string, Sub>();
let subSeq = 0;
let bridgeWired = false;

/** False in test/jsdom environments (no preload); realtime then no-ops, matching
 * the web app's behavior when Firebase wasn't configured. */
const hasBridges = (): boolean => typeof window !== 'undefined' && Boolean(window.db);

function wireBridges(): void {
  if (bridgeWired || typeof window === 'undefined' || !window.db) return;
  bridgeWired = true;
  window.db.onUpdate((_path, value, subId) => {
    subs.get(subId)?.cb(value);
  });
  window.relay.onMessage((message) => void handleRelayMessage(message as RelayServerMessage));
  window.relay.onStatus((status) => {
    session.status = status as SessionStatus;
    emitSession();
  });
}

export function subscribe<T>(path: string, cb: (value: T | null) => void): Unsubscribe {
  if (!hasBridges()) {
    cb(null);
    return () => {};
  }
  wireBridges();
  const id = `sub-${++subSeq}`;
  subs.set(id, { path, cb: cb as (value: unknown) => void });
  void window.db.subscribe(path, id);
  // Players warm unseen paths from the GM on demand.
  if (session.role === 'player') void requestRead(path);
  return () => {
    subs.delete(id);
    void window.db.unsubscribe(id);
  };
}

export async function readValue<T>(path: string): Promise<T | null> {
  if (!hasBridges()) return null;
  wireBridges();
  const local = (await window.db.read(path)) as T | null;
  if (local !== null || session.role !== 'player') return local;
  // Local miss while in a session as a player → ask the GM.
  return (await requestRead(path)) as T | null;
}

export async function writeValue<T>(path: string, value: T): Promise<void> {
  if (!hasBridges()) return;
  wireBridges();
  await window.db.write(path, value ?? null);
  broadcast({ t: 'write', path, value: value ?? null });
}

export async function updateValue(
  path: string,
  partial: Record<string, unknown>,
): Promise<void> {
  if (!hasBridges()) return;
  wireBridges();
  await window.db.update(path, partial);
  broadcast({ t: 'update', path, partial });
}

export async function multiUpdate(updates: Record<string, unknown>): Promise<void> {
  if (!hasBridges()) return;
  wireBridges();
  await window.db.multiUpdate(updates);
  broadcast({ t: 'multi', updates });
}

// ---------------------------------------------------------------------------
// Push keys — RTDB-style: 20 chars, timestamp-prefixed so keys sort
// chronologically (the roll log and chat depend on key order).
// ---------------------------------------------------------------------------

const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
let lastPushTime = 0;
let lastRand: number[] = [];

export function newKey(_path: string): string {
  let now = Date.now();
  const dup = now === lastPushTime;
  lastPushTime = now;

  const ts = new Array<string>(8);
  for (let i = 7; i >= 0; i -= 1) {
    ts[i] = PUSH_CHARS.charAt(now % 64);
    now = Math.floor(now / 64);
  }

  if (!dup) {
    lastRand = Array.from({ length: 12 }, () => Math.floor(Math.random() * 64));
  } else {
    // Same millisecond: increment the random tail so keys stay ordered.
    let i = 11;
    while (i >= 0 && lastRand[i] === 63) {
      lastRand[i] = 0;
      i -= 1;
    }
    if (i >= 0) lastRand[i] += 1;
  }
  return ts.join('') + lastRand.map((n) => PUSH_CHARS.charAt(n)).join('');
}

/** React hook: live value at a path. Pass null to disable. */
export function useValue<T>(path: string | null): { value: T | null; loading: boolean } {
  const [state, setState] = useState<{ value: T | null; loading: boolean }>({
    value: null,
    loading: true,
  });

  useEffect(() => {
    if (!path) {
      setState({ value: null, loading: false });
      return;
    }
    setState((s) => (s.loading ? s : { ...s, loading: true }));
    const unsub = subscribe<T>(path, (value) => setState({ value, loading: false }));
    return unsub;
  }, [path]);

  return state;
}

// ---------------------------------------------------------------------------
// Session management (host / join / leave) + relay sync
// ---------------------------------------------------------------------------

export type SessionStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';
export type SessionRole = 'idle' | 'gm' | 'player';

export interface SessionState {
  role: SessionRole;
  status: SessionStatus;
  roomCode: string | null;
  /** The game being played over this session (set for GM at host, player at join-ack). */
  gameId: string | null;
  error: string | null;
}

const session: SessionState = {
  role: 'idle',
  status: 'idle',
  roomCode: null,
  gameId: null,
  error: null,
};

const sessionListeners = new Set<() => void>();
function emitSession(): void {
  sessionListeners.forEach((l) => l());
}

export function getSession(): SessionState {
  return { ...session };
}

/** React hook: live session state (role, room code, status). */
export function useSession(): SessionState {
  const [, force] = useState(0);
  useEffect(() => {
    const l = (): void => force((n) => n + 1);
    sessionListeners.add(l);
    return () => {
      sessionListeners.delete(l);
    };
  }, []);
  return getSession();
}

// --- Wire payloads (ride the relay's opaque game-message data field) --------

type SyncOp =
  | { t: 'write'; path: string; value: unknown }
  | { t: 'update'; path: string; partial: Record<string, unknown> }
  | { t: 'multi'; updates: Record<string, unknown> }
  | { t: 'read'; path: string; reqId: string }
  | { t: 'readres'; path: string; reqId: string; value: unknown }
  | { t: 'session'; gameId: string; snapshot: Record<string, unknown> };

interface RelayServerMessage {
  type: string;
  payload?: {
    roomCode?: string;
    playerId?: string;
    displayName?: string;
    from?: string;
    data?: unknown;
    message?: string;
  };
}

/** Paths under these roots never leave this machine. */
const isPrivate = (path: string): boolean =>
  path === 'local' || path.startsWith('local/');

function opTouchesPrivate(op: SyncOp): boolean {
  switch (op.t) {
    case 'write':
    case 'update':
      return isPrivate(op.path);
    case 'multi':
      return Object.keys(op.updates).some(isPrivate);
    default:
      return false;
  }
}

function broadcast(op: SyncOp): void {
  if (session.role === 'idle' || session.status !== 'open') return;
  if (opTouchesPrivate(op)) return;
  void window.relay.send({ type: 'game-message', payload: { data: op } });
}

/** Apply a remote op to local SQLite WITHOUT re-broadcasting from here. */
async function applyOp(op: SyncOp): Promise<void> {
  switch (op.t) {
    case 'write':
      await window.db.write(op.path, op.value ?? null);
      break;
    case 'update':
      await window.db.update(op.path, op.partial);
      break;
    case 'multi':
      await window.db.multiUpdate(op.updates);
      break;
    default:
      break;
  }
}

// Pending player→GM read requests.
const pendingReads = new Map<string, (value: unknown) => void>();
let readSeq = 0;

function requestRead(path: string): Promise<unknown> {
  if (session.role !== 'player' || session.status !== 'open' || isPrivate(path)) {
    return Promise.resolve(null);
  }
  const reqId = `r${++readSeq}-${Math.random().toString(36).slice(2, 8)}`;
  return new Promise((resolve) => {
    pendingReads.set(reqId, resolve);
    void window.relay.send({
      type: 'game-message',
      payload: { data: { t: 'read', path, reqId } satisfies SyncOp },
    });
    // Don't hang forever if the GM missed it.
    setTimeout(() => {
      if (pendingReads.delete(reqId)) resolve(null);
    }, 8000);
  });
}

async function handleRelayMessage(msg: RelayServerMessage): Promise<void> {
  switch (msg.type) {
    case 'hosted':
      session.roomCode = msg.payload?.roomCode ?? null;
      session.error = null;
      emitSession();
      break;

    case 'player-joined': {
      // GM: enroll the newcomer as a member (players can't write the GM's game
      // themselves), then greet them with the hosted game's snapshot. (The relay
      // broadcasts GM messages to every player; extras apply idempotently.)
      if (session.role === 'gm' && session.gameId) {
        const { playerId, displayName } = msg.payload ?? {};
        void (async () => {
          if (playerId) {
            const existing = await window.db.read(
              `games/${session.gameId}/members/${playerId}`,
            );
            if (!existing) {
              await updateValue(`games/${session.gameId}/members/${playerId}`, {
                role: 'player',
                displayName: displayName ?? 'Adventurer',
                joinedAt: Date.now(),
              });
            }
          }
          await sendSessionSnapshot(session.gameId!);
        })();
      }
      break;
    }

    case 'game-message': {
      const op = msg.payload?.data as SyncOp | undefined;
      if (!op || typeof op !== 'object' || !('t' in op)) return;

      if (session.role === 'gm') {
        // Player-originated op: apply, then re-broadcast so all players converge.
        if (op.t === 'read') {
          if (isPrivate(op.path)) return;
          const value = await window.db.read(op.path);
          void window.relay.send({
            type: 'game-message',
            payload: {
              data: { t: 'readres', path: op.path, reqId: op.reqId, value } satisfies SyncOp,
            },
          });
          return;
        }
        if (op.t === 'write' || op.t === 'update' || op.t === 'multi') {
          if (opTouchesPrivate(op)) return;
          await applyOp(op);
          void window.relay.send({ type: 'game-message', payload: { data: op } });
        }
        return;
      }

      // Player side.
      switch (op.t) {
        case 'session': {
          await window.db.multiUpdate(op.snapshot);
          session.gameId = op.gameId;
          session.error = null;
          emitSession();
          break;
        }
        case 'readres': {
          if (op.value !== null && !isPrivate(op.path)) {
            await window.db.write(op.path, op.value);
          }
          pendingReads.get(op.reqId)?.(op.value);
          pendingReads.delete(op.reqId);
          break;
        }
        case 'write':
        case 'update':
        case 'multi':
          if (!opTouchesPrivate(op)) await applyOp(op);
          break;
        default:
          break;
      }
      break;
    }

    case 'gm-disconnected':
      session.error = 'The GM disconnected — the session has ended.';
      session.role = 'idle';
      session.status = 'idle';
      session.roomCode = null;
      emitSession();
      break;

    case 'error':
      session.error = msg.payload?.message ?? 'Relay error.';
      emitSession();
      break;

    default:
      break;
  }
}

/** GM → players: everything a player needs to enter the hosted game. */
async function sendSessionSnapshot(gameId: string): Promise<void> {
  const snapshot: Record<string, unknown> = {};
  const game = await window.db.read(`games/${gameId}`);
  if (game) snapshot[`games/${gameId}`] = game;

  // Characters belonging to this game (global root, gameId field).
  const characters = (await window.db.read('characters')) as Record<
    string,
    { gameId?: string }
  > | null;
  if (characters) {
    for (const [id, c] of Object.entries(characters)) {
      if (c && c.gameId === gameId) snapshot[`characters/${id}`] = c;
    }
  }

  // Member profiles (display names, avatars) — small, and sheets read them.
  const users = await window.db.read('users');
  if (users) snapshot['users'] = users;

  void window.relay.send({
    type: 'game-message',
    payload: { data: { t: 'session', gameId, snapshot } satisfies SyncOp },
  });
}

// --- Public session API (the lobby drives these) -----------------------------

export interface SessionIdentity {
  uid: string;
  displayName: string;
}

const DEFAULT_RELAY_URL = 'ws://localhost:3001';

export async function getRelayUrl(): Promise<string> {
  const stored = (await window.db.read('local/settings/relayUrl')) as string | null;
  return stored || DEFAULT_RELAY_URL;
}

export async function setRelayUrl(url: string): Promise<void> {
  await window.db.write('local/settings/relayUrl', url.trim() || DEFAULT_RELAY_URL);
}

/** GM: host a live session for one of the local games. */
export async function hostSession(gameId: string, identity: SessionIdentity): Promise<void> {
  wireBridges();
  const url = await getRelayUrl();
  session.role = 'gm';
  session.status = 'connecting';
  session.gameId = gameId;
  session.roomCode = null;
  session.error = null;
  emitSession();
  await window.relay.connect(url, {
    mode: 'host',
    uid: identity.uid,
    displayName: identity.displayName,
  });
}

/** Player: join a GM's session by room code. Resolves with the gameId once the
 * GM's snapshot lands (that's the join-ack in this protocol). */
export async function joinSession(
  roomCode: string,
  identity: SessionIdentity,
): Promise<string> {
  wireBridges();
  const url = await getRelayUrl();
  session.role = 'player';
  session.status = 'connecting';
  session.gameId = null;
  session.roomCode = roomCode.trim().toUpperCase();
  session.error = null;
  emitSession();
  await window.relay.connect(url, {
    mode: 'join',
    roomCode: session.roomCode,
    uid: identity.uid,
    displayName: identity.displayName,
  });

  const gameId = await new Promise<string>((resolve, reject) => {
    const started = Date.now();
    const tick = (): void => {
      if (session.gameId) return resolve(session.gameId);
      if (session.error) return reject(new Error(session.error));
      if (Date.now() - started > 15000) {
        return reject(new Error('Timed out waiting for the GM. Check the room code.'));
      }
      setTimeout(tick, 150);
    };
    tick();
  });

  // Remember the game locally so it shows in this player's lobby next launch.
  await window.db.write(`userGames/${identity.uid}/${gameId}`, true);
  return gameId;
}

export async function leaveSession(): Promise<void> {
  await window.relay.disconnect();
  session.role = 'idle';
  session.status = 'idle';
  session.roomCode = null;
  session.gameId = null;
  session.error = null;
  emitSession();
}
