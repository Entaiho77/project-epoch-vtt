import { describe, it, expect } from 'vitest';
import { attackAdvantage, autoCritAgainst, combineAdvantage, effectsFor } from '../conditions';
import { conditions as dnd5e } from '@solryn/systems/dnd5e/conditions';
import { conditions as solryn } from '@solryn/systems/solryn/conditions';

const eff = (defs: typeof dnd5e, ids: string[]) =>
  effectsFor(defs, Object.fromEntries(ids.map((id) => [id, true as const])));
const none = {};

describe('effectsFor', () => {
  it('merges the flags of the active conditions', () => {
    expect(eff(dnd5e, ['blinded'])).toMatchObject({ attacksAgainstAdvantage: true, ownAttacksDisadvantage: true });
    expect(eff(dnd5e, ['poisoned', 'prone'])).toMatchObject({
      ownAttacksDisadvantage: true,
      disadvantageAbilityChecks: true,
      meleeAdvRangedDis: true,
    });
  });
  it('returns empty effects when nothing is active', () => {
    expect(effectsFor(dnd5e, undefined)).toEqual({});
    expect(effectsFor(undefined, { blinded: true })).toEqual({});
  });
});

describe('attackAdvantage (5e)', () => {
  it('grants advantage vs a target whose condition says so (Blinded/Restrained/Stunned…)', () => {
    expect(attackAdvantage(none, eff(dnd5e, ['blinded']), true)).toBe('advantage');
    expect(attackAdvantage(none, eff(dnd5e, ['restrained']), true)).toBe('advantage');
    expect(attackAdvantage(none, eff(dnd5e, ['stunned']), true)).toBe('advantage');
  });
  it('gives the attacker disadvantage when the attacker is Blinded/Poisoned/Restrained', () => {
    expect(attackAdvantage(eff(dnd5e, ['blinded']), none, true)).toBe('disadvantage');
    expect(attackAdvantage(eff(dnd5e, ['poisoned']), none, true)).toBe('disadvantage');
    expect(attackAdvantage(eff(dnd5e, ['restrained']), none, true)).toBe('disadvantage');
  });
  it('cancels one advantage against one disadvantage to a normal roll', () => {
    // Blinded target (advantage) + blinded attacker (disadvantage) → normal.
    expect(attackAdvantage(eff(dnd5e, ['blinded']), eff(dnd5e, ['blinded']), true)).toBeUndefined();
  });
  it('Invisible: disadvantage vs an invisible target; advantage for an invisible attacker', () => {
    expect(attackAdvantage(none, eff(dnd5e, ['invisible']), true)).toBe('disadvantage');
    expect(attackAdvantage(eff(dnd5e, ['invisible']), none, true)).toBe('advantage');
  });
  it('Prone: advantage from within 5 ft, disadvantage from farther', () => {
    expect(attackAdvantage(none, eff(dnd5e, ['prone']), true)).toBe('advantage');
    expect(attackAdvantage(none, eff(dnd5e, ['prone']), false)).toBe('disadvantage');
  });
});

describe('autoCritAgainst (5e)', () => {
  it('Paralyzed/Unconscious targets auto-crit on a melee hit within 5 ft only', () => {
    expect(autoCritAgainst(eff(dnd5e, ['paralyzed']), true)).toBe(true);
    expect(autoCritAgainst(eff(dnd5e, ['paralyzed']), false)).toBe(false);
    expect(autoCritAgainst(eff(dnd5e, ['unconscious']), true)).toBe(true);
    expect(autoCritAgainst(eff(dnd5e, ['stunned']), true)).toBe(false); // stunned isn't auto-crit
  });
});

describe('combineAdvantage', () => {
  it('a manual choice overrides the condition-derived one', () => {
    expect(combineAdvantage('disadvantage', 'advantage')).toBe('disadvantage');
    expect(combineAdvantage(undefined, 'advantage')).toBe('advantage');
    expect(combineAdvantage(undefined, undefined)).toBeUndefined();
  });
});

describe('Solryn conditions', () => {
  it('Stunned/Paralyzed/Unconscious make attacks ignore DR (→ auto-crit)', () => {
    expect(eff(solryn, ['stunned']).ignoreDrAgainst).toBe(true);
    expect(eff(solryn, ['paralyzed']).ignoreDrAgainst).toBe(true);
    expect(eff(solryn, ['unconscious']).ignoreDrAgainst).toBe(true);
    expect(eff(solryn, ['grappled']).ignoreDrAgainst).toBeUndefined();
  });
  it('cantAct is set on the incapacitating conditions', () => {
    expect(eff(solryn, ['stunned']).cantAct).toBe(true);
    expect(eff(solryn, ['prone']).cantAct).toBeUndefined();
  });
});
