import { describe, it, expect } from 'vitest';
import type { SkillMode } from '@solryn/shared-types';
import {
  addInvestedPoints,
  computeSkillProgress,
  computeSkillState,
  tierIndexForPoints,
  trainSkill,
} from '../skills';

const mode: SkillMode = {
  id: 'tiered-training',
  tiers: [
    { id: 'novice', label: 'Novice', bonus: 1 },
    { id: 'journeyman', label: 'Journeyman', bonus: 2 },
    { id: 'master', label: 'Master', bonus: 3 },
  ],
  pointsPerTier: 3,
  crossOnNextPoint: true,
  maxPointsPerSkill: 9,
  trainingGated: true,
};

describe('tierIndexForPoints (3-to-fill, 1-to-cross)', () => {
  it.each([
    [0, -1],
    [1, 0],
    [3, 0],
    [4, 1],
    [6, 1],
    [7, 2],
    [9, 2],
    [10, 2], // capped at top tier
  ])('points %i → tier index %i', (points, expected) => {
    expect(tierIndexForPoints(points, mode)).toBe(expected);
  });

  it('throws for unimplemented skill modes', () => {
    expect(() =>
      tierIndexForPoints(1, { ...mode, crossOnNextPoint: false }),
    ).toThrow();
  });
});

describe('computeSkillProgress', () => {
  it.each([
    [1, 1],
    [3, 3],
    [4, 1],
    [6, 3],
    [7, 1],
    [9, 3],
  ])('points %i → %i bubbles filled in current tier', (points, bubbles) => {
    expect(computeSkillProgress(points, mode).bubblesFilled).toBe(bubbles);
  });

  it('reports the bonus jump at points 4 and 7', () => {
    expect(computeSkillProgress(3, mode).bonus).toBe(1);
    expect(computeSkillProgress(4, mode).bonus).toBe(2);
    expect(computeSkillProgress(7, mode).bonus).toBe(3);
  });

  it('clamps points to the per-skill maximum', () => {
    expect(computeSkillProgress(99, mode).points).toBe(9);
  });
});

describe('computeSkillState (training gate)', () => {
  it('active bonus lags invested points until trained → pending', () => {
    // 4 invested (would be Journeyman +2) but only 1 realized (Novice +1)
    const state = computeSkillState(4, 1, mode);
    expect(state.activeBonus).toBe(1);
    expect(state.pendingTraining).toBe(true);
  });

  it('training realizes invested points and clears pending', () => {
    const { realizedPoints } = trainSkill({ investedPoints: 4 });
    const state = computeSkillState(4, realizedPoints, mode);
    expect(state.activeBonus).toBe(2);
    expect(state.pendingTraining).toBe(false);
  });

  it('placing points within the same tier does not flag pending', () => {
    // invested 2, realized 1 — both Novice, no bonus owed
    const state = computeSkillState(2, 1, mode);
    expect(state.pendingTraining).toBe(false);
    expect(state.activeBonus).toBe(1);
  });
});

describe('addInvestedPoints', () => {
  it('adds and clamps to the per-skill max', () => {
    expect(addInvestedPoints(3, 2, mode)).toBe(5);
    expect(addInvestedPoints(8, 5, mode)).toBe(9);
    expect(addInvestedPoints(0, -5, mode)).toBe(0);
  });
});
