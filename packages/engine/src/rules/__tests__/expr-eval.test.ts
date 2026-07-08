import { describe, it, expect } from 'vitest';
import { add, c, clamp, equip, mod, mul, score, sub } from '@solryn/shared-types';
import { evaluate, explain, type EvalContext } from '../expr-eval';

const ctx: EvalContext = {
  scores: { STR: 6, END: 6, NIM: 3 },
  modifiers: { STR: 2, END: 2, NIM: 1 },
  equipment: { armor: { dr: 2, speedPenalty: 5 } },
};

describe('evaluate', () => {
  it('evaluates constants and stat terms', () => {
    expect(evaluate(c(10), ctx)).toBe(10);
    expect(evaluate(score('END'), ctx)).toBe(6);
    expect(evaluate(mod('END'), ctx)).toBe(2);
  });

  it('evaluates HP = Endurance score + Endurance modifier', () => {
    expect(evaluate(add(score('END'), mod('END')), ctx)).toBe(8);
  });

  it('evaluates Speed = clamp(10 + (STR mod + END mod) × 5, 0, 50)', () => {
    const speed = clamp(
      add(c(10), mul(add(mod('STR'), mod('END')), c(5))),
      0,
      50,
    );
    // 10 + (2+2)*5 = 30
    expect(evaluate(speed, ctx)).toBe(30);
  });

  it('caps via clamp', () => {
    const big = clamp(add(c(10), mul(add(mod('STR'), mod('END')), c(50))), 0, 50);
    expect(evaluate(big, ctx)).toBe(50);
  });

  it('evaluates subtraction', () => {
    expect(evaluate(sub(c(10), c(3)), ctx)).toBe(7);
  });

  it('reads equipment fields', () => {
    expect(evaluate(equip('armor', 'dr'), ctx)).toBe(2);
  });
});

describe('explain', () => {
  it('marks equipment terms pending when the slot is absent', () => {
    const dr = add(equip('armor', 'dr'), mod('NIM'), mod('END'));
    const withoutGear: EvalContext = { ...ctx, equipment: undefined };
    const result = explain(dr, withoutGear);
    expect(result.pending).toBe(true);
    expect(result.value).toBe(3); // armor term contributes 0
    expect(result.text).toContain('(?)');
  });

  it('is not pending once gear is present', () => {
    const dr = add(equip('armor', 'dr'), mod('NIM'), mod('END'));
    const result = explain(dr, ctx);
    expect(result.pending).toBe(false);
    expect(result.value).toBe(5); // 2 + 1 + 2
  });

  it('uses provided labels for readable breakdowns', () => {
    const result = explain(add(score('END'), mod('END')), ctx, {
      stat: (id, as) => `${id === 'END' ? 'Endurance' : id}${as === 'modifier' ? ' mod' : ''}`,
    });
    expect(result.text).toBe('Endurance (6) + Endurance mod (+2)');
  });
});
