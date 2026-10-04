import { describe, it, expect } from 'vitest';
import type { Rng } from '@solryn/engine';
import { attemptLuckCrit, luckCritThreshold, resolveSolrynAttack } from '../combat';

const seqRng = (vals: number[]): Rng => { let i = 0; return () => vals[i++ % vals.length]; };
const face = (f: number, sides: number): Rng => seqRng([(f - 0.5) / sides]);

describe('resolveSolrynAttack — DR resolution', () => {
  it('normal hit: hpLoss = rolled − DR', () => {
    const r = resolveSolrynAttack({ label: 'Sword', dice: '1d8', targetDr: 3, rng: face(6, 8) });
    expect(r.rolled).toBe(6);
    expect(r.hpLoss).toBe(3);
    expect(r.blocked).toBe(false);
    expect(r.logText).toBe('Sword: Rolled 6 damage vs DR 3 → 3 HP damage');
  });

  it('blocked: damage ≤ DR → 0 HP loss and "Blocked (no damage)"', () => {
    const r = resolveSolrynAttack({ label: 'Sword', dice: '1d8', targetDr: 5, rng: face(2, 8) });
    expect(r.hpLoss).toBe(0);
    expect(r.blocked).toBe(true);
    expect(r.logText).toBe('Sword: Rolled 2 damage vs DR 5 → Blocked (no damage)');
  });

  it('adds the flat skill bonus to the rolled damage', () => {
    const r = resolveSolrynAttack({ label: 'Sword', dice: '1d8', bonus: 2, targetDr: 4, rng: face(5, 8) });
    expect(r.rolled).toBe(7); // 5 + 2
    expect(r.hpLoss).toBe(3); // 7 − 4
  });

  it('no target: auto-hits, no DR to compare against', () => {
    const r = resolveSolrynAttack({ label: 'Sword', dice: '1d8', rng: face(6, 8) });
    expect(r.hpLoss).toBe(6);
    expect(r.logText).toBe('Sword: Rolled 6 damage');
  });
});

describe('resolveSolrynAttack — Luck crits', () => {
  it('crit success: DR ignored and damage doubled', () => {
    const r = resolveSolrynAttack({ label: 'Sword', dice: '1d8', targetDr: 5, crit: 'success', rng: face(6, 8) });
    expect(r.crit).toBe(true);
    expect(r.dr).toBe(0);
    expect(r.hpLoss).toBe(12); // 6 × 2, DR ignored
    expect(r.logText).toBe('Sword: CRITICAL HIT! Rolled 6 damage, DR ignored → 12 HP damage');
  });

  it('crit failure: resolves normally with the "Critical attempt failed" prefix', () => {
    const r = resolveSolrynAttack({ label: 'Sword', dice: '1d8', targetDr: 3, crit: 'failed', rng: face(6, 8) });
    expect(r.crit).toBe(false);
    expect(r.hpLoss).toBe(3); // 6 − 3, still vs DR
    expect(r.logText).toBe('Sword: Critical attempt failed — Rolled 6 damage vs DR 3 → 3 HP damage');
  });
});

describe('luckCritThreshold', () => {
  it('widens the success range with the Luck modifier (20 − mod)', () => {
    expect(luckCritThreshold(1)).toBe(19);
    expect(luckCritThreshold(2)).toBe(18);
    expect(luckCritThreshold(3)).toBe(17);
    expect(luckCritThreshold(6)).toBe(14);
  });
  it('a non-positive modifier only crits on a natural 20', () => {
    expect(luckCritThreshold(0)).toBe(20);
    expect(luckCritThreshold(-2)).toBe(20);
  });
});

describe('attemptLuckCrit', () => {
  it('succeeds when the d20 meets the threshold', () => {
    const a = attemptLuckCrit(3, face(17, 20)); // threshold 17
    expect(a.threshold).toBe(17);
    expect(a.roll).toBe(17);
    expect(a.success).toBe(true);
  });
  it('fails below the threshold', () => {
    const a = attemptLuckCrit(3, face(16, 20));
    expect(a.roll).toBe(16);
    expect(a.success).toBe(false);
  });
});
