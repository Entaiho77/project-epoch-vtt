import type { Skill, SkillCategory } from '@solryn/shared-types';

/**
 * Solryn skills — canonical v1.2 names (32 base / 22 weapon / 43 crafting + 8 Action
 * Economy). Three categories are chosen from at creation: base 3, weapon 3, crafting 1.
 *
 * AUTHORING NOTE (flagged for Matthew): the v1.2 ruleset lists skill NAMES only. The
 * `description` + `exampleUse` hover/teaching blurbs and the governing-ability mapping
 * are NOT in the ruleset and are intentionally left blank here rather than invented. The
 * UI degrades gracefully (hover shows the name) until those blurbs are provided.
 *
 * Action Economy skills are flagged `creationExcluded` (cost 3 points, level 2+) and are
 * not offered in the builder's selection grid.
 */
export const skillCategories: SkillCategory[] = [
  { id: 'base', name: 'Base Skills', chooseAtCreation: 3 },
  { id: 'weapon', name: 'Weapon Skills', chooseAtCreation: 3 },
  { id: 'crafting', name: 'Crafting & Trade', chooseAtCreation: 1 },
];

const slug = (n: string) =>
  n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function make(
  names: string[],
  categoryId: string,
  overrides: Record<string, string> = {},
  extra: Partial<Skill> = {},
): Skill[] {
  return names.map((name) => ({
    id: overrides[name] ?? slug(name),
    name,
    categoryId,
    ...extra,
  }));
}

const base = make(
  [
    'Acrobatics', 'Animal Handling', 'Arcane Knowledge', 'Athletics', 'Bluffing',
    'Climbing', 'Cooking', 'Deception', 'Disguise', 'Engineering', 'Etiquette',
    'Fishing', 'Foraging', 'Forgery', 'Haggling', 'Herbalism', 'History', 'Insight',
    'Intimidation', 'Investigation', 'Meditation', 'Nature Knowledge', 'Negotiation',
    'Perception', 'Performance', 'Persuasion', 'Riding', 'Search', 'Sleight of Hand',
    'Stealth', 'Streetwise', 'Survival',
  ],
  'base',
);

const weapon = make(
  [
    'Light Swords', 'Heavy Swords', 'Curved Swords', 'Hand Axes', 'Battleaxes',
    'Great Axes', 'Light Maces', 'Heavy Maces', 'Two-Handed Maces', 'Polearms',
    'Spears', 'Daggers', 'Thrown Weapons', 'Light Bows', 'Heavy Bows', 'Specialty Bows',
    'Staves', 'Wands', 'Flails', 'Whips', 'Firearms', 'Specialty Weapons',
  ],
  'weapon',
);

// Cooking / Herbalism / Engineering also exist as base skills → disambiguate ids.
const crafting = make(
  [
    'Alchemy', 'Blacksmithing', 'Brewing', 'Carpentry', 'Cooking', 'Glassblowing',
    'Herbalism', 'Jewelry Making', 'Leatherworking', 'Pottery', 'Sewing', 'Smithing',
    'Stonecarving', 'Tinkering', 'Weaving', 'Woodcarving', 'Bookbinding', 'Candlemaking',
    'Calligraphy', 'Cartography', 'Cloth Dyeing', 'Enchantment', 'Engineering',
    'Fletching', 'Gemcutting', 'Incense Making', 'Metallurgy', 'Painting', 'Rope Making',
    'Runesmithing', 'Scroll Scribing', 'Shipbuilding', 'Soap Making', 'Tattooing',
    'Tool Making', 'Toy Making', 'Trap Making', 'Wheelwrighting', 'Wig Making',
    'Winemaking', 'Wire Working', 'Cobbler', 'Lacemaking',
  ],
  'crafting',
  {
    Cooking: 'cooking-craft',
    Herbalism: 'herbalism-craft',
    Engineering: 'engineering-craft',
  },
);

// Action Economy — not a creation choice (cost 3 points, level 2+).
const actionEconomy = make(
  [
    'Extra Attack', 'Quick Reflexes', 'Fleet of Foot', 'Swift Casting',
    'Battle Readiness', 'Tactical Mastery', 'Evasive Maneuvers', 'Battle Medic',
  ],
  'action-economy',
  {},
  { creationExcluded: true },
);

export const skills: Skill[] = [...base, ...weapon, ...crafting, ...actionEconomy];
