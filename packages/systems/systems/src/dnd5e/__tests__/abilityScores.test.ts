import { describe, it, expect } from 'vitest';
import {
  POINT_BUY_BUDGET,
  pointBuyCost,
  pointBuyRemaining,
  pointBuySpent,
  pointBuyValid,
  roll4d6DropLowest,
  rollAbilityScores,
} from '../abilityScores';

describe('point buy (SRD cost table + 27-point budget)', () => {
  it('cost table is exactly the SRD values', () => {
    expect([8, 9, 10, 11, 12, 13, 14, 15].map(pointBuyCost)).toEqual([0, 1, 2, 3, 4, 5, 7, 9]);
  });

  it('the standard 15/15/15/8/8/8-ish spread and a 27-point spend', () => {
    // 15,14,13,12,10,8 = 9+7+5+4+2+0 = 27 → 0 left, valid.
    const scores = { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 };
    expect(pointBuySpent(scores)).toBe(27);
    expect(pointBuyRemaining(scores)).toBe(0);
    expect(pointBuyValid(scores)).toBe(true);
  });

  it('all-8s leaves the full budget', () => {
    const scores = { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 };
    expect(pointBuyRemaining(scores)).toBe(POINT_BUY_BUDGET);
    expect(pointBuyValid(scores)).toBe(true);
  });

  it('overspending the 27-point budget is invalid', () => {
    // 15,15,15,8,8,8 = 9+9+9 = 27 exactly (valid); bump one to break it.
    const over = { STR: 15, DEX: 15, CON: 15, INT: 15, WIS: 8, CHA: 8 }; // 9*4 = 36 > 27
    expect(pointBuyRemaining(over)).toBeLessThan(0);
    expect(pointBuyValid(over)).toBe(false);
  });

  it('scores outside 8–15 are invalid', () => {
    expect(pointBuyValid({ STR: 16, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 })).toBe(false);
    expect(pointBuyValid({ STR: 7, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 })).toBe(false);
  });
});

describe('rolled stats (4d6 drop lowest)', () => {
  const seqRng = (vals: number[]) => {
    let i = 0;
    return () => vals[i++ % vals.length];
  };
  // rng value that yields die face f on Math.floor(rng()*6)+1.
  const face = (f: number) => (f - 0.5) / 6;

  it('drops the lowest of four dice', () => {
    // faces 1,6,6,6 → drop the 1 → 18.
    expect(roll4d6DropLowest(seqRng([face(1), face(6), face(6), face(6)]))).toBe(18);
    // faces 3,3,4,5 → drop a 3 → 3+4+5 = 12.
    expect(roll4d6DropLowest(seqRng([face(3), face(4), face(3), face(5)]))).toBe(12);
  });

  it('produces six values, each in the valid 3–18 range', () => {
    const scores = rollAbilityScores(); // real RNG
    expect(scores).toHaveLength(6);
    for (const s of scores) {
      expect(s).toBeGreaterThanOrEqual(3);
      expect(s).toBeLessThanOrEqual(18);
    }
  });
});
