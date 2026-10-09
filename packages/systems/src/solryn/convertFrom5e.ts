// 5e → Solryn monster conversion (backlog item 6, spec from Matthew, Oct 8 2026).
// Pure math over already-structured data — no Firebase, no UI. Converts a 5e statblock
// (CR, six ability scores, a list of attacks) into Solryn creature stats (TR-derived HP/DR,
// the seven Solryn scores + modifiers, and attacks with the 5e to-hit/ability bonus swapped
// for the converted Solryn modifier). See the backlog note for the full step-by-step spec.

import { modifierRule } from './attributes';

/** A 5e ability score key, lowercase to match BestiaryEntry.stats convention. */
export type Dnd5eAbility = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

/** A Solryn core stat id. */
export type SolrynStat = 'STR' | 'NIM' | 'END' | 'WIS' | 'INT' | 'ARC' | 'LCK';

export interface Dnd5eAttackInput {
  name: string;
  /** e.g. "2d6+5" — the flat bonus is the ability modifier (± a magic-weapon bonus), which
   *  gets replaced wholesale by the converted Solryn modifier (per spec step 6). */
  diceExpr: string;
  damageType: string;
  /** Which 5e ability the damage bonus came from. Existing bestiary/homebrew data doesn't
   *  record this, so leave it unset to let the converter infer it (see inferAbilityFromBonus) —
   *  only pass this to override the inference. */
  ability?: Dnd5eAbility;
  note?: string;
}

export interface Dnd5eStatblockInput {
  /** CR as a number (0.125, 0.25, 0.5, 1, 2, ...). Parse "1/4"-style strings with
   *  crToNumber() (data/homebrew.ts) before calling this. */
  cr: number;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  attacks?: Dnd5eAttackInput[];
  /** True if the statblock has any spellcasting — surfaces the "handle spells by hand" note. */
  hasSpells?: boolean;
}

export interface SolrynConvertedAttack {
  name: string;
  diceExpr: string;
  damageType: string;
  note?: string;
}

export interface SolrynConversionResult {
  /** Threat Rating — intermediate step only, per spec not meant to be stored as its own field. */
  tr: number;
  hp: number;
  dr: number;
  scores: Record<SolrynStat, number>;
  modifiers: Record<SolrynStat, number>;
  attacks: SolrynConvertedAttack[];
  /** User-facing notes to carry along with the converted sheet (spec's two call-outs, plus any
   *  extrapolation flags — e.g. TR0/TR11 HP aren't in Matthew's given table and are estimated). */
  notes: string[];
}

/** Step 1 — CR → TR lookup table (spec, Oct 8 2026). */
function crToTr(cr: number): number {
  if (cr <= 0.125) return 0;
  if (cr <= 0.5) return 1;
  if (cr === 1) return 2;
  if (cr === 2) return 3;
  if (cr <= 4) return 4;
  if (cr === 5) return 5;
  if (cr <= 7) return 6;
  if (cr <= 9) return 7;
  if (cr <= 12) return 8;
  if (cr <= 16) return 9;
  if (cr <= 20) return 10;
  return 11; // 21–30, "Catastrophe"
}

/** Step 3 — HP by TR (spec table is TR1–TR10; TR0 and TR11 aren't given, see notes below). */
const TR_HP: Record<number, number> = {
  1: 22,
  2: 34,
  3: 45,
  4: 65,
  5: 84,
  6: 98,
  7: 118,
  8: 135,
  9: 150,
  10: 200,
};
const TR11_CATASTROPHE_MIDPOINT_HP = 450; // spec: 300–700 band, default to midpoint

function hpForTr(tr: number, notes: string[]): number {
  if (tr === 11) return TR11_CATASTROPHE_MIDPOINT_HP;
  const hp = TR_HP[tr];
  if (hp !== undefined) return hp;
  // TR0 isn't in the given table — estimate below TR1 rather than guessing wrong silently.
  notes.push('TR0 HP is an estimate (not in the given TR1–TR10 table) — confirm with Matthew.');
  return 12;
}

/** Generic Solryn modifier: applies the system's own linear-step rule instead of hardcoding
 *  "÷3 floored" again, so this stays correct if the rule ever changes. */
function solrynModifier(score: number): number {
  if (modifierRule.type !== 'linear-step') {
    throw new Error(`convertFrom5e assumes a linear-step modifier rule, got "${modifierRule.type}"`);
  }
  return Math.floor(score / modifierRule.pointsPerStep) * modifierRule.bonusPerStep;
}

