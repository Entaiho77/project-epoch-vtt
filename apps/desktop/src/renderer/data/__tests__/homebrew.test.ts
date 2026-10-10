import { describe, it, expect } from 'vitest';
import type { SystemDefinition } from '@epoch/shared-types';
import { getCombatResolver, type Rng } from '@epoch/engine';
import {
  crToNumber,
  equipmentList,
  equipmentToInventoryItem,
  homebrewToBestiaryEntry,
  type HomebrewEquipment,
  type HomebrewMonster,
} from '../homebrew';

function hb(over: Partial<HomebrewMonster> = {}): HomebrewMonster {
  return {
    id: 'hb1', name: 'Gloom Stalker', size: 'Medium', type: 'monstrosity', alignment: 'neutral evil',
    hp: 45, ac: 15, speed: 40, cr: '3',
    str: 16, dex: 18, con: 14, int: 8, wis: 12, cha: 6,
    damageResistances: ['cold'], damageImmunities: [], damageVulnerabilities: ['fire'],
    conditionImmunities: ['frightened'],
    attacks: { a0: { name: 'Claw', toHit: 6, damageDice: '2d6+4', damageType: 'slashing' } },
    traits: { t0: { name: 'Ambusher', description: 'Advantage on attacks in the first round.' } },
    actions: { c0: { name: 'Multiattack', description: 'Two claw attacks.' } },
    legendaryActions: { l0: { name: 'Pounce', description: 'Move up to half speed.' } },
    ...over,
  };
}

describe('crToNumber', () => {
  it('parses fractions and whole numbers', () => {
    expect(crToNumber('1/8')).toBe(0.125);
    expect(crToNumber('1/4')).toBe(0.25);
    expect(crToNumber('1/2')).toBe(0.5);
    expect(crToNumber('5')).toBe(5);
    expect(crToNumber('0')).toBe(0);
    expect(crToNumber('nonsense')).toBe(0);
  });
});

describe('homebrewToBestiaryEntry', () => {
  const e = homebrewToBestiaryEntry(hb());

  it('produces a creature BestiaryEntry with SRD-shaped stats', () => {
    expect(e.id).toBe('hb1');
    expect(e.name).toBe('Gloom Stalker');
    expect(e.category).toBe('creature');
    expect(e.stats.ac).toBe(15);
    expect(e.stats.hp).toBe(45);
    expect(e.stats.speed).toBe('40 ft.');
    expect(e.stats.type).toBe('Monstrosity'); // capitalized like SRD
    expect(e.stats.cr).toBe(3);
    expect(e.stats.crLabel).toBe('3');
    expect(e.stats.dex).toBe(18);
    expect(e.stats.resistances).toBe('cold');
    expect(e.stats.vulnerabilities).toBe('fire');
    expect(e.stats.conditionImmunities).toBe('frightened');
    // Absent lists don't add empty keys.
    expect('immunities' in e.stats).toBe(false);
  });

  it('maps the attacks object-map to structured AttackEntry rows', () => {
    expect(e.attacks).toEqual([
      { name: 'Claw', diceExpr: '2d6+4', damageType: 'slashing', attackBonus: 6 },
    ]);
  });

  it('flattens traits/actions/legendary into abilities lines (legendary tagged)', () => {
    expect(e.abilities).toEqual([
      'Ambusher: Advantage on attacks in the first round.',
      'Multiattack: Two claw attacks.',
      'Pounce (Legendary): Move up to half speed.',
    ]);
  });

  it('omits attacks/abilities when there are none', () => {
    const bare = homebrewToBestiaryEntry(hb({ attacks: {}, traits: {}, actions: {}, legendaryActions: {} }));
    expect(bare.attacks).toBeUndefined();
    expect(bare.abilities).toBeUndefined();
  });

  it('survives Firebase dropping empty arrays/maps (undefined fields)', () => {
    // Firebase stores nothing for empty arrays/objects → they read back as undefined.
    const sparse = {
      id: 'x', name: 'Blob', size: 'Small', type: 'ooze', alignment: 'unaligned',
      hp: 5, ac: 8, speed: 10, cr: '0', str: 6, dex: 6, con: 10, int: 1, wis: 6, cha: 1,
      createdBy: 'gm',
    } as unknown as HomebrewMonster;
    const entry = homebrewToBestiaryEntry(sparse);
    expect(entry.name).toBe('Blob');
    expect(entry.attacks).toBeUndefined();
    expect(entry.abilities).toBeUndefined();
    expect('resistances' in entry.stats).toBe(false);
  });
});

