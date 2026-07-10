import type { FeatDefinition } from '@solryn/shared-types';

// SRD 5.1 feats. The strict SRD 5.1 contains only the *Grappler* feat; the PHB feats were removed
// for commercial (CC-BY-4.0) cleanliness. Keep this list SRD-only.
//
// Mechanization tiers (for any SRD feats added later):
//  - Passive effects (ability bonuses, +HP/level, +AC, +speed, resistances, proficiency grants)
//    fold into pcDerived automatically.
//  - powerAttack feats add a −5/+10 toggle to weapon attack rows.
//  - resource feats add a point tracker on the sheet.
//  - Everything else is display-only text with an accurate description + note; feats needing a
//    system we don't model yet (e.g. grapple) are marked displayOnly.

export const feats: FeatDefinition[] = [
  {
    id: 'grappler',
    name: 'Grappler',
    description: 'Advantage on attacks against a creature you’re grappling; you can try to pin a grappled creature (both restrained).',
    prerequisite: 'Strength 13 or higher',
    requires: { ability: 'STR', min: 13 },
    displayOnly: true,
    note: 'Needs the grapple/condition system (not modeled yet).',
  },
];

/** A feat by id. */
export function featById(id: string): FeatDefinition | undefined {
  return feats.find((f) => f.id === id);
}

/**
 * Whether a character meets a feat's structured prerequisite. `scores` are the effective ability
 * scores; `isCaster` is whether the class has spellcasting. Feats with no `requires` are always
 * eligible. (Free-text-only prerequisites aren't enforced — the requires field drives the filter.)
 */
export function meetsFeatPrerequisite(
  feat: FeatDefinition,
  scores: Record<string, number>,
  isCaster: boolean,
): boolean {
  const req = feat.requires;
  if (!req) return true;
  if (req.needsSpellcasting && !isCaster) return false;
  if (req.ability && req.min != null && (scores[req.ability] ?? 10) < req.min) return false;
  return true;
}
