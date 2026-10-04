import { describe, it, expect } from 'vitest';
import type { SystemDefinition } from '@solryn/shared-types';
import { getCombatResolver, type Rng } from '@solryn/engine';
import { spells } from '../spells';
import { concentrationOnCast, spellCastLog, spellDamage } from '../spellCast';

const dnd = { modes: { combat: { id: 'attack-roll-vs-ac' } } } as unknown as SystemDefinition;
const resolver = getCombatResolver(dnd);
const seqRng = (vals: number[]): Rng => {
  let i = 0;
  return () => vals[i++ % vals.length];
};
const face = (f: number, sides: number) => (f - 0.5) / sides;
const byId = (id: string) => spells.find((s) => s.id === id)!;

describe('spellDamage — dice at chosen slot / caster level', () => {
  it('leveled spell upcasts by slot level (Fireball 8d6 at 3rd, 10d6 at 5th)', () => {
    const fb = byId('fireball');
    expect(spellDamage(fb, 3, 5)).toBe('8d6');
    expect(spellDamage(fb, 5, 5)).toBe('10d6');
  });

  it('cantrip scales by caster level (Fire Bolt 1d10 at L3, 2d10 at L5)', () => {
    const fbolt = byId('fire-bolt');
    expect(spellDamage(fbolt, 0, 3)).toBe('1d10');
    expect(spellDamage(fbolt, 0, 5)).toBe('2d10');
    expect(spellDamage(fbolt, 0, 11)).toBe('3d10');
  });

  it('non-damage spell has no dice', () => {
    expect(spellDamage(byId('bless'), 1, 5)).toBeNull();
  });
});

describe('spellCastLog — resolution branches (reuses shared resolvers)', () => {
  it('attack spell → attackRollVsAc line with target', () => {
    // Fire Bolt (cantrip, ranged attack): d20 14 (+5 = 19) vs AC 15 → HIT; 1d10 → 7 fire.
    const line = spellCastLog(byId('fire-bolt'), {
      casterName: 'Mage', targetName: 'Goblin', targetAc: 15, saveDc: 15, attackBonus: 5,
      dice: '1d10', resolver, rng: seqRng([face(14, 20), face(7, 10)]),
    });
    expect(line).toBe('Mage → Goblin — Fire Bolt: 1d20+5 = 19 vs AC 15 — HIT, 7 Fire damage');
  });

  it('save spell → damage + "DC X ABILITY save for half" note', () => {
    // Fireball 8d6, all faces 3 → 24 fire; DEX save for half → 12.
    const line = spellCastLog(byId('fireball'), {
      casterName: 'Mage', saveDc: 15, attackBonus: 5, dice: '8d6',
      resolver, rng: seqRng([face(3, 6)]),
    });
    expect(line).toBe('Mage — Fireball: rolled 3+3+3+3+3+3+3+3 = 24 Fire damage · DC 15 DEX save for half (12)');
  });

  it('utility spell → announce only, no roll', () => {
    const line = spellCastLog(byId('bless'), {
      casterName: 'Cleric', saveDc: 13, attackBonus: 5, dice: null, resolver,
    });
    expect(line).toBe('Cleric casts Bless.');
  });
});

describe('concentrationOnCast — one concentration spell at a time', () => {
  it('casting a concentration spell with none active sets it, no break log', () => {
    const res = concentrationOnCast(undefined, byId('bless'), 'Cleric');
    expect(res).toEqual({ concentrating: { spellId: 'bless', spellName: 'Bless' } });
    expect(res?.breakLog).toBeUndefined();
  });

  it('casting a second concentration spell breaks the first and logs it', () => {
    const res = concentrationOnCast({ spellId: 'bless', spellName: 'Bless' }, byId('hypnotic-pattern'), 'Cleric');
    expect(res?.concentrating).toEqual({ spellId: 'hypnotic-pattern', spellName: 'Hypnotic Pattern' });
    expect(res?.breakLog).toBe('Cleric: Concentration on Bless broken.');
  });

  it('non-concentration spell leaves concentration untouched (returns null)', () => {
    expect(concentrationOnCast({ spellId: 'bless', spellName: 'Bless' }, byId('fireball'), 'Mage')).toBeNull();
  });

  it('recasting the same concentration spell does not log a break', () => {
    const res = concentrationOnCast({ spellId: 'bless', spellName: 'Bless' }, byId('bless'), 'Cleric');
    expect(res?.breakLog).toBeUndefined();
  });
});
