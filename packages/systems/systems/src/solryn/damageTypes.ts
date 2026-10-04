// Canonical Solryn damage types — the single source of truth for creature
// (and, later, weapon/spell) damage. Stored as full words, exactly as listed.
// AttackEntry.damageType stays a plain string at the engine level (the engine
// is system-agnostic); this set is the Solryn-system constraint on the data.
export const DAMAGE_TYPES = [
  'Bludgeoning',
  'Piercing',
  'Slashing',
  'Acid',
  'Fire',
  'Cold',
  'Lightning',
  'Thunder',
  'Necrotic',
  'Radiant',
  'Force',
  'Poison',
  'Arcane',
  'Psychic',
] as const;

export type DamageType = (typeof DAMAGE_TYPES)[number];

export function isDamageType(v: string): v is DamageType {
  return (DAMAGE_TYPES as readonly string[]).includes(v);
}
