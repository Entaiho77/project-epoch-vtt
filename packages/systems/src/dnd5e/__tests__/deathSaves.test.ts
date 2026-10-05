import { describe, expect, it } from 'vitest';
import { applyDeathSave, damageAtZero, deathState } from '../deathSaves';

describe('5e death saves', () => {
  it('10+ succeeds, 9- fails, three of either decides it', () => {
    let ds = applyDeathSave(undefined, 12).saves;
    ds = applyDeathSave(ds, 15).saves;
    const third = applyDeathSave(ds, 10);
    expect(third.state).toBe('stable');
    expect(applyDeathSave({ successes: 0, failures: 2 }, 4).state).toBe('dead');
  });
  it('natural 1 is two failures; natural 20 brings you back', () => {
    expect(applyDeathSave({ successes: 1, failures: 0 }, 1).saves).toEqual({ successes: 1, failures: 2 });
    expect(applyDeathSave({ successes: 0, failures: 2 }, 20)).toMatchObject({ state: 'revived', saves: { successes: 0, failures: 0 } });
  });
  it('damage at 0 HP adds a failure (two on a crit)', () => {
    expect(damageAtZero(undefined)).toEqual({ successes: 0, failures: 1 });
    expect(deathState(damageAtZero({ successes: 2, failures: 1 }, true))).toBe('dead');
  });
});
