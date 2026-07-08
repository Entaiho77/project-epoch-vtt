import type { Expr } from '@solryn/shared-types';

export interface EvalContext {
  /** Core-stat id → raw score. */
  scores: Record<string, number>;
  /** Core-stat id → modifier (precompute with computeModifiers). */
  modifiers: Record<string, number>;
  /**
   * Equipment slot id → field map (e.g. { armor: { dr: 2, speedPenalty: 0 } }).
   * A slot left undefined means "not chosen yet" → its terms are PENDING (partial value).
   */
  equipment?: Record<string, Record<string, number> | undefined>;
}

export interface ExprLabels {
  stat?: (statId: string, as: 'score' | 'modifier') => string;
  equipment?: (equipment: string, field: string) => string;
}

export interface Explanation {
  value: number;
  /** Readable equation with values substituted (teaching panels). */
  text: string;
  /** True if an equipment term was unresolved (gear not chosen) — show partial. */
  pending: boolean;
}

const signed = (n: number): string => (n >= 0 ? `+${n}` : `${n}`);

/** Evaluate an expression to a number. Unresolved equipment terms contribute 0. */
export function evaluate(expr: Expr, ctx: EvalContext): number {
  return explain(expr, ctx).value;
}

/** Evaluate AND produce a human-readable breakdown + pending flag. */
export function explain(
  expr: Expr,
  ctx: EvalContext,
  labels: ExprLabels = {},
): Explanation {
  switch (expr.kind) {
    case 'const':
      return { value: expr.value, text: String(expr.value), pending: false };

    case 'stat': {
      const value =
        expr.as === 'score'
          ? (ctx.scores[expr.stat] ?? 0)
          : (ctx.modifiers[expr.stat] ?? 0);
      const label = labels.stat
        ? labels.stat(expr.stat, expr.as)
        : `${expr.stat}${expr.as === 'modifier' ? ' mod' : ''}`;
      const shown = expr.as === 'modifier' ? signed(value) : String(value);
      return { value, text: `${label} (${shown})`, pending: false };
    }

    case 'equipment': {
      const slot = ctx.equipment?.[expr.equipment];
      const label = labels.equipment
        ? labels.equipment(expr.equipment, expr.field)
        : `${expr.equipment} ${expr.field}`;
      if (slot === undefined) {
        // Gear not chosen yet → partial value.
        return { value: 0, text: `${label} (?)`, pending: true };
      }
      const value = slot[expr.field] ?? 0;
      return { value, text: `${label} (${value})`, pending: false };
    }

    case 'add': {
      const parts = expr.terms.map((t) => explain(t, ctx, labels));
      return {
        value: parts.reduce((sum, p) => sum + p.value, 0),
        text: parts.map((p) => p.text).join(' + '),
        pending: parts.some((p) => p.pending),
      };
    }

    case 'sub': {
      const a = explain(expr.left, ctx, labels);
      const b = explain(expr.right, ctx, labels);
      return {
        value: a.value - b.value,
        text: `${a.text} − ${b.text}`,
        pending: a.pending || b.pending,
      };
    }

    case 'mul': {
      const a = explain(expr.left, ctx, labels);
      const b = explain(expr.right, ctx, labels);
      const wrap = (e: Expr, t: string) =>
        e.kind === 'add' || e.kind === 'sub' ? `(${t})` : t;
      return {
        value: a.value * b.value,
        text: `${wrap(expr.left, a.text)} × ${wrap(expr.right, b.text)}`,
        pending: a.pending || b.pending,
      };
    }

    case 'clamp': {
      const inner = explain(expr.value, ctx, labels);
      let value = inner.value;
      if (expr.min !== undefined) value = Math.max(value, expr.min);
      if (expr.max !== undefined) value = Math.min(value, expr.max);
      const capped = value !== inner.value;
      return {
        value,
        text: capped ? `${inner.text} → ${value}` : inner.text,
        pending: inner.pending,
      };
    }

    default: {
      const _exhaustive: never = expr;
      throw new Error(`Unsupported expr: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
