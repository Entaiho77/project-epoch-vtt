import type { DerivedStat, SemanticColor, SystemDefinition } from '@solryn/shared-types';
import { computeModifiers } from './modifiers';
import { explain, type EvalContext, type ExprLabels } from './expr-eval';

export interface DerivedResult {
  id: string;
  name: string;
  abbreviation?: string;
  /** True when the value is a per-use roll (e.g. Initiative). */
  isRoll: boolean;
  /** 'value' → the number; 'roll' → the stored modifier (e.g. Initiative modifier). */
  value: number;
  /** Present for rolls: the die rolled at use time (e.g. "d20"). */
  die?: string;
  /** True if an equipment-fed term is unresolved (gear not chosen) — show partial. */
  pending: boolean;
  /** Readable equation breakdown for teaching panels. */
  breakdown: string;
  unit?: string;
  color?: SemanticColor;
  resourcePool?: boolean;
}

type SystemForDerived = Pick<
  SystemDefinition,
  'coreStats' | 'modifierRule' | 'derivedStats' | 'equipment'
>;

/** Human-readable labels for stat/equipment terms, drawn from system data. */
export function makeLabels(
  system: Pick<SystemDefinition, 'coreStats'>,
): ExprLabels {
  const statName = (id: string) =>
    system.coreStats.find((s) => s.id === id)?.name ?? id;
  return {
    stat: (id, as) => `${statName(id)}${as === 'modifier' ? ' mod' : ''}`,
    equipment: (eq, field) => `${eq} ${field}`,
  };
}

/** Build an evaluation context from raw scores (+ optional equipment field maps). */
export function makeEvalContext(
  system: Pick<SystemDefinition, 'coreStats' | 'modifierRule'>,
  scores: Record<string, number>,
  equipment?: EvalContext['equipment'],
): EvalContext {
  return {
    scores,
    modifiers: computeModifiers(system, scores),
    equipment,
  };
}

/** Compute a single derived stat against an evaluation context. */
export function computeDerivedStat(
  ds: DerivedStat,
  ctx: EvalContext,
  labels: ExprLabels = {},
): DerivedResult {
  const base = {
    id: ds.id,
    name: ds.name,
    abbreviation: ds.abbreviation,
    unit: ds.unit,
    color: ds.color,
    resourcePool: ds.resourcePool,
  };

  if (ds.compute.type === 'roll') {
    const m = explain(ds.compute.modifier, ctx, labels);
    return {
      ...base,
      isRoll: true,
      value: m.value,
      die: ds.compute.die,
      pending: m.pending,
      breakdown: `${ds.compute.die} + ${m.text}`,
    };
  }

  const r = explain(ds.compute.expr, ctx, labels);
  return {
    ...base,
    isRoll: false,
    value: r.value,
    pending: r.pending,
    breakdown: r.text,
  };
}

/**
 * Compute every derived stat for a character. Pass partial/absent equipment to get the
 * "so far" values the builder shows before gear is chosen (pending=true on DR/Speed).
 */
export function computeDerived(
  system: SystemForDerived,
  scores: Record<string, number>,
  equipment?: EvalContext['equipment'],
): DerivedResult[] {
  const ctx = makeEvalContext(system, scores, equipment);
  const labels = makeLabels(system);
  return system.derivedStats.map((ds) => computeDerivedStat(ds, ctx, labels));
}
