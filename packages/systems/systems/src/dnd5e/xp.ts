// 5e experience (SRD 2014). XP is a cumulative total; a character is the highest level whose
// threshold their total meets. Pure helpers — no Firebase — so the tables are unit-testable.

/** Cumulative XP total required to BE each level (index = level, 1–20). Level 1 = 0. */
export const XP_THRESHOLDS: number[] = [
  0, // index 0 unused
  0, // 1
  300, // 2
  900, // 3
  2700, // 4
  6500, // 5
  14000, // 6
  23000, // 7
  34000, // 8
  48000, // 9
  64000, // 10
  85000, // 11
  100000, // 12
  120000, // 13
  140000, // 14
  165000, // 15
  195000, // 16
  225000, // 17
  265000, // 18
  305000, // 19
  355000, // 20
];

export const MAX_LEVEL = 20;

/** The highest level a given total XP qualifies for (1–20). */
export function levelForXp(xp: number): number {
  let lvl = 1;
  for (let l = 2; l <= MAX_LEVEL; l++) {
    if (xp >= XP_THRESHOLDS[l]) lvl = l;
    else break;
  }
  return lvl;
}

/** Progress toward the next level for a character at `currentLevel` with `xp` total. */
export function xpProgress(
  xp: number,
  currentLevel: number,
): { atMax: boolean; nextThreshold: number; prevThreshold: number; intoLevel: number; span: number; fraction: number; canLevelUp: boolean } {
  const clamped = Math.max(1, Math.min(MAX_LEVEL, currentLevel));
  if (clamped >= MAX_LEVEL) {
    return { atMax: true, nextThreshold: XP_THRESHOLDS[MAX_LEVEL], prevThreshold: XP_THRESHOLDS[MAX_LEVEL], intoLevel: 0, span: 0, fraction: 1, canLevelUp: false };
  }
  const prevThreshold = XP_THRESHOLDS[clamped];
  const nextThreshold = XP_THRESHOLDS[clamped + 1];
  const span = nextThreshold - prevThreshold;
  const intoLevel = Math.max(0, xp - prevThreshold);
  const fraction = span > 0 ? Math.min(1, intoLevel / span) : 0;
  // A level-up is available when total XP has earned a higher level than the character currently is.
  const canLevelUp = levelForXp(xp) > clamped;
  return { atMax: false, nextThreshold, prevThreshold, intoLevel, span, fraction, canLevelUp };
}

// --- Monster XP by CR (SRD 2014 table) --------------------------------------
/** XP value of a creature by its Challenge Rating (CR stored as a number, e.g. 0.25). */
export const MONSTER_XP_BY_CR: Record<number, number> = {
  0: 10,
  0.125: 25,
  0.25: 50,
  0.5: 100,
  1: 200,
  2: 450,
  3: 700,
  4: 1100,
  5: 1800,
  6: 2300,
  7: 2900,
  8: 3900,
  9: 5000,
  10: 5900,
  11: 7200,
  12: 8400,
  13: 10000,
  14: 11500,
  15: 13000,
  16: 15000,
  17: 18000,
  18: 20000,
  19: 22000,
  20: 25000,
  21: 33000,
  22: 41000,
  23: 50000,
  24: 62000,
  25: 75000,
  26: 90000,
  27: 105000,
  28: 120000,
  29: 135000,
  30: 155000,
};

/** XP awarded for defeating a creature of the given CR (0 if the CR is unknown). */
export function monsterXp(cr: number): number {
  return MONSTER_XP_BY_CR[cr] ?? 0;
}
