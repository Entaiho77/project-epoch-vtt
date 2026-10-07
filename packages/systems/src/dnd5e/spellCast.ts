import type { Dnd5eSpell } from '@solryn/shared-types';
import { describeRoll, rollDice, type CombatResolver, type CritFormula, type Rng } from '@solryn/engine';

/** What a resolved cast deals, if anything — mirrors the roll-log's `Hit`/`PendingSave` shapes
 *  (data/damage.ts) without importing them, since this package doesn't depend on the app. */
export interface SpellCastResult {
  logText: string;
  /** Attack-spell hit, or a plain damage spell with no save — applied immediately, like a weapon. */
  hit?: { tokenId: string; amount: number };
  /** Save-based spell damage — the GM resolves fail/success afterward; not auto-applied. */
  pendingSave?: {
    tokenId: string;
    dc: number;
    ability: string;
    successType: 'half' | 'none';
    amount: number;
    damageType?: string;
  };
}

/**
 * Damage dice for a spell cast at a given slot level. Cantrips scale by the caster's level
 * (byCharacterLevel — highest keyed level ≤ caster level); leveled spells scale by the slot
 * used (bySlotLevel — upcasting). Falls back to the base dice; null for non-damage spells.
 */
export function spellDamage(sp: Dnd5eSpell, slotLevel: number, casterLevel: number): string | null {
  if (sp.level === 0) {
    const map = sp.scaling?.byCharacterLevel;
    if (!map) return sp.damageDice;
    const keys = Object.keys(map).map(Number).sort((a, b) => a - b);
    const best = keys.filter((k) => k <= casterLevel).pop() ?? keys[0];
    return map[String(best)] ?? sp.damageDice;
  }
  return sp.scaling?.bySlotLevel?.[String(slotLevel)] ?? sp.damageDice;
}

/**
 * Concentration bookkeeping for a cast. Returns null when the spell isn't a concentration spell
 * (leave play.concentrating untouched). Otherwise returns the new concentration target and, if a
 * DIFFERENT concentration spell was already active, a log line noting it was broken (5e: you can
 * only concentrate on one spell — casting another breaks the first). Pure — no Firebase.
 */
export function concentrationOnCast(
  prev: { spellId: string; spellName: string } | undefined,
  sp: Dnd5eSpell,
  casterName: string,
): { concentrating: { spellId: string; spellName: string }; breakLog?: string } | null {
  if (!sp.concentration) return null;
  const out: { concentrating: { spellId: string; spellName: string }; breakLog?: string } = {
    concentrating: { spellId: sp.id, spellName: sp.name },
  };
  if (prev && prev.spellId !== sp.id) out.breakLog = `${casterName}: Concentration on ${prev.spellName} broken.`;
  return out;
}

export interface CastContext {
  casterName: string;
  /** Target name (attack spells with a set target) → shown as "Caster → Target — Spell". */
  targetName?: string;
  /** Resolved defender AC (from the target token or the manual field). */
  targetAc?: number;
  advantage?: 'advantage' | 'disadvantage';
  /** The caster's spell save DC (8 + prof + ability). */
  saveDc: number;
  /** The caster's spell attack bonus (prof + ability). */
  attackBonus: number;
  /** Damage dice already resolved for the chosen slot/level (null = non-damage spell). */
  dice: string | null;
  /** The targeted token's id, so a resulting hit/pendingSave knows what to apply to. */
  targetTokenId?: string;
  resolver: CombatResolver;
  /** Campaign crit rules for attack spells (threshold + damage formula). */
  critThreshold?: number;
  critFormula?: CritFormula;
  critFormulaCustom?: string;
  /** Injectable RNG for deterministic tests. */
  rng?: Rng;
}

/**
 * Resolve casting a spell, reusing the shared resolvers (no new combat math):
 * - attack spell (attackType + dice) → attackRollVsAc, exactly like a weapon attack — a hit
 *   applies immediately, same roll-proof pipeline as a weapon attack;
 * - plain-damage spell with no save (dice, no attackType, no save) → always lands, applied
 *   immediately like an auto-hit (e.g. Magic Missile);
 * - save spell (dice + save) → roll damage + a "DC X ABILITY save" note; the amount is held as
 *   `pendingSave` since the *target's* roll (not the caster's) decides fail/half/none — the GM
 *   resolves it afterward, same trust tier as AoE damage;
 * - utility / buff (no dice) → announce "Caster casts Spell.".
 * Pure — the slot spend (Firebase) is the caller's responsibility.
 */
export function spellCastResolve(sp: Dnd5eSpell, ctx: CastContext): SpellCastResult {
  const label = ctx.targetName
    ? `${ctx.casterName} → ${ctx.targetName} — ${sp.name}`
    : `${ctx.casterName} — ${sp.name}`;

  if (sp.attackType && ctx.dice) {
    const res = ctx.resolver.resolveAttack({
      label,
      dice: ctx.dice,
      damageType: sp.damageType,
      attackBonus: ctx.attackBonus,
      targetAc: ctx.targetAc,
      advantage: ctx.advantage,
      ...(ctx.critThreshold != null ? { critThreshold: ctx.critThreshold } : {}),
      ...(ctx.critFormula ? { critFormula: ctx.critFormula } : {}),
      ...(ctx.critFormulaCustom ? { critFormulaCustom: ctx.critFormulaCustom } : {}),
      rng: ctx.rng,
    });
    return {
      logText: res.logText,
      ...(ctx.targetTokenId && res.hit && res.damage > 0
        ? { hit: { tokenId: ctx.targetTokenId, amount: res.damage } }
        : {}),
    };
  }

  if (ctx.dice) {
    const r = rollDice(ctx.dice, ctx.rng);
    let line = describeRoll(`${ctx.casterName} — ${sp.name}`, r, { type: sp.damageType });
    if (sp.save) {
      line += ` · DC ${ctx.saveDc} ${sp.save} save`;
      if (sp.saveSuccess === 'half') line += ` for half (${Math.floor(r.total / 2)})`;
      return {
        logText: line,
        ...(ctx.targetTokenId
          ? {
              pendingSave: {
                tokenId: ctx.targetTokenId,
                dc: ctx.saveDc,
                ability: sp.save,
                successType: sp.saveSuccess === 'half' ? ('half' as const) : ('none' as const),
                amount: r.total,
                ...(sp.damageType ? { damageType: sp.damageType } : {}),
              },
            }
          : {}),
      };
    }
    // No attack roll, no save — a plain damage spell (e.g. Magic Missile) always lands in full.
    return {
      logText: line,
      ...(ctx.targetTokenId && r.total > 0 ? { hit: { tokenId: ctx.targetTokenId, amount: r.total } } : {}),
    };
  }

  return { logText: `${ctx.casterName} casts ${sp.name}.` };
}

/** Back-compat string-only wrapper — existing callers that just want the log line. */
export function spellCastLog(sp: Dnd5eSpell, ctx: CastContext): string {
  return spellCastResolve(sp, ctx).logText;
}
