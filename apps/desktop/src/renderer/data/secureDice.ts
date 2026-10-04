import { setDiceSource, setDieObserver } from '@epoch/engine';
import { uniformFor, type DieRecord, BATCH_SIZE } from './diceLedger';

/**
 * Rolling dice in a way the GM can check (see diceLedger.ts).
 *
 *   const { result } = await secureRoll(() => {
 *     const r = rollDice('d20');          // any engine dice inside
 *     postRoll(`d20: ${r.total}`);        // the roll log attaches the proof
 *     return r;
 *   });
 *
 * - Player in a live session: random numbers come from the GM's computer.
 * - Everyone else (the GM, or playing offline): this computer's own secure randomness.
 * The body runs synchronously with those numbers installed; every die it rolls is
 * recorded, and the first roll-log entry it posts carries the record.
 */

export interface RollContext {
  /** Set when the numbers came from the GM (players in a session). */
  rngId: string | null;
  dice: DieRecord[];
  /** The proof has been attached to a roll-log entry already. */
  attached: boolean;
  /** A player whose GM couldn't be reached: rolled here, so nothing to prove. */
  unverifiable: boolean;
}

/** How a player's app gets numbers from the GM; installed by realtime.ts. */
type GmDiceSource = () => Promise<{ rngId: string; values: Uint32Array } | 'unavailable' | null>;
let gmSource: GmDiceSource | null = null;

export function setGmDiceSource(fn: GmDiceSource | null): void {
  gmSource = fn;
}

let current: RollContext | null = null;

/** The roll being made right now (only during a secureRoll body). */
export function currentRoll(): RollContext | null {
  return current;
}

/**
 * Take the proof for a roll-log entry: the dice rolled so far in this action,
 * once. Later entries from the same action (e.g. "concentration broken") get none.
 */
export function takeProof(): { rngId?: string; dice: DieRecord[] } | null {
  if (!current || current.unverifiable || current.attached || current.dice.length === 0) return null;
  current.attached = true;
  return current.rngId ? { rngId: current.rngId, dice: [...current.dice] } : { dice: [...current.dice] };
}

function localValues(): Uint32Array {
  const v = new Uint32Array(BATCH_SIZE);
  crypto.getRandomValues(v);
  return v;
}

export class RollTooLargeError extends Error {
  constructor() {
    super('That roll needs more dice than one action allows.');
  }
}

export async function secureRoll<T>(
  body: () => T,
): Promise<{ result: T; proof: { rngId: string | null; dice: DieRecord[] } }> {
  const got = gmSource ? await gmSource() : null;
  const fromGm = got && got !== 'unavailable' ? got : null;
  const values = fromGm?.values ?? localValues();
  const ctx: RollContext = {
    rngId: fromGm?.rngId ?? null,
    dice: [],
    attached: false,
    unverifiable: got === 'unavailable',
  };
  let i = 0;
  const prevSource = setDiceSource(() => {
    if (i >= values.length) throw new RollTooLargeError();
    return uniformFor(values[i++]);
  });
  setDieObserver((s, f) => ctx.dice.push({ s, f }));
  const prevCtx = current;
  current = ctx;
  try {
    const result = body();
    return { result, proof: { rngId: ctx.rngId, dice: ctx.dice } };
  } finally {
    current = prevCtx;
    setDieObserver(null);
    setDiceSource(prevSource);
  }
}
