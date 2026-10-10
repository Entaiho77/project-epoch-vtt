import { useEffect, useState } from 'react';
import { ensureAssets, handleAssetOp, initAssetSync, isAssetOp } from './assetSync';
import { DiceLedger, decodeValues, encodeValues } from './diceLedger';
import { setGmDiceSource } from './secureDice';
import {
  checkPlayerOp,
  isPrivatePath,
  projectForPlayer,
  touchedPaths,
  visibilityRoot,
  type GateContext,
  type WriteOp,
} from './gatekeeper';

/**
 * The ONE sync mechanism, re-homed from Firebase RTDB to the desktop stack:
 * local SQLite (window.db) is the source of truth, and a live session mirrors
 * writes peer-to-peer (window.relay, backed by the Hyperswarm helper).
 *
 * The API is signature-identical to the Firebase version, so every data module
 * and screen above this file is unchanged:
 *   subscribe / readValue / writeValue / updateValue / multiUpdate / newKey / useValue
 *
 * Sync model (GM-authoritative):
 * - Any local mutation is applied to SQLite and, while in a session, shared
 *   (private paths — see gatekeeper.isPrivatePath — never leave the machine).
 * - Players send changes to the GM; the GM checks them (gatekeeper), applies them,
 *   and sends each player the result trimmed to what they may see.
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
  window.relay.onStatus((status) => setStatus(status as SessionStatus));
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
// Live sessions (peer-to-peer)
//
// The GM hosts a game under its invite code; players join with that code. The
// transport (window.relay, backed by the Hyperswarm helper) routes player → GM and
// GM → players. The GM's copy is the authority: every player change is checked by
// the gatekeeper before it's applied, and everything the GM sends out is trimmed to
// what each player may see (data/gatekeeper.ts).
// ---------------------------------------------------------------------------

export type SessionStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';
export type SessionRole = 'idle' | 'gm' | 'player';

export interface JoinRequest {
  peerKey: string;
  playerId: string;
  displayName: string;
  /** Set when this request deserves a second look. */
  warning?: string;
}

export interface SessionPlayer {
  playerId: string;
  displayName: string;
}

export interface SessionState {
  role: SessionRole;
  status: SessionStatus;
  roomCode: string | null;
  /** The game being played over this session (set for GM at host, player at join-ack). */
  gameId: string | null;
  error: string | null;
  /** Player: connected to the GM but not let in yet. */
  waitingForApproval: boolean;
  /** Player: the session was open at some point (so a drop means "reconnecting"). */
  wasOpen: boolean;
  /** GM: people asking to join, waiting for a decision. */
  joinRequests: JoinRequest[];
  /** GM: players connected right now. */
  players: SessionPlayer[];
}

const session: SessionState = {
  role: 'idle',
  status: 'idle',
  roomCode: null,
  gameId: null,
  error: null,
  waitingForApproval: false,
  wasOpen: false,
  joinRequests: [],
  players: [],
};

/** GM: this computer's uid while hosting (owner of the library players read). */
let hostUid: string | null = null;
/** GM: who's hosting, so hosting can be restarted after a dropped connection. */
let hostIdentity: SessionIdentity | null = null;
/** This computer's own uid for the current session, GM or player — needed by 'kicked' to
 *  clean up this player's own local lobby index (see endSession's caller below). */
let myUid: string | null = null;

initAssetSync({
  send: (op) => void window.relay.send({ type: 'game-message', payload: { data: op } }),
  isOpen: () => session.role !== 'idle' && session.status === 'open',
  isGm: () => session.role === 'gm',
});

const sessionListeners = new Set<() => void>();
function emitSession(): void {
  sessionListeners.forEach((l) => l());
}

export function getSession(): SessionState {
  return { ...session, joinRequests: [...session.joinRequests], players: [...session.players] };
}

/** Non-React listener for session changes (voice uses it to follow the session). */
export function onSessionChange(cb: () => void): Unsubscribe {
  sessionListeners.add(cb);
  return () => {
    sessionListeners.delete(cb);
  };
}

