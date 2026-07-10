import { describe, it, expect } from 'vitest';
import type { Character } from '@solryn/shared-types';
import type { SystemDefinition } from '@solryn/shared-types';
import { getCombatResolver, type Rng } from '@solryn/engine';
import { dnd5eSystem } from '../index';
import { pcDerived } from '../character';
import { subclasses } from '../subclasses';

function pc(classId: string, level: number, subclassId?: string): Character {
  return {
    id: 'pc', gameId: 'g', ownerUserId: 'u', systemId: 'dnd5e', name: 'X', buildComplete: true,
    definition: { ancestryId: 'human', classId, coreScores: { STR: 16, DEX: 12, CON: 14, INT: 10, WIS: 10, CHA: 10 }, chosenSkillIds: [], knownSpellIds: [] },
    play: { level, reputation: 'Unaligned', pools: {}, skills: {}, equippedWeaponIds: ['longsword'], equippedArmorId: 'chain-mail', ...(subclassId ? { subclassId } : {}) },
  };
}

describe('subclasses (SRD 2014)', () => {
  it('one subclass per class, 12 total, each with a valid parent', () => {
    expect(subclasses).toHaveLength(12);
    const classIds = new Set(dnd5eSystem.classes!.map((c) => c.id));
    for (const sub of subclasses) expect(classIds.has(sub.classId)).toBe(true);
    expect(dnd5eSystem.subclasses).toHaveLength(12);
  });

  it('Champion features arrive at levels 3/7/10/15/18', () => {
    const champ = subclasses.find((s) => s.id === 'champion')!;
    expect(champ.levels.map((l) => l.level)).toEqual([3, 7, 10, 15, 18]);
    expect(champ.levels.find((l) => l.level === 3)!.features).toContain('Improved Critical');
    expect(champ.levels.find((l) => l.level === 15)!.features).toContain('Superior Critical');
  });

  it('pcDerived merges subclass features cumulatively up to the character level', () => {
    const d3 = pcDerived(dnd5eSystem, pc('fighter', 3, 'champion'));
    expect(d3.subclassName).toBe('Champion');
    expect(d3.subclassFeatures).toEqual(['Improved Critical']);
    const d10 = pcDerived(dnd5eSystem, pc('fighter', 10, 'champion'));
    expect(d10.subclassFeatures).toEqual(['Improved Critical', 'Remarkable Athlete', 'Additional Fighting Style']);
  });

  it('crit threshold: 20 by default, 19 at Champion L3, 18 at L15', () => {
    expect(pcDerived(dnd5eSystem, pc('fighter', 3)).critThreshold).toBe(20); // no subclass
    expect(pcDerived(dnd5eSystem, pc('fighter', 3, 'champion')).critThreshold).toBe(19);
    expect(pcDerived(dnd5eSystem, pc('fighter', 14, 'champion')).critThreshold).toBe(19); // before L15
    expect(pcDerived(dnd5eSystem, pc('fighter', 15, 'champion')).critThreshold).toBe(18);
  });
});

describe('attackRollVsAc — configurable crit threshold', () => {
  const dnd = { modes: { combat: { id: 'attack-roll-vs-ac' } } } as unknown as SystemDefinition;
  const resolver = getCombatResolver(dnd);
  const seqRng = (vals: number[]): Rng => { let i = 0; return () => vals[i++ % vals.length]; };
  const face = (f: number, sides: number) => (f - 0.5) / sides;

  it('a natural 19 crits when critThreshold is 19 (Champion), auto-hitting', () => {
    // d20 → 19; crit damage 2d8+3 (longsword doubled) faces 5,4 → "5+4+3 = 12".
    const res = resolver.resolveAttack({
      label: 'Aria — Longsword', dice: '1d8+3', damageType: 'Slashing', attackBonus: 5,
      targetAc: 99, critThreshold: 19, rng: seqRng([face(19, 20), face(5, 8), face(4, 8)]),
    });
    expect(res.crit).toBe(true);
    expect(res.hit).toBe(true);
    expect(res.logText).toBe('Aria — Longsword: natural 19 — CRIT, 5+4+3 = 12 Slashing damage');
  });

  it('a natural 19 is NOT a crit at the default threshold of 20', () => {
    // d20 → 19 (+0 = 19) vs AC 25 → miss (no crit, needs the total).
    const res = resolver.resolveAttack({
      label: 'X — Longsword', dice: '1d8+3', attackBonus: 0, targetAc: 25,
      rng: seqRng([face(19, 20)]),
    });
    expect(res.crit).toBeFalsy();
    expect(res.hit).toBe(false);
  });
});
