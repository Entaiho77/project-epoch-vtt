import { describe, expect, it } from 'vitest';
import { adjustDraft, draftSpent, totalInvested, withDraft } from '../skillDraft';

describe('pencilled-in skill points', () => {
  const opts = (current = 0) => ({ available: 2, current, maxPerSkill: 5 });

  it('places points up to what you have, and takes them back freely', () => {
    let d = adjustDraft({}, 'stealth', 1, opts());
    d = adjustDraft(d, 'climb', 1, opts());
    expect(draftSpent(d)).toBe(2);
    expect(adjustDraft(d, 'stealth', 1, opts())).toBe(d); // none left
    d = adjustDraft(d, 'climb', -1, opts());
    expect(d).toEqual({ stealth: 1 });
    expect(adjustDraft(d, 'climb', -1, opts())).toBe(d); // nothing to take back
  });

  it('respects the per-skill cap', () => {
    expect(adjustDraft({}, 'stealth', 1, opts(5))).toEqual({});
  });

  it('shows the skills with the pencilled points in', () => {
    const skills = { stealth: { investedPoints: 1, realizedPoints: 1 } };
    expect(withDraft(skills, { stealth: 1, climb: 1 }, 5)).toEqual({
      stealth: { investedPoints: 2, realizedPoints: 1 },
      climb: { investedPoints: 1, realizedPoints: 0 },
    });
    expect(totalInvested(withDraft(skills, { stealth: 1, climb: 1 }, 5))).toBe(3);
  });
});
