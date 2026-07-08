import { describe, it, expect } from 'vitest';
import {
  add,
  clamp,
  equip,
  mod,
  mul,
  score,
  sub,
  c,
  type DerivedStat,
  type ModifierRule,
} from '@solryn/shared-types';
import { computeDerived } from '../derived';

const modifierRule: ModifierRule = {
  type: 'linear-step',
  pointsPerStep: 3,
  bonusPerStep: 1,
  cap: null,
};

const coreStats = [
  { id: 'STR', name: 'Strength', abbreviation: 'STR', description: '', roll: '2d4' },
  { id: 'NIM', name: 'Nimbleness', abbreviation: 'NIM', description: '', roll: '2d4' },
  { id: 'END', name: 'Endurance', abbreviation: 'END', description: '', roll: '2d4' },
];

const derivedStats: DerivedStat[] = [
  {
    id: 'hp',
    name: 'Hit Points',
    description: 'Endurance score + Endurance modifier.',
    compute: { type: 'value', expr: add(score('END'), mod('END')) },
    resourcePool: true,
    color: 'teal',
  },
  {
    id: 'dr',
    name: 'Damage Reduction',
    description: 'Armor DR + Nimbleness mod + Endurance mod.',
    compute: {
      type: 'value',
      expr: add(equip('armor', 'dr'), mod('NIM'), mod('END')),
    },
    dependsOnEquipment: true,
  },
  {
    id: 'speed',
    name: 'Speed',
    description: '10 + (STR mod + END mod) × 5, capped at 50, minus armor penalty.',
    compute: {
      type: 'value',
      expr: sub(
        clamp(add(c(10), mul(add(mod('STR'), mod('END')), c(5))), 0, 50),
        equip('armor', 'speedPenalty'),
      ),
    },
    dependsOnEquipment: true,
    unit: 'ft',
  },
  {
    id: 'initiative',
    name: 'Initiative',
    description: 'd20 + Nimbleness modifier, rolled each combat.',
    compute: { type: 'roll', die: 'd20', modifier: mod('NIM') },
  },
];

const system = { coreStats, modifierRule, derivedStats, equipment: { armor: [], weapons: [], startingKit: [] } };
const scores = { STR: 6, NIM: 3, END: 6 }; // mods: STR 2, NIM 1, END 2

describe('computeDerived', () => {
  it('computes a plain value (HP)', () => {
    const hp = computeDerived(system, scores).find((d) => d.id === 'hp')!;
    expect(hp.value).toBe(8);
    expect(hp.isRoll).toBe(false);
    expect(hp.resourcePool).toBe(true);
  });

  it('shows DR/Speed partial (pending) before gear is chosen', () => {
    const results = computeDerived(system, scores);
    const dr = results.find((d) => d.id === 'dr')!;
    const speed = results.find((d) => d.id === 'speed')!;
    expect(dr.pending).toBe(true);
    expect(dr.value).toBe(3); // 0 (armor) + 1 + 2
    expect(speed.pending).toBe(true);
    expect(speed.value).toBe(30); // 10 + (2+2)*5, no penalty resolved
  });

  it('finalizes DR/Speed once gear is provided', () => {
    const equipment = { armor: { dr: 2, speedPenalty: 10 } };
    const results = computeDerived(system, scores, equipment);
    const dr = results.find((d) => d.id === 'dr')!;
    const speed = results.find((d) => d.id === 'speed')!;
    expect(dr.pending).toBe(false);
    expect(dr.value).toBe(5); // 2 + 1 + 2
    expect(speed.value).toBe(20); // 30 - 10
  });

  it('treats Initiative as a per-use roll storing the modifier', () => {
    const init = computeDerived(system, scores).find((d) => d.id === 'initiative')!;
    expect(init.isRoll).toBe(true);
    expect(init.die).toBe('d20');
    expect(init.value).toBe(1); // NIM mod
  });
});
