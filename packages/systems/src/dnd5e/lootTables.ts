// Backlog item 1 (loot generator), content settled Oct 9, 2026 — Matthew specified the shape of
// the first three CR tiers himself ("CR0-3 basic normal loot... CR4-6... CR7-9... Do you get the
// idea?"); I drafted the continuation through CR 21-30 to keep the same escalating curve
// ("yesterday's rare becomes today's common"), approved as-is ("I think that looks great").
// Every percentage here is my own placeholder to keep that curve consistent, not a number
// Matthew stated — open to correction once this is in actual play.
//
// Pure data + pure generator function — no Firebase, no UI. Mirrors encounterBudget.ts's shape:
// a GM-facing drawer calls `generateLootPool()` with the creatures actually fought and the GM's
// own equipment library, and gets back a flat pool to review before anything is handed out.

import type { EquipmentCategory, GeneratedLootItem, HomebrewEquipment, LootRarity } from '@epoch/shared-types';
import { rollDice, type Rng, defaultRng } from '@epoch/engine';

/** A loot table entry before it's been given a generated id. */
type LootTemplate = Omit<GeneratedLootItem, 'id'>;

export interface LootTier {
  /** Inclusive CR range this tier covers — matches the item 6 converter's own CR groupings. */
  crRange: [number, number];
  /** Gold rolled PER creature in this tier: `count`d`sides` × `mult` gp. */
  gold: { count: number; sides: number; mult: number };
  /** How many mundane gear items to roll per creature (a flat range, inclusive). */
  mundaneCount: [number, number];
  /** Mundane gear flavor for this tier, used when the GM's own homebrew equipment library has
   *  nothing to offer (or is skipped by the 50/50 blend below). */
  mundane: LootTemplate[];
  /** Each entry rolled independently per creature (not mutually exclusive — a well-stocked
   *  fight can turn up more than one of these). `chancePct` is this entry's own chance out of
   *  a d100, not a share of a fixed pie. */
  magic: { chancePct: number; item: LootTemplate }[];
}

const weapon = (name: string, category: EquipmentCategory, description: string, extra: Partial<LootTemplate> = {}): LootTemplate => ({
  name,
  category,
  description,
  ...extra,
});

const potion = (name: string, rarity: LootRarity, healDie: string): LootTemplate => ({
  name,
  category: 'other',
  rarity,
  description: `A corked vial of shimmering liquid. Drinking it restores ${healDie} hit points.`,
  // Mundane-enough that what it does isn't a secret — no separate reveal text needed.
});

const scroll = (name: string, rarity: LootRarity, description: string): LootTemplate => ({
  name,
  category: 'other',
  rarity,
  description,
  revealDescription: 'A sealed spell scroll, its markings unfamiliar until read or identified.',
});

const magicWeaponOrArmor = (
  name: string,
  rarity: LootRarity,
  category: EquipmentCategory,
  description: string,
): LootTemplate => ({
  name,
  category,
  rarity,
  description,
  revealDescription: `A finely made ${category === 'armor' ? 'piece of armor' : 'weapon'}, clearly of uncommon quality — its true nature only shows once identified or attuned.`,
});

