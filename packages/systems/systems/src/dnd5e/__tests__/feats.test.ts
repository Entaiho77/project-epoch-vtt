import { describe, it, expect } from 'vitest';
import type { Character } from '@solryn/shared-types';
import type { FeatDefinition } from '@solryn/shared-types';
import { dnd5eSystem } from '../index';
import { pcDerived } from '../character';
import { feats, featById, meetsFeatPrerequisite } from '../feats';
import { levelUpSummary, computeLevelUp } from '../levelUp';

function pc(
  classId: string,
  level: number,
  play: Partial<Character['play']> = {},
  scores: Record<string, number> = { STR: 16, DEX: 12, CON: 14, INT: 10, WIS: 10, CHA: 10 },
): Character {
  return {
    id: 'pc', gameId: 'g', ownerUserId: 'u', systemId: 'dnd5e', name: 'X', buildComplete: true,
    definition: { ancestryId: 'human', classId, coreScores: scores, chosenSkillIds: [], knownSpellIds: [] },
    play: { level, reputation: 'Unaligned', pools: {}, skills: {}, equippedWeaponIds: ['greatsword'], equippedArmorId: 'chain-mail', ...play },
  };
}

describe('feats data + lookup (SRD 5.1)', () => {
  it('exposes only the SRD Grappler feat, wired into the system', () => {
    expect(feats.map((f) => f.id)).toEqual(['grappler']);
    expect(dnd5eSystem.feats).toBe(feats);
    expect(new Set(feats.map((f) => f.id)).size).toBe(feats.length);
  });

  it('featById resolves Grappler and returns undefined for removed/unknown feats', () => {
    expect(featById('grappler')?.name).toBe('Grappler');
    expect(featById('lucky')).toBeUndefined(); // removed PHB feat
    expect(featById('not-a-feat')).toBeUndefined();
  });
});

describe('meetsFeatPrerequisite', () => {
  const casterScores = { STR: 8, DEX: 20, CON: 10, INT: 10, WIS: 10, CHA: 10 };
  // Synthetic feats exercise the no-requirement and spellcasting branches (Grappler, the only
  // SRD feat, carries an ability requirement).
  const noReq: FeatDefinition = { id: 't-none', name: 'None', description: '' };
  const needsCaster: FeatDefinition = { id: 't-cast', name: 'Cast', description: '', requires: { needsSpellcasting: true } };

  it('feats with no requirement are always eligible', () => {
    expect(meetsFeatPrerequisite(noReq, casterScores, false)).toBe(true);
  });

  it('ability minimums are enforced (Grappler needs STR 13)', () => {
    const grappler = featById('grappler')!;
    expect(meetsFeatPrerequisite(grappler, { ...casterScores, STR: 12 }, false)).toBe(false);
    expect(meetsFeatPrerequisite(grappler, { ...casterScores, STR: 13 }, false)).toBe(true);
  });

  it('spellcasting requirement needs a caster', () => {
    expect(meetsFeatPrerequisite(needsCaster, casterScores, false)).toBe(false);
    expect(meetsFeatPrerequisite(needsCaster, casterScores, true)).toBe(true);
  });
});

describe('pcDerived folds feats', () => {
  it('a display-only feat (Grappler) appears in feats with no stat side effects', () => {
    const base = pcDerived(dnd5eSystem, pc('fighter', 4));
    const d = pcDerived(dnd5eSystem, pc('fighter', 4, { featIds: ['grappler'] }));
    expect(d.feats.map((f) => f.id)).toEqual(['grappler']);
    // Grappler is text-only: no ability change, HP, speed, power-attack toggle, or resource pool.
    expect(d.scores).toEqual(base.scores);
    expect(d.maxHp).toBe(base.maxHp);
    expect(d.speed).toBe(base.speed);
    expect(d.powerAttack).toBeUndefined();
    expect(d.featResources).toEqual([]);
  });

  it('unknown / removed feat ids are ignored', () => {
    const d = pcDerived(dnd5eSystem, pc('fighter', 4, { featIds: ['lucky'] })); // removed PHB feat
    expect(d.feats).toEqual([]);
  });
});

describe('computeLevelUp — feat instead of ASI', () => {
  it('appends the feat, leaving core scores untouched (ASI not applied)', () => {
    const c = pc('fighter', 3); // L3 → L4 is an ASI level for Fighter
    const summary = levelUpSummary(dnd5eSystem, c);
    expect(summary.isAsi).toBe(true);
    const result = computeLevelUp(dnd5eSystem, c, summary, {
      asi: {}, newCantripIds: [], newSpellIds: [], featId: 'grappler',
    });
    expect(result.featIds).toEqual(['grappler']);
    // The ASI path is NOT applied — coreScores are unchanged from the definition.
    expect(result.coreScores).toEqual(c.definition.coreScores);
  });

  it('dedupes against an already-owned feat', () => {
    const c = pc('fighter', 3, { featIds: ['grappler'] });
    const summary = levelUpSummary(dnd5eSystem, c);
    const result = computeLevelUp(dnd5eSystem, c, summary, {
      asi: {}, newCantripIds: [], newSpellIds: [], featId: 'grappler',
    });
    expect(result.featIds).toEqual(['grappler']);
  });
});
