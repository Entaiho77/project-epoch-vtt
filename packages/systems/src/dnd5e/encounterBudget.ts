// 5e encounter-difficulty / XP-budget math (DMG 2014) — the piece backlog item 3 (random
// encounter generator) needs and that didn't exist anywhere in the codebase yet. Pure, no
// Firebase, no UI — see generateEncounter() below for the actual group-building algorithm.

import { monsterXp } from './xp';

export type EncounterDifficulty = 'easy' | 'medium' | 'hard' | 'deadly';

/** DMG "XP Thresholds by Character Level" — per-character XP budget by difficulty, index 1-20. */
const XP_THRESHOLD_BY_LEVEL: Record<EncounterDifficulty, number[]> = {
  easy: [0, 25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1250, 1400, 1600, 2000, 2100, 2400, 2800],
  medium: [0, 50, 100, 150, 250, 500, 600, 750, 900, 1100, 1200, 1600, 2000, 2200, 2500, 2800, 3200, 3900, 4200, 4900, 5700],
  hard: [0, 75, 150, 225, 375, 750, 900, 1100, 1400, 1600, 1900, 2400, 3000, 3400, 3800, 4300, 4800, 5900, 6300, 7300, 8500],
  deadly: [0, 100, 200, 400, 500, 1100, 1400, 1700, 2100, 2400, 2800, 3600, 4500, 5100, 5700, 6400, 7200, 8800, 9500, 10900, 12700],
};

/** Per-character XP threshold for a level (1-20) and difficulty. */
export function xpThreshold(level: number, difficulty: EncounterDifficulty): number {
  const clamped = Math.max(1, Math.min(20, level));
  return XP_THRESHOLD_BY_LEVEL[difficulty][clamped];
}

/** Total party XP budget: sum of each character's threshold at their own level. */
export function partyBudget(partyLevels: number[], difficulty: EncounterDifficulty): number {
  return partyLevels.reduce((sum, lvl) => sum + xpThreshold(lvl, difficulty), 0);
}

/** DMG "Encounter Multipliers" by monster count, before the party-size adjustment below. */
function baseMultiplier(count: number): number {
  if (count <= 1) return 1;
  if (count === 2) return 1.5;
  if (count <= 6) return 2;
  if (count <= 10) return 2.5;
  if (count <= 14) return 3;
  return 4;
}

/** DMG rule: a party smaller than 3 treats the encounter as one row more dangerous (shift up
 *  the multiplier table); a party of 7+ treats it as one row less dangerous (shift down). */
function multiplierRowShift(count: number, partySize: number): number {
  const shift = partySize < 3 ? 1 : partySize >= 7 ? -1 : 0;
  if (shift === 0) return baseMultiplier(count);
  // Walk the row breakpoints by `shift` steps instead of duplicating the whole table.
  const breakpoints = [1, 2, 3, 7, 11, 15];
  const multipliers = [1, 1.5, 2, 2.5, 3, 4];
  let row = 0;
  for (let i = 0; i < breakpoints.length; i++) {
    if (count >= breakpoints[i]) row = i;
  }
  row = Math.max(0, Math.min(multipliers.length - 1, row + shift));
  return multipliers[row];
}

/** The adjusted (effective) XP of a group of `count` same-tier monsters totaling `rawXp`. */
export function adjustedXp(rawXp: number, monsterCount: number, partySize: number): number {
  return rawXp * multiplierRowShift(monsterCount, partySize);
}

export interface EncounterPoolEntry {
  id: string;
  name: string;
  cr: number;
  /** Free-text creature type (e.g. "Humanoid"), for display/grouping — not matched against here;
   *  the caller filters the pool to whichever type(s) the GM picked before calling generate. */
  type?: string;
}

export interface GeneratedEncounterMember {
  id: string;
  name: string;
  cr: number;
  count: number;
  role: 'grunt' | 'miniboss';
}

export interface GeneratedEncounter {
  members: GeneratedEncounterMember[];
  budget: number;
  rawXp: number;
  adjustedXp: number;
  /** True if nothing in the pool fit even a single copy within budget — caller should say so
   *  rather than silently returning an empty/over-budget encounter. */
  underBudget: boolean;
}

/**
 * Builds a same-type (or pooled-multi-type, if the caller already filtered the pool to several
 * selected types) encounter against a party's XP budget.
 *
 * Picks ONE base "grunt" species from the pool (the one whose repeated use best fills the
 * budget) and adds as many as fit under the adjusted-XP multiplier, then optionally tops it
 * with one miniboss: the pool's highest-CR entry whose CR is roughly base CR + 2 to + 3, added
 * as a single extra body (counted in `count` for the multiplier, same as the DMG treats a mixed
 * group of different-CR monsters as one encounter).
 */
export function generateEncounter(
  pool: EncounterPoolEntry[],
  partyLevels: number[],
  difficulty: EncounterDifficulty,
  options: { includeMiniboss?: boolean } = {},
): GeneratedEncounter {
  const budget = partyBudget(partyLevels, difficulty);
  const partySize = partyLevels.length || 1;

  if (pool.length === 0) {
    return { members: [], budget, rawXp: 0, adjustedXp: 0, underBudget: true };
  }

  // Try each pool entry as the "grunt" species, find the best count for each, keep whichever
  // uses the most of the budget without going over.
  let best: { entry: EncounterPoolEntry; count: number; adjusted: number } | null = null;
  for (const entry of pool) {
    const xp = monsterXp(entry.cr);
    if (xp <= 0) continue;
    for (let count = 1; count <= 20; count++) {
      const adjusted = adjustedXp(xp * count, count, partySize);
      if (adjusted > budget) break;
      if (!best || adjusted > best.adjusted) best = { entry, count, adjusted };
    }
  }

  if (!best) {
    // Nothing fits even a single copy — hand back the cheapest option so the GM sees *something*
    // rather than an empty encounter, flagged under budget-less-than-reality via underBudget.
    const cheapest = [...pool].sort((a, b) => monsterXp(a.cr) - monsterXp(b.cr))[0];
    return {
      members: [{ id: cheapest.id, name: cheapest.name, cr: cheapest.cr, count: 1, role: 'grunt' }],
      budget,
      rawXp: monsterXp(cheapest.cr),
      adjustedXp: adjustedXp(monsterXp(cheapest.cr), 1, partySize),
      underBudget: false,
    };
  }

  const members: GeneratedEncounterMember[] = [
    { id: best.entry.id, name: best.entry.name, cr: best.entry.cr, count: best.count, role: 'grunt' },
  ];
  let totalCount = best.count;
  let rawXp = monsterXp(best.entry.cr) * best.count;

  if (options.includeMiniboss) {
    const targetCr = best.entry.cr + 2.5; // midpoint of the spec's "CR +2 or +3"
    const miniboss = [...pool]
      .filter((e) => e.cr > best!.entry.cr)
      .sort((a, b) => Math.abs(a.cr - targetCr) - Math.abs(b.cr - targetCr))[0];
    if (miniboss) {
      members.push({ id: miniboss.id, name: miniboss.name, cr: miniboss.cr, count: 1, role: 'miniboss' });
      totalCount += 1;
      rawXp += monsterXp(miniboss.cr);
    }
  }

  return {
    members,
    budget,
    rawXp,
    adjustedXp: adjustedXp(rawXp, totalCount, partySize),
    underBudget: true,
  };
}
