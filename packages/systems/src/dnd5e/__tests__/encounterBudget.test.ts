import { describe, it, expect } from 'vitest';
import {
  xpThreshold,
  partyBudget,
  adjustedXp,
  generateEncounter,
  type EncounterPoolEntry,
} from '../encounterBudget';

describe('xpThreshold / partyBudget (DMG 2014 table)', () => {
  it('matches the DMG table at a few spot-checked levels', () => {
    expect(xpThreshold(1, 'easy')).toBe(25);
    expect(xpThreshold(1, 'deadly')).toBe(100);
    expect(xpThreshold(5, 'medium')).toBe(500);
    expect(xpThreshold(5, 'deadly')).toBe(1100);
    expect(xpThreshold(20, 'deadly')).toBe(12700);
  });

  it('sums per-character thresholds for the party budget', () => {
    // 4 level-5 characters, medium difficulty: 4 * 500
    expect(partyBudget([5, 5, 5, 5], 'medium')).toBe(2000);
    // mixed levels
    expect(partyBudget([3, 4, 5], 'easy')).toBe(75 + 125 + 250);
  });
});

describe('adjustedXp (encounter multiplier table)', () => {
  it('applies the standard multiplier by monster count for a typical party size (4-6)', () => {
    expect(adjustedXp(100, 1, 4)).toBe(100); // x1
    expect(adjustedXp(100, 2, 4)).toBe(150); // x1.5
    expect(adjustedXp(100, 4, 4)).toBe(200); // x2 (3-6)
    expect(adjustedXp(100, 8, 4)).toBe(250); // x2.5 (7-10)
    expect(adjustedXp(100, 12, 4)).toBe(300); // x3 (11-14)
    expect(adjustedXp(100, 16, 4)).toBe(400); // x4 (15+)
  });

  it('shifts the multiplier row for a small party (<3) and a large one (7+)', () => {
    // 3 identical monsters normally x2, but a 2-player party treats it as one row worse (x2.5)
    expect(adjustedXp(100, 3, 2)).toBe(250);
    // 7+ players treat it as one row better: 3 monsters normally x2, becomes x1.5
    expect(adjustedXp(100, 3, 7)).toBe(150);
  });
});

describe('generateEncounter', () => {
  const pool: EncounterPoolEntry[] = [
    { id: 'bandit', name: 'Bandit', cr: 0.125, type: 'Humanoid' },
    { id: 'bandit-captain', name: 'Bandit Captain', cr: 2, type: 'Humanoid' },
    { id: 'wolf', name: 'Wolf', cr: 0.25, type: 'Beast' },
  ];

  it('picks a same-species grunt group that fills most of the budget without exceeding it', () => {
    // 4 level-3 characters, medium: budget = 4 * 150 = 600
    const result = generateEncounter(pool, [3, 3, 3, 3], 'medium', {});
    expect(result.budget).toBe(600);
    expect(result.adjustedXp).toBeLessThanOrEqual(result.budget);
    expect(result.members).toHaveLength(1);
    expect(result.underBudget).toBe(true);
  });

  it('adds a single miniboss at roughly +2 to +3 CR above the grunt when requested', () => {
    const result = generateEncounter(pool, [3, 3, 3, 3], 'medium', { includeMiniboss: true });
    const miniboss = result.members.find((m) => m.role === 'miniboss');
    expect(miniboss).toBeDefined();
    expect(miniboss!.count).toBe(1);
    const grunt = result.members.find((m) => m.role === 'grunt')!;
    expect(miniboss!.cr).toBeGreaterThanOrEqual(grunt.cr + 1);
  });

  it('mixes in a minority of a secondary type when primaryType is set and other types are in the pool', () => {
    // 4 level-5 characters, medium: budget = 4 * 500 = 2000 — plenty of room for a mix.
    const result = generateEncounter(pool, [5, 5, 5, 5], 'medium', { primaryType: 'Humanoid' });
    const grunt = result.members.find((m) => m.role === 'grunt')!;
    const secondary = result.members.find((m) => m.role === 'secondary');
    expect(grunt.cr).toBe(0.125); // the bandit, since primaryType pins the grunt search to Humanoid
    expect(secondary).toBeDefined();
    expect(secondary!.cr).toBe(0.25); // the wolf, the only non-Humanoid in the pool
    expect(secondary!.count).toBeGreaterThan(0);
    expect(secondary!.count).toBeLessThan(grunt.count); // minority, not an even split
    expect(result.adjustedXp).toBeLessThanOrEqual(result.budget);
  });

  it('does not add a secondary when the pool has only one type', () => {
    const singleTypePool: EncounterPoolEntry[] = [{ id: 'bandit', name: 'Bandit', cr: 0.125, type: 'Humanoid' }];
    const result = generateEncounter(singleTypePool, [5, 5, 5, 5], 'medium', { primaryType: 'Humanoid' });
    expect(result.members.some((m) => m.role === 'secondary')).toBe(false);
  });

  it('flags underBudget: false when nothing in the pool fits even one copy', () => {
    const expensivePool: EncounterPoolEntry[] = [{ id: 'dragon', name: 'Ancient Dragon', cr: 24 }];
    // 1 level-1 character, easy: budget = 25 — nowhere close to a CR24 monster's XP.
    const result = generateEncounter(expensivePool, [1], 'easy', {});
    expect(result.underBudget).toBe(false);
    expect(result.members).toHaveLength(1);
  });

  it('returns an empty result for an empty pool instead of throwing', () => {
    const result = generateEncounter([], [5, 5, 5, 5], 'hard', {});
    expect(result.members).toEqual([]);
    expect(result.underBudget).toBe(true);
  });

  it('uses a direct xp override instead of monsterXp(cr) for entries with no real CR', () => {
    // A comingled Solryn-bestiary creature: cr is 0 (no real 5e CR), but it carries its own
    // authored XP reward. Without the override it would score 0 XP and never get picked.
    const comingledPool: EncounterPoolEntry[] = [
      { id: 'crag-hound', name: 'Crag Hound', cr: 0, xp: 10, type: 'Beast' },
    ];
    const result = generateEncounter(comingledPool, [3, 3, 3, 3], 'medium', {});
    expect(result.members).toHaveLength(1);
    expect(result.members[0].count).toBeGreaterThan(0);
    expect(result.rawXp).toBeGreaterThan(0);
  });
});
