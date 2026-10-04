import { faceFor } from '@epoch/engine';

/**
 * Dice that players can't fake.
 *
 * During a live session a player's app doesn't use its own randomness for dice.
 * It asks the GM's computer for a batch of random numbers, rolls with those, and
 * attaches the dice it rolled (sides + face, in order) to the result it posts.
 * The GM's computer — this ledger — remembers every batch it handed out and checks
 * that each face is exactly what its number produces. A batch works once.
 *
 * Fishing for a good roll (asking for numbers, not liking them, asking again) is
 * visible: when a player posts a roll, any of their earlier batches that were never
 * used are counted and shown with it ("1 earlier roll not shown").
 */

export interface DieRecord {
  /** sides */
  s: number;
  /** face rolled */
  f: number;
}

export interface RollProof {
  rngId: string;
  dice: DieRecord[];
}

/** Random numbers per batch: plenty for any single action (a crit fireball is ~20). */
export const BATCH_SIZE = 256;
/** A batch must be used within this long. */
export const BATCH_TTL_MS = 10 * 60_000;
/** Unused batches a player may hold at once (older ones are dropped and counted). */
export const MAX_OUTSTANDING = 8;

const TWO_32 = 2 ** 32;

interface Batch {
  uid: string;
  values: Uint32Array;
  issuedAt: number;
  seq: number;
}

export type ProofVerdict = { ok: true; skipped: number } | { ok: false; reason: string };

function cryptoValues(n: number): Uint32Array {
  const out = new Uint32Array(n);
  crypto.getRandomValues(out);
  return out;
}

export function uniformFor(value: number): number {
  return value / TWO_32;
}

export class DiceLedger {
  private batches = new Map<string, Batch>();
  /** Per player: unused batches already dropped (expired / over the limit), not yet reported. */
  private carried = new Map<string, number>();
  private seq = 0;
  private now: () => number;
  private random: (n: number) => Uint32Array;

  constructor(opts: { now?: () => number; random?: (n: number) => Uint32Array } = {}) {
    this.now = opts.now ?? (() => Date.now());
    this.random = opts.random ?? cryptoValues;
  }

  /** Hand a player a fresh batch of random numbers. */
  issue(uid: string): { rngId: string; values: Uint32Array } {
    this.expire();
    const mine = [...this.batches.entries()].filter(([, b]) => b.uid === uid).sort((a, b) => a[1].seq - b[1].seq);
    while (mine.length >= MAX_OUTSTANDING) {
      const [oldId] = mine.shift() as [string, Batch];
      this.batches.delete(oldId);
      this.carry(uid);
    }
    const rngId = `g${(++this.seq).toString(36)}${this.random(1)[0].toString(36)}`;
    const values = this.random(BATCH_SIZE);
    this.batches.set(rngId, { uid, values, issuedAt: this.now(), seq: this.seq });
    return { rngId, values };
  }

  /**
   * Check a player's dice against the batch they were given. On success the batch is
   * used up, and `skipped` says how many of their earlier batches were never shown.
   */
  verify(uid: string, proof: unknown): ProofVerdict {
    this.expire();
    if (!proof || typeof proof !== 'object') return { ok: false, reason: 'no dice' };
    const { rngId, dice } = proof as Partial<RollProof>;
    if (typeof rngId !== 'string' || !Array.isArray(dice)) return { ok: false, reason: 'no dice' };
    const batch = this.batches.get(rngId);
    if (!batch) return { ok: false, reason: 'those dice were not handed out (or were already used)' };
    if (batch.uid !== uid) return { ok: false, reason: 'those dice belong to someone else' };
    if (dice.length === 0 || dice.length > batch.values.length) return { ok: false, reason: 'bad dice' };
    for (let i = 0; i < dice.length; i++) {
      const d = dice[i] as Partial<DieRecord> | null;
      if (!d || !Number.isInteger(d.s) || (d.s as number) < 1 || (d.s as number) > 10_000) {
        return { ok: false, reason: 'bad dice' };
      }
      if (d.f !== faceFor(d.s as number, uniformFor(batch.values[i]))) {
        return { ok: false, reason: 'a die does not match the roll' };
      }
    }
    this.batches.delete(rngId);
    let skipped = this.carried.get(uid) ?? 0;
    this.carried.delete(uid);
    for (const [id, b] of this.batches) {
      if (b.uid === uid && b.seq < batch.seq) {
        this.batches.delete(id);
        skipped += 1;
      }
    }
    return { ok: true, skipped };
  }

  /** A player left: forget their batches. */
  forget(uid: string): void {
    for (const [id, b] of this.batches) if (b.uid === uid) this.batches.delete(id);
    this.carried.delete(uid);
  }

  private carry(uid: string): void {
    this.carried.set(uid, (this.carried.get(uid) ?? 0) + 1);
  }

  private expire(): void {
    const cutoff = this.now() - BATCH_TTL_MS;
    for (const [id, b] of this.batches) {
      if (b.issuedAt < cutoff) {
        this.batches.delete(id);
        this.carry(b.uid);
      }
    }
  }
}

/** Batches travel as base64 (4 bytes per number). */
export function encodeValues(values: Uint32Array): string {
  const bytes = new Uint8Array(values.buffer, values.byteOffset, values.byteLength);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

export function decodeValues(b64: string): Uint32Array | null {
  try {
    const s = atob(b64);
    if (s.length % 4 !== 0 || s.length === 0 || s.length > BATCH_SIZE * 4) return null;
    const bytes = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
    return new Uint32Array(bytes.buffer);
  } catch {
    return null;
  }
}
