import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  collectAssetNames,
  handleAssetOp,
  initAssetSync,
  onAssetStored,
  resetAssetSyncForTests,
  type AssetOp,
} from '../assetSync';

const NAME = `${'a'.repeat(64)}.png`;
const OTHER = `${'b'.repeat(64)}.jpg`;

const b64 = (s: string): string => btoa(s);

describe('assetSync', () => {
  let sent: AssetOp[];
  let stored: Map<string, Uint8Array>;
  let putBytes: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    resetAssetSyncForTests();
    sent = [];
    stored = new Map();
    // Fake file storage: names the content by its first byte so a test can
    // make the "hash" match or not.
    putBytes = vi.fn(async (bytes: Uint8Array) => {
      const name = bytes[0] === 'G'.charCodeAt(0) ? NAME : OTHER;
      stored.set(name, bytes);
      return `epoch-asset:${name}`;
    });
    window.epochAssets = {
      put: vi.fn(),
      putBytes,
      has: vi.fn(async (name: string) => stored.has(name)),
      get: vi.fn(async (name: string) => stored.get(name)!.buffer as ArrayBuffer),
      url: (name: string) => `asset://${name}`,
    };
    initAssetSync({ send: (op) => sent.push(op), isOpen: () => true, isGm: () => false });
  });

  afterEach(() => {
    delete window.epochAssets;
  });

  it('finds image references anywhere in synced data', () => {
    const names = collectAssetNames({
      maps: { m1: { imageUrl: `epoch-asset:${NAME}` } },
      tokens: [{ imageUrl: `epoch-asset:${OTHER}` }, { imageUrl: 'https://x/y.png' }],
      junk: 'epoch-asset:../../epoch.db',
    });
    expect([...names].sort()).toEqual([NAME, OTHER].sort());
  });

  it('reassembles chunks that arrive out of order and announces the file', async () => {
    const announced: string[] = [];
    onAssetStored((n) => announced.push(n));
    await handleAssetOp({ t: 'asset-chunk', name: NAME, i: 1, n: 2, data: b64('Map') });
    expect(putBytes).not.toHaveBeenCalled();
    await handleAssetOp({ t: 'asset-chunk', name: NAME, i: 0, n: 2, data: b64('Good') });
    expect(new TextDecoder().decode(stored.get(NAME))).toBe('GoodMap');
    expect(announced).toEqual([NAME]);
  });

  it('rejects a file whose contents do not match the requested fingerprint', async () => {
    const announced: string[] = [];
    onAssetStored((n) => announced.push(n));
    // Content hashes to OTHER, but claims to be NAME.
    await handleAssetOp({ t: 'asset-chunk', name: NAME, i: 0, n: 1, data: b64('Bad') });
    expect(announced).toEqual([]);
  });

  it('ignores malformed chunks and unsafe names', async () => {
    await handleAssetOp({ t: 'asset-chunk', name: NAME, i: 5, n: 2, data: b64('x') });
    await handleAssetOp({ t: 'asset-chunk', name: NAME, i: 0, n: 9999, data: b64('x') });
    await handleAssetOp({ t: 'asset-chunk', name: '../epoch.db', i: 0, n: 1, data: b64('x') });
    expect(putBytes).not.toHaveBeenCalled();
  });

  it('answers a request by sending the file in chunks', async () => {
    const big = new Uint8Array(600 * 1024).fill(71); // 'G'
    stored.set(NAME, big);
    await handleAssetOp({ t: 'asset-req', name: NAME });
    const chunks = sent.filter((op) => op.t === 'asset-chunk');
    expect(chunks).toHaveLength(3); // 256 KB + 256 KB + 88 KB
    expect(chunks.every((c) => c.t === 'asset-chunk' && c.n === 3)).toBe(true);
  });
});
