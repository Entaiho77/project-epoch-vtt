import { describe, it, expect } from 'vitest';
import type { SystemDefinition } from '@solryn/shared-types';
import { describeRoll, getCombatResolver, resolveCheck } from '../combat';
import { rollDice, type Rng } from '../dice';

/** Deterministic RNG cycling through provided [0,1) values. */
const seqRng = (vals: number[]): Rng => {
  let i = 0;
  return () => vals[i++ % vals.length];
};
/** An rng value that makes `rollDie(sides)` land on a specific face. */
const face = (f: number, sides: number) => (f - 0.5) / sides;

const solrynLike = {
  modes: { combat: { id: 'auto-hit-vs-dr' } },
} as unknown as SystemDefinition;

describe('getCombatResolver', () => {
  it('selects auto-hit-vs-dr for Solryn-like systems', () => {
    expect(getCombatResolver(solrynLike)).toBeDefined();
  });

  it('selects attack-roll-vs-ac for 5e-like systems', () => {
    const dnd = { modes: { combat: { id: 'attack-roll-vs-ac' } } } as unknown as SystemDefinition;
    expect(getCombatResolver(dnd)).toBeDefined();
  });

  it('throws for an unmapped combat mode', () => {
    const bad = { modes: { combat: { id: 'dice-pool' } } } as unknown as SystemDefinition;
    expect(() => getCombatResolver(bad)).toThrow(/No combat resolver/);
  });
});

describe('attackRollVsAc — d20 + bonus vs AC (5e)', () => {
  const dnd = { modes: { combat: { id: 'attack-roll-vs-ac' } } } as unknown as SystemDefinition;
  const resolver = getCombatResolver(dnd);

  it('hit: roll meets AC, rolls damage', () => {
    // d20 → 14 (face(14,20)); then 1d6 → 3 (face(3,6))
    const res = resolver.resolveAttack({
      label: 'Goblin — Scimitar',
      dice: '1d6+2',
      damageType: 'Slashing',
      attackBonus: 4,
      targetAc: 15,
      rng: seqRng([face(14, 20), face(3, 6)]),
    });
    expect(res.hit).toBe(true);
    expect(res.attackRoll).toBe(18);
    expect(res.damage).toBe(5);
    expect(res.logText).toBe('Goblin — Scimitar: 1d20+4 = 18 vs AC 15 — HIT, 5 Slashing damage');
  });

  it('miss: roll under AC, no damage', () => {
    const res = resolver.resolveAttack({
      label: 'Goblin — Scimitar',
      dice: '1d6+2',
      damageType: 'Slashing',
      attackBonus: 4,
      targetAc: 15,
      rng: seqRng([face(5, 20)]),
    });
    expect(res.hit).toBe(false);
    expect(res.attackRoll).toBe(9);
    expect(res.damage).toBe(0);
    expect(res.rolls).toEqual([]);
    expect(res.logText).toBe('Goblin — Scimitar: 1d20+4 = 9 vs AC 15 — MISS');
  });

  it('advantage: takes the higher of two d20s', () => {
    // rollHighest('d20',2): faces 5 then 14 → best 14
    const res = resolver.resolveAttack({
      label: 'Bite',
      dice: '1d4',
      attackBonus: 0,
      targetAc: 10,
      advantage: 'advantage',
      rng: seqRng([face(5, 20), face(14, 20), face(2, 4)]),
    });
    expect(res.attackRoll).toBe(14);
    expect(res.logText).toBe('Bite: 1d20 = 14 (adv) vs AC 10 — HIT, 2 damage');
  });

  it('disadvantage: takes the lower of two d20s', () => {
    // rollLowest('d20',2): faces 14 then 5 → worst 5
    const res = resolver.resolveAttack({
      label: 'Claw',
      dice: '1d8',
      attackBonus: 5,
      targetAc: 12,
      advantage: 'disadvantage',
      rng: seqRng([face(14, 20), face(5, 20)]),
    });
    expect(res.attackRoll).toBe(10);
    expect(res.hit).toBe(false);
    expect(res.logText).toBe('Claw: 1d20+5 = 10 (dis) vs AC 12 — MISS');
  });
});

