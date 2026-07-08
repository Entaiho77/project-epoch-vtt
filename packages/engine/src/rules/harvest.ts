import type { QualityScale, QualityTier } from '@solryn/shared-types';
import { parseDice, rollDie, type Rng, defaultRng } from './dice';

/**
 * The universal harvest / loot / quality mechanic (Design Doc §4.14).
 *
 * A character rolls d100 + governing-skill bonus → a QUALITY tier (not quantity). The
 * same engine drives combat loot, skinning, foraging, ore gathering, soul-core
 * extraction — only the roller differs (whole party vs. individual), handled by callers.
 *
 * Solryn gates harvesting behind the governing skill (no skill = no roll), so every roll
 * already carries at least a Novice bonus; that gating is enforced in the UI (the option
 * is unavailable without the skill), not here.
 */

/** Map a final roll total to its quality tier (clamps to the top tier when configured). */
export function resolveQuality(total: number, scale: QualityScale): QualityTier {
  const { tiers } = scale;
  const top = tiers[tiers.length - 1];
  if (scale.roll.capAtTop && total > top.max) return top;
  const found = tiers.find((t) => total >= t.min && total <= t.max);
  return found ?? tiers[0];
}

export interface HarvestRollResult {
  /** The raw die roll(s) made (one, or several when assisted). */
  rolls: number[];
  /** The kept roll (highest when assisted). */
  baseRoll: number;
  skillBonus: number;
  total: number;
  tier: QualityTier;
  assisted: boolean;
}

/**
 * Perform a harvest roll: roll the scale's die (+ assist dice, take highest) and add the
 * governing-skill bonus, then resolve the quality tier.
 */
export function rollHarvestQuality(params: {
  scale: QualityScale;
  skillBonus: number;
  assisted?: boolean;
  rng?: Rng;
}): HarvestRollResult {
  const { scale, skillBonus, assisted = false, rng = defaultRng } = params;
  const parsed = parseDice(scale.roll.die);
  if (!parsed) throw new Error(`Invalid harvest die: ${scale.roll.die}`);

  const diceCount =
    assisted && scale.assist.enabled ? scale.assist.diceWhenAssisted : 1;
  const rolls = Array.from({ length: diceCount }, () =>
    rollDie(parsed.sides, rng),
  );
  const baseRoll = Math.max(...rolls);
  const bonus = scale.roll.addGoverningSkillBonus ? skillBonus : 0;
  const total = baseRoll + bonus;

  return {
    rolls,
    baseRoll,
    skillBonus: bonus,
    total,
    tier: resolveQuality(total, scale),
    assisted: diceCount > 1,
  };
}