/** Voice registers here to hear "the GM muted / unmuted you". */
let voiceMutedHandler: ((muted: boolean) => void) | null = null;
export function setVoiceMutedHandler(fn: ((muted: boolean) => void) | null): void {
  voiceMutedHandler = fn;
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

function setStatus(status: SessionStatus): void {
  session.status = status;
  if (status === 'open' && session.role === 'player') {
    session.wasOpen = true;
    session.waitingForApproval = false;
  }
  emitSession();
}

// --- Wire payloads -----------------------------------------------------------

type SyncOp =
  | WriteOp
  | { t: 'read'; path: string; reqId: string }
  | { t: 'readres'; path: string; reqId: string; value: unknown }
  | { t: 'session'; gameId: string; snapshot: Record<string, unknown> }
  | { t: 'rng'; reqId: string }
  | { t: 'rngres'; reqId: string; rngId: string; data: string };

interface RelayServerMessage {
  type: string;
  payload?: {
    roomCode?: string;
    playerId?: string;
    displayName?: string;
    peerKey?: string;
    from?: string;
    data?: unknown;
    message?: string;
    muted?: boolean;
  };
}

const isWriteOp = (op: SyncOp): op is WriteOp =>
  op.t === 'write' || op.t === 'update' || op.t === 'multi';

/** Drop anything that must stay on this computer from an outgoing change. */
function withoutPrivate(op: WriteOp): WriteOp | null {
  switch (op.t) {
    case 'write':
    case 'update':
      return isPrivatePath(op.path) ? null : op;
    case 'multi': {
      const updates = Object.fromEntries(
        Object.entries(op.updates).filter(([p]) => !isPrivatePath(p)),
      );
      return Object.keys(updates).length ? { t: 'multi', updates } : null;
    }
  }
}

const sendToGm = (op: SyncOp): void =>
  void window.relay.send({ type: 'game-message', payload: { data: op } });

const sendTo = (playerId: string, op: SyncOp): void =>
  void window.relay.send({ type: 'game-message', payload: { data: op, to: playerId } });

/** Called after every local change. */
function broadcast(op: WriteOp): void {
  if (session.role === 'idle' || session.status !== 'open') return;
  const shared = withoutPrivate(op);
  if (!shared) return;
  if (session.role === 'player') sendToGm(shared);
  else void fanOut(touchedPaths(shared));
}

/** Apply a remote op to local SQLite WITHOUT re-broadcasting from here. */
async function applyOp(op: WriteOp): Promise<void> {
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
  }
}

// --- GM side ------------------------------------------------------------------

/** GM: the random numbers handed to players for dice, so their rolls can be checked. */
const diceLedger = new DiceLedger();

function gateContext(): GateContext {
  return {
    gameId: session.gameId ?? '',
    gmUid: hostUid ?? '',
    read: (path) => window.db.read(path),
    dice: diceLedger,
  };
}

/** What a player may see at `path`, even below the piece visibility is decided on. */
function projectPath(path: string, value: unknown, playerId: string, ctx: GateContext): unknown {
  const root = visibilityRoot(path);
  const norm = path.replace(/^\/+|\/+$/g, '');
  if (root === norm || root.length >= norm.length) {
    return projectForPlayer(norm, value, { uid: playerId }, ctx);
  }
  return undefined; // caller re-reads the root
}

/**
 * GM: after anything changes, re-send the affected pieces to each connected player,
 * trimmed to what that player may see.
 */
async function fanOut(paths: string[]): Promise<void> {
  if (session.role !== 'gm' || !session.gameId || session.players.length === 0) return;
  const ctx = gateContext();
  const roots = [...new Set(paths.map(visibilityRoot))];
  const values = new Map<string, unknown>();
  for (const root of roots) values.set(root, await window.db.read(root));
  for (const { playerId } of session.players) {
    const updates: Record<string, unknown> = {};
    for (const root of roots) {
      const projected = projectForPlayer(root, values.get(root), { uid: playerId }, ctx);
      if (projected !== undefined) updates[`/${root}`] = projected;
    }
    if (Object.keys(updates).length) sendTo(playerId, { t: 'multi', updates });
  }
}

