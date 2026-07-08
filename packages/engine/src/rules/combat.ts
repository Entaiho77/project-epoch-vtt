import type { SystemDefinition } from '@solryn/shared-types';
import type { CombatModeId } from '@solryn/shared-types';
import { parseDice, rollDice, rollHighest, rollLowest, type RollResult, type Rng } from './dice';
import { evalFormula } from './formula';

/**
 * How critical-hit damage is computed (a campaign rule). Each variant maps to the homebrew Rules
 * setting; `custom` evaluates a DM-authored expression over ROLL_DICE / MAX_DICE / MOD.
 */
export type CritFormula =
  | 'double_dice'
  | 'max_plus_roll'
  | 'roll_then_double'
  | 'max_then_double'
  | 'custom';

/**
 * The combat-resolution seam. Every attack flows through a system-selected `CombatResolver`
 * (chosen by `modes.combat.id`) instead of inlining the roll at the call site. Today only
 * Solryn's `auto-hit-vs-dr` exists, wrapping the prior behavior exactly; a future
 * `attack-roll-vs-ac` slots in here without touching the call sites.
 */

/**
 * Canonical damage-roll string — the format reused by weapon, spell, and monster rolls so
 * the log reads uniformly. (Moved here from the roll-log UI so the engine resolver can
 * produce it; `rollLog.tsx` re-exports it for back-compat. Pure — no UI deps.)
 */
export function describeRoll(
  label: string,
  r: RollResult,
  opts: { bonus?: number; type?: string } = {},
): string {
  const bonus = opts.bonus ?? 0;
  const total = r.total + bonus;
  const m = r.modifier + bonus;
  const mStr = m ? ` ${m >= 0 ? '+' : '-'}${Math.abs(m)}` : '';
  const type = opts.type ? `${opts.type} ` : '';
  return `${label}: rolled ${r.rolls.join('+')}${mStr} = ${total} ${type}damage`;
}

export interface AttackInput {
  /** Log label, fully built by the caller (e.g. "Goblin — Scimitar"). */
  label: string;
  /** Damage dice notation (e.g. "1d8+2"). */
  dice: string;
  /** Flat add on top of the DAMAGE dice (Solryn weapon skill bonus). */
  bonus?: number;
  damageType?: string;
  /** d20 TO-HIT bonus (attack-roll-vs-ac only; ignored by auto-hit). */
  attackBonus?: number;
  /** Defender's Armor Class (attack-roll-vs-ac only; ignored by auto-hit). */
  targetAc?: number;
  /** Roll the d20 with advantage/disadvantage (attack-roll-vs-ac only). */
  advantage?: 'advantage' | 'disadvantage';
  /** Extra damage dice added on a hit (e.g. Rogue Sneak Attack); doubled on a crit like the
   *  weapon dice. Rolled and shown separately. */
  bonusDamage?: { dice: string; label: string };
  /** Lowest natural d20 that scores a crit (default 20; Champion 19 at L3, 18 at L15). */
  critThreshold?: number;
  /** How crit damage is computed (campaign rule; default double_dice = standard 5e). */
  critFormula?: CritFormula;
  /** Custom crit expression (used only when critFormula === 'custom'). */
  critFormulaCustom?: string;
  /** Injectable RNG for deterministic tests. */
  rng?: Rng;
}

export interface AttackResolution {
  /** ABSENT for auto-hit (so the Solryn log line is unchanged); set by roll-to-hit modes. */
  hit?: boolean;
  /** True on a natural-20 critical hit (doubled damage dice). */
  crit?: boolean;
  /** The d20 to-hit total (incl. attackBonus) for roll-to-hit modes; absent for auto-hit. */
  attackRoll?: number;
  /** Damage dice faces (empty on a miss). */
  rolls: number[];
  modifier: number;
  /** Total damage including the flat bonus (0 on a miss). */
  damage: number;
  /** The exact log line. */
  logText: string;
}

export interface CombatResolver {
  resolveAttack(input: AttackInput): AttackResolution;
}

/** Solryn: attacks auto-hit; roll damage, no to-hit. Wraps the prior inline behavior. */
const autoHitVsDr: CombatResolver = {
  resolveAttack({ label, dice, bonus = 0, damageType, rng }) {
    const r = rollDice(dice, rng);
    const logText = describeRoll(label, r, { bonus, type: damageType });
    return { rolls: r.rolls, modifier: r.modifier, damage: r.total + bonus, logText };
  },
};

