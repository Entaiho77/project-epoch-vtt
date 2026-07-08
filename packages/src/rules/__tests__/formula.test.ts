import { describe, it, expect } from 'vitest';
import { evalFormula } from '../formula';

const V = { ROLL_DICE: 4, MAX_DICE: 6, MOD: 2 };

describe('evalFormula — safe arithmetic evaluator', () => {
  it('evaluates literals and the four operators', () => {
    expect(evalFormula('1 + 2', {})).toBe(3);
    expect(evalFormula('10 - 4', {})).toBe(6);
    expect(evalFormula('3 * 4', {})).toBe(12);
    expect(evalFormula('12 / 4', {})).toBe(3);
  });

  it('respects operator precedence and parentheses', () => {
    expect(evalFormula('2 + 3 * 4', {})).toBe(14);
    expect(evalFormula('(2 + 3) * 4', {})).toBe(20);
    expect(evalFormula('2 * (3 + 4) - 1', {})).toBe(13);
  });

  it('handles unary minus and decimals', () => {
    expect(evalFormula('-5 + 2', {})).toBe(-3);
    expect(evalFormula('-(3 * 2)', {})).toBe(-6);
    expect(evalFormula('1.5 * 2', {})).toBe(3);
  });

  it('substitutes named variables', () => {
    expect(evalFormula('ROLL_DICE + MOD', V)).toBe(6);
    expect(evalFormula('(MAX_DICE + MOD) * 2', V)).toBe(16);
    expect(evalFormula('ROLL_DICE * 3', V)).toBe(12);
  });

  it('returns null for unknown variables', () => {
    expect(evalFormula('FOO + 1', V)).toBeNull();
    expect(evalFormula('ROLL_DICE + BAR', V)).toBeNull();
  });

  it('returns null for malformed input', () => {
    expect(evalFormula('', V)).toBeNull();
    expect(evalFormula('1 +', V)).toBeNull();
    expect(evalFormula('(1 + 2', V)).toBeNull();
    expect(evalFormula('1 2', V)).toBeNull();
    expect(evalFormula('2 ** 3', V)).toBeNull(); // ** not supported
    expect(evalFormula('MOD; drop', V)).toBeNull();
  });

  it('never executes code — property/bracket access is a syntax error, not evaluation', () => {
    expect(evalFormula('constructor', V)).toBeNull();
    expect(evalFormula('MOD.toString', V)).toBeNull();
    expect(evalFormula('globalThis', V)).toBeNull();
  });

  it('returns null for a non-finite result (division by zero)', () => {
    expect(evalFormula('1 / 0', {})).toBeNull();
  });
});
