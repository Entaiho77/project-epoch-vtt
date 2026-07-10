/**
 * The "menu of mechanical modes".
 *
 * The engine is NOT a fully-generic "express any rule" machine (that's a research
 * problem). Instead it supports a finite, growing menu of mechanical modes, and each
 * system DEFINITION selects from the menu + supplies parameters. Solryn exercises one
 * combination. A future system reuses these modes or adds ONE new variant — which then
 * benefits every later system.
 *
 * Distinguish *parameters* (numbers/formulas/scales — pure data, trivially general,
 * live elsewhere in the schema) from *modes* (need an engine branch — here).
 *
 * Today only Solryn's selected variants are implemented; the unions list the intended
 * menu so the shape of "a system makes a choice" is explicit from day one.
 */

// --- Combat resolution ---
export type CombatModeId =
  | 'auto-hit-vs-dr' // Solryn: attacks auto-hit, roll damage, subtract DR
  | 'attack-roll-vs-ac' // 5e-style (not yet implemented)
  | 'dice-pool'; // (not yet implemented)

export interface CombatMode {
  id: CombatModeId;
  /** Base die for an offensive spell before scaling (Solryn: "1d4"). */
  baseSpellDie?: string;
}

// --- Casting model ---
export type CastingModeId =
  | 'point-pool' // Solryn: an Arcana point pool
  | 'spell-slots'
  | 'mana'
  | 'none';

export interface CastingMode {
  id: CastingModeId;
  /** Derived-stat id holding the max pool (Solryn: "arcanaPoints"). */
  poolStatId?: string;
  /**
   * Per-turn spend limit, expressed as a character field reference.
   * Solryn: spend up to `level` Arcana per turn.
   */
  perTurnSpend?: 'level' | 'unlimited';
  /** Human-readable recovery rule (shown in teaching panels / rules reference). */
  recoveryNote?: string;
}

// --- Progression model ---
export type ProgressionModeId =
  | 'classless-dice-roll' // Solryn: every stat rises by a die roll each level
  | 'class-and-level'
  | 'point-buy';

/** One level "band" → which die each stat rolls to increase. */
export interface LevelBand {
  id: string;
  label: string;
  /** Die rolled per stat to determine the increase (e.g. "1d4", "2d6", "1d8"). */
  die: string;
  /** Explicit levels this band applies to (e.g. [6,10,14,18]). */
  levels?: number[];
  /** Or a lower bound (e.g. 20+) when not an explicit list. */
  fromLevel?: number;
  note?: string;
}

export interface ProgressionMode {
  id: ProgressionModeId;
  /** All core stats advance each level (Solryn = true). */
  advanceAllStats?: boolean;
  /** Level bands deciding the increase die. First match wins; last is the default. */
  levelBands?: LevelBand[];
  /** Skill points granted per level. */
  skillPointsPerLevel?: number;
  /**
   * Growth realized only after in-town training (Solryn). The app assists, it does
   * not police: points/levels can be earned anywhere, realized on training.
   */
  trainingGated?: boolean;
}

// --- Skill model ---
export type SkillModeId =
  | 'tiered-training' // Solryn: tiers + "3-to-fill-1-to-cross" + training gate
  | 'proficiency-bonus';

export interface SkillTier {
  id: string;
  label: string;
  /** Flat bonus granted while at this tier. */
  bonus: number;
}

export interface SkillMode {
  id: SkillModeId;
  tiers: SkillTier[];
  /** Points to fill a tier ("3 to fill"). */
  pointsPerTier: number;
  /**
   * The next point past a filled tier crosses into the next tier AND counts as its
   * first filled point ("1 to cross"). Solryn = true.
   */
  crossOnNextPoint: boolean;
  /** Max investable points in a single skill (Solryn: 9 = full Master). */
  maxPointsPerSkill: number;
  /**
   * A placed point does not raise the bonus until trained in town. The bonus lags
   * invested points; the gap shows as "pending" (amber). Solryn = true.
   */
  trainingGated: boolean;
}

/** The full set of mode selections a system makes. */
export interface SystemModes {
  combat: CombatMode;
  casting: CastingMode;
  progression: ProgressionMode;
  skill: SkillMode;
}
