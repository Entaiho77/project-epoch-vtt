import type { Ancestry, StatBonus, Subrace } from '@solryn/shared-types';

// All 9 SRD races (5e-bits/5e-database 2014 SRD), with the SRD's subraces. Ability bonuses,
// proficiencies, resistances, and trait names come from that source; the standard breath-weapon
// dice/DC and 5e rules text are encoded directly. Spell-based traits (High Elf cantrip,
// Tiefling's Infernal Legacy) are text-only pending the spellcasting phase.
//
// The open SRD contains only ONE subrace per race (Hill Dwarf, High Elf, Lightfoot Halfling,
// Rock Gnome); the other PHB subraces are not SRD content. Dragonborn's draconic ancestry is
// modeled as a subrace-style pick (it sets the breath weapon's damage type + shape).

const fixed = (stat: string, amount: number): StatBonus => ({ kind: 'fixed', stat, amount });

/** The 10 draconic ancestries → breath damage type + area (SRD Draconic Ancestry table). */
const DRACONIC: { id: string; color: string; damageType: string; shape: 'cone' | 'line' }[] = [
  { id: 'black', color: 'Black', damageType: 'Acid', shape: 'line' },
  { id: 'blue', color: 'Blue', damageType: 'Lightning', shape: 'line' },
  { id: 'brass', color: 'Brass', damageType: 'Fire', shape: 'line' },
  { id: 'bronze', color: 'Bronze', damageType: 'Lightning', shape: 'line' },
  { id: 'copper', color: 'Copper', damageType: 'Acid', shape: 'line' },
  { id: 'gold', color: 'Gold', damageType: 'Fire', shape: 'cone' },
  { id: 'green', color: 'Green', damageType: 'Poison', shape: 'cone' },
  { id: 'red', color: 'Red', damageType: 'Fire', shape: 'cone' },
  { id: 'silver', color: 'Silver', damageType: 'Cold', shape: 'cone' },
  { id: 'white', color: 'White', damageType: 'Cold', shape: 'cone' },
];

const draconicSubraces: Subrace[] = DRACONIC.map((d) => ({
  id: d.id,
  name: `${d.color} (${d.damageType})`,
  description: `Breath weapon: ${d.shape === 'cone' ? '15 ft. cone' : '30 ft. line'}, ${d.damageType} damage. You gain resistance to ${d.damageType} damage.`,
  resistances: [d.damageType],
  breath: { damageType: d.damageType, shape: d.shape, size: d.shape === 'cone' ? 15 : 30 },
}));