/** GM: answer a player's read with only what they may see. */
async function answerRead(playerId: string, path: string, reqId: string): Promise<void> {
  const ctx = gateContext();
  const root = visibilityRoot(path);
  const norm = path.replace(/^\/+|\/+$/g, '');
  let value: unknown;
  if (root.length < norm.length) {
    // Deeper than the piece visibility is decided on: project the piece, then descend.
    let node = projectForPlayer(root, await window.db.read(root), { uid: playerId }, ctx);
    for (const seg of norm.slice(root.length + 1).split('/')) {
      node = node && typeof node === 'object' ? (node as Record<string, unknown>)[seg] : undefined;
    }
    value = node;
  } else {
    value = projectPath(norm, await window.db.read(norm), playerId, ctx);
  }
  sendTo(playerId, { t: 'readres', path: norm, reqId, value: value ?? null });
}

const ROLL_LOG_CAP = 100;

/** GM: keep the dice log to the newest entries (players can't delete entries). */
async function trimRollLog(gameId: string): Promise<void> {
  const log = (await window.db.read(`games/${gameId}/rollLog`)) as Record<string, unknown> | null;
  if (!log) return;
  const keys = Object.keys(log).sort();
  if (keys.length <= ROLL_LOG_CAP) return;
  const updates: Record<string, null> = {};
  for (const k of keys.slice(0, keys.length - ROLL_LOG_CAP)) updates[`/games/${gameId}/rollLog/${k}`] = null;
  await multiUpdate(updates);
}

/** GM: a change from a player. Apply it only if the gatekeeper allows it. */
async function handlePlayerChange(playerId: string, op: WriteOp): Promise<void> {
  const ctx = gateContext();
  const verdict = await checkPlayerOp(op, playerId, ctx);
  if (!verdict.ok) {
    console.warn(`[session] blocked a change from ${playerId}: ${verdict.reason}`);
    // Put that player's copy back in line with the GM's.
    const roots = [...new Set(touchedPaths(op).map(visibilityRoot))];
    const updates: Record<string, unknown> = {};
    for (const root of roots) {
      const projected = projectForPlayer(root, await window.db.read(root), { uid: playerId }, ctx);
      if (projected !== undefined) updates[`/${root}`] = projected;
    }
    if (Object.keys(updates).length) sendTo(playerId, { t: 'multi', updates });
    return;
  }
  await applyOp(op);
  await fanOut(touchedPaths(op));
  // Notes the GM's copy adds on top (e.g. "1 earlier roll not shown").
  if (verdict.followUps && Object.keys(verdict.followUps).length) await multiUpdate(verdict.followUps);
  void ensureAssets(op); // e.g. a player's new character art
  if (touchedPaths(op).some((p) => p.startsWith(`games/${ctx.gameId}/rollLog/`))) {
    await trimRollLog(ctx.gameId);
  }
}

/** GM → one player: everything they need to enter the hosted game. */
async function sendSessionSnapshot(gameId: string, playerId: string): Promise<void> {
  const ctx = gateContext();
  const viewer = { uid: playerId };
  const snapshot: Record<string, unknown> = {};
  const game = projectForPlayer(`games/${gameId}`, await window.db.read(`games/${gameId}`), viewer, ctx);
  if (game) snapshot[`games/${gameId}`] = game;

  const characters = (await window.db.read('characters')) as Record<string, unknown> | null;
  for (const [id, c] of Object.entries(characters ?? {})) {
    const projected = projectForPlayer(`characters/${id}`, c, viewer, ctx);
    if (projected) snapshot[`characters/${id}`] = projected;
  }
  const index = await window.db.read(`gameCharacters/${gameId}`);
  if (index) snapshot[`gameCharacters/${gameId}`] = index;
  if (hostUid) {
    const gmUser = projectForPlayer(`users/${hostUid}`, await window.db.read(`users/${hostUid}`), viewer, ctx);
    if (gmUser) snapshot[`users/${hostUid}`] = gmUser;
  }
  sendTo(playerId, { t: 'session', gameId, snapshot });
}