describe('homebrew attacks run through the SAME combat resolver as SRD', () => {
  // A minimal 5e-mode system: the resolver only cares about modes.combat.id, not the creature.
  const dnd = { modes: { combat: { id: 'attack-roll-vs-ac' } } } as unknown as SystemDefinition;
  const resolver = getCombatResolver(dnd);
  const seqRng = (vals: number[]): Rng => { let i = 0; return () => vals[i++ % vals.length]; };
  const face = (f: number, sides: number) => (f - 0.5) / sides;

  it('a homebrew attack hits vs AC and rolls its damage, no special-casing', () => {
    const entry = homebrewToBestiaryEntry(hb());
    const atk = entry.attacks![0]; // Claw: +6, 2d6+4 slashing
    // d20 → 15 (+6 = 21) vs AC 15 → hit; damage 2d6+4 with faces 3,5 → 3+5+4 = 12.
    const res = resolver.resolveAttack({
      label: `${entry.name} — ${atk.name}`,
      dice: atk.diceExpr,
      damageType: atk.damageType,
      attackBonus: atk.attackBonus,
      targetAc: 15,
      rng: seqRng([face(15, 20), face(3, 6), face(5, 6)]),
    });
    expect(res.hit).toBe(true);
    expect(res.damage).toBe(12);
    expect(res.logText).toContain('HIT');
  });
});

function eq(over: Partial<HomebrewEquipment> = {}): HomebrewEquipment {
  return {
    id: 'eq1', name: 'Flametongue', category: 'weapon', description: 'A blade wreathed in fire.',
    weight: 3, value: '5000 gp',
    damageDice: '1d8', damageType: 'slashing', weaponRange: 'melee',
    properties: ['versatile'], versatileDamageDice: '1d10',
    ...over,
  };
}

describe('equipmentToInventoryItem (loot snapshot)', () => {
  it('snapshots the item: references equipmentId, drops the source id, defaults equipped false', () => {
    const item = equipmentToInventoryItem(eq());
    expect('id' in item).toBe(false); // record id is assigned on write, not here
    expect(item.equipmentId).toBe('eq1');
    expect(item.equipped).toBe(false);
    expect(item.name).toBe('Flametongue');
    expect(item.category).toBe('weapon');
    expect(item.damageDice).toBe('1d8');
    expect(item.versatileDamageDice).toBe('1d10');
  });

  it('prunes undefined optional fields (Firebase set() rejects undefined)', () => {
    const item = equipmentToInventoryItem(
      eq({ weight: undefined, value: undefined, properties: undefined, versatileDamageDice: undefined }),
    );
    for (const [, v] of Object.entries(item)) expect(v).not.toBeUndefined();
    expect('weight' in item).toBe(false);
    expect('value' in item).toBe(false);
    expect('versatileDamageDice' in item).toBe(false);
  });
});

