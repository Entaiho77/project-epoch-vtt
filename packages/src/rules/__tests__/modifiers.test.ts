import { describe, it, expect } from 'vitest';
import type { ModifierRule, SystemDefinition } from '@solryn/shared-types';
import { computeModifier, computeModifiers, modifierChart } from '../modifiers';

const solrynRule: ModifierRule = {
  type: 'linear-step',
  pointsPerStep: 3,
  bonusPerStep: 1,
  cap: null,
};

describe('computeModifier (linear-step, Solryn: every 3 pts = +1, no cap)', () => {
  it.each([
    [0, 0],
    [2, 0],
    [3, 1],
    [5, 1],
    [6, 2],
    [8, 2],
    [9, 3],
    [12, 4],
    [30, 10],
  ])('score %i → modifier %i', (score, expected) => {
    expect(computeModifier(score, solrynRule)).toBe(expected);
  });

  it('respects a cap when one is set', () => {
    const capped: ModifierRule = { ...solrynRule, cap: 5 };
    expect(computeModifier(30, capped)).toBe(5);
    expect(computeModifier(9, capped)).toBe(3);
  });
});

describe('computeModifier (ability-modifier, D&D 5e: floor((score−10)/2))', () => {
  const rule: ModifierRule = { type: 'ability-modifier', baseline: 10, pointsPerStep: 2 };
  it.each([
    [1, -5],
    [8, -1],
    [9, -1],
    [10, 0],
    [11, 0],
    [12, 1],
    [14, 2],
    [20, 5],
  ])('score %i → modifier %i', (score, expected) => {
    expect(computeModifier(score, rule)).toBe(expected);
  });
});

describe('computeModifiers', () => {
  const system: Pick<SystemDefinition, 'coreStats' | 'modifierRule'> = {
    modifierRule: solrynRule,
    coreStats: [
      { id: 'STR', name: 'Strength', abbreviation: 'STR', description: '', roll: '2d4' },
      { id: 'END', name: 'Endurance', abbreviation: 'END', description: '', roll: '2d4' },
    ],
  };

  it('maps every core stat score to a modifier', () => {
    expect(computeModifiers(system, { STR: 6, END: 3 })).toEqual({
      STR: 2,
      END: 1,
    });
  });

  it('treats a missing score as 0', () => {
    expect(computeModifiers(system, { STR: 9 })).toEqual({ STR: 3, END: 0 });
  });
});

describe('modifierChart', () => {
  it('produces score→modifier rows derived from the rule', () => {
    const rows = modifierChart(solrynRule, 0, 6);
    expect(rows).toHaveLength(7);
    expect(rows[3]).toEqual({ score: 3, modifier: 1 });
    expect(rows[6]).toEqual({ score: 6, modifier: 2 });
  });
});
