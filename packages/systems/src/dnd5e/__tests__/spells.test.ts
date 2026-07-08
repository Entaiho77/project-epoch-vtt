import { describe, it, expect } from 'vitest';
import { spells, getSpellsForClass } from '../spells';

const byId = (id: string) => spells.find((s) => s.id === id);

describe('5e SRD spell list (data foundation)', () => {
  it('ingests the full SRD list including cantrips (level 0)', () => {
    expect(spells.length).toBe(319);
    expect(spells.filter((s) => s.level === 0).length).toBe(24);
    expect(spells.every((s) => s.level >= 0 && s.level <= 9)).toBe(true);
  });

  it('Fireball: level 3 Evocation, not concentration, DEX save for half', () => {
    const fb = byId('fireball');
    expect(fb).toMatchObject({
      level: 3,
      school: 'Evocation',
      concentration: false,
      ritual: false,
      damageType: 'Fire',
      save: 'DEX',
      saveSuccess: 'half',
    });
    // Base dice = the entry at the spell's own slot level.
    expect(fb?.damageDice).toBe('8d6');
    expect(fb?.scaling?.bySlotLevel?.['3']).toBe('8d6');
    expect(fb?.scaling?.bySlotLevel?.['4']).toBe('9d6');
  });

  it('Magic Missile: level 1 with upcast scaling and higher-level text', () => {
    const mm = byId('magic-missile');
    expect(mm?.level).toBe(1);
    expect(mm?.scaling?.bySlotLevel?.['1']).toBe('3d4+3'); // normalized (no spaces)
    expect(mm?.scaling?.bySlotLevel?.['2']).toBe('4d4+4');
    expect(mm?.higherLevel).toMatch(/dart/i);
  });

  it('Bless: concentration true', () => {
    expect(byId('bless')?.concentration).toBe(true);
  });

  it('Fire Bolt: cantrip attack-roll spell that scales by character level', () => {
    const fb = byId('fire-bolt');
    expect(fb?.level).toBe(0);
    expect(fb?.attackType).toBe('ranged');
    expect(fb?.scaling?.byCharacterLevel?.['1']).toBe('1d10');
    expect(fb?.scaling?.byCharacterLevel?.['5']).toBe('2d10');
  });

  it('components are parsed to V/S/M flags (+ material text)', () => {
    const fb = byId('fireball');
    expect(fb?.components).toEqual({ v: true, s: true, m: true });
    expect(fb?.material).toBeTruthy();
    expect(byId('magic-missile')?.components).toEqual({ v: true, s: true, m: false });
  });
});

describe('getSpellsForClass', () => {
  it('filters to a class spell list (Wizard includes Fireball)', () => {
    const wizard = getSpellsForClass('wizard', spells);
    expect(wizard.some((s) => s.id === 'fireball')).toBe(true);
    // Paladin (a half-caster) has its own, smaller list and no Fireball.
    const paladin = getSpellsForClass('paladin', spells);
    expect(paladin.some((s) => s.id === 'fireball')).toBe(false);
    expect(paladin.length).toBeGreaterThan(0);
  });

  it('all 8 casters have a non-empty spell list', () => {
    for (const cls of ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard']) {
      expect(getSpellsForClass(cls, spells).length, cls).toBeGreaterThan(0);
    }
  });
});
