import { describe, it, expect } from 'vitest';
import type { ProgressionMode } from '@solryn/shared-types';
import { bandForLevel, dieForLevel } from '../progression';

const mode: ProgressionMode = {
  id: 'classless-dice-roll',
  advanceAllStats: true,
  skillPointsPerLevel: 2,
  trainingGated: true,
  levelBands: [
    { id: 'standard', label: 'Standard', die: '1d4' },
    { id: 'milestone', label: 'Milestone', die: '2d6', levels: [6, 10, 14, 18] },
    { id: 'epic', label: 'Epic', die: '1d8', fromLevel: 20 },
  ],
};

describe('dieForLevel (Solryn: 1d4 / 2d6 milestone / 1d8 epic)', () => {
  it.each([
    [2, '1d4'],
    [5, '1d4'],
    [6, '2d6'],
    [10, '2d6'],
    [18, '2d6'],
    [19, '1d4'],
    [20, '1d8'],
    [25, '1d8'],
  ])('level %i → %s', (level, die) => {
    expect(dieForLevel(level, mode)).toBe(die);
  });
});

describe('bandForLevel', () => {
  it('prefers an explicit level match over the default', () => {
    expect(bandForLevel(6, mode).id).toBe('milestone');
  });

  it('uses the ranged band past its threshold', () => {
    expect(bandForLevel(30, mode).id).toBe('epic');
  });

  it('falls back to the unconstrained default band', () => {
    expect(bandForLevel(3, mode).id).toBe('standard');
  });
});
