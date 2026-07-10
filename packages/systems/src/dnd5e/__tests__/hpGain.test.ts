import { describe, it, expect } from 'vitest';
import type { Rng } from '@solryn/engine';
import { hpGainForLevel } from '../levelUp';

// A d10 hit die with CON +2. max = 10, average = ⌊10/2⌋+1 = 6, rolled = die + CON.
describe('hpGainForLevel — startingHp method (d10, CON +2)', () => {
  it('max: hit-die max + CON', () => {
    expect(hpGainForLevel('d10', 2, 'max')).toBe(12);
  });
  it('average (default): ⌊die/2⌋ + 1 + CON', () => {
    expect(hpGainForLevel('d10', 2, 'average')).toBe(8);
    expect(hpGainForLevel('d10', 2)).toBe(8);
  });
  it('rolled: 1dDie + CON, using the injected RNG', () => {
    const rng: Rng = () => (7 - 0.5) / 10; // forces a 7 on the d10
    expect(hpGainForLevel('d10', 2, 'rolled', rng)).toBe(9);
  });
});