describe('homebrewToBestiaryEntry (Demilich acceptance test)', () => {
  // From claude/HOMEBREW_MONSTER_FORM_BRIEF.md — every previously-missing section entered as
  // real fields, none of it stuffed into names or descriptions.
  const demilich = hb({
    id: 'demilich', name: 'Demilich', size: 'Tiny', type: 'undead', alignment: 'neutral evil',
    hp: 80, ac: 20, speed: 0, cr: '18',
    otherSpeeds: { fly: 30, hover: true },
    str: 1, dex: 16, con: 10, int: 20, wis: 17, cha: 20,
    proficiencyBonus: 7,
    savingThrows: { con: 6, int: 11, wis: 9, cha: 11 },
    senses: 'truesight 120 ft., passive Perception 13',
    languages: 'None',
    damageResistances: ['bludgeoning', 'piercing', 'slashing'],
    damageResistanceNote: 'from magic weapons',
    damageImmunities: ['bludgeoning', 'piercing', 'slashing'],
    damageImmunityNote: "from nonmagical attacks that aren't magic",
    conditionImmunities: ['frightened'],
    attacks: {},
    traits: { t0: { name: 'Legendary Resistance', description: 'If the demilich fails a saving throw, it can choose to succeed instead.', uses: '3/Day' } },
    actions: {
      howl: { name: 'Howl', description: 'All creatures within 30 feet must succeed on a save or be frightened.', saveAbility: 'con', saveDc: 15, recharge: '5-6' },
      lifeDrain: { name: 'Life Drain', description: 'One creature the demilich can see within 30 feet.', saveAbility: 'con', saveDc: 19, damage: '21 (6d6) necrotic', healing: 'equal to the damage dealt' },
      cloudOfDust: { name: 'Cloud of Dust', description: 'A cloud of ancient dust and grave dirt.', saveAbility: 'con', saveDc: 15, saveEffect: 'half' },
    },
    legendaryActions: {
      energyDrain: { name: 'Energy Drain', description: 'The demilich targets one creature.', cost: 2 },
      vileCurse: { name: 'Vile Curse', description: 'The demilich curses one creature.', cost: 3 },
    },
    legendaryActionCount: 3,
  });

  it('carries speed with a hovering fly speed alongside walk 0', () => {
    const e = homebrewToBestiaryEntry(demilich);
    expect(e.stats.speed).toBe('0 ft., fly 30 ft. (hover)');
  });

  it('carries qualified resistances and immunities as one display string, not lost to checkboxes', () => {
    const e = homebrewToBestiaryEntry(demilich);
    expect(e.stats.resistances).toBe('bludgeoning, piercing, slashing (from magic weapons)');
    expect(e.stats.immunities).toBe("bludgeoning, piercing, slashing (from nonmagical attacks that aren't magic)");
  });

  it('carries proficiency bonus, saving throws, senses, and languages', () => {
    const e = homebrewToBestiaryEntry(demilich);
    expect(e.stats.proficiencyBonus).toBe('+7');
    expect(e.stats.savingThrows).toBe('CON +6, INT +11, WIS +9, CHA +11');
    expect(e.stats.senses).toBe('truesight 120 ft., passive Perception 13');
    expect(e.stats.languages).toBe('None');
  });

  it('turns save DC/ability/recharge/uses/healing/cost into structured data and readable tags', () => {
    const e = homebrewToBestiaryEntry(demilich);
    expect(e.abilities).toContain(
      'Legendary Resistance: If the demilich fails a saving throw, it can choose to succeed instead. (Uses: 3/Day)',
    );
    expect(e.abilities).toContain(
      'Howl: All creatures within 30 feet must succeed on a save or be frightened. (DC 15 CON save; Recharge 5-6)',
    );
    expect(e.abilities).toContain(
      'Life Drain: One creature the demilich can see within 30 feet. (Damage: 21 (6d6) necrotic; Healing: equal to the damage dealt; DC 19 CON save)',
    );
    expect(e.abilities).toContain(
      'Cloud of Dust: A cloud of ancient dust and grave dirt. (DC 15 CON save (half on success))',
    );
    expect(e.abilities).toContain(
      'Energy Drain (Legendary): The demilich targets one creature. (Costs 2 Actions)',
    );
    expect(e.abilities).toContain(
      'Vile Curse (Legendary): The demilich curses one creature. (Costs 3 Actions)',
    );
    expect(e.stats.legendaryActionCount).toBe(3);
  });

  it('builds structured CreatureSave entries from every save-bearing action, for the stat card', () => {
    const e = homebrewToBestiaryEntry(demilich);
    expect(e.saves).toEqual(
      expect.arrayContaining([
        { name: 'Howl', ability: 'con', dc: 15, success: 'none' },
        { name: 'Life Drain', ability: 'con', dc: 19, success: 'none' },
        { name: 'Cloud of Dust', ability: 'con', dc: 15, success: 'half' },
      ]),
    );
  });
});

describe('homebrewToBestiaryEntry (spellcasting as its own section)', () => {
  it('renders ability/DC/attack bonus plus at-will and per-day spell lists', () => {
    const caster = hb({
      actions: {},
      spellcasting: {
        ability: 'int',
        saveDc: 17,
        attackBonus: 9,
        atWill: { 'Mage Hand': true, 'Minor Illusion': true },
        perDay: { Fireball: 3, 'Charm Person': 1 },
        notes: 'Spellcasting ability is Intelligence.',
      },
    });
    const e = homebrewToBestiaryEntry(caster);
    expect(e.abilities).toContainEqual(expect.stringContaining('INT as spellcasting ability'));
    expect(e.abilities).toContainEqual(expect.stringContaining('spell save DC 17'));
    expect(e.abilities).toContainEqual(expect.stringContaining('+9 to hit with spell attacks'));
    expect(e.abilities).toContainEqual(expect.stringContaining('At will: Mage Hand, Minor Illusion.'));
    expect(e.abilities).toContainEqual(expect.stringContaining('Fireball (3/day)'));
    expect(e.abilities).toContainEqual(expect.stringContaining('Charm Person (1/day)'));
    expect(e.abilities).toContainEqual(expect.stringContaining('Spellcasting ability is Intelligence.'));
  });
});

describe('equipmentList', () => {
  it('returns a name-sorted array, tolerating an undefined map', () => {
    expect(equipmentList(undefined)).toEqual([]);
    const sorted = equipmentList({
      b: eq({ id: 'b', name: 'Zither' }),
      a: eq({ id: 'a', name: 'Amulet', category: 'other' }),
    });
    expect(sorted.map((e) => e.name)).toEqual(['Amulet', 'Zither']);
  });
});
