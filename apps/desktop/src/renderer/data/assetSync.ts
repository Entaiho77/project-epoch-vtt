/**
 * Moves image files (maps, token art) between players during a live session.
 *
 * Images are stored as files and referenced in game data as
 * `epoch-asset:<sha256>.<ext>` (see data/images.ts). When a synced value
 * mentions an image this machine doesn't have, we ask for it; whoever has it
 * replies with the file in base64 chunks over the relay.
 *
 * The relay routes player → GM and GM → all players, so this works in both
 * directions: players fetch the GM's maps, and the GM fetches a player's
 * character art (then relays it to the other players when they ask).
 *
 * Integrity: the receiver re-hashes the bytes when saving, and drops the file
 * unless the hash matches the name it asked for.
 */

const PREFIX = 'epoch-asset:';
const NAME_RE = /^[0-9a-f]{64}\.(png|jpg|webp|gif|avif|bmp|svg|mp3|ogg|wav|m4a)$/;
/** Raw bytes per chunk (~350 KB once base64-encoded). */
const CHUNK_BYTES = 256 * 1024;
/** 50 MB limit / 256 KB chunks = 200; a little headroom. */
const MAX_CHUNKS = 210;
const RETRY_MS = 10_000;
const MAX_ATTEMPTS = 3;
/** Don't resend the same file more often than this (several players may ask at once). */
const RESEND_COOLDOWN_MS = 5_000;

export type AssetOp =
  | { t: 'asset-req'; name: string }
  | { t: 'asset-chunk'; name: string; i: number; n: number; data: string };

export interface AssetSyncDeps {
  /** Send an op over the relay as a game-message. */
  send(op: AssetOp): void;
  /** True while a session is connected. */
  isOpen(): boolean;
  isGm(): boolean;
}

let deps: AssetSyncDeps | null = null;

const present = new Set<string>();
const attempts = new Map<string, number>();
const lastRequested = new Map<string, number>();
const lastSent = new Map<string, number>();
/** GM only: images a player asked for that the GM is still fetching itself. */
const owedToPlayers = new Set<string>();
const incoming = new Map<string, { n: number; got: number; parts: (string | undefined)[] }>();
const storedListeners = new Set<(name: string) => void>();

export function initAssetSync(d: AssetSyncDeps): void {
  deps = d;
}

/** Called when a missing image arrives, so screens can redraw it. */
export function onAssetStored(cb: (name: string) => void): () => void {
  storedListeners.add(cb);
  return () => storedListeners.delete(cb);
}

export function isAssetOp(op: unknown): op is AssetOp {
  const t = (op as { t?: unknown } | null)?.t;
  return t === 'asset-req' || t === 'asset-chunk';
}

/** Every `epoch-asset:` image name mentioned anywhere inside a value. */
export function collectAssetNames(value: unknown, out: Set<string> = new Set()): Set<string> {
  if (typeof value === 'string') {
    if (value.startsWith(PREFIX)) {
      const name = value.slice(PREFIX.length);
      if (NAME_RE.test(name)) out.add(name);
    }
  } else if (Array.isArray(value)) {
    for (const v of value) collectAssetNames(v, out);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectAssetNames(v, out);
  }
  return out;
}

const bridge = (): EpochAssetsBridge | undefined =>
  typeof window !== 'undefined' ? window.epochAssets : undefined;

async function haveLocally(name: string): Promise<boolean> {
  if (present.has(name)) return true;
  const assets = bridge();
  if (!assets) return true; // no file storage here (tests/browser): nothing to fetch
  if (await assets.has(name)) {
    present.add(name);
    return true;
  }
  return false;
}

/** Look through a synced value and request any images this machine lacks. */
export async function ensureAssets(value: unknown): Promise<void> {
  if (!deps?.isOpen() || !bridge()) return;
  for (const name of collectAssetNames(value)) {
    if (!(await haveLocally(name))) request(name);
  }
}

function request(name: string): void {
  if (!deps?.isOpen() || present.has(name)) return;
  const now = Date.now();
  if (now - (lastRequested.get(name) ?? 0) < RETRY_MS) return;
  const tries = (attempts.get(name) ?? 0) + 1;
  if (tries > MAX_ATTEMPTS) return;
  attempts.set(name, tries);
  lastRequested.set(name, now);
  incoming.delete(name); // start clean if an earlier transfer stalled
  deps.send({ t: 'asset-req', name });
  setTimeout(() => {
    if (!present.has(name)) request(name);
  }, RETRY_MS + 50);
}

