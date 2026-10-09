import { describe, it, expect } from 'vitest';
import { convertDnd5eToSolryn } from '../convertFrom5e';

describe('convertDnd5eToSolryn', () => {
  it('converts a low-CR creature (goblin, CR 1/4 -> TR1), inferring the attack ability from its bonus', () => {
    // 5e goblin: CR 1/4, STR8 DEX14 CON10 INT10 WIS8 CHA8, scimitar 1d6+2
    // DEX14 -> 5e mod floor((14-10)/2) = +2, matching the scimitar's +2 -> infers DEX
    // without being told, since no `ability` field is passed on the attack.
    const result = convertDnd5eToSolryn({
      cr: 0.25,
      str: 8,
      dex: 14,
      con: 10,
      int: 10,
      wis: 8,
      cha: 8,
      attacks: [{ name: 'Scimitar', diceExpr: '1d6+2', damageType: 'Slashing' }],
    });

    expect(result.tr).toBe(1);
    expect(result.hp).toBe(22);
    expect(result.dr).toBe(1); // round(1 * 0.8)
    expect(result.scores).toEqual({
      STR: 6, // round(8*0.8)
      NIM: 11, // round(14*0.75)
      END: 8, // round(10*0.82)
      WIS: 6, // round(8*0.7)
      INT: 7, // round(10*0.73)
      ARC: 6, // round(8*0.75)
      LCK: Math.round(((6 + 11 + 8 + 6 + 7 + 6) / 6) / 3),
    });
    expect(result.modifiers.NIM).toBe(3); // floor(11/3)
    expect(result.attacks).toEqual([
      { name: 'Scimitar', diceExpr: '1d6+3', damageType: 'Slashing', note: undefined },
    ]);
  });

  it('infers a WIS-based attack correctly even though STR is higher (picks the matching modifier, not the biggest score)', () => {
    // STR16 (mod +3) but WIS14 (mod +2) — attack bonus is +2, so it must be the spell/WIS
    // attack, not the STR one, even though STR is the bigger number.
    const result = convertDnd5eToSolryn({
      cr: 2,
      str: 16,
      dex: 10,
      con: 10,
      int: 10,
      wis: 14,
      cha: 10,
      attacks: [{ name: 'Guiding Bolt', diceExpr: '1d10+2', damageType: 'Radiant' }],
    });
    // WIS14 -> round(14*0.7) = 10 -> solryn modifier floor(10/3) = 3
    expect(result.attacks[0].diceExpr).toBe('1d10+3');
    expect(result.notes.some((n) => n.includes('Guiding Bolt'))).toBe(false);
  });

  it('flags an attack whose bonus matches no ability modifier (e.g. a magic weapon) and defaults to STR', () => {
    const result = convertDnd5eToSolryn({
      cr: 3,
      str: 12, // mod +1
      dex: 12, // mod +1
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
      // +4 doesn't match any of this creature's ability modifiers (all are +1 or 0) —
      // likely a +3 magic longsword stacked on a +1 STR mod.
      attacks: [{ name: '+3 Longsword', diceExpr: '1d8+4', damageType: 'Slashing' }],
    });
    expect(result.notes.some((n) => n.includes('+3 Longsword') && n.includes("couldn't match"))).toBe(true);
  });

  it('converts a mid-CR creature (CR 5 -> TR5) and drops a negative-mod attack correctly', () => {
    // Hand-picked stats where a converted modifier comes out negative, to check the sign.
    const result = convertDnd5eToSolryn({
      cr: 5,
      str: 10,
      dex: 10,
      con: 16,
      int: 3,
      wis: 10,
      cha: 10,
      attacks: [{ name: 'Bite', diceExpr: '2d8+0', damageType: 'Piercing', ability: 'int' }],
    });

    expect(result.tr).toBe(5);
    expect(result.hp).toBe(84);
    expect(result.dr).toBe(4); // round(5 * 0.8)
    expect(result.scores.INT).toBe(2); // round(3*0.73)
    expect(result.modifiers.INT).toBe(0); // floor(2/3)
    expect(result.attacks[0].diceExpr).toBe('2d8'); // zero modifier -> no bonus suffix
  });

  it('converts a high-CR creature (CR 24 -> TR11 Catastrophe) with the midpoint HP band', () => {
    const result = convertDnd5eToSolryn({
      cr: 24,
      str: 27,
      dex: 14,
      con: 25,
      int: 24,
      wis: 21,
      cha: 25,
    });

    expect(result.tr).toBe(11);
    expect(result.hp).toBe(450);
    expect(result.dr).toBe(9); // round(11 * 0.8)
    expect(result.attacks).toEqual([]);
  });

  it('flags spellcasting in the output notes', () => {
    const result = convertDnd5eToSolryn({
      cr: 9,
      str: 10,
      dex: 10,
      con: 10,
      int: 18,
      wis: 10,
      cha: 10,
      hasSpells: true,
    });
    expect(result.notes.some((n) => n.toLowerCase().includes('spell'))).toBe(true);
  });

  it('always notes that HP/DR ignore the original 5e numbers', () => {
    const result = convertDnd5eToSolryn({ cr: 1, str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
    expect(result.notes[0]).toMatch(/HP and DR come only from the TR lookup/);
  });

  it('CR boundary spot-checks against the given TR table', () => {
    const cases: [number, number][] = [
      [0, 0],
      [0.125, 0],
      [0.5, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 4],
      [6, 6],
      [7, 6],
      [10, 8],
      [12, 8],
      [20, 10],
      [21, 11],
      [30, 11],
    ];
    for (const [cr, tr] of cases) {
      expect(convertDnd5eToSolryn({ cr, str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }).tr).toBe(tr);
    }
  });
});
