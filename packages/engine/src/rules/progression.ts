import type { LevelBand, ProgressionMode } from '@solryn/shared-types';

/**
 * Which level "band" applies at a given level — decides the stat-increase die in the
 * level-up ceremony. Solryn: 1d4 standard, 2d6 at milestone levels (6/10/14/18), 1d8
 * epic (20+). Data-driven so other progression curves are just different bands.
 *
 * Resolution order: an explicit level match wins; else the highest matching fromLevel
 * threshold; else the unconstrained default band.
 */
export function bandForLevel(level: number, mode: ProgressionMode): LevelBand {
  const bands = mode.levelBands ?? [];

  const explicit = bands.find((b) => b.levels?.includes(level));
  if (explicit) return explicit;

  const ranged = bands
    .filter((b) => b.fromLevel != null && level >= b.fromLevel)
    .sort((a, b) => (b.fromLevel ?? 0) - (a.fromLevel ?? 0))[0];
  if (ranged) return ranged;

  const fallback = bands.find((b) => !b.levels && b.fromLevel == null);
  if (fallback) return fallback;

  throw new Error(`No level band defined for level ${level}`);
}

/** The stat-increase die rolled at a given level (e.g. "1d4", "2d6", "1d8"). */
export function dieForLevel(level: number, mode: ProgressionMode): string {
  return bandForLevel(level, mode).die;
}