/** Handle an asset op from the relay. */
export async function handleAssetOp(op: AssetOp): Promise<void> {
  if (!deps || !NAME_RE.test(op.name)) return;
  if (op.t === 'asset-req') {
    if (await haveLocally(op.name)) {
      if (bridge()) await sendAsset(op.name);
    } else if (deps.isGm()) {
      // A player wants something the GM doesn't have yet (e.g. another
      // player's art): fetch it from the players, then pass it on.
      owedToPlayers.add(op.name);
      request(op.name);
    }
    return;
  }
  await receiveChunk(op);
}

async function sendAsset(name: string): Promise<void> {
  const assets = bridge();
  if (!deps || !assets) return;
  const now = Date.now();
  if (now - (lastSent.get(name) ?? 0) < RESEND_COOLDOWN_MS) return;
  lastSent.set(name, now);
  const bytes = new Uint8Array(await assets.get(name));
  const n = Math.max(1, Math.ceil(bytes.length / CHUNK_BYTES));
  for (let i = 0; i < n; i += 1) {
    const part = bytes.subarray(i * CHUNK_BYTES, (i + 1) * CHUNK_BYTES);
    deps.send({ t: 'asset-chunk', name, i, n, data: toBase64(part) });
    // Yield between chunks so a big map doesn't freeze the screen.
    await new Promise((r) => setTimeout(r, 0));
  }
}

async function receiveChunk(op: Extract<AssetOp, { t: 'asset-chunk' }>): Promise<void> {
  const { name, i, n, data } = op;
  if (present.has(name)) return;
  if (!Number.isInteger(n) || n < 1 || n > MAX_CHUNKS) return;
  if (!Number.isInteger(i) || i < 0 || i >= n || typeof data !== 'string') return;

  let entry = incoming.get(name);
  if (!entry || entry.n !== n) {
    entry = { n, got: 0, parts: new Array(n) };
    incoming.set(name, entry);
  }
  if (entry.parts[i] === undefined) {
    entry.parts[i] = data;
    entry.got += 1;
  }
  if (entry.got < entry.n) return;

  incoming.delete(name);
  const assets = bridge();
  if (!assets) return;
  try {
    const bytes = joinBase64(entry.parts as string[]);
    const ref = await assets.putBytes(bytes, mimeFor(name));
    if (ref !== PREFIX + name) {
      // Contents didn't match the fingerprint we asked for: don't use it.
      console.warn(`[assetSync] rejected ${name}: content hash mismatch`);
      return;
    }
    present.add(name);
    attempts.delete(name);
    storedListeners.forEach((cb) => cb(name));
    if (owedToPlayers.delete(name) && deps?.isGm()) await sendAsset(name);
  } catch (error) {
    console.warn(`[assetSync] could not store ${name}:`, error);
  }
}

function mimeFor(name: string): string {
  const ext = name.slice(name.lastIndexOf('.') + 1);
  return (
    {
      png: 'image/png',
      jpg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      avif: 'image/avif',
      bmp: 'image/bmp',
      svg: 'image/svg+xml',
      mp3: 'audio/mpeg',
      ogg: 'audio/ogg',
      wav: 'audio/wav',
      m4a: 'audio/mp4',
    }[ext] ?? 'application/octet-stream'
  );
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const step = 0x8000; // stay under argument-count limits
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  return btoa(binary);
}

function joinBase64(parts: string[]): Uint8Array {
  const decoded = parts.map((p) => {
    const bin = atob(p);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    return out;
  });
  const total = decoded.reduce((sum, d) => sum + d.length, 0);
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const d of decoded) {
    bytes.set(d, offset);
    offset += d.length;
  }
  return bytes;
}

/** Test hook: forget all transfer state. */
export function resetAssetSyncForTests(): void {
  present.clear();
  attempts.clear();
  lastRequested.clear();
  lastSent.clear();
  owedToPlayers.clear();
  incoming.clear();
  deps = null;
}
