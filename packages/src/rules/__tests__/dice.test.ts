import { describe, it, expect } from 'vitest';
import { parseDice, rollDice, rollDie, rollHighest, rollLowest, type Rng } from '../dice';

/** Deterministic RNG cycling through provided [0,1) values. */
const seqRng = (vals: number[]): Rng => {
  let i = 0;
  return () => vals[i++ % vals.length];
};

describe('parseDice', () => {
  it.each([
    ['2d6+3', { count: 2, sides: 6, modifier: 3 }],
    ['d20', { count: 1, sides: 20, modifier: 0 }],
    ['1d4-1', { count: 1, sides: 4, modifier: -1 }],
    ['100d100+100', { count: 100, sides: 100, modifier: 100 }],
  ])('parses %s', (notation, expected) => {
    expect(parseDice(notation)).toEqual(expected);
  });

  it.each(['garbage', '0d6', 'd0', '2x6', ''])('rejects %s', (bad) => {
    expect(parseDice(bad)).toBeNull();
  });
});

describe('rollDie', () => {
  it('maps rng [0,1) to [1, sides]', () => {
    expect(rollDie(6, () => 0)).toBe(1);
    expect(rollDie(6, () => 0.999)).toBe(6);
    expect(rollDie(20, () => 0.5)).toBe(11);
  });
});

describe('rollDice', () => {
  it('rolls and sums with modifier', () => {
    const result = rollDice('2d6+3', () => 0); // each die → 1
    expect(result.rolls).toEqual([1, 1]);
    expect(result.total).toBe(5);
    expect(result.modifier).toBe(3);
  });

  it('throws on invalid notation', () => {
    expect(() => rollDice('nope')).toThrow();
  });
});

describe('rollHighest (advantage / harvest assist)', () => {
  it('keeps the best of N rolls', () => {
    // d20: first roll uses 0.1 → 3, second uses 0.9 → 19
    const { best, all } = rollHighest('d20', 2, seqRng([0.1, 0.9]));
    expect(all).toHaveLength(2);
    expect(best.total).toBe(19);
  });
});

describe('rollLowest (disadvantage)', () => {
  it('keeps the worst of N rolls', () => {
    // d20: first roll 0.1 → 3, second 0.9 → 19; lowest = 3
    const { worst, all } = rollLowest('d20', 2, seqRng([0.1, 0.9]));
    expect(all).toHaveLength(2);
    expect(worst.total).toBe(3);
  });
});
