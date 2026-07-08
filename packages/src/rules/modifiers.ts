import type { ModifierRule, CoreStat, SystemDefinition } from '@solryn/shared-types';

/**
 * Map a raw stat score to its modifier per the system's ModifierRule.
 * Solryn: linear-step(pointsPerStep=3, bonusPerStep=+1, cap=null) → "every 3 pts = +1,
 * no cap" → floor(score / 3).
 */
export function computeModifier(score: number, rule: ModifierRule): number {
  switch (rule.type) {
    case 'linear-step': {
      const steps = Math.floor(score / rule.pointsPerStep);
      const raw = steps * rule.bonusPerStep;
      return rule.cap === null ? raw : Math.min(raw, rule.cap);
    }
    case 'ability-modifier':
      // 5e: floor((score − 10) / 2). Math.floor handles negatives correctly (8 → −1).
      return Math.floor((score - rule.baseline) / rule.pointsPerStep);
    default: {
      // Exhaustiveness guard: a new ModifierRule variant must be handled above.
      const _exhaustive: never = rule;
      throw new Error(`Unsupported modifier rule: ${JSON.stringify(_exhaustive)}`);
    }
  }
}

/** Compute modifiers for every core stat from a score map. */
export function computeModifiers(
  system: Pick<SystemDefinition, 'coreStats' | 'modifierRule'>,
  scores: Record<string, number>,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const stat of system.coreStats) {
    out[stat.id] = computeModifier(scores[stat.id] ?? 0, system.modifierRule);
  }
  return out;
}

/**
 * The modifier "chart" rows for the teaching panel — score → modifier across a range.
 * Generic: derived from the rule, not a hardcoded table.
 */
export function modifierChart(
  rule: ModifierRule,
  fromScore = 0,
  toScore = 12,
): Array<{ score: number; modifier: number }> {
  const rows: Array<{ score: number; modifier: number }> = [];
  for (let s = fromScore; s <= toScore; s++) {
    rows.push({ score: s, modifier: computeModifier(s, rule) });
  }
  return rows;
}

/** Convenience: look up a core stat by id. */
export function findStat(
  system: Pick<SystemDefinition, 'coreStats'>,
  statId: string,
): CoreStat | undefined {
  return system.coreStats.find((s) => s.id === statId);
}