/** GM: someone wants in. Let a known device straight back in; ask about anyone else. */
async function handleJoinRequest(req: JoinRequest): Promise<void> {
  if (!session.gameId) return;
  const member = (await window.db.read(`games/${session.gameId}/members/${req.playerId}`)) as
    | { role?: string; peerKey?: string; displayName?: string }
    | null;
  if (member?.role === 'gm') {
    // Nobody else can be the GM of this game.
    void window.relay.approve(req.peerKey, false);
    return;
  }
  if (member?.peerKey && member.peerKey === req.peerKey) {
    void window.relay.approve(req.peerKey, true);
    return;
  }
  const warning = member
    ? member.peerKey
      ? `${member.displayName ?? req.displayName} is already in this game, but this request comes from a different computer. Only allow it if you're sure it's them.`
      : `${member.displayName ?? req.displayName} is already in this game. This is their first time joining from this computer.`
    : undefined;
  session.joinRequests = [
    ...session.joinRequests.filter((r) => r.peerKey !== req.peerKey),
    { ...req, ...(warning ? { warning } : {}) },
  ];
  emitSession();
}

/** GM: decide on a join request. */
export async function answerJoinRequest(peerKey: string, allow: boolean): Promise<void> {
  session.joinRequests = session.joinRequests.filter((r) => r.peerKey !== peerKey);
  emitSession();
  await window.relay.approve(peerKey, allow);
}

/** GM: remove a player from the session. Their computer can't rejoin on this code. */
export async function kickPlayer(playerId: string): Promise<void> {
  session.players = session.players.filter((p) => p.playerId !== playerId);
  emitSession();
  await window.relay.kick(playerId);
}

async function onPlayerJoined(playerId: string, displayName: string, peerKey: string): Promise<void> {
  if (session.role !== 'gm' || !session.gameId) return;
  const gameId = session.gameId;
  session.players = [
    ...session.players.filter((p) => p.playerId !== playerId),
    { playerId, displayName },
  ];
  emitSession();
  // Enroll (or re-key) the player. Their device key is how we recognise them next time.
  const membersPath = `games/${gameId}/members/${playerId}`;
  const existing = (await window.db.read(membersPath)) as Record<string, unknown> | null;
  await updateValue(membersPath, {
    role: 'player',
    displayName: (existing?.displayName as string | undefined) ?? displayName,
    joinedAt: (existing?.joinedAt as number | undefined) ?? Date.now(),
    peerKey,
  });
  await sendSessionSnapshot(gameId, playerId);
}

// --- Player side ----------------------------------------------------------------

// Pending player→GM read requests.
const pendingReads = new Map<string, (value: unknown) => void>();
let readSeq = 0;

function requestRead(path: string): Promise<unknown> {
  if (session.role !== 'player' || session.status !== 'open' || isPrivatePath(path)) {
    return Promise.resolve(null);
  }
  const reqId = `r${++readSeq}-${Math.random().toString(36).slice(2, 8)}`;
  return new Promise((resolve) => {
    pendingReads.set(reqId, resolve);
    sendToGm({ t: 'read', path, reqId });
    // Don't hang forever if the GM missed it.
    setTimeout(() => {
      if (pendingReads.delete(reqId)) resolve(null);
    }, 8000);
  });
}

// Pending player→GM requests for dice numbers.
const pendingRng = new Map<string, (r: { rngId: string; values: Uint32Array } | null) => void>();

/**
 * Player in a live session: dice numbers come from the GM's computer, so the GM can
 * check the rolls. If the GM can't be reached, the roll happens here and is shown
 * without the "checked" mark.
 */
