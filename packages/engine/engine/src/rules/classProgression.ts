import type { ClassDefinition, ClassLevel } from '@solryn/shared-types';

/**
 * Class-and-level progression (5e). Pure, table-driven: every value is a lookup on the
 * class's 1–20 level table, never a formula. Parallel to Solryn's classless progression.ts
 * (which this does NOT touch) and selected by the system's progression mode. Ability
 * modifiers are passed IN (computed via the system's modifierRule) so this stays generic.
 */

const clampLevel = (level: number) => Math.max(1, Math.min(20, Math.floor(level)));

/** The class's level-table row for a (clamped 1–20) level. */
export function classLevel(cls: ClassDefinition, level: number): ClassLevel {
  const L = clampLevel(level);
  const row = cls.levels.find((r) => r.level === L);
  if (!row) throw new Error(`${cls.id}: no level-table row for level ${L}`);
  return row;
}

/** Proficiency bonus at a level (table lookup; 5e: +2 … +6). */
export function proficiencyBonus(cls: ClassDefinition, level: number): number {
  return classLevel(cls, level).proficiencyBonus;
}

/**
 * Spell slots at a level, as { slotLevel → count } for non-zero slots only. Empty for
 * non-casters and martials. Read straight from the class table (SRD). NOTE: Warlock's rows
 * carry its Pact Magic slot counts (fewer, higher-level) — correct counts, but this phase
 * still recovers them on a long rest like everyone else; Pact Magic short-rest recovery is G4.
 */
export function spellSlots(cls: ClassDefinition, level: number): Record<number, number> {
  const arr = classLevel(cls, level).spellSlots ?? [];
  const out: Record<number, number> = {};
  arr.forEach((count, i) => {
    if (count > 0) out[i + 1] = count; // index 0 = slot level 1
  });
  return out;
}

/** All features gained from level 1 through `level` (cumulative). */
export function cumulativeFeatures(cls: ClassDefinition, level: number): string[] {
  const L = clampLevel(level);
  return cls.levels.filter((r) => r.level <= L).flatMap((r) => r.features);
}

/** Levels at which this class gains an ASI / feat. */
export function asiLevels(cls: ClassDefinition): number[] {
  return cls.levels.filter((r) => r.abilityScoreImprovement).map((r) => r.level);
}

/** Number of ASI/feat opportunities up to and including `level`. */
export function asiCount(cls: ClassDefinition, level: number): number {
  const L = clampLevel(level);
  return cls.levels.filter((r) => r.level <= L && r.abilityScoreImprovement).length;
}

const dieSize = (hitDie: string): number => parseInt(hitDie.replace(/^d/i, ''), 10);

/**
 * Max HP (fixed-average method): level 1 = hit-die max + CON mod; each level after =
 * hit-die average (⌊size/2⌋+1) + CON mod. (Rolled HP is a later option.)
 */
export function maxHitPoints(cls: ClassDefinition, level: number, conMod: number): number {
  const size = dieSize(cls.hitDie);
  const avg = Math.floor(size / 2) + 1;
  const L = clampLevel(level);
  return size + conMod + (L - 1) * (avg + conMod);
}

/** Attack bonus: ability modifier + proficiency bonus (when proficient with the weapon). */
export function attackBonus(abilityMod: number, profBonus: number, proficient = true): number {
  return abilityMod + (proficient ? profBonus : 0);
}

/** Save modifier for an ability: ability modifier + proficiency where the class is proficient. */
export function saveModifier(
  cls: ClassDefinition,
  abilityId: string,
  abilityMod: number,
  profBonus: number,
): number {
  return abilityMod + (cls.savingThrows.includes(abilityId) ? profBonus : 0);
}

/**
 * Basic Armor Class. Unarmored = 10 + Dex mod. With armor = base AC + Dex (capped to
 * `maxDexBonus` when set; 0 for heavy armor, null/undefined = uncapped for light armor).
 * Enough to make a PC targetable by the attack-roll-vs-AC resolver.
 */
export function armorClass(
  dexMod: number,
  armor?: { baseAc: number; maxDexBonus?: number | null },
): number {
  if (!armor) return 10 + dexMod;
  const dex = armor.maxDexBonus == null ? dexMod : Math.min(dexMod, armor.maxDexBonus);
  return armor.baseAc + dex;
}
