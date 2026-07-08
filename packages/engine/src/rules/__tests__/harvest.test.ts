import { describe, it, expect } from 'vitest';
import type { QualityScale } from '@solryn/shared-types';
import { resolveQuality, rollHarvestQuality } from '../harvest';
import type { Rng } from '../dice';

const scale: QualityScale = {
  tiers: [
    { id: 'ruined', label: 'Ruined', min: 1, max: 8, isFailure: true },
    { id: 'common', label: 'Common', min: 9, max: 40 },
    { id: 'uncommon', label: 'Uncommon', min: 41, max: 68 },
    { id: 'rare', label: 'Rare', min: 69, max: 86 },
    { id: 'very-rare', label: 'Very Rare', min: 87, max: 96 },
    { id: 'legendary', label: 'Legendary', min: 97, max: 100 },
  ],
  roll: { die: 'd100', addGoverningSkillBonus: true, capAtTop: true },
  assist: { enabled: true, diceWhenAssisted: 2 },
};

const seqRng = (vals: number[]): Rng => {
  let i = 0;
  return () => vals[i++ % vals.length];
};

describe('resolveQuality', () => {
  it.each([
    [1, 'ruined'],
    [8, 'ruined'],
    [9, 'common'],
    [40, 'common'],
    [41, 'uncommon'],
    [86, 'rare'],
    [96, 'very-rare'],
    [97, 'legendary'],
    [100, 'legendary'],
  ])('total %i → %s', (total, tierId) => {
    expect(resolveQuality(total, scale).id).toBe(tierId);
  });

  it('caps over-100 at the top tier (mastery reliably maxes out)', () => {
    expect(resolveQuality(150, scale).id).toBe('legendary');
  });

  it('floors at the worst tier below the lowest band', () => {
    expect(resolveQuality(0, scale).id).toBe('ruined');
  });
});

describe('rollHarvestQuality', () => {
  it('adds the governing-skill bonus to the d100 roll', () => {
    // rng 0 → d100 = 1; +10 bonus → 11 → Common
    const result = rollHarvestQuality({ scale, skillBonus: 10, rng: () => 0 });
    expect(result.baseRoll).toBe(1);
    expect(result.total).toBe(11);
    expect(result.tier.id).toBe('common');
    expect(result.assisted).toBe(false);
  });

  it('assist rolls two d100 and keeps the highest', () => {
    // rolls: 0.0 → 1, 0.8 → 81; highest 81; +5 → 86 → rare
    const result = rollHarvestQuality({
      scale,
      skillBonus: 5,
      assisted: true,
      rng: seqRng([0.0, 0.8]),
    });
    expect(result.rolls).toHaveLength(2);
    expect(result.baseRoll).toBe(81);
    expect(result.total).toBe(86);
    expect(result.tier.id).toBe('rare');
    expect(result.assisted).toBe(true);
  });
});
