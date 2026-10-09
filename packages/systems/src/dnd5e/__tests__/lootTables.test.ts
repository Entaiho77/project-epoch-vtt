import { describe, it, expect } from 'vitest';
import { LOOT_TIERS, generateLootPool, tierForCr } from '../lootTables';
import type { HomebrewEquipment } from '@epoch/shared-types';

describe('tierForCr', () => {
  it('buckets a CR into the matching tier, matching the item 6 converter groupings', () => {
    expect(tierForCr(0)).toBe(LOOT_TIERS[0]);
    expect(tierForCr(3)).toBe(LOOT_TIERS[0]);
    expect(tierForCr(4)).toBe(LOOT_TIERS[1]);
    expect(tierForCr(9)).toBe(LOOT_TIERS[2]);
    expect(tierForCr(12)).toBe(LOOT_TIERS[3]);
    expect(tierForCr(20)).toBe(LOOT_TIERS[5]);
    expect(tierForCr(30)).toBe(LOOT_TIERS[6]);
  });

  it('falls back to the lowest tier for an out-of-range CR instead of throwing', () => {
    expect(tierForCr(-1)).toBe(LOOT_TIERS[0]);
    expect(tierForCr(99)).toBe(LOOT_TIERS[0]);
  });
});

describe('generateLootPool', () => {
  // Deterministic rng: returns 0 (lowest roll) every time, so every "chance" check and every
  // "pick index 0" branch is exercised predictably.
  const always0 = () => 0;
  // Returns just under 1 every time — the opposite edge.
  const always1 = () => 0.999999;

  it('always rolls some gold for at least one creature, scaled by tier', () => {
    const low = generateLootPool([{ name: 'Rat', cr: 0 }], [], always0);
    const high = generateLootPool([{ name: 'Ancient Dragon', cr: 25 }], [], always0);
    expect(low.gold).toBeGreaterThanOrEqual(0);
    expect(high.gold).toBeGreaterThan(low.gold);
  });

  it('rolls every magic-table entry as an independent chance (rng always "hits")', () => {
    const pool = generateLootPool([{ name: 'Young Dragon', cr: 8 }], [], always0);
    // CR 8 is the 7-9 tier, which has 3 magic entries — an always-hit rng should produce all 3
    // plus whatever mundane items rolled, not just one "picked" item.
    const magicNames = new Set(pool.items.map((i) => i.name));
    expect(magicNames.has('Potion of Healing')).toBe(true);
    expect(magicNames.has('Spell Scroll (3rd level)')).toBe(true);
    expect(magicNames.has('+1 Weapon')).toBe(true);
  });

  it('rolls nothing from the magic table when rng always "misses"', () => {
    const pool = generateLootPool([{ name: 'Young Dragon', cr: 8 }], [], always1);
    const magicItems = pool.items.filter((i) => i.rarity);
    expect(magicItems).toHaveLength(0);
  });

  it('aggregates across multiple creatures instead of just the last one', () => {
    const pool = generateLootPool(
      [{ name: 'Goblin', cr: 0.25 }, { name: 'Goblin', cr: 0.25 }, { name: 'Goblin Boss', cr: 1 }],
      [],
      always0,
    );
    // 3 creatures, each guaranteed >=0 gold rolled independently and summed.
    expect(pool.gold).toBeGreaterThan(0);
  });

  it('merges in the GM homebrew equipment library instead of only the built-in mundane list', () => {
    const homebrew: HomebrewEquipment[] = [
      { id: 'hb-1', name: 'Rusty Pitchfork', category: 'weapon', description: 'A farm tool pressed into service.' },
    ];
    // always0 drives both the "use library" coin flip (rng() < 0.5) and the library index pick;
    // CR 8 (the 7-9 tier) guarantees at least one mundane roll even at the bottom of its range.
    const pool = generateLootPool([{ name: 'Bandit Captain', cr: 8 }], homebrew, always0);
    expect(pool.items.some((i) => i.name === 'Rusty Pitchfork')).toBe(true);
  });

  it('every generated item gets a unique id', () => {
    const pool = generateLootPool(
      [{ name: 'A', cr: 8 }, { name: 'B', cr: 8 }],
      [],
      always0,
    );
    const ids = new Set(pool.items.map((i) => i.id));
    expect(ids.size).toBe(pool.items.length);
  });
});
