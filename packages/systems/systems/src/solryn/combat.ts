import { rollDice, type Rng } from '@solryn/engine';

/**
 * Solryn combat resolution (PHB): ALL attacks auto-hit. The attacker rolls weapon/spell damage
 * dice + modifiers + skill bonus, then compares the rolled total to the target's DR:
 *   hpLoss = max(0, damage − DR)   (0 → "Blocked (no damage)")
 *
 * Luck-based crits: the attacker spends 1 Luck Point and rolls a d20; success (roll ≥ threshold,
 * where the threshold widens with Luck modifier) IGNORES DR and DOUBLES the rolled damage. A failed
 * attempt still resolves the attack normally (auto-hits, still vs DR).
 *
 * This is Solryn-only logic, kept out of the shared engine so the 5e attack-roll-vs-AC path is
 * untouched.
 */

/** Whether an attack is a Luck-crit attempt and, if so, its outcome. */
export type CritState = 'none' | 'success' | 'failed';

export interface SolrynAttackInput {
  /** Log label (e.g. "Hero → Goblin — Shortsword"). */
  label: string;
  /** Damage dice term, e.g. "1d8". */
  dice: string;
  /** Flat add on top of the damage dice (weapon skill bonus). */
  bonus?: number;
  /** Target's DR. Omit when no target is set — the attack still auto-hits but isn't reduced. */
  targetDr?: number;
  /** Crit-attempt outcome ('success' ignores DR + doubles; 'failed' resolves normally). */
  crit?: CritState;
  /** Injectable RNG for deterministic tests. */
  rng?: Rng;
}

export interface SolrynAttackResult {
  /** Rolled damage (dice + bonus), before any crit doubling. */
  rolled: number;
  /** DR applied (0 when no target, or on a crit success where DR is ignored). */
  dr: number;
  /** HP the target actually loses. */
  hpLoss: number;
  /** True when a normal/failed attack was fully absorbed by DR. */
  blocked: boolean;
  /** True on a successful Luck crit. */
  crit: boolean;
  /** The exact roll-log line. */
  logText: string;
}

/**
 * Lowest d20 face that scores a Luck crit for a given Luck modifier:
 *   +1 → 19, +2 → 18, … +6 → 14 (i.e. 20 − mod). A non-positive modifier only crits on a natural 20.
 */
export function luckCritThreshold(luckMod: number): number {
  return Math.min(20, 20 - Math.max(0, luckMod));
}

export interface LuckCritAttempt {
  roll: number;
  threshold: number;
  success: boolean;
}

/** Roll the d20 for a Luck-crit attempt against the modifier's threshold. */
export function attemptLuckCrit(luckMod: number, rng?: Rng): LuckCritAttempt {
  const threshold = luckCritThreshold(luckMod);
  const roll = rollDice('d20', rng).total;
  return { roll, threshold, success: roll >= threshold };
}

/**
 * Resolve a Solryn attack (auto-hit) against a target's DR, honoring a Luck-crit outcome. Pure —
 * the caller spends the Luck Point / Arcana and posts `logText`.
 */
export function resolveSolrynAttack(input: SolrynAttackInput): SolrynAttackResult {
  const { label, dice, bonus = 0, targetDr, crit = 'none', rng } = input;
  const rolled = rollDice(dice, rng).total + bonus;

  // Crit success: DR ignored, damage doubled.
  if (crit === 'success') {
    const finalDamage = rolled * 2;
    return {
      rolled,
      dr: 0,
      hpLoss: finalDamage,
      blocked: false,
      crit: true,
      logText: `${label}: CRITICAL HIT! Rolled ${rolled} damage, DR ignored → ${finalDamage} HP damage`,
    };
  }

  const prefix = crit === 'failed' ? 'Critical attempt failed — ' : '';

  // No target set → auto-hit with nothing to reduce against.
  if (targetDr === undefined) {
    return {
      rolled,
      dr: 0,
      hpLoss: rolled,
      blocked: false,
      crit: false,
      logText: `${label}: ${prefix}Rolled ${rolled} damage`,
    };
  }

  const dr = targetDr;
  const hpLoss = Math.max(0, rolled - dr);
  const blocked = hpLoss === 0;
  const outcome = blocked ? 'Blocked (no damage)' : `${hpLoss} HP damage`;
  return {
    rolled,
    dr,
    hpLoss,
    blocked,
    crit: false,
    logText: `${label}: ${prefix}Rolled ${rolled} damage vs DR ${dr} → ${outcome}`,
  };
}
