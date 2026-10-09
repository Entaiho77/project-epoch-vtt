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
  /** Direct XP override — for a creature with no real 5e CR to look up (e.g. a comingled
   *  Solryn-bestiary creature, which carries its own authored XP reward instead). When set,
   *  this is used in place of monsterXp(cr); `cr` can stay 0 on these entries. */
  xp?: number;
}

/** A pool entry's XP value for budget math: its direct `xp` override if set, else the
 *  standard monsterXp(cr) lookup. */
function entryXp(entry: EncounterPoolEntry): number {
  return entry.xp ?? monsterXp(entry.cr);
}

export interface GeneratedEncounterMember {
  id: string;
  name: string;
  cr: number;
  count: number;
  role: 'grunt' | 'secondary' | 'miniboss';
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

/** Share of the grunt group's slots that get swapped for secondary-type creatures when the GM
 *  picks more than one type (e.g. bandits leading trained wolves) — a minority presence, not an
 *  even split. Tunable; this is a first guess, not something the spec pinned down. */
const SECONDARY_SHARE = 0.3;

/**
 * Builds an encounter against a party's XP budget from a pool of creatures the GM already
 * filtered down to their chosen type(s).
 *
 * Single type selected: picks the one species whose repeated use best fills the budget
 * ("grunts"), optionally topped with one miniboss (the pool's entry whose CR is roughly the
 * grunt's CR + 2 to + 3, added as a single extra body).
 *
 * Multiple types selected: pass `primaryType` to name which one is the bulk of the group — the
 * grunt search only considers that type. A minority of those slots (SECONDARY_SHARE, trimmed if
 * it would blow the budget) then get swapped for the cheapest entry from the *other* selected
 * type(s), so "bandits + wolves" reliably comes back with some of both instead of collapsing to
 * whichever single species is most budget-efficient.
 */
export function generateEncounter(
  pool: EncounterPoolEntry[],
  partyLevels: number[],
  difficulty: EncounterDifficulty,
  options: { includeMiniboss?: boolean; primaryType?: string } = {},
): GeneratedEncounter {
  const budget = partyBudget(partyLevels, difficulty);
  const partySize = partyLevels.length || 1;

  if (pool.length === 0) {
    return { members: [], budget, rawXp: 0, adjustedXp: 0, underBudget: true };
  }

  const gruntCandidates = options.primaryType
    ? pool.filter((e) => e.type === options.primaryType)
    : pool;
  const usableGruntPool = gruntCandidates.length ? gruntCandidates : pool;

  // Try each candidate as the "grunt" species. When a primary type is set and other types are
  // present, search jointly over the TOTAL group size (not the primary-only size first) so a
  // secondary always has room — reserving its share up front rather than trying to carve it out
  // of an already-budget-saturated primary-only count after the fact.
  let best: {
    entry: EncounterPoolEntry;
    count: number;
    adjusted: number;
    secondary?: EncounterPoolEntry;
    secondaryCount: number;
  } | null = null;

  for (const entry of usableGruntPool) {
    const xp = entryXp(entry);
    if (xp <= 0) continue;

    const secondaryCandidates = pool.filter((e) => e.id !== entry.id && e.type !== entry.type);
    const secondary = options.primaryType && secondaryCandidates.length
      ? [...secondaryCandidates].sort((a, b) => entryXp(a) - entryXp(b))[0]
      : undefined;
    const secondaryXp = secondary ? entryXp(secondary) : 0;

    for (let count = 1; count <= 20; count++) {
      const secondaryCount = secondary ? Math.min(count - 1, Math.max(1, Math.round(count * SECONDARY_SHARE))) : 0;
      const gruntCount = count - secondaryCount;
      const raw = xp * gruntCount + secondaryXp * secondaryCount;
      const adjusted = adjustedXp(raw, count, partySize);
      if (adjusted > budget) break;
      if (!best || adjusted > best.adjusted) best = { entry, count, adjusted, secondary, secondaryCount };
    }
  }

  if (!best) {
    // Nothing fits even a single copy — hand back the cheapest option so the GM sees *something*
    // rather than an empty encounter, flagged under budget-less-than-reality via underBudget.
    const cheapest = [...pool].sort((a, b) => entryXp(a) - entryXp(b))[0];
    return {
      members: [{ id: cheapest.id, name: cheapest.name, cr: cheapest.cr, count: 1, role: 'grunt' }],
      budget,
      rawXp: entryXp(cheapest),
      adjustedXp: adjustedXp(entryXp(cheapest), 1, partySize),
      underBudget: false,
    };
  }

  const gruntCount = best.count - best.secondaryCount;
  const secondaryCount = best.secondaryCount;
  const secondary = best.secondary;

  const members: GeneratedEncounterMember[] = [
    { id: best.entry.id, name: best.entry.name, cr: best.entry.cr, count: gruntCount, role: 'grunt' },
  ];
  if (secondary && secondaryCount > 0) {
    members.push({ id: secondary.id, name: secondary.name, cr: secondary.cr, count: secondaryCount, role: 'secondary' });
  }
  let totalCount = gruntCount + secondaryCount;
  let rawXp = entryXp(best.entry) * gruntCount + (secondary ? entryXp(secondary) * secondaryCount : 0);

  if (options.includeMiniboss) {
    // CR-proximity only means something for entries with a real CR (the common case — SRD
    // creatures). A comingled entry with no CR (cr defaults to 0) just won't be favored here;
    // known soft limitation, not a crash — the budget check below still applies regardless.
    const targetCr = best.entry.cr + 2.5; // midpoint of the spec's "CR +2 or +3"
    const miniboss = [...pool]
      .filter((e) => e.cr > best!.entry.cr)
      .sort((a, b) => Math.abs(a.cr - targetCr) - Math.abs(b.cr - targetCr))[0];
    if (miniboss) {
      members.push({ id: miniboss.id, name: miniboss.name, cr: miniboss.cr, count: 1, role: 'miniboss' });
      totalCount += 1;
      rawXp += entryXp(miniboss);
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