export const ancestries: Ancestry[] = [
  // Human already shipped in Phase B/C — unchanged.
  {
    id: 'human',
    name: 'Human',
    bonusSummary: '+1 to all six ability scores.',
    bonuses: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((stat) => fixed(stat, 1)),
    advantages: [],
    weaknesses: [],
    speed: 30,
    size: 'Medium',
    traits: ['Extra language of your choice.'],
  },

  {
    id: 'dwarf',
    name: 'Dwarf',
    bonusSummary: '+2 CON.',
    bonuses: [fixed('CON', 2)],
    advantages: [],
    weaknesses: [],
    speed: 25,
    size: 'Medium',
    resistances: ['Poison'],
    grantedProficiencies: ['battleaxe', 'handaxe', 'light-hammer', 'warhammer', 'artisans-tools'],
    traits: [
      'Darkvision 60 ft.',
      'Dwarven Resilience: advantage on saving throws against poison, and resistance to poison damage.',
      'Dwarven Combat Training: proficiency with battleaxe, handaxe, light hammer, and warhammer.',
      'Tool Proficiency: one artisan’s tool of your choice (smith’s, brewer’s, or mason’s).',
      'Stonecunning: add double proficiency on History checks about stonework.',
    ],
    subraces: [
      {
        id: 'hill-dwarf',
        name: 'Hill Dwarf',
        description: '+1 WIS. Dwarven Toughness: +1 hit point per level.',
        bonuses: [fixed('WIS', 1)],
        traits: ['Dwarven Toughness: your hit point maximum increases by 1 per level.'],
      },
    ],
  },

  {
    id: 'elf',
    name: 'Elf',
    bonusSummary: '+2 DEX.',
    bonuses: [fixed('DEX', 2)],
    advantages: [],
    weaknesses: [],
    speed: 30,
    size: 'Medium',
    grantedProficiencies: ['perception'],
    traits: [
      'Darkvision 60 ft.',
      'Keen Senses: proficiency in Perception.',
      'Fey Ancestry: advantage on saves against being charmed, and magic can’t put you to sleep.',
      'Trance: 4 hours of meditation counts as a long rest.',
    ],
    subraces: [
      {
        id: 'high-elf',
        name: 'High Elf',
        description: '+1 INT. Longsword/bow training, a wizard cantrip (pending spells), extra language.',
        bonuses: [fixed('INT', 1)],
        grantedProficiencies: ['longsword', 'shortbow'],
        traits: [
          'Elf Weapon Training: proficiency with longsword, shortsword, shortbow, and longbow.',
          'High Elf Cantrip: one wizard cantrip (added in the spellcasting phase).',
          'Extra Language of your choice.',
        ],
      },
    ],
  },

  {
    id: 'halfling',
    name: 'Halfling',
    bonusSummary: '+2 DEX.',
    bonuses: [fixed('DEX', 2)],
    advantages: [],
    weaknesses: [],
    speed: 25,
    size: 'Small',
    lucky: true,
    traits: [
      'Lucky: when you roll a natural 1 on an attack, ability check, or save, reroll and use the new roll.',
      'Brave: advantage on saving throws against being frightened.',
      'Halfling Nimbleness: move through the space of any creature larger than you.',
    ],
    subraces: [
      {
        id: 'lightfoot',
        name: 'Lightfoot Halfling',
        description: '+1 CHA. Naturally Stealthy: hide behind creatures larger than you.',
        bonuses: [fixed('CHA', 1)],
        traits: ['Naturally Stealthy: attempt to hide even when obscured only by a larger creature.'],
      },
    ],
  },

  {
    id: 'dragonborn',
    name: 'Dragonborn',
    bonusSummary: '+2 STR, +1 CHA.',
    bonuses: [fixed('STR', 2), fixed('CHA', 1)],
    advantages: [],
    weaknesses: [],
    speed: 30,
    size: 'Medium',
    traits: [
      'Draconic Ancestry: choose a dragon color — it sets your breath weapon and damage resistance.',
      'Breath Weapon: exhale energy in a cone or line (DC 8 + CON + proficiency; DEX save for half). Scales with level.',
    ],
    // Draconic color is picked like a subrace; it sets the breath weapon + resistance.
    subraces: draconicSubraces,
  },

  {
    id: 'gnome',
    name: 'Gnome',
    bonusSummary: '+2 INT.',
    bonuses: [fixed('INT', 2)],
    advantages: [],
    weaknesses: [],
    speed: 25,
    size: 'Small',
    traits: [
      'Darkvision 60 ft.',
      'Gnome Cunning: advantage on all INT, WIS, and CHA saving throws against magic.',
    ],
    subraces: [
      {
        id: 'rock-gnome',
        name: 'Rock Gnome',
        description: '+1 CON. Artificer’s Lore and Tinker (tinker’s tools).',
        bonuses: [fixed('CON', 1)],
        grantedProficiencies: ['tinkers-tools'],
        traits: [
          'Artificer’s Lore: add double proficiency on History checks about magic items, alchemy, or tech.',
          'Tinker: proficiency with tinker’s tools; build tiny clockwork devices.',
        ],
      },
    ],
  },

  {
    id: 'half-elf',
    name: 'Half-Elf',
    bonusSummary: '+2 CHA, and +1 to two other abilities of your choice.',
    bonuses: [
      fixed('CHA', 2),
      { kind: 'choice', amount: 1, count: 2, from: ['STR', 'DEX', 'CON', 'INT', 'WIS'], distinct: true },
    ],
    advantages: [],
    weaknesses: [],
    speed: 30,
    size: 'Medium',
    // Skill Versatility: proficiency in two skills of your choice.
    raceSkillChoices: { choose: 2, from: 'any' },
    traits: [
      'Darkvision 60 ft.',
      'Fey Ancestry: advantage on saves against being charmed, and magic can’t put you to sleep.',
      'Skill Versatility: proficiency in two skills of your choice.',
    ],
  },

  {
    id: 'half-orc',
    name: 'Half-Orc',
    bonusSummary: '+2 STR, +1 CON.',
    bonuses: [fixed('STR', 2), fixed('CON', 1)],
    advantages: [],
    weaknesses: [],
    speed: 30,
    size: 'Medium',
    grantedProficiencies: ['intimidation'],
    traits: [
      'Darkvision 60 ft.',
      'Menacing: proficiency in Intimidation.',
      'Relentless Endurance: when dropped to 0 HP (not killed outright), drop to 1 HP instead — once per long rest.',
      'Savage Attacks: on a melee critical hit, roll one of the weapon’s damage dice one extra time.',
    ],
  },

  {
    id: 'tiefling',
    name: 'Tiefling',
    bonusSummary: '+2 CHA, +1 INT.',
    bonuses: [fixed('CHA', 2), fixed('INT', 1)],
    advantages: [],
    weaknesses: [],
    speed: 30,
    size: 'Medium',
    resistances: ['Fire'],
    traits: [
      'Darkvision 60 ft.',
      'Hellish Resistance: resistance to fire damage.',
      'Infernal Legacy: innate spellcasting (added in the spellcasting phase).',
    ],
  },
];