describe('autoHitVsDr — identical Solryn log lines', () => {
  const resolver = getCombatResolver(solrynLike);

  it('weapon with skill bonus (no type)', () => {
    const res = resolver.resolveAttack({
      label: 'Shortsword',
      dice: '1d6',
      bonus: 2,
      rng: seqRng([face(4, 6)]),
    });
    expect(res.logText).toBe('Shortsword: rolled 4 +2 = 6 damage');
    expect(res.damage).toBe(6);
    expect(res.hit).toBeUndefined(); // auto-hit → no hit/miss
  });

  it('multi-die weapon, no bonus', () => {
    const res = resolver.resolveAttack({
      label: 'Greatsword',
      dice: '2d6',
      rng: seqRng([face(3, 6), face(5, 6)]),
    });
    expect(res.logText).toBe('Greatsword: rolled 3+5 = 8 damage');
  });

  it('spell damage roll with a type (suffix added by caller)', () => {
    const res = resolver.resolveAttack({
      label: 'Ember Strike',
      dice: '1d4',
      damageType: 'Fire',
      rng: seqRng([face(3, 4)]),
    });
    expect(res.logText).toBe('Ember Strike: rolled 3 = 3 Fire damage');
  });

  it('monster attack: name-prefixed label, dice modifier + type', () => {
    const res = resolver.resolveAttack({
      label: 'Goblin — Scimitar',
      dice: '1d6+2',
      damageType: 'Slashing',
      rng: seqRng([face(4, 6)]),
    });
    expect(res.logText).toBe('Goblin — Scimitar: rolled 4 +2 = 6 Slashing damage');
    expect(res.modifier).toBe(2);
    expect(res.damage).toBe(6);
  });

  it('monster ability: no type, no bonus', () => {
    const res = resolver.resolveAttack({
      label: 'Goblin — Pack Tactics',
      dice: '2d6',
      rng: seqRng([face(3, 6), face(5, 6)]),
    });
    expect(res.logText).toBe('Goblin — Pack Tactics: rolled 3+5 = 8 damage');
  });

  it('logText matches a direct describeRoll over the same roll', () => {
    const expected = describeRoll('Shortsword', rollDice('1d6', seqRng([face(4, 6)])), { bonus: 2 });
    const res = resolver.resolveAttack({ label: 'Shortsword', dice: '1d6', bonus: 2, rng: seqRng([face(4, 6)]) });
    expect(res.logText).toBe(expected);
  });
});

describe('resolveCheck — d20 + modifier vs DC (5e saves / checks)', () => {
  it('pass: roll meets DC', () => {
    // d20 → 12 (face(12,20)); +2 → 14 ≥ DC 14
    const res = resolveCheck({ label: 'Goblin — DEX save', modifier: 2, dc: 14, rng: seqRng([face(12, 20)]) });
    expect(res.success).toBe(true);
    expect(res.roll).toBe(14);
    expect(res.logText).toBe('Goblin — DEX save: 1d20+2 = 14 vs DC 14 — SUCCESS');
  });

  it('fail: roll under DC', () => {
    const res = resolveCheck({ label: 'Goblin — DEX save', modifier: 2, dc: 15, rng: seqRng([face(12, 20)]) });
    expect(res.success).toBe(false);
    expect(res.roll).toBe(14);
    expect(res.logText).toBe('Goblin — DEX save: 1d20+2 = 14 vs DC 15 — FAIL');
  });

  it('advantage: takes the higher of two d20s', () => {
    // rollHighest('d20',2): 5 then 14 → 14; +3 = 17 ≥ DC 12
    const res = resolveCheck({ label: 'Orc — STR check', modifier: 3, dc: 12, advantage: 'advantage', rng: seqRng([face(5, 20), face(14, 20)]) });
    expect(res.roll).toBe(17);
    expect(res.logText).toBe('Orc — STR check: 1d20+3 = 17 (adv) vs DC 12 — SUCCESS');
  });

  it('disadvantage: takes the lower of two d20s', () => {
    // rollLowest('d20',2): 14 then 5 → 5; -1 = 4 < DC 10
    const res = resolveCheck({ label: 'Kobold — WIS save', modifier: -1, dc: 10, advantage: 'disadvantage', rng: seqRng([face(14, 20), face(5, 20)]) });
    expect(res.roll).toBe(4);
    expect(res.success).toBe(false);
    expect(res.logText).toBe('Kobold — WIS save: 1d20-1 = 4 (dis) vs DC 10 — FAIL');
  });
});

