import type { TokenCondition, TokenConditionEffects } from '@solryn/shared-types';

/**
 * Condition → combat effect helpers. Systems supply their own TokenCondition list (with mechanized
 * effect flags); this module resolves a token's active-condition map into effects and combines
 * advantage/disadvantage the 5e way: any advantage + any disadvantage cancel to a normal roll, and
 * multiples never stack beyond a single advantage or disadvantage.
 */

export type AdvantageState = 'advantage' | 'disadvantage' | undefined;

/** The TokenCondition defs that are currently active on a token (from its conditions map). */
export function activeConditions(
  defs: TokenCondition[] | undefined,
  active: Record<string, true> | undefined,
): TokenCondition[] {
  if (!defs || !active) return [];
  return defs.filter((c) => active[c.id]);
}

/** Union of all effect flags across a set of conditions (any true wins). */
export function mergeEffects(conditions: TokenCondition[]): TokenConditionEffects {
  const out: TokenConditionEffects = {};
  for (const c of conditions) {
    for (const [k, v] of Object.entries(c.effects)) {
      if (v) (out as Record<string, boolean>)[k] = true;
    }
  }
  return out;
}

/** Convenience: resolve a token's condition map straight to merged effects. */
export function effectsFor(
  defs: TokenCondition[] | undefined,
  active: Record<string, true> | undefined,
): TokenConditionEffects {
  return mergeEffects(activeConditions(defs, active));
}

/**
 * Net advantage/disadvantage on an attack, from the attacker's and target's conditions. `meleeWithin5`
 * distinguishes Prone (melee advantage vs ranged disadvantage). Advantage and disadvantage cancel.
 */
export function attackAdvantage(
  attacker: TokenConditionEffects,
  target: TokenConditionEffects,
  meleeWithin5: boolean,
): AdvantageState {
  let adv = false;
  let dis = false;

  // Target-side.
  if (target.attacksAgainstAdvantage) adv = true;
  if (target.attacksAgainstDisadvantage) dis = true;
  if (target.meleeAdvRangedDis) {
    if (meleeWithin5) adv = true;
    else dis = true;
  }
  // Attacker-side.
  if (attacker.ownAttacksAdvantage) adv = true;
  if (attacker.ownAttacksDisadvantage) dis = true;

  if (adv && dis) return undefined;
  return adv ? 'advantage' : dis ? 'disadvantage' : undefined;
}

/** Combine a manually-chosen advantage with the condition-derived one (manual wins if set). */
export function combineAdvantage(manual: AdvantageState, fromConditions: AdvantageState): AdvantageState {
  return manual ?? fromConditions;
}

/** 5e: a melee attack from within 5 ft against this target is an automatic critical hit. */
export function autoCritAgainst(target: TokenConditionEffects, meleeWithin5: boolean): boolean {
  return !!target.autoCritMeleeAgainst && meleeWithin5;
}
