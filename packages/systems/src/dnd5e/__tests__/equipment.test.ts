import { describe, it, expect } from 'vitest';
import type { Character } from '@solryn/shared-types';
import type { InventoryItem } from '@solryn/shared-types';
import { dnd5eSystem } from '../index';
import { pcDerived } from '../character';

let n = 0;
function item(partial: Partial<InventoryItem>): InventoryItem {
  return {
    id: `i${n++}`, equipmentId: `e${n}`, name: 'Item', category: 'other',
    description: '', equipped: true, ...partial,
  };
}

/** Fighter (no built-in armor/weapons → unarmored 10 + DEX; pb 2 at L1) with an inventory. */
function charWith(scores: Record<string, number>, inventory: InventoryItem[], level = 1): Character {
  return {
    id: 'pc', gameId: 'g', ownerUserId: 'u', systemId: 'dnd5e', name: 'X', buildComplete: true,
    definition: { ancestryId: 'human', classId: 'fighter', coreScores: scores, chosenSkillIds: [], knownSpellIds: [] },
    play: { level, reputation: 'Unaligned', pools: {}, skills: {}, equippedWeaponIds: [] },
    inventory: Object.fromEntries(inventory.map((it) => [it.id, it])),
  };
}

const STR16 = { STR: 16, DEX: 14, CON: 14, INT: 10, WIS: 10, CHA: 10 }; // STR +3, DEX +2

describe('equipped inventory weapons join the attack list', () => {
  it('a melee weapon uses STR: to-hit = pb + STR mod, damage carries the STR mod', () => {
    const d = pcDerived(dnd5eSystem, charWith(STR16, [
      item({ name: 'Sword', category: 'weapon', damageDice: '1d8', damageType: 'slashing', weaponRange: 'melee' }),
    ]));
    const atk = d.attacks.find((a) => a.name === 'Sword')!;
    expect(atk).toBeDefined();
    expect(atk.attackBonus).toBe(5); // pb 2 + STR 3
    expect(atk.dice).toBe('1d8+3');
    expect(atk.damageType).toBe('slashing');
  });

  it('an unequipped weapon does not appear', () => {
    const d = pcDerived(dnd5eSystem, charWith(STR16, [
      item({ name: 'Sword', category: 'weapon', damageDice: '1d8', damageType: 'slashing', equipped: false }),
    ]));
    expect(d.attacks.find((a) => a.name === 'Sword')).toBeUndefined();
  });

  it('finesse uses the better of STR/DEX; ranged uses DEX', () => {
    const scores = { STR: 12, DEX: 16, CON: 12, INT: 10, WIS: 10, CHA: 10 }; // STR +1, DEX +3
    const d = pcDerived(dnd5eSystem, charWith(scores, [
      item({ name: 'Dagger', category: 'weapon', damageDice: '1d4', damageType: 'piercing', weaponRange: 'melee', properties: ['finesse'] }),
      item({ name: 'Bow', category: 'weapon', damageDice: '1d8', damageType: 'piercing', weaponRange: 'ranged' }),
    ]));
    expect(d.attacks.find((a) => a.name === 'Dagger')!.dice).toBe('1d4+3'); // DEX > STR
    expect(d.attacks.find((a) => a.name === 'Dagger')!.attackBonus).toBe(5); // pb 2 + 3
    expect(d.attacks.find((a) => a.name === 'Bow')!.dice).toBe('1d8+3'); // ranged → DEX
  });

  it('versatile shows two-handed dice with no off-hand, one-handed with a shield', () => {
    const versatile = { name: 'Longsword', category: 'weapon' as const, damageDice: '1d8', versatileDamageDice: '1d10', damageType: 'slashing', weaponRange: 'melee' as const, properties: ['versatile'] };
    const solo = pcDerived(dnd5eSystem, charWith(STR16, [item(versatile)]));
    expect(solo.attacks.find((a) => a.name === 'Longsword')!.dice).toBe('1d10+3'); // two-handed

    const withShield = pcDerived(dnd5eSystem, charWith(STR16, [
      item(versatile),
      item({ name: 'Shield', category: 'armor', armorType: 'shield', baseAc: 2 }),
    ]));
    expect(withShield.attacks.find((a) => a.name === 'Longsword')!.dice).toBe('1d8+3'); // off-hand occupied
  });
});

describe('equipped armor sets AC (Phase B2 formulas)', () => {
  const base = pcDerived(dnd5eSystem, charWith(STR16, [])).ac; // unarmored 10 + DEX 2 = 12
  it('unarmored default is 10 + DEX', () => expect(base).toBe(12));

  it('light armor = baseAc + DEX (no cap)', () => {
    const d = pcDerived(dnd5eSystem, charWith(STR16, [item({ name: 'Leather', category: 'armor', armorType: 'light', baseAc: 11 })]));
    expect(d.ac).toBe(13); // 11 + 2
  });

  it('medium armor caps DEX at +2', () => {
    const scores = { STR: 12, DEX: 18, CON: 12, INT: 10, WIS: 10, CHA: 10 }; // DEX +4
    const d = pcDerived(dnd5eSystem, charWith(scores, [item({ name: 'Breastplate', category: 'armor', armorType: 'medium', baseAc: 14 })]));
    expect(d.ac).toBe(16); // 14 + min(4, 2)
  });

  it('heavy armor ignores DEX (flat base)', () => {
    const d = pcDerived(dnd5eSystem, charWith(STR16, [item({ name: 'Plate', category: 'armor', armorType: 'heavy', baseAc: 18 })]));
    expect(d.ac).toBe(18); // DEX +2 not added
  });

  it('a shield adds +2 on top of armor', () => {
    const d = pcDerived(dnd5eSystem, charWith(STR16, [
      item({ name: 'Leather', category: 'armor', armorType: 'light', baseAc: 11 }),
      item({ name: 'Shield', category: 'armor', armorType: 'shield', baseAc: 2 }),
    ]));
    expect(d.ac).toBe(15); // 11 + DEX 2 + shield 2
  });

  it('unequipping armor reverts to the unarmored default', () => {
    const d = pcDerived(dnd5eSystem, charWith(STR16, [item({ name: 'Plate', category: 'armor', armorType: 'heavy', baseAc: 18, equipped: false })]));
    expect(d.ac).toBe(12); // back to 10 + DEX
  });
});
