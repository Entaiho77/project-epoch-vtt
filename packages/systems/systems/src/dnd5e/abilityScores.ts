// Ability-score generation methods for the 5e builder. All three produce the same result — a
// {ability → score} map that effectiveScores/pcDerived read — so nothing downstream cares which
// was used. These helpers are pure (RNG injectable) so the cost table and roll range are testable.

export type AbilityScoreMethod = 'standard' | 'pointbuy' | 'roll';

// (Standard array lives in character.ts as STANDARD_ARRAY — the canonical source.)

// --- Point buy (SRD) --------------------------------------------------------
/** Point-buy cost of each score (before racial bonuses). Scores below 8 / above 15 are illegal. */
export const POINT_BUY_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const POINT_BUY_BUDGET = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;

/** Cost of a single score (0 for anything out of the buy range). */
export function pointBuyCost(score: number): number {
  return POINT_BUY_COST[score] ?? 0;
}

/** Total points spent across a score map. */
export function pointBuySpent(scores: Record<string, number>): number {
  return Object.values(scores).reduce((sum, s) => sum + pointBuyCost(s), 0);
}

/** Points left of the 27-point budget (negative = overspent). */
export function pointBuyRemaining(scores: Record<string, number>): number {
  return POINT_BUY_BUDGET - pointBuySpent(scores);
}

/** Whether a score map is a legal point-buy: every score 8–15 and within the 27-point budget. */
export function pointBuyValid(scores: Record<string, number>, count = 6): boolean {
  const vals = Object.values(scores);
  if (vals.length !== count) return false;
  if (vals.some((s) => s < POINT_BUY_MIN || s > POINT_BUY_MAX)) return false;
  return pointBuyRemaining(scores) >= 0;
}

// --- Rolled stats (4d6 drop lowest) -----------------------------------------
type Rng = () => number;

/** Roll 4d6 and drop the lowest die. */
export function roll4d6DropLowest(rng: Rng = Math.random): number {
  const dice = Array.from({ length: 4 }, () => Math.floor(rng() * 6) + 1).sort((a, b) => a - b);
  return dice[1] + dice[2] + dice[3]; // drop dice[0], the lowest
}

/** Six 4d6-drop-lowest values (each 3–18) for the player to assign. */
export function rollAbilityScores(rng: Rng = Math.random): number[] {
  return Array.from({ length: 6 }, () => roll4d6DropLowest(rng));
}
