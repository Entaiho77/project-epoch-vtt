import { describe, expect, it } from 'vitest';
import { longRest5e, restSolryn, shortRest5e } from '../rests';

const fighter = { characterId: 'c', name: 'Ila', level: 4, maxHp: 36, currentHp: 10, isWarlock: false, hitDiceUsed: 3 };

describe('5e rests', () => {
  it('long rest: full HP, slots back, half your hit dice back, death saves cleared', () => {
    const r = longRest5e({ ...fighter, maxSlots: { 1: 3 } });
    expect(r.updates).toMatchObject({
      '/characters/c/play/pools/hp/current': 36,
      '/characters/c/play/spellSlots': { 1: 3 },
      '/characters/c/play/hitDiceUsed': 1,
      '/characters/c/play/deathSaves': null,
      '/characters/c/play/featResources': null,
    });
  });
  it('short rest: each hit die heals its roll + CON, capped at max HP and dice left', () => {
    const r = shortRest5e(fighter, [6, 1, 9], 2); // only 1 die left (4 - 3 used)
    expect(r.updates['/characters/c/play/pools/hp/current']).toBe(18);
    expect(r.updates['/characters/c/play/hitDiceUsed']).toBe(4);
    const full = shortRest5e({ ...fighter, hitDiceUsed: 0, currentHp: 35 }, [10], 2);
    expect(full.updates['/characters/c/play/pools/hp/current']).toBe(36);
  });
  it('warlocks get pact slots back on a short rest', () => {
    const r = shortRest5e({ ...fighter, isWarlock: true, maxSlots: { 2: 2 } }, [], 0);
    expect(r.updates['/characters/c/play/spellSlots']).toEqual({ 2: 2 });
  });
});

describe('Solryn rests (rulebook Rest & Recovery)', () => {
  const pools = { hp: { id: 'hp', max: 20, current: 5 }, ap: { id: 'arcanaPoints', max: 7, current: 1 }, luck: { id: 'luckPoints', max: 2, current: 0 } };
  it('short rest: AP + half its max (rounded down), nothing else', () => {
    expect(restSolryn('c', 'B', 'short', pools).updates).toEqual({ '/characters/c/play/pools/arcanaPoints/current': 4 });
  });
  it('long rest in the field: HP + half max; AP and Luck full', () => {
    expect(restSolryn('c', 'B', 'long-field', pools).updates).toEqual({
      '/characters/c/play/pools/hp/current': 15,
      '/characters/c/play/pools/arcanaPoints/current': 7,
      '/characters/c/play/pools/luckPoints/current': 2,
    });
  });
  it('long rest in town: everything full', () => {
    expect(restSolryn('c', 'B', 'long-town', pools).updates['/characters/c/play/pools/hp/current']).toBe(20);
  });
});
