import type { SkillMode, SkillTier } from '@solryn/shared-types';

export interface SkillProgress {
  points: number;
  /** -1 = untrained (no points invested). */
  tierIndex: number;
  tier: SkillTier | null;
  bonus: number;
  /** Filled bubbles within the current tier (0..pointsPerTier). */
  bubblesFilled: number;
  pointsPerTier: number;
}

export interface SkillState {
  /** Points the player has placed (editable anywhere, e.g. on level-up). */
  investedPoints: number;
  /** Points realized through in-town training (drives the active bonus). */
  realizedPoints: number;
  activeTier: SkillTier | null;
  /** The bonus currently in effect (lags invested points until trained). */
  activeBonus: number;
  /**
   * Invested points have crossed into a higher tier than training has realized →
   * a bonus is owed. Shown amber with a "needs training" indicator.
   */
  pendingTraining: boolean;
  invested: SkillProgress;
  realized: SkillProgress;
}

/**
 * Tier index for a given number of points under "3-to-fill, 1-to-cross":
 * the (pointsPerTier+1)-th point crosses to the next tier and counts as its first
 * filled point. Solryn (pointsPerTier=3): 1–3 Novice, 4–6 Journeyman, 7–9 Master.
 * Returns -1 for untrained (0 points).
 */
export function tierIndexForPoints(points: number, mode: SkillMode): number {
  if (points <= 0) return -1;
  if (!mode.crossOnNextPoint) {
    // Other skill modes are a future menu addition; only Solryn's variant exists today.
    throw new Error(
      'Skill mode with crossOnNextPoint=false is not implemented yet',
    );
  }
  const idx = Math.floor((points - 1) / mode.pointsPerTier);
  return Math.min(idx, mode.tiers.length - 1);
}

export function computeSkillProgress(
  points: number,
  mode: SkillMode,
): SkillProgress {
  const clamped = Math.max(0, Math.min(points, mode.maxPointsPerSkill));
  const tierIndex = tierIndexForPoints(clamped, mode);
  const tier = tierIndex >= 0 ? mode.tiers[tierIndex] : null;
  const bubblesFilled =
    clamped <= 0 ? 0 : ((clamped - 1) % mode.pointsPerTier) + 1;
  return {
    points: clamped,
    tierIndex,
    tier,
    bonus: tier?.bonus ?? 0,
    bubblesFilled,
    pointsPerTier: mode.pointsPerTier,
  };
}

/**
 * Full skill state from invested vs. realized (trained) points.
 * The active bonus follows realized points; pendingTraining flags when invested points
 * have crossed into a higher tier than has been trained.
 */
export function computeSkillState(
  investedPoints: number,
  realizedPoints: number,
  mode: SkillMode,
): SkillState {
  const invested = computeSkillProgress(investedPoints, mode);
  const realized = computeSkillProgress(
    Math.min(realizedPoints, investedPoints),
    mode,
  );
  return {
    investedPoints: invested.points,
    realizedPoints: realized.points,
    activeTier: realized.tier,
    activeBonus: realized.bonus,
    pendingTraining: invested.tierIndex > realized.tierIndex,
    invested,
    realized,
  };
}

/** Place points into a skill (clamped to the per-skill max). Returns new invested total. */
export function addInvestedPoints(
  current: number,
  amount: number,
  mode: SkillMode,
): number {
  return Math.max(0, Math.min(current + amount, mode.maxPointsPerSkill));
}

/** Realize a skill's invested points (the in-town training step): bonus catches up. */
export function trainSkill(state: Pick<SkillState, 'investedPoints'>): {
  realizedPoints: number;
} {
  return { realizedPoints: state.investedPoints };
}