export const LOOT_TIERS: LootTier[] = [
  {
    crRange: [0, 3],
    gold: { count: 2, sides: 6, mult: 1 },
    mundaneCount: [0, 1],
    mundane: [
      weapon('Shortsword', 'weapon', 'A plain, well-worn shortsword.', { damageDice: '1d6', damageType: 'piercing', weaponRange: 'melee' }),
      weapon('Leather Armor', 'armor', 'Simple, serviceable leather armor.', { armorType: 'light', baseAc: 11 }),
      weapon('Traveler’s Pack', 'other', 'Rope, rations, a bedroll, and a tinderbox.'),
    ],
    magic: [{ chancePct: 10, item: potion('Potion of Healing', 'common', '2d4+2') }],
  },
  {
    crRange: [4, 6],
    gold: { count: 3, sides: 8, mult: 2 },
    mundaneCount: [0, 2],
    mundane: [
      weapon('Longsword, well-made', 'weapon', 'A balanced, well-maintained longsword.', { damageDice: '1d8', damageType: 'slashing', weaponRange: 'melee' }),
      weapon('Chain Shirt', 'armor', 'Fine chain mail, oiled and in good repair.', { armorType: 'medium', baseAc: 13 }),
      weapon('Set of Fine Clothes', 'other', 'Expensive, well-tailored clothing, easily worth a sale.'),
    ],
    magic: [
      { chancePct: 25, item: potion('Potion of Healing', 'common', '2d4+2') },
      { chancePct: 10, item: scroll('Spell Scroll (1st level)', 'uncommon', 'A scroll bearing a single 1st-level spell, usable once.') },
    ],
  },
  {
    crRange: [7, 9],
    gold: { count: 4, sides: 10, mult: 5 },
    mundaneCount: [1, 2],
    mundane: [
      weapon('Masterwork Rapier', 'weapon', 'A masterwork rapier, beautifully balanced.', { damageDice: '1d8', damageType: 'piercing', weaponRange: 'melee', properties: ['finesse'] }),
      weapon('Breastplate', 'armor', 'A fitted steel breastplate.', { armorType: 'medium', baseAc: 14 }),
      weapon('Small Gemstones (pouch)', 'other', 'A handful of uncut gemstones, worth selling to the right buyer.'),
    ],
    magic: [
      { chancePct: 50, item: potion('Potion of Healing', 'common', '2d4+2') },
      { chancePct: 25, item: scroll('Spell Scroll (3rd level)', 'uncommon', 'A scroll bearing a single 3rd-level spell, usable once.') },
      { chancePct: 10, item: magicWeaponOrArmor('+1 Weapon', 'rare', 'weapon', 'A weapon humming faintly with enchantment — +1 to attack and damage rolls.') },
    ],
  },
  {
    crRange: [10, 12],
    gold: { count: 4, sides: 10, mult: 20 },
    mundaneCount: [1, 3],
    mundane: [
      weapon('Fine Art Object', 'other', 'A well-crafted art piece — a small statuette, a painted fan, a carved idol.'),
      weapon('Masterwork Plate (pieces)', 'armor', 'Scattered pieces of masterwork plate armor.', { armorType: 'heavy', baseAc: 17 }),
    ],
    magic: [
      { chancePct: 50, item: potion('Potion of Greater Healing', 'uncommon', '4d4+4') },
      { chancePct: 25, item: scroll('Spell Scroll (5th level)', 'uncommon', 'A scroll bearing a single 5th-level spell, usable once.') },
      { chancePct: 25, item: magicWeaponOrArmor('+1 Weapon or Armor', 'uncommon', 'weapon', 'A weapon or armor piece lightly enchanted — +1 to its usual effect.') },
      { chancePct: 10, item: magicWeaponOrArmor('+2 Item or Rare Wondrous Item', 'rare', 'other', 'A more deeply enchanted item, or a rare wondrous trinket with a real effect of its own.') },
    ],
  },
  {
    crRange: [13, 16],
    gold: { count: 6, sides: 10, mult: 40 },
    mundaneCount: [1, 3],
    mundane: [
      weapon('Rare Art Object', 'other', 'A genuinely valuable art piece — fine jewelry, a gilded icon, a carved jade figure.'),
      weapon('Mixed Gemstones (pouch)', 'other', 'A pouch of mixed, well-cut gemstones.'),
    ],
    magic: [
      { chancePct: 50, item: potion('Potion of Superior Healing', 'rare', '8d4+8') },
      { chancePct: 50, item: magicWeaponOrArmor('+1 Weapon or Armor', 'uncommon', 'weapon', 'A weapon or armor piece lightly enchanted — +1 to its usual effect.') },
      { chancePct: 25, item: magicWeaponOrArmor('+2 Item', 'uncommon', 'other', 'A deeply enchanted weapon or armor piece — +2 to its usual effect.') },
      { chancePct: 10, item: magicWeaponOrArmor('+3 Item or Very Rare Wondrous Item', 'veryRare', 'other', 'A powerfully enchanted item, or a very rare wondrous item with a significant effect.') },
    ],
  },
  {
    crRange: [17, 20],
    gold: { count: 8, sides: 10, mult: 100 },
    mundaneCount: [1, 2],
    mundane: [
      weapon('Legendary-Scale Hoard Goods', 'other', 'Chests of coin, plate, and finery — the trappings of a legendary hoard.'),
    ],
    magic: [
      { chancePct: 50, item: potion('Potion of Supreme Healing', 'veryRare', '10d4+20') },
      { chancePct: 25, item: magicWeaponOrArmor('+2 or +3 Item', 'rare', 'other', 'A powerfully enchanted weapon, armor piece, or wondrous item.') },
      { chancePct: 10, item: magicWeaponOrArmor('Legendary Item or Minor Artifact', 'legendary', 'other', 'An item of true legend, or a minor artifact with a story of its own.') },
    ],
  },
  {
    crRange: [21, 30],
    gold: { count: 10, sides: 10, mult: 250 },
    mundaneCount: [0, 1],
    mundane: [
      weapon('Unique Hoard Goods', 'other', 'A truly massive, one-of-a-kind hoard — coin, art, and relics beyond ordinary counting.'),
    ],
    magic: [
      { chancePct: 60, item: potion('Potion of Supreme Healing', 'veryRare', '10d4+20') },
      { chancePct: 25, item: magicWeaponOrArmor('Legendary Item', 'legendary', 'other', 'An item of true legend.') },
      // Deliberately NOT randomized — flagged in the design doc as GM-hand-placed: a true
      // Artifact at this level is usually campaign-defining, not a dice roll.
    ],
  },
];