describe('attackRollVsAc — crits & fumbles (raw natural d20)', () => {
  const dnd = { modes: { combat: { id: 'attack-roll-vs-ac' } } } as unknown as SystemDefinition;
  const resolver = getCombatResolver(dnd);

  it('natural 20: auto-hit regardless of AC, doubled damage dice', () => {
    // d20 → 20; crit damage rolls 2d6+2 → faces 3,4 → 3+4+2 = 9
    const res = resolver.resolveAttack({
      label: 'Goblin — Scimitar',
      dice: '1d6+2',
      damageType: 'Slashing',
      attackBonus: 4,
      targetAc: 99, // would never hit on the total
      rng: seqRng([face(20, 20), face(3, 6), face(4, 6)]),
    });
    expect(res.hit).toBe(true);
    expect(res.crit).toBe(true);
    expect(res.rolls).toHaveLength(2); // dice doubled (2d6)
    expect(res.damage).toBe(9);
    // Crit shows the full breakdown of doubled dice + modifier (3+4+2 = 9).
    expect(res.logText).toBe('Goblin — Scimitar: natural 20 — CRIT, 3+4+2 = 9 Slashing damage');
  });

  it('crit with no damage modifier: breakdown omits "+0"', () => {
    // d20 → 20; crit damage 2d6 (no mod) → faces 5,3 → "5+3 = 8"
    const res = resolver.resolveAttack({
      label: 'Ogre — Club',
      dice: '1d6',
      damageType: 'Bludgeoning',
      attackBonus: 2,
      targetAc: 99,
      rng: seqRng([face(20, 20), face(5, 6), face(3, 6)]),
    });
    expect(res.crit).toBe(true);
    expect(res.damage).toBe(8);
    expect(res.logText).toBe('Ogre — Club: natural 20 — CRIT, 5+3 = 8 Bludgeoning damage');
  });

  it('natural 1: auto-miss regardless of AC, no damage', () => {
    const res = resolver.resolveAttack({
      label: 'Goblin — Scimitar',
      dice: '1d6+2',
      attackBonus: 20,
      targetAc: 5, // would always hit on the total
      rng: seqRng([face(1, 20)]),
    });
    expect(res.hit).toBe(false);
    expect(res.crit).toBeUndefined();
    expect(res.damage).toBe(0);
    expect(res.logText).toBe('Goblin — Scimitar: natural 1 — MISS');
  });

  it('a 20 discarded under disadvantage does NOT crit (kept die decides)', () => {
    // rollLowest('d20',2): 20 then 5 → kept 5, not a crit
    const res = resolver.resolveAttack({
      label: 'Claw',
      dice: '1d8',
      attackBonus: 0,
      targetAc: 10,
      advantage: 'disadvantage',
      rng: seqRng([face(20, 20), face(5, 20)]),
    });
    expect(res.crit).toBeFalsy();
    expect(res.attackRoll).toBe(5);
    expect(res.logText).toBe('Claw: 1d20 = 5 (dis) vs AC 10 — MISS');
  });
});

describe('attackRollVsAc — bonus damage (Rogue Sneak Attack)', () => {
  const dnd = { modes: { combat: { id: 'attack-roll-vs-ac' } } } as unknown as SystemDefinition;
  const resolver = getCombatResolver(dnd);

  it('hit: adds bonus dice, shown separately in the log', () => {
    // d20 14 → hit; weapon 1d8+3 → d8=5 → 8; Sneak 1d6 → 4
    const res = resolver.resolveAttack({
      label: 'Aria — Rapier',
      dice: '1d8+3',
      damageType: 'Piercing',
      attackBonus: 5,
      targetAc: 10,
      bonusDamage: { dice: '1d6', label: 'Sneak Attack' },
      rng: seqRng([face(14, 20), face(5, 8), face(4, 6)]),
    });
    expect(res.hit).toBe(true);
    expect(res.damage).toBe(12); // 8 + 4
    expect(res.logText).toBe('Aria — Rapier: 1d20+5 = 19 vs AC 10 — HIT, 8 Piercing + 4 Sneak Attack = 12 damage');
  });

  it('crit: bonus dice double too (2d8+3 weapon, 2d6 sneak)', () => {
    // d20 20 → crit; weapon crit 2d8+3 → 5,6 → 14; sneak crit 2d6 → 4,3 → 7
    const res = resolver.resolveAttack({
      label: 'Aria — Rapier',
      dice: '1d8+3',
      damageType: 'Piercing',
      attackBonus: 5,
      targetAc: 99,
      bonusDamage: { dice: '1d6', label: 'Sneak Attack' },
      rng: seqRng([face(20, 20), face(5, 8), face(6, 8), face(4, 6), face(3, 6)]),
    });
    expect(res.crit).toBe(true);
    expect(res.damage).toBe(21); // 14 + 7
    // Both weapon (5+6+3) and Sneak Attack (4+3) show their own doubled-dice breakdowns.
    expect(res.logText).toBe('Aria — Rapier: natural 20 — CRIT, 5+6+3 Piercing + 4+3 Sneak Attack = 21 damage');
  });

  it('no bonusDamage → log format unchanged (regression)', () => {
    const res = resolver.resolveAttack({
      label: 'Goblin — Scimitar', dice: '1d6+2', damageType: 'Slashing', attackBonus: 4, targetAc: 15,
      rng: seqRng([face(14, 20), face(3, 6)]),
    });
    expect(res.logText).toBe('Goblin — Scimitar: 1d20+4 = 18 vs AC 15 — HIT, 5 Slashing damage');
  });
});
