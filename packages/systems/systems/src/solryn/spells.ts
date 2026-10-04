import type { Spell } from '@solryn/shared-types';
import type { DamageType } from './damageTypes';

/**
 * Solryn spells — canonical v1.2. All damage spells: base 1d4, auto-hit vs DR, base
 * range Touch or 20 ft, base cost 0 AP (modifications cost AP). Offensive spells feed
 * the attack row; utility spells live only in the spell book.
 *
 * AUTHORING NOTE (flagged for Matthew): the ruleset gives short mechanical tags only.
 * The fuller `synopsis` text is intentionally left blank rather than invented; the UI
 * hides the synopsis line until it's provided. Damage type / range / cost are canonical.
 */
const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Canonical offensive spell — damageType is type-checked against the Solryn
// DamageType set (the engine field stays `string`; this narrows the data).
const off = (name: string, range: 'touch' | 'ranged', damageType: DamageType): Spell => ({
  id: slug(name),
  name,
  type: 'offensive',
  damageDice: '1d4',
  damageType,
  cost: 0,
  range: range === 'touch' ? 'Touch' : '20 ft',
  duration: 'Instant',
});

// Adaptive-combat spells whose "type" is a descriptive effect (e.g. "force
// (jumps)", "random elemental") rather than a single canonical DamageType.
// FLAGGED for Matthew: these can't be constrained to DamageType without a
// ruleset decision on how the effect resolves; kept as free strings for now.
const offSpecial = (name: string, range: 'touch' | 'ranged', damageType: string): Spell =>
  ({ ...off(name, range, 'Force'), damageType });

const util = (name: string, range: string, duration: string): Spell => ({
  id: slug(name),
  name,
  type: 'utility',
  damageDice: null,
  cost: 0,
  range,
  duration,
});

export const spells: Spell[] = [
  // Elemental
  off('Ember Strike', 'touch', 'Fire'),
  off('Ignition Bolt', 'ranged', 'Fire'),
  off('Frostbite Surge', 'touch', 'Cold'),
  off('Glacial Spear', 'ranged', 'Cold'),
  off('Thunder Palm', 'touch', 'Lightning'),
  off('Arc Spark', 'ranged', 'Lightning'),
  off('Earthen Crush', 'touch', 'Bludgeoning'),
  off('Stone Shard', 'ranged', 'Piercing'),
  off('Gust Slash', 'touch', 'Slashing'),
  off('Cyclone Dart', 'ranged', 'Force'),
  // Arcane Energy
  off('Arcane Jolt', 'touch', 'Force'),
  off('Void Lance', 'ranged', 'Necrotic'),
  off('Astral Spike', 'touch', 'Psychic'),
  off('Soul Rend', 'ranged', 'Psychic'),
  off('Echo Strike', 'touch', 'Thunder'),
  off('Resonance Beam', 'ranged', 'Thunder'),
  off('Mystic Shock', 'touch', 'Radiant'),
  off('Starfire Ray', 'ranged', 'Radiant'),
  off('Eldritch Claw', 'touch', 'Necrotic'),
  off('Shadow Dart', 'ranged', 'Necrotic'),
  // Poison & Corrupting
  off('Venom Strike', 'touch', 'Poison'),
  off('Toxic Dart', 'ranged', 'Poison'),
  off('Rotting Grip', 'touch', 'Necrotic'),
  off('Decay Arrow', 'ranged', 'Necrotic'),
  off('Withering Touch', 'touch', 'Necrotic'),
  off('Blight Surge', 'ranged', 'Necrotic'),
  off('Acidic Claw', 'touch', 'Acid'),
  off('Corrosive Orb', 'ranged', 'Acid'),
  off('Ashen Grasp', 'touch', 'Necrotic'),
  off('Hallowed Rupture', 'ranged', 'Radiant'),
  // Adaptive Combat (canonical type)
  off('Lethal Echo', 'ranged', 'Psychic'),
  // Adaptive Combat (descriptive effect — see offSpecial note)
  offSpecial('Mirror Strike', 'touch', "mimics target's last type"),
  offSpecial('Prismatic Sting', 'ranged', 'random elemental'),
  offSpecial('Aether Burst', 'touch', 'force (ignores resistance)'),
  offSpecial('Burning Rune', 'touch', 'fire (lingers)'),
  offSpecial('Glacial Lash', 'ranged', 'cold (slows)'),
  offSpecial('Thundering Claw', 'touch', 'thunder (shockwave)'),
  offSpecial('Explosive Arc', 'ranged', 'force (jumps)'),
  offSpecial('Void Pulse', 'touch', 'necrotic (disrupts magic)'),
  offSpecial('Radiant Wave', 'touch', 'radiant (area)'),
  // Utility (non-damaging)
  util('Light', 'Object · 20 ft', '1 hour'),
  util('Mage Hand', '30 ft', '1 minute'),
  util('Prestidigitation', '10 ft', 'Instant'),
  util('Message', '120 ft', 'Instant'),
  util('Create Water', '30 ft', 'Instant'),
  util('Blade Ward', 'Self', '1 round'),
  util('True Strike', '30 ft', '1 round'),
];
