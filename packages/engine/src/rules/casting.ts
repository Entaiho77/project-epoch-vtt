import type { SpellAccessRule } from '@solryn/shared-types';

/**
 * Casting access (Solryn v1.2 §5.5, decision #1). A character is a caster if their
 * casting-stat modifier ≥ threshold, OR an ancestry grants it (Elf). Known spells =
 * (mod × knownPerMod) + (addLevel ? level : 0) + (granted ? ancestryBonus : 0).
 * A non-granted, sub-threshold character is NOT a caster (known = 0) — so the "+ level"
 * term never turns a 0-Arcana non-Elf into a caster.
 */
export interface CastingAccess {
  isCaster: boolean;
  knownCount: number;
  /** Breakdown for teaching panels. */
  modPart: number;
  levelPart: number;
  ancestryBonus: number;
}

export function castingAccess(
  rule: SpellAccessRule,
  params: { mod: number; level: number; granted: boolean },
): CastingAccess {
  const isCaster = params.mod >= rule.casterThreshold || params.granted;
  if (!isCaster) {
    return { isCaster: false, knownCount: 0, modPart: 0, levelPart: 0, ancestryBonus: 0 };
  }
  const modPart = params.mod * rule.knownPerMod;
  const levelPart = rule.addLevel ? params.level : 0;
  const ancestryBonus = params.granted ? rule.ancestryBonus : 0;
  return {
    isCaster: true,
    knownCount: Math.max(0, modPart + levelPart + ancestryBonus),
    modPart,
    levelPart,
    ancestryBonus,
  };
}