setGmDiceSource(() => {
  if (session.role !== 'player' || session.status !== 'open') return Promise.resolve(null);
  const reqId = `d${++readSeq}-${Math.random().toString(36).slice(2, 8)}`;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      if (pendingRng.delete(reqId)) resolve('unavailable');
    }, 4000);
    pendingRng.set(reqId, (r) => {
      clearTimeout(timer);
      resolve(r ?? 'unavailable');
    });
    sendToGm({ t: 'rng', reqId });
  });
});

/** Player: store data from the GM. Objects merge, so data from other games stays. */
async function storeFromGm(path: string, value: unknown): Promise<void> {
  if (value === null || value === undefined || isPrivatePath(path)) return;
  if (typeof value === 'object' && !Array.isArray(value)) {
    await window.db.update(path, value as Record<string, unknown>);
  } else {
    await window.db.write(path, value);
  }
}

// --- Messages from the transport ---------------------------------------------------

async function handleRelayMessage(msg: RelayServerMessage): Promise<void> {
  const p = msg.payload ?? {};
  switch (msg.type) {
    case 'hosted':
      session.error = null;
      emitSession();
      break;

    case 'join-request':
      if (session.role === 'gm' && p.peerKey && p.playerId) {
        await handleJoinRequest({
          peerKey: p.peerKey,
          playerId: p.playerId,
          displayName: p.displayName ?? 'Adventurer',
        });
      }
      break;

    case 'player-joined':
      if (p.playerId && p.peerKey) await onPlayerJoined(p.playerId, p.displayName ?? 'Adventurer', p.peerKey);
      break;

    case 'player-left':
      session.players = session.players.filter((pl) => pl.playerId !== p.playerId);
      session.joinRequests = session.joinRequests.filter((r) => r.playerId !== p.playerId);
      emitSession();
      break;

    case 'waiting':
      session.waitingForApproval = true;
      emitSession();
      break;

    case 'game-message': {
      const op = p.data as SyncOp | undefined;
      if (!op || typeof op !== 'object' || !('t' in op)) return;

      // Image file transfers have their own handler and are never re-broadcast.
      if (isAssetOp(op)) {
        await handleAssetOp(op);
        return;
      }

      if (session.role === 'gm') {
        const from = p.from;
        if (!from) return;
        if (op.t === 'read') {
          if (!isPrivatePath(op.path)) await answerRead(from, op.path, op.reqId);
          return;
        }
        if (op.t === 'rng') {
          if (typeof op.reqId !== 'string' || !session.players.some((pl) => pl.playerId === from)) return;
          const { rngId, values } = diceLedger.issue(from);
          sendTo(from, { t: 'rngres', reqId: op.reqId.slice(0, 64), rngId, data: encodeValues(values) });
          return;
        }
        if (isWriteOp(op)) await handlePlayerChange(from, op);
        return;
      }

      // Player side: everything here comes from the GM.
      switch (op.t) {
        case 'session': {
          for (const [path, value] of Object.entries(op.snapshot)) await storeFromGm(path, value);
          void ensureAssets(op.snapshot);
          session.gameId = op.gameId;
          session.error = null;
          session.waitingForApproval = false;
          emitSession();
          break;
        }
        case 'rngres': {
          const values = decodeValues(op.data);
          pendingRng.get(op.reqId)?.(values ? { rngId: op.rngId, values } : null);
          pendingRng.delete(op.reqId);
          break;
        }
        case 'readres': {
          await storeFromGm(op.path, op.value);
          void ensureAssets(op.value);
          pendingReads.get(op.reqId)?.(op.value);
          pendingReads.delete(op.reqId);
          break;
        }
        default:
          if (isWriteOp(op)) {
            const shared = withoutPrivate(op);
            if (shared) {
              await applyOp(shared);
              void ensureAssets(shared);
            }
          }
          break;
      }
      break;
    }

    case 'voice-muted':
      voiceMutedHandler?.(Boolean(p.muted));
      break;

    case 'gm-disconnected':
      endSession('The GM ended the session.');
      break;

    case 'kicked':
      // Drop this game from the player's own local lobby index too — the GM's removeMember()
      // already cleared the GM's copy, but the player's own SQLite mirror still has it, which
      // is why a kicked player used to keep seeing the game in their lobby.
      if (myUid && session.gameId) void window.db.write(`userGames/${myUid}/${session.gameId}`, null);
      endSession('The GM removed you from the session.');
      break;

    case 'error':
      session.error = p.message ?? 'Connection error.';
      emitSession();
      break;

    default:
      break;
  }
}