export function tierForCr(cr: number): LootTier {
  return LOOT_TIERS.find((t) => cr >= t.crRange[0] && cr <= t.crRange[1]) ?? LOOT_TIERS[0];
}

let nextId = 0;
function freshId(prefix: string): string {
  nextId += 1;
  return `${prefix}-${Date.now()}-${nextId}`;
}

export interface GeneratedLootPool {
  items: GeneratedLootItem[];
  gold: number;
}

/**
 * Builds a loot pool from the creatures actually fought in a scene (`{ name, cr }[]`), merged
 * with the GM's own homebrew equipment library per the original spec ("pulls from both the
 * built-in 5e loot tables and the GM's homebrew library, merged at generation time"). Each
 * creature independently rolls its tier's gold, its mundane-item count (picked ~50/50 from the
 * GM's library vs. the built-in tier flavor when the library has a matching category), and
 * every magic-table entry in its tier (each its own independent d100 check) — so a multi-creature
 * fight naturally turns up more loot than a single kill, without a separate "area mode."
 */
export function generateLootPool(
  creatures: { name: string; cr: number }[],
  homebrewEquipment: HomebrewEquipment[] = [],
  rng: Rng = defaultRng,
): GeneratedLootPool {
  const items: GeneratedLootItem[] = [];
  let gold = 0;

  for (const creature of creatures) {
    const tier = tierForCr(creature.cr);
    gold += rollDice(`${tier.gold.count}d${tier.gold.sides}`, rng).total * tier.gold.mult;

    const mundaneRoll = tier.mundaneCount[0] + Math.floor(rng() * (tier.mundaneCount[1] - tier.mundaneCount[0] + 1));
    for (let i = 0; i < mundaneRoll; i++) {
      const useLibrary = homebrewEquipment.length > 0 && rng() < 0.5;
      // Widened through `raw` first: a fresh `{ ...equip }` literal assigned straight to a
      // `LootTemplate`-typed const would trip excess-property checking on HomebrewEquipment's
      // own `id`/`weight` fields, which LootTemplate doesn't carry.
      const raw = useLibrary ? { ...homebrewEquipment[Math.floor(rng() * homebrewEquipment.length)] } : tier.mundane[Math.floor(rng() * tier.mundane.length)];
      const template: LootTemplate = raw;
      items.push({ ...template, id: freshId('loot') });
    }

    for (const entry of tier.magic) {
      if (rng() * 100 < entry.chancePct) {
        items.push({ ...entry.item, id: freshId('loot') });
      }
    }
  }

  return { items, gold };
}
