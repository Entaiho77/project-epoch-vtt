import { describe, it, expect, vi } from 'vitest';
import type { SystemDefinition } from '@solryn/shared-types';
import { getCombatResolver, type CritFormula, type Rng } from '../index';

// A minimal 5e-mode system: the resolver only cares about modes.combat.id.
const dnd = { modes: { combat: { id: 'attack-roll-vs-ac' } } } as unknown as SystemDefinition;
const resolver = getCombatResolver(dnd);
const seqRng = (vals: number[]): Rng => { let i = 0; return () => vals[i++ % vals.length]; };
const face = (f: number, sides: number) => (f - 0.5) / sides;

/** Roll a crit (nat 20) with the base dice 1d6+2, using the given formula and a scripted RNG. */
function critDamage(formula: CritFormula, dice: number[], custom?: string) {
  const res = resolver.resolveAttack({
    label: 'X',
    dice: '1d6+2',
    attackBonus: 0,
    targetAc: 5,
    critThreshold: 20,
    critFormula: formula,
    ...(custom ? { critFormulaCustom: custom } : {}),
    // d20 = 20 (crit), then the damage dice faces.
    rng: seqRng([face(20, 20), ...dice.map((f) => face(f, 6))]),
  });
  return res;
}

describe('crit damage formulas (base 1d6+2, ROLL_DICE roll = 3, MAX_DICE = 6, MOD = 2)', () => {
  it('double_dice: rolls the dice twice, modifier once — 3 + 5 + 2 = 10', () => {
    const r = critDamage('double_dice', [3, 5]); // two 1d6 rolls
    expect(r.crit).toBe(true);
    expect(r.damage).toBe(10);
  });

  it('max_plus_roll: MAX_DICE + one roll + MOD — 6 + 3 + 2 = 11', () => {
    expect(critDamage('max_plus_roll', [3]).damage).toBe(11);
  });

  it('roll_then_double: (roll + MOD) × 2 — (3 + 2) × 2 = 10', () => {
    expect(critDamage('roll_then_double', [3]).damage).toBe(10);
  });

  it('max_then_double: (MAX_DICE + MOD) × 2 — (6 + 2) × 2 = 16', () => {
    expect(critDamage('max_then_double', [3]).damage).toBe(16);
  });

  it('custom: evaluates over ROLL_DICE/MAX_DICE/MOD — (MAX_DICE + MOD) × 2 = 16', () => {
    expect(critDamage('custom', [3], '(MAX_DICE + MOD) * 2').damage).toBe(16);
    expect(critDamage('custom', [3], 'ROLL_DICE * 3').damage).toBe(9);
  });

  it('custom with an invalid formula falls back to double_dice and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Invalid → double_dice, which consumes two 1d6 rolls (3, 5) → 3 + 5 + 2 = 10.
    const r = critDamage('custom', [3, 5], 'MAX_DICE +');
    expect(r.damage).toBe(10);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('a non-crit hit uses plain damage regardless of the formula', () => {
    const r = resolver.resolveAttack({
      label: 'X', dice: '1d6+2', attackBonus: 0, targetAc: 5, critThreshold: 20,
      critFormula: 'max_then_double',
      rng: seqRng([face(10, 20), face(4, 6)]), // d20 = 10 (no crit), damage die = 4
    });
    expect(r.crit).toBe(false);
    expect(r.damage).toBe(6); // 4 + 2, formula not applied
  });
});
