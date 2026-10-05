import type { CharacterSkillState } from '@epoch/shared-types';

/**
 * Placing level-up skill points in pencil: points go into a draft (skill id → points added)
 * that can be moved around freely, and only Confirm writes them to the character.
 */
export type SkillDraft = Record<string, number>;

export function draftSpent(d: SkillDraft): number {
  return Object.values(d).reduce((a, n) => a + n, 0);
}

/** The character's skills with the draft pencilled in (new skills start untrained). */
export function withDraft(
  skills: Record<string, CharacterSkillState>,
  d: SkillDraft,
  maxPerSkill: number,
): Record<string, CharacterSkillState> {
  const out = { ...skills };
  for (const [id, n] of Object.entries(d)) {
    if (n <= 0) continue;
    const cur = skills[id] ?? { investedPoints: 0, realizedPoints: 0 };
    out[id] = { investedPoints: Math.min(cur.investedPoints + n, maxPerSkill), realizedPoints: cur.realizedPoints };
  }
  return out;
}

/** Add (+1) or take back (−1) a pencilled point, within the points available and the cap. */
export function adjustDraft(
  d: SkillDraft,
  id: string,
  delta: 1 | -1,
  opts: { available: number; current: number; maxPerSkill: number },
): SkillDraft {
  const have = d[id] ?? 0;
  if (delta === 1 && (draftSpent(d) >= opts.available || opts.current + have >= opts.maxPerSkill)) return d;
  if (delta === -1 && have === 0) return d;
  const next = { ...d, [id]: have + delta };
  if (next[id] === 0) delete next[id];
  return next;
}

/** Sum of invested points across all skills (the GM's computer checks it against points spent). */
export function totalInvested(skills: Record<string, { investedPoints?: number } | undefined> | undefined): number {
  return Object.values(skills ?? {}).reduce((a, s) => a + (s?.investedPoints ?? 0), 0);
}