/** A signed term like "+4" / "-1" / "" (for 0). */
const sign = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `${n}` : '');

/** Roll a d20 face, honoring advantage/disadvantage. */
function rollD20Face(advantage: AttackInput['advantage'], rng?: Rng): number {
  if (advantage === 'advantage') return rollHighest('d20', 2, rng).best.total;
  if (advantage === 'disadvantage') return rollLowest('d20', 2, rng).worst.total;
  return rollDice('d20', rng).total;
}

/** A damage roll with a display breakdown; crit rolls carry a formula-specific breakdown string. */
interface DamageRoll {
  total: number;
  rolls: number[];
  modifier: number;
  breakdown?: string;
}

/**
 * Crit damage per the campaign's crit formula, using these variables of the base dice term NdX+M:
 *   ROLL_DICE = a normal roll of NdX (no modifier), MAX_DICE = N×X, MOD = M.
 * - double_dice     : roll 2N dice, add MOD once (standard 5e — the default)
 * - max_plus_roll   : MAX_DICE + ROLL_DICE + MOD ("max one set of dice, roll the other")
 * - roll_then_double: (ROLL_DICE + MOD) × 2
 * - max_then_double : (MAX_DICE + MOD) × 2
 * - custom          : evaluate the DM's expression over ROLL_DICE/MAX_DICE/MOD; on any failure
 *                     (bad syntax / unknown var / non-finite) fall back to double_dice and warn.
 */
function critDamage(dice: string, formula: CritFormula, custom: string | undefined, rng?: Rng): DamageRoll {
  const p = parseDice(dice);
  if (!p) {
    const r = rollDice(dice, rng);
    return { total: r.total, rolls: r.rolls, modifier: r.modifier, breakdown: `${r.rolls.join('+')}${sign(r.modifier)}` };
  }
  const { count, sides, modifier: MOD } = p;
  const roll1 = rollDice(`${count}d${sides}`, rng); // ROLL_DICE (dice only, no modifier)
  const ROLL_DICE = roll1.total;
  const MAX_DICE = count * sides;
  const maxed = Array.from({ length: count }, () => sides);

  const doubleDice = (): DamageRoll => {
    const roll2 = rollDice(`${count}d${sides}`, rng);
    const rolls = [...roll1.rolls, ...roll2.rolls];
    return { total: roll1.total + roll2.total + MOD, rolls, modifier: MOD, breakdown: `${rolls.join('+')}${sign(MOD)}` };
  };

  switch (formula) {
    case 'max_plus_roll': {
      const rolls = [...maxed, ...roll1.rolls];
      return { total: MAX_DICE + ROLL_DICE + MOD, rolls, modifier: MOD, breakdown: `${rolls.join('+')}${sign(MOD)}` };
    }
    case 'roll_then_double':
      return { total: (ROLL_DICE + MOD) * 2, rolls: roll1.rolls, modifier: MOD, breakdown: `(${roll1.rolls.join('+')}${sign(MOD)})×2` };
    case 'max_then_double':
      return { total: (MAX_DICE + MOD) * 2, rolls: maxed, modifier: MOD, breakdown: `(${maxed.join('+')}${sign(MOD)})×2` };
    case 'custom': {
      const v = custom ? evalFormula(custom, { ROLL_DICE, MAX_DICE, MOD }) : null;
      if (v == null) {
        console.warn(`[crit] invalid custom formula "${custom}" — falling back to double dice`);
        return doubleDice();
      }
      const total = Math.max(0, Math.round(v));
      return { total, rolls: roll1.rolls, modifier: MOD, breakdown: `${custom} = ${total}` };
    }
    case 'double_dice':
    default:
      return doubleDice();
  }
}

/**
 * D&D 5e: roll d20 + attackBonus vs the target's AC. The RAW natural die (the kept die under
 * advantage/disadvantage) decides crits: natural 20 → auto-hit + doubled damage dice; natural
 * 1 → auto-miss. Otherwise total ≥ AC hits. Solryn's autoHitVsDr is unaffected.
 */