/** Step 4 — ability score conversion ratios (spec, Oct 8 2026). */
function convertScores(input: Dnd5eStatblockInput): Record<SolrynStat, number> {
  const STR = Math.round(input.str * 0.8);
  const NIM = Math.round(input.dex * 0.75);
  const END = Math.round(input.con * 0.82);
  const WIS = Math.round(input.wis * 0.7);
  const INT = Math.round(input.int * 0.73);
  const ARC = Math.round(input.cha * 0.75);
  // Luck has no 5e equivalent — default to ~1/3 of the average converted score (spec gives
  // this or a flat 6 as the two acceptable defaults; average is used here since it scales
  // with the creature instead of being the same for a rat and a dragon).
  const average = (STR + NIM + END + WIS + INT + ARC) / 6;
  const LCK = Math.round(average / 3);
  return { STR, NIM, END, WIS, INT, ARC, LCK };
}

const SOLRYN_ABILITY_FOR: Record<Dnd5eAbility, SolrynStat> = {
  str: 'STR',
  dex: 'NIM',
  con: 'END',
  int: 'INT',
  wis: 'WIS',
  cha: 'ARC',
};

/** Standard 5e ability modifier: floor((score - 10) / 2). */
function dnd5eModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** A normal weapon attack's damage bonus IS its ability modifier — 5e proficiency only
 *  affects the to-hit roll, never damage — so a flat damage bonus can be matched back to
 *  whichever of the creature's six abilities produces that exact modifier. Ties (two
 *  abilities sharing a modifier) resolve to the melee-typical order (STR, then DEX, ...).
 *  Returns undefined when nothing matches (e.g. a magic weapon's damage bonus baked in),
 *  so the caller can fall back and flag it instead of silently guessing wrong. */
function inferAbilityFromBonus(bonus: number, dnd5e: Dnd5eStatblockInput): Dnd5eAbility | undefined {
  const order: Dnd5eAbility[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  return order.find((a) => dnd5eModifier(dnd5e[a]) === bonus);
}

/** Step 6 — attack conversion: keep the dice, drop the to-hit, swap the baked-in ability
 *  modifier for the converted Solryn modifier. */
function convertAttack(
  attack: Dnd5eAttackInput,
  dnd5e: Dnd5eStatblockInput,
  modifiers: Record<SolrynStat, number>,
  notes: string[],
): SolrynConvertedAttack {
  const match = attack.diceExpr.match(/^(\d+d\d+)(?:\s*([+-]\s*\d+))?$/i);
  const dicePart = match ? match[1] : attack.diceExpr; // unparsed expr: keep as-is, dice only
  const flatBonus = match?.[2] ? parseInt(match[2].replace(/\s+/g, ''), 10) : 0;

  let ability = attack.ability;
  if (!ability) {
    ability = inferAbilityFromBonus(flatBonus, dnd5e);
    if (!ability) {
      ability = 'str'; // fallback when nothing matches (e.g. a magic weapon's damage bonus)
      notes.push(
        `"${attack.name}": couldn't match its +${flatBonus} damage bonus to one of this creature's ability modifiers (likely a magic weapon bonus) — defaulted to STR. Check this one on review.`,
      );
    }
  }

  const stat = SOLRYN_ABILITY_FOR[ability];
  const mod = modifiers[stat];
  const diceExpr = mod !== 0 ? `${dicePart}${mod > 0 ? '+' : ''}${mod}` : dicePart;

  return {
    name: attack.name,
    diceExpr,
    damageType: attack.damageType,
    note: attack.note,
  };
}

/** Runs the full 5e → Solryn conversion spec. Pure — the caller decides what to do with the
 *  result (preview to the GM, save as a new Solryn homebrew BestiaryEntry, etc). */
export function convertDnd5eToSolryn(input: Dnd5eStatblockInput): SolrynConversionResult {
  const notes: string[] = [
    "HP and DR come only from the TR lookup, not from this creature's original 5e HP/AC — that's by design, not an oversight.",
  ];
  if (input.hasSpells) {
    notes.push("This creature has spellcasting — spells don't auto-convert. Handle its spells by hand.");
  }

  const tr = crToTr(input.cr);
  const hp = hpForTr(tr, notes);
  const dr = Math.round(tr * 0.8);
  const scores = convertScores(input);
  const modifiers: Record<SolrynStat, number> = {
    STR: solrynModifier(scores.STR),
    NIM: solrynModifier(scores.NIM),
    END: solrynModifier(scores.END),
    WIS: solrynModifier(scores.WIS),
    INT: solrynModifier(scores.INT),
    ARC: solrynModifier(scores.ARC),
    LCK: solrynModifier(scores.LCK),
  };
  const attacks = (input.attacks ?? []).map((a) => convertAttack(a, input, modifiers, notes));

  return { tr, hp, dr, scores, modifiers, attacks, notes };
}