function endSession(error: string | null): void {
  session.role = 'idle';
  session.status = 'idle';
  session.roomCode = null;
  session.gameId = null;
  session.error = error;
  session.waitingForApproval = false;
  session.wasOpen = false;
  session.joinRequests = [];
  session.players = [];
  hostUid = null;
  hostIdentity = null;
  emitSession();
}

// --- Public session API (the lobby drives these) -----------------------------

export interface SessionIdentity {
  uid: string;
  displayName: string;
}

/** GM: host a live session for one of the local games, under its invite code. */
export async function hostSession(gameId: string, identity: SessionIdentity): Promise<string> {
  wireBridges();
  const code = (await window.db.read(`games/${gameId}/inviteCode`)) as string | null;
  if (!code) throw new Error('This game has no invite code yet. Regenerate one in game settings.');
  hostUid = identity.uid;
  hostIdentity = identity;
  myUid = identity.uid;
  session.role = 'gm';
  session.status = 'connecting';
  session.gameId = gameId;
  session.roomCode = code;
  session.error = null;
  session.joinRequests = [];
  session.players = [];
  emitSession();
  await window.relay.connect('p2p', {
    mode: 'host',
    uid: identity.uid,
    displayName: identity.displayName,
    roomCode: code,
  });
  return code;
}

/** How long to look for the GM, and how long to wait for them to let you in. */
const FIND_GM_MS = 45_000;
const APPROVAL_MS = 5 * 60_000;

/** Player: join a GM's session by room code. Resolves with the gameId once the GM
 * has let you in and sent the game. */
export async function joinSession(roomCode: string, identity: SessionIdentity): Promise<string> {
  wireBridges();
  myUid = identity.uid;
  session.role = 'player';
  session.status = 'connecting';
  session.gameId = null;
  session.roomCode = roomCode.trim().toUpperCase();
  session.error = null;
  session.waitingForApproval = false;
  session.wasOpen = false;
  emitSession();
  await window.relay.connect('p2p', {
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
      if (session.role === 'idle') return reject(new Error('The session ended.'));
      const waited = Date.now() - started;
      if (!session.waitingForApproval && waited > FIND_GM_MS) {
        void leaveSession();
        return reject(
          new Error("Couldn't find that game. Check the code, and that the GM has clicked Host session."),
        );
      }
      if (waited > APPROVAL_MS) {
        void leaveSession();
        return reject(new Error('The GM didn’t let you in. Ask them to check for your request.'));
      }
      setTimeout(tick, 150);
    };
    tick();
  });

  // Remember the game locally so it shows in this player's lobby next launch.
  await window.db.write(`userGames/${identity.uid}/${gameId}`, true);
  return gameId;
}

/** Dismiss the "session ended" notice. */
export function clearSessionError(): void {
  if (session.role !== 'idle') return;
  session.error = null;
  emitSession();
}

/** GM: start hosting again after the connection dropped. */
export async function restartHosting(): Promise<void> {
  if (session.role !== 'gm' || !session.gameId || !hostIdentity) return;
  await hostSession(session.gameId, hostIdentity);
}

/** GM: the invite code changed — keep hosting under the new one. Players already
 * in the session stay connected. */
export async function changeRoomCode(gameId: string, code: string): Promise<void> {
  if (session.role !== 'gm' || session.gameId !== gameId) return;
  session.roomCode = code;
  emitSession();
  await window.relay.setCode(code);
}

export async function leaveSession(): Promise<void> {
  await window.relay.disconnect();
  endSession(null);
}
