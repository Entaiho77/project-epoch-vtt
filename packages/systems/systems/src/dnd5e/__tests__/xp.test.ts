import { describe, it, expect } from 'vitest';
import { XP_THRESHOLDS, levelForXp, xpProgress, monsterXp } from '../xp';

describe('XP thresholds (SRD 2014)', () => {
  it('matches the SRD cumulative table at key levels', () => {
    expect(XP_THRESHOLDS[1]).toBe(0);
    expect(XP_THRESHOLDS[2]).toBe(300);
    expect(XP_THRESHOLDS[3]).toBe(900);
    expect(XP_THRESHOLDS[5]).toBe(6500);
    expect(XP_THRESHOLDS[11]).toBe(85000);
    expect(XP_THRESHOLDS[20]).toBe(355000);
  });

  it('levelForXp finds the highest qualifying level', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(299)).toBe(1);
    expect(levelForXp(300)).toBe(2);
    expect(levelForXp(899)).toBe(2);
    expect(levelForXp(2700)).toBe(4);
    expect(levelForXp(999999)).toBe(20); // capped
  });
});

describe('xpProgress', () => {
  it('reports fraction toward the next threshold and flags an available level-up', () => {
    // Level 1 with 150 XP: next is 300, span 300, halfway; not yet level-up.
    const p = xpProgress(150, 1);
    expect(p.nextThreshold).toBe(300);
    expect(p.fraction).toBeCloseTo(0.5, 5);
    expect(p.canLevelUp).toBe(false);
  });

  it('canLevelUp once total XP earns a higher level than current', () => {
    // 300 XP but still recorded as level 1 → can level up to 2.
    expect(xpProgress(300, 1).canLevelUp).toBe(true);
    // Already level 2 with 300 XP → caught up, no level-up.
    expect(xpProgress(300, 2).canLevelUp).toBe(false);
  });

  it('level 20 is at max', () => {
    expect(xpProgress(400000, 20).atMax).toBe(true);
    expect(xpProgress(400000, 20).canLevelUp).toBe(false);
  });
});

describe('monster XP by CR (SRD 2014)', () => {
  it('matches the standard table', () => {
    expect(monsterXp(0)).toBe(10);
    expect(monsterXp(0.125)).toBe(25); // CR 1/8
    expect(monsterXp(0.25)).toBe(50); // CR 1/4
    expect(monsterXp(0.5)).toBe(100);
    expect(monsterXp(1)).toBe(200);
    expect(monsterXp(5)).toBe(1800);
    expect(monsterXp(17)).toBe(18000);
    expect(monsterXp(30)).toBe(155000);
  });

  it('unknown CR is 0', () => {
    expect(monsterXp(99)).toBe(0);
  });
});
