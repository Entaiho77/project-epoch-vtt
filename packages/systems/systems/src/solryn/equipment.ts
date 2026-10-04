import type { EquipmentDefinition, WeaponItem } from '@solryn/shared-types';
import type { DamageType } from './damageTypes';

/**
 * Solryn weapons reference the canonical {@link DamageType} set so the data is
 * type-checked at build time (the engine field stays a plain `string` because it
 * is system-agnostic; this narrows it for Solryn data only).
 */
const weapons: (WeaponItem & { damageType: DamageType })[] = [
  // Swords
  { id: 'shortsword', name: 'Shortsword', weaponSkillId: 'light-swords', damageDice: '1d6', damageType: 'Piercing' },
  { id: 'rapier', name: 'Rapier', weaponSkillId: 'light-swords', damageDice: '1d8', damageType: 'Piercing' },
  { id: 'broadsword', name: 'Broadsword', weaponSkillId: 'heavy-swords', damageDice: '1d10', damageType: 'Slashing' },
  { id: 'greatsword', name: 'Greatsword', weaponSkillId: 'heavy-swords', damageDice: '2d6', damageType: 'Slashing', twoHanded: true },
  { id: 'scimitar', name: 'Scimitar', weaponSkillId: 'curved-swords', damageDice: '1d6', damageType: 'Slashing' },
  { id: 'sabre', name: 'Sabre', weaponSkillId: 'curved-swords', damageDice: '1d8', damageType: 'Slashing' },
  // Axes
  { id: 'handaxe', name: 'Handaxe', weaponSkillId: 'hand-axes', damageDice: '1d6', damageType: 'Slashing' },
  { id: 'hatchet', name: 'Hatchet', weaponSkillId: 'hand-axes', damageDice: '1d4', damageType: 'Slashing' },
  { id: 'battleaxe', name: 'Battleaxe', weaponSkillId: 'battleaxes', damageDice: '1d8', damageType: 'Slashing' },
  { id: 'war-axe', name: 'War Axe', weaponSkillId: 'battleaxes', damageDice: '1d10', damageType: 'Slashing' },
  { id: 'greataxe', name: 'Greataxe', weaponSkillId: 'great-axes', damageDice: '1d12', damageType: 'Slashing', twoHanded: true },
  // Maces / Hammers
  { id: 'mace', name: 'Mace', weaponSkillId: 'light-maces', damageDice: '1d6', damageType: 'Bludgeoning' },
  { id: 'club', name: 'Club', weaponSkillId: 'light-maces', damageDice: '1d4', damageType: 'Bludgeoning' },
  { id: 'warhammer', name: 'Warhammer', weaponSkillId: 'heavy-maces', damageDice: '1d8', damageType: 'Bludgeoning' },
  { id: 'morningstar', name: 'Morningstar', weaponSkillId: 'heavy-maces', damageDice: '1d8', damageType: 'Piercing' },
  { id: 'maul', name: 'Maul', weaponSkillId: 'two-handed-maces', damageDice: '2d6', damageType: 'Bludgeoning', twoHanded: true },
  { id: 'sledgehammer', name: 'Sledgehammer', weaponSkillId: 'two-handed-maces', damageDice: '1d12', damageType: 'Bludgeoning', twoHanded: true },
  // Polearms & spears
  { id: 'spear', name: 'Spear', weaponSkillId: 'spears', damageDice: '1d6', damageType: 'Piercing' },
  { id: 'javelin', name: 'Javelin', weaponSkillId: 'spears', damageDice: '1d6', damageType: 'Piercing', range: '30/120' },
  { id: 'halberd', name: 'Halberd', weaponSkillId: 'polearms', damageDice: '1d10', damageType: 'Slashing', twoHanded: true },
  { id: 'glaive', name: 'Glaive', weaponSkillId: 'polearms', damageDice: '1d10', damageType: 'Slashing', twoHanded: true },
  { id: 'pike', name: 'Pike', weaponSkillId: 'polearms', damageDice: '1d10', damageType: 'Piercing', twoHanded: true },
  { id: 'lance', name: 'Lance', weaponSkillId: 'polearms', damageDice: '1d12', damageType: 'Piercing' },
  // Daggers (added — see note)
  { id: 'dagger', name: 'Dagger', weaponSkillId: 'daggers', damageDice: '1d4', damageType: 'Piercing', range: '20/60' },
  // Ranged
  { id: 'shortbow', name: 'Shortbow', weaponSkillId: 'light-bows', damageDice: '1d6', damageType: 'Piercing', range: '80/320', twoHanded: true },
  { id: 'longbow', name: 'Longbow', weaponSkillId: 'heavy-bows', damageDice: '1d8', damageType: 'Piercing', range: '150/600', twoHanded: true },
  { id: 'light-crossbow', name: 'Light Crossbow', weaponSkillId: 'specialty-bows', damageDice: '1d8', damageType: 'Piercing', range: '80/320', twoHanded: true },
  { id: 'heavy-crossbow', name: 'Heavy Crossbow', weaponSkillId: 'specialty-bows', damageDice: '1d10', damageType: 'Piercing', range: '100/400', twoHanded: true },
];

