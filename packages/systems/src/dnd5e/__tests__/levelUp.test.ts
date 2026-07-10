import { describe, it, expect } from 'vitest';
import type { Character } from '@solryn/shared-types';
import { dnd5eSystem } from '../index';
import { hpGainForLevel, levelUpSummary, computeLevelUp } from '../levelUp';

function char(classId: string, scores: Record<string, number>, level: number, extra: Partial<Character['play']> = {}, def: Partial<Character['definition']> = {}): Character {
  return {
    id: 'pc', gameId: 'g', ownerUserId: 'u', systemId: 'dnd5e', name: 'X', buildComplete: true,
    definition: { ancestryId: 'human', classId, coreScores: scores, chosenSkillIds: [], knownSpellIds: [], ...def },
    play: { level, reputation: 'Unaligned', pools: {}, skills: {}, equippedWeaponIds: [], levelUpPending: true, ...extra },
  };
}
const S = { STR: 16, DEX: 12, CON: 14, INT: 16, WIS: 15, CHA: 10 }; // CON +2, INT/WIS mods for casters

describe('hpGainForLevel — 5e "take the average" per hit die', () => {
  it('⌊die/2⌋+1 + CON, per die size', () => {
    expect(hpGainForLevel('d6', 0)).toBe(4);
    expect(hpGainForLevel('d8', 0)).toBe(5);
    expect(hpGainForLevel('d10', 0)).toBe(6);
    expect(hpGainForLevel('d12', 0)).toBe(7);
    expect(hpGainForLevel('d10', 2)).toBe(8); // Fighter, CON +2
    expect(hpGainForLevel('d12', 3)).toBe(10);
  });
});

describe('levelUpSummary', () => {
  it('Fighter 1→2: gains features, HP +8 (d10+CON2), no ASI', () => {
    const sum = levelUpSummary(dnd5eSystem, char('fighter', S, 1));
    expect(sum).toMatchObject({ applicable: true, atMax: false, fromLevel: 1, toLevel: 2, isAsi: false });
    expect(sum.newFeatures.length).toBeGreaterThan(0);
    expect(sum.hpGain).toBe(8);
  });

  it('Fighter 3→4: this level has an ASI', () => {
    expect(levelUpSummary(dnd5eSystem, char('fighter', S, 3)).isAsi).toBe(true);
  });

  it('Wizard 1→2: spellbook model gains 2 spells, slots refresh to 3×L1', () => {
    const sum = levelUpSummary(dnd5eSystem, char('wizard', S, 1));
    expect(sum.model).toBe('spellbook');
    expect(sum.spellsGain).toBe(2);
    expect(sum.newMaxSlots).toEqual({ 1: 3 });
  });

  it('Cleric 1→2: prepared model, no spell picks, prepared count = WIS mod + level', () => {
    const sum = levelUpSummary(dnd5eSystem, char('cleric', S, 1));
    expect(sum.model).toBe('prepared');
    expect(sum.spellsGain).toBe(0);
    expect(sum.newPreparedCount).toBe(2 + 2); // WIS 15 (+2) + level 2
  });

  it('level 20: atMax, cannot grant further', () => {
    expect(levelUpSummary(dnd5eSystem, char('fighter', S, 20)).atMax).toBe(true);
  });

  it('non-class character: not applicable', () => {
    const c = char('fighter', S, 1, {}, { classId: undefined });
    expect(levelUpSummary(dnd5eSystem, c).applicable).toBe(false);
  });
});

describe('computeLevelUp — folds choices into persisted values', () => {
  it('bumps level + HP; applies a +2 ASI to coreScores', () => {
    const c = char('fighter', S, 1, { pools: { hp: { current: 12 } } });
    const sum = levelUpSummary(dnd5eSystem, c);
    const res = computeLevelUp(dnd5eSystem, c, sum, { asi: { STR: 2 }, newCantripIds: [], newSpellIds: [] });
    expect(res.level).toBe(2);
    expect(res.hpCurrent).toBe(12 + sum.hpGain); // full character stays full
    expect(res.coreScores.STR).toBe(18); // 16 + 2
    expect(res.coreScores.DEX).toBe(12); // untouched
  });

  it('+1/+1 ASI touches two scores', () => {
    const c = char('fighter', S, 3);
    const sum = levelUpSummary(dnd5eSystem, c);
    const res = computeLevelUp(dnd5eSystem, c, sum, { asi: { STR: 1, CON: 1 }, newCantripIds: [], newSpellIds: [] });
    expect(res.coreScores.STR).toBe(17);
    expect(res.coreScores.CON).toBe(15);
  });

  it('Wizard new spells go to the spellbook; known list keeps cantrips only', () => {
    const c = char('wizard', S, 1, {}, { knownSpellIds: ['fire-bolt'], spellbookSpellIds: ['magic-missile'] });
    const sum = levelUpSummary(dnd5eSystem, c);
    const res = computeLevelUp(dnd5eSystem, c, sum, { asi: {}, newCantripIds: [], newSpellIds: ['shield', 'thunderwave'] });
    expect(res.spellbookSpellIds).toEqual(['magic-missile', 'shield', 'thunderwave']);
    expect(res.knownSpellIds).toEqual(['fire-bolt']); // leveled picks didn't leak into known
    expect(res.spellSlots).toEqual({ 1: 3 }); // refreshed to new max
  });

  it('Known caster new spells go to the known list', () => {
    const c = char('sorcerer', S, 1, {}, { knownSpellIds: ['fire-bolt'] });
    const sum = levelUpSummary(dnd5eSystem, c);
    const res = computeLevelUp(dnd5eSystem, c, sum, { asi: {}, newCantripIds: [], newSpellIds: ['shield'] });
    expect(res.knownSpellIds).toEqual(['fire-bolt', 'shield']);
    expect(res.spellbookSpellIds).toBeUndefined();
  });
});
