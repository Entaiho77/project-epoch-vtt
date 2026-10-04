import { afterEach, describe, expect, it } from 'vitest';
import { faceFor, rollDice, rollDie } from '@epoch/engine';
import {
  BATCH_SIZE,
  BATCH_TTL_MS,
  DiceLedger,
  MAX_OUTSTANDING,
  decodeValues,
  encodeValues,
  uniformFor,
} from '../diceLedger';
import { secureRoll, setGmDiceSource, takeProof } from '../secureDice';

/** Rolls `n` dice of `sides` with a batch, the way a player's app would. */
const facesFrom = (values: Uint32Array, sides: number[]) =>
  sides.map((s, i) => ({ s, f: faceFor(s, uniformFor(values[i])) }));

describe('DiceLedger (GM side)', () => {
  it('accepts dice that match the numbers handed out, once', () => {
    const l = new DiceLedger();
    const { rngId, values } = l.issue('thomas');
    expect(values).toHaveLength(BATCH_SIZE);
    const dice = facesFrom(values, [20, 6, 6]);
    expect(l.verify('thomas', { rngId, dice })).toEqual({ ok: true, skipped: 0 });
    expect(l.verify('thomas', { rngId, dice })).toMatchObject({ ok: false }); // used up
  });

  it('rejects a changed face, extra dice, someone else’s batch, and made-up ids', () => {
    const l = new DiceLedger();
    const { rngId, values } = l.issue('thomas');
    const dice = facesFrom(values, [20]);
    const nat20 = [{ s: 20, f: 20 }];
    if (dice[0].f !== 20) expect(l.verify('thomas', { rngId, dice: nat20 })).toMatchObject({ ok: false });
    expect(l.verify('angie', { rngId, dice })).toMatchObject({ ok: false, reason: /someone else/ });
    expect(l.verify('thomas', { rngId: 'gNOPE', dice })).toMatchObject({ ok: false });
    expect(l.verify('thomas', { rngId, dice: [] })).toMatchObject({ ok: false });
    expect(l.verify('thomas', { rngId, dice: [{ s: 0, f: 1 }] })).toMatchObject({ ok: false });
    expect(l.verify('thomas', null)).toMatchObject({ ok: false });
    // The honest roll still works afterwards.
    expect(l.verify('thomas', { rngId, dice })).toMatchObject({ ok: true });
  });

  it('counts earlier rolls a player asked for but never showed', () => {
    const l = new DiceLedger();
    l.issue('thomas'); // didn't like it
    l.issue('thomas'); // didn't like that either
    l.issue('angie');
    const { rngId, values } = l.issue('thomas');
    expect(l.verify('thomas', { rngId, dice: facesFrom(values, [20]) })).toEqual({ ok: true, skipped: 2 });
    // Reported once.
    const next = l.issue('thomas');
    expect(l.verify('thomas', { rngId: next.rngId, dice: facesFrom(next.values, [20]) })).toEqual({ ok: true, skipped: 0 });
  });

  it('expired and over-the-limit batches are counted too', () => {
    let now = 0;
    const l = new DiceLedger({ now: () => now });
    l.issue('thomas');
    now += BATCH_TTL_MS + 1;
    const late = l.issue('thomas');
    expect(l.verify('thomas', { rngId: late.rngId, dice: facesFrom(late.values, [6]) })).toEqual({ ok: true, skipped: 1 });
    for (let i = 0; i < MAX_OUTSTANDING + 3; i++) l.issue('thomas');
    const last = l.issue('thomas');
    expect(l.verify('thomas', { rngId: last.rngId, dice: facesFrom(last.values, [6]) })).toEqual({
      ok: true,
      skipped: MAX_OUTSTANDING + 3,
    });
  });

  it('batches survive the trip as base64', () => {
    const { values } = new DiceLedger().issue('x');
    expect(Array.from(decodeValues(encodeValues(values))!)).toEqual(Array.from(values));
    expect(decodeValues('not base64!!')).toBeNull();
  });
});

describe('secureRoll (rolling side)', () => {
  afterEach(() => setGmDiceSource(null));

  it('records every die and attaches the proof to the first log entry only', async () => {
    const { result, proof } = await secureRoll(() => {
      const r = rollDice('3d6');
      const first = takeProof();
      const second = takeProof();
      return { r, first, second };
    });
    expect(proof.rngId).toBeNull(); // not a player in a session: this computer's own dice
    expect(proof.dice.map((d) => d.s)).toEqual([6, 6, 6]);
    expect(proof.dice.map((d) => d.f)).toEqual(result.r.rolls);
    expect(result.first?.dice).toEqual(proof.dice);
    expect(result.second).toBeNull();
  });

  it("a player's dice come from the GM's numbers and check out on the GM's side", async () => {
    const ledger = new DiceLedger();
    setGmDiceSource(async () => ledger.issue('thomas'));
    const { result, proof } = await secureRoll(() => [rollDie(20), rollDie(8)]);
    expect(proof.rngId).toMatch(/^g/);
    expect(proof.dice.map((d) => d.f)).toEqual(result);
    expect(ledger.verify('thomas', proof)).toEqual({ ok: true, skipped: 0 });
  });

  it("if the GM can't be reached, the roll still happens but carries no proof", async () => {
    setGmDiceSource(async () => 'unavailable');
    const { result } = await secureRoll(() => {
      rollDie(20);
      return takeProof();
    });
    expect(result).toBeNull();
  });

  it('puts the normal dice back afterwards, even if the roll throws', async () => {
    await expect(
      secureRoll(() => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
    expect(takeProof()).toBeNull();
    const faces = Array.from({ length: 200 }, () => rollDie(6));
    expect(new Set(faces).size).toBeGreaterThan(1);
  });
});