/**
 * Solryn equipment — canonical v1.2. Armor feeds the DR formula (`dr`) and Speed
 * (`speedPenalty`); weapons reference a weaponSkillId so the gear step filters them to
 * the player's chosen weapon skills.
 *
 * NOTE (flagged for Matthew): the v1.2 weapon list maps cleanly onto most of the 22
 * weapon skills, but a few are inferred and should be confirmed — crossbows are filed
 * under "Specialty Bows" (no dedicated crossbow skill exists), Lance under "Polearms",
 * and a basic Dagger is added for the "Daggers" skill (the v1.2 weapon table lists none).
 * Shields are captured as data; a shield equip-slot (so shield DR feeds the formula) is a
 * follow-up.
 */
export const equipment: EquipmentDefinition = {
  armor: [
    { id: 'padded-cloth', name: 'Padded Cloth', weight: 'light', dr: 2, speedPenalty: 0, cost: 5 },
    { id: 'leather', name: 'Leather', weight: 'light', dr: 2, speedPenalty: 0, cost: 10 },
    { id: 'studded-leather', name: 'Studded Leather', weight: 'light', dr: 3, speedPenalty: 0, cost: 25 },
    { id: 'hide', name: 'Hide', weight: 'light', dr: 3, speedPenalty: 0, cost: 15 },
    { id: 'chain-shirt', name: 'Chain Shirt', weight: 'medium', dr: 4, speedPenalty: 5, cost: 50 },
    { id: 'scale-mail', name: 'Scale Mail', weight: 'medium', dr: 4, speedPenalty: 5, cost: 50 },
    { id: 'breastplate', name: 'Breastplate', weight: 'medium', dr: 5, speedPenalty: 5, cost: 400 },
    { id: 'half-plate', name: 'Half Plate', weight: 'medium', dr: 5, speedPenalty: 5, cost: 750 },
    { id: 'ring-mail', name: 'Ring Mail', weight: 'heavy', dr: 6, speedPenalty: 10, cost: 30 },
    { id: 'chain-mail', name: 'Chain Mail', weight: 'heavy', dr: 6, speedPenalty: 10, cost: 75 },
    { id: 'splint-mail', name: 'Splint Mail', weight: 'heavy', dr: 7, speedPenalty: 10, cost: 200 },
    { id: 'plate-mail', name: 'Plate Mail', weight: 'heavy', dr: 8, speedPenalty: 10, cost: 1500 },
  ],
  shields: [
    { id: 'buckler', name: 'Buckler', dr: 1, cost: 5 },
    { id: 'shield', name: 'Shield', dr: 2, cost: 10 },
    { id: 'tower-shield', name: 'Tower Shield', dr: 3, cost: 25, note: 'Disadvantage on attacks.' },
  ],
  weapons,
  startingKit: [
    { name: "Adventurer's toolset" },
    { name: 'Backpack' },
    { name: 'Rope (50 ft)' },
    { name: 'Rations', quantity: 5 },
    { name: 'Bedroll' },
    { name: 'Lantern' },
    { name: 'Healing potion (Standard, 2d4+2)', quantity: 3 },
  ],
};
