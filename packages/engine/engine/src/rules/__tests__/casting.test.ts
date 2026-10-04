import { describe, it, expect } from 'vitest';
import type { SpellAccessRule } from '@solryn/shared-types';
import { castingAccess } from '../casting';

const rule: SpellAccessRule = {
  modStatId: 'ARC',
  casterThreshold: 1,
  knownPerMod: 2,
  addLevel: true,
  grantedByAncestry: ['elf'],
  ancestryBonus: 3,
};

describe('castingAccess (Solryn §5.5)', () => {
  it('a sub-threshold non-grantee is not a caster — the +level never leaks in', () => {
    const a = castingAccess(rule, { mod: 0, level: 5, granted: false });
    expect(a.isCaster).toBe(false);
    expect(a.knownCount).toBe(0);
  });

  it('a caster knows (mod × 2) + level', () => {
    expect(castingAccess(rule, { mod: 2, level: 1, granted: false }).knownCount).toBe(5);
    expect(castingAccess(rule, { mod: 3, level: 4, granted: false }).knownCount).toBe(10);
  });

  it('an ancestry grant gives access + bonus even at mod 0', () => {
    const a = castingAccess(rule, { mod: 0, level: 1, granted: true });
    expect(a.isCaster).toBe(true);
    expect(a.knownCount).toBe(4); // 0 + level 1 + Elf 3
    expect(a.ancestryBonus).toBe(3);
  });
});