const attackRollVsAc: CombatResolver = {
  resolveAttack({ label, dice, damageType, attackBonus = 0, targetAc = 10, advantage, bonusDamage, critThreshold = 20, critFormula = 'double_dice', critFormulaCustom, rng }) {
    const face = rollD20Face(advantage, rng); // raw natural value of the kept die
    const attackRoll = face + attackBonus;
    const advTag =
      advantage === 'advantage' ? ' (adv)' : advantage === 'disadvantage' ? ' (dis)' : '';
    const toHit = `1d20${sign(attackBonus)} = ${attackRoll}${advTag}`;
    const typeStr = damageType ? ` ${damageType}` : '';

    // Natural 1 → automatic miss, regardless of AC.
    if (face === 1) {
      return { hit: false, attackRoll, rolls: [], modifier: 0, damage: 0, logText: `${label}: natural 1 — MISS` };
    }
    // A natural roll at/above the threshold crits (and auto-hits, like a natural 20).
    const crit = face >= critThreshold;
    const hit = crit || attackRoll >= targetAc;

    if (!hit) {
      return { hit: false, attackRoll, rolls: [], modifier: 0, damage: 0, logText: `${label}: ${toHit} vs AC ${targetAc} — MISS` };
    }
    const dmg: DamageRoll = crit ? critDamage(dice, critFormula, critFormulaCustom, rng) : rollDice(dice, rng);
    // Bonus damage dice (Sneak Attack) also crit alongside the weapon dice, per 5e.
    const bonus: DamageRoll | null = bonusDamage
      ? crit
        ? critDamage(bonusDamage.dice, critFormula, critFormulaCustom, rng)
        : rollDice(bonusDamage.dice, rng)
      : null;
    const total = dmg.total + (bonus?.total ?? 0);
    const head = crit ? `natural ${face} — CRIT` : `${toHit} vs AC ${targetAc} — HIT`;
    // Individual dice + modifier, e.g. [3,4] +2 → "3+4+2" (empty modifier for 0), matching the
    // describeRoll breakdown style. Only crits show this; a normal hit stays total-only.
    const breakdown = (r: DamageRoll) => r.breakdown ?? `${r.rolls.join('+')}${sign(r.modifier)}`;
    const dmgText = crit
      ? bonus
        ? `${breakdown(dmg)}${typeStr} + ${breakdown(bonus)} ${bonusDamage!.label} = ${total} damage`
        : `${breakdown(dmg)} = ${total}${typeStr} damage`
      : bonus
        ? `${dmg.total}${typeStr} + ${bonus.total} ${bonusDamage!.label} = ${total} damage`
        : `${total}${typeStr} damage`;
    return {
      hit: true,
      crit,
      attackRoll,
      rolls: dmg.rolls,
      modifier: dmg.modifier,
      damage: total,
      logText: `${label}: ${head}, ${dmgText}`,
    };
  },
};

// --- Roll-vs-DC (saving throws & ability/skill checks) ----------------------
// The sibling of attackRollVsAc: d20 + modifier vs a Difficulty Class → success/failure.
// One primitive for both saves and checks (they differ only in the label). Universal —
// not tied to a combat mode — so it's a plain function, not part of CombatResolver. 5e-only
// in practice (Solryn has no saves); Solryn never calls it.

export interface CheckInput {
  /** Fully-built label, e.g. "Adult Red Dragon — DEX save" or "Goblin — Stealth check". */
  label: string;
  /** Save/check bonus added to the d20. */
  modifier?: number;
  /** Difficulty Class to meet or beat. */
  dc?: number;
  advantage?: 'advantage' | 'disadvantage';
  rng?: Rng;
}

export interface CheckResolution {
  success: boolean;
  /** d20 + modifier total. */
  roll: number;
  modifier: number;
  dc: number;
  logText: string;
}

export function resolveCheck({
  label,
  modifier = 0,
  dc = 10,
  advantage,
  rng,
}: CheckInput): CheckResolution {
  const face = rollD20Face(advantage, rng);
  const roll = face + modifier;
  const advTag =
    advantage === 'advantage' ? ' (adv)' : advantage === 'disadvantage' ? ' (dis)' : '';
  const success = roll >= dc;
  return {
    success,
    roll,
    modifier,
    dc,
    logText: `${label}: 1d20${sign(modifier)} = ${roll}${advTag} vs DC ${dc} — ${success ? 'SUCCESS' : 'FAIL'}`,
  };
}

const resolvers: Partial<Record<CombatModeId, CombatResolver>> = {
  'auto-hit-vs-dr': autoHitVsDr,
  'attack-roll-vs-ac': attackRollVsAc,
};

/** The combat resolver a system uses, selected by `modes.combat.id`. */
export function getCombatResolver(system: SystemDefinition): CombatResolver {
  const resolver = resolvers[system.modes.combat.id];
  if (!resolver) {
    throw new Error(`No combat resolver for mode: ${system.modes.combat.id}`);
  }
  return resolver;
}
