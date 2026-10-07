/**
 * Short and long rests, as database changes for one character. Pure — the sheet applies the
 * returned updates in one write and posts the summary line to the roll log.
 *
 * 5e (SRD):
 *  - Long rest: HP to max, all spell slots back, feat uses back (e.g. Lucky), recover spent hit
 *    dice up to half your level (min 1), death saves cleared.
 *  - Short rest: spend hit dice (each heals 1 die + CON), Warlock pact slots back.
 * Solryn (rulebook "Rest & Recovery"):
 *  - Short rest (1 hr): AP recovers half its max (rounded down); no HP or Luck. No exhaustion
 *    benefit (rulebook §1.4).
 *  - Long rest, field (8 hrs): HP +half max, AP full, Luck full, exhaustion −1 level.
 *  - Long rest, town (8 hrs): HP full, AP full, Luck full, exhaustion −1 level.
 *  Exhaustion levels are cumulative (confirmed by Matthew 2026-10-07): level 2 carries level 1's
 *  effect too, same convention 5e already uses in this codebase. Level 3 ("Death. Permanent. No
 *  resurrection.") is never auto-applied by a rest — a rest only ever REDUCES exhaustion.
 */

export type Updates = Record<string, unknown>;

const base = (id: string) => `/characters/${id}/play`;

// --- 5e -------------------------------------------------------------------------------

export interface FiveERestInput {
  characterId: string;
  name: string;
  level: number;
  maxHp: number;
  currentHp: number;
  /** Max slots by level (Warlock: their pact slots). */
  maxSlots?: Record<number, number>;
  isWarlock: boolean;
  hitDiceUsed: number;
}

export function longRest5e(c: FiveERestInput): { updates: Updates; text: string } {
  const regain = Math.max(1, Math.floor(c.level / 2));
  const used = Math.max(0, c.hitDiceUsed - regain);
  return {
    updates: {
      [`${base(c.characterId)}/pools/hp/current`]: c.maxHp,
      ...(c.maxSlots ? { [`${base(c.characterId)}/spellSlots`]: c.maxSlots } : {}),
      [`${base(c.characterId)}/featResources`]: null,
      [`${base(c.characterId)}/hitDiceUsed`]: used,
      [`${base(c.characterId)}/deathSaves`]: null,
    },
    text: `${c.name} takes a long rest: HP ${c.maxHp}/${c.maxHp}${c.maxSlots ? ', spell slots restored' : ''}, ${c.level - used}/${c.level} hit dice.`,
  };
}

/**
 * A short rest spending `rolls` hit dice (each roll is one die's face; CON added per die, a die
 * never heals less than 0). Warlocks get their pact slots back.
 */
export function shortRest5e(c: FiveERestInput, rolls: number[], conMod: number): { updates: Updates; text: string } {
  const available = Math.max(0, c.level - c.hitDiceUsed);
  const spent = rolls.slice(0, available);
  const healed = spent.reduce((sum, f) => sum + Math.max(0, f + conMod), 0);
  const hp = Math.min(c.maxHp, c.currentHp + healed);
  const pact = c.isWarlock && c.maxSlots;
  const parts = [
    spent.length ? `spends ${spent.length} hit ${spent.length === 1 ? 'die' : 'dice'} (${spent.join('+')}${conMod ? ` ${conMod >= 0 ? '+' : '−'}${Math.abs(conMod)} each` : ''}) → +${hp - c.currentHp} HP (${hp}/${c.maxHp})` : 'rests without spending hit dice',
    ...(pact ? ['pact slots restored'] : []),
  ];
  return {
    updates: {
      ...(spent.length ? { [`${base(c.characterId)}/pools/hp/current`]: hp, [`${base(c.characterId)}/hitDiceUsed`]: c.hitDiceUsed + spent.length } : {}),
      ...(hp > 0 && spent.length ? { [`${base(c.characterId)}/deathSaves`]: null } : {}),
      ...(pact ? { [`${base(c.characterId)}/spellSlots`]: c.maxSlots } : {}),
    },
    text: `${c.name} takes a short rest: ${parts.join('; ')}.`,
  };
}

// --- Solryn ---------------------------------------------------------------------------

export interface SolrynPool {
  id: string;
  max: number;
  current: number;
}

export type SolrynRest = 'short' | 'long-field' | 'long-town';

/** The 3 exhaustion condition ids, in level order — matches `solryn/conditions.ts`. */
export const SOLRYN_EXHAUSTION_IDS = ['exhaustion_1', 'exhaustion_2', 'exhaustion_3'];

export function restSolryn(
  characterId: string,
  name: string,
  kind: SolrynRest,
  pools: { hp?: SolrynPool; ap?: SolrynPool; luck?: SolrynPool },
  /** The character's own board token + its current exhaustion level (0–3), so a long rest can
   *  step it down by one. Omit if the character has no token on the active map — the rest still
   *  works, it just can't touch exhaustion (nothing to write it to). */
  exhaustion?: { gameId: string; tokenId: string; level: number },
): { updates: Updates; text: string } {
  const u: Updates = {};
  const said: string[] = [];
  const set = (p: SolrynPool | undefined, value: number, label: string) => {
    if (!p) return;
    const v = Math.max(0, Math.min(p.max, value));
    u[`${base(characterId)}/pools/${p.id}/current`] = v;
    said.push(`${label} ${v}/${p.max}`);
  };
  if (kind === 'short') {
    set(pools.ap, (pools.ap?.current ?? 0) + Math.floor((pools.ap?.max ?? 0) / 2), 'AP');
  } else {
    if (kind === 'long-town') set(pools.hp, pools.hp?.max ?? 0, 'HP');
    else set(pools.hp, (pools.hp?.current ?? 0) + Math.floor((pools.hp?.max ?? 0) / 2), 'HP');
    set(pools.ap, pools.ap?.max ?? 0, 'AP');
    set(pools.luck, pools.luck?.max ?? 0, 'Luck');
  }
  const label = kind === 'short' ? 'a short rest' : kind === 'long-town' ? 'a long rest in town' : 'a long rest in the field';
  // Short rests give no exhaustion benefit (rulebook §1.4); long rests (either kind) reduce it
  // by one level. Level 3 ("Death") is a floor a rest can step away from but never apply.
  let tail = '';
  if (kind !== 'short' && exhaustion && exhaustion.level > 0) {
    const nextLevel = exhaustion.level - 1;
    for (let i = 0; i < SOLRYN_EXHAUSTION_IDS.length; i++) {
      u[`games/${exhaustion.gameId}/tokens/${exhaustion.tokenId}/conditions/${SOLRYN_EXHAUSTION_IDS[i]}`] =
        i + 1 === nextLevel ? true : null;
    }
    tail = nextLevel > 0 ? ` · exhaustion reduced to level ${nextLevel}` : ' · exhaustion cleared';
  }
  return { updates: u, text: `${name} takes ${label}: ${said.join(', ') || 'nothing to recover'}${tail}.` };
}
