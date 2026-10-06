import type { Combatant, InitiativeState, Token } from '@epoch/shared-types';
import { rollDice } from '@epoch/engine';
import { readValue, writeValue } from './realtime';
import { removeToken } from './board';

/** Initiative tracker state lives at game.initiative (§4.13). */

/** Highest first; players win ties versus monsters; then by tiebreak. */
export function sortOrder(order: Combatant[]): Combatant[] {
  return [...order].sort((a, b) => {
    if (b.initiative !== a.initiative) return b.initiative - a.initiative;
    const aw = a.kind === 'character' ? 1 : 0;
    const bw = b.kind === 'character' ? 1 : 0;
    if (bw !== aw) return bw - aw;
    return b.tieBreak - a.tieBreak;
  });
}

export function rollInitiative(modifier: number): {
  initiative: number;
  tieBreak: number;
} {
  return { initiative: rollDice('d20').total + modifier, tieBreak: modifier };
}

/**
 * Start combat in the "Rolling initiative…" phase: the chosen monsters are in (possibly none —
 * a chase or a duel), players roll themselves in, and nobody's turn has started yet. The GM
 * clicks Begin to start round 1 with the highest roll.
 */
export function startCombat(gameId: string, monsters: Combatant[]): Promise<void> {
  const state: InitiativeState = {
    active: true,
    phase: 'rolling',
    round: 1,
    turnIndex: 0,
    order: sortOrder(monsters),
  };
  return writeValue(`games/${gameId}/initiative`, state);
}

/** True while everyone is still rolling in (before the GM clicks Begin). */
export function isRolling(state: InitiativeState | null | undefined): boolean {
  return !!state?.active && state.phase === 'rolling';
}

/** Begin round 1 with the highest initiative (GM). */
export function beginCombat(gameId: string, state: InitiativeState): Promise<void> {
  return writeValue(`games/${gameId}/initiative`, {
    ...state,
    phase: 'running',
    round: 1,
    turnIndex: 0,
    order: sortOrder(state.order ?? []),
  });
}

/** The state with `c` added in initiative order, keeping the same combatant's turn. */
export function withCombatant(state: InitiativeState, c: Combatant): InitiativeState {
  const prev = state.order ?? [];
  if (prev.some((o) => o.id === c.id)) return state;
  const currentId = prev[state.turnIndex]?.id;
  const order = sortOrder([...prev, c]);
  const turnIndex = Math.max(0, order.findIndex((o) => o.id === currentId));
  return { ...state, order, turnIndex };
}

/** Players trickle in; keep the same combatant's turn after re-sorting. */
export function addCombatant(
  gameId: string,
  state: InitiativeState,
  c: Combatant,
): Promise<void> {
  const next = withCombatant(state, c);
  if (next === state) return Promise.resolve();
  return writeValue(`games/${gameId}/initiative`, next);
}

/**
 * Add a combatant to the CURRENT initiative (re-read right before writing, so several creatures
 * placed in a burst don't overwrite each other). Does nothing outside combat. Returns whether
 * it was added.
 */
export async function joinCombat(gameId: string, c: Combatant): Promise<boolean> {
  const state = await readValue<InitiativeState>(`games/${gameId}/initiative`);
  if (!state?.active) return false;
  const next = withCombatant({ ...state, order: state.order ?? [] }, c);
  if (next.order.length === (state.order ?? []).length) return false;
  await writeValue(`games/${gameId}/initiative`, next);
  return true;
}

/** Take one combatant out of the order (GM), keeping whoever's turn it is. */
export async function leaveCombat(gameId: string, combatantId: string): Promise<void> {
  const state = await readValue<InitiativeState>(`games/${gameId}/initiative`);
  if (!state?.active) return;
  const prev = state.order ?? [];
  const idx = prev.findIndex((c) => c.id === combatantId);
  if (idx === -1) return;
  const order = prev.filter((c) => c.id !== combatantId);
  if (order.length === 0 && state.phase !== 'rolling') {
    return writeValue(`games/${gameId}/initiative`, null);
  }
  let turnIndex = state.turnIndex - (idx < state.turnIndex ? 1 : 0);
  if (turnIndex >= order.length || turnIndex < 0) turnIndex = 0;
  await writeValue(`games/${gameId}/initiative`, { ...state, order, turnIndex });
}

/**
 * A creature's initiative modifier: its own `initiativeMod` (Solryn / homebrew), else its
 * DEX modifier (5e stat blocks list DEX, not initiative), else 0.
 */
export function creatureInitiativeMod(stats: Token['stats']): number {
  const own = Number(stats?.initiativeMod);
  if (stats?.initiativeMod !== undefined && Number.isFinite(own)) return own;
  const dex = Number(stats?.dex);
  return Number.isFinite(dex) && stats?.dex !== undefined ? Math.floor((dex - 10) / 2) : 0;
}

/** A creature token as a combatant, with a fresh initiative roll. */
export function creatureCombatant(t: Pick<Token, 'id' | 'name' | 'stats'>): Combatant {
  return {
    id: t.id,
    name: t.name,
    kind: 'creature',
    tokenId: t.id,
    ...rollInitiative(creatureInitiativeMod(t.stats)),
  };
}

/** Advance to the next combatant, skipping defeated creatures; loop bumps the round. */
export function nextTurn(
  gameId: string,
  state: InitiativeState,
  tokens: Record<string, Token>,
): Promise<void> {
  if (state.order.length === 0) return Promise.resolve();
  let idx = state.turnIndex;
  let round = state.round;
  for (let n = 0; n < state.order.length; n++) {
    idx += 1;
    if (idx >= state.order.length) {
      idx = 0;
      round += 1;
    }
    const cand = state.order[idx];
    const tok = cand.tokenId ? tokens[cand.tokenId] : undefined;
    if (!(cand.kind === 'creature' && tok?.defeated)) break;
  }
  return writeValue(`games/${gameId}/initiative`, { ...state, turnIndex: idx, round });
}

/** Jump the active turn directly to a combatant (GM override; keeps the current round). */
export function setTurn(
  gameId: string,
  state: InitiativeState,
  index: number,
): Promise<void> {
  if (index < 0 || index >= state.order.length || index === state.turnIndex) {
    return Promise.resolve();
  }
  return writeValue(`games/${gameId}/initiative`, { ...state, turnIndex: index });
}

export function endCombat(gameId: string): Promise<void> {
  return writeValue(`games/${gameId}/initiative`, null);
}

/** Drop any combatants backed by the given token ids (used when tokens are removed in
 * bulk) so the tracker never shows ghosts. Keeps the active actor where possible. */
export function removeCombatantsByToken(
  gameId: string,
  state: InitiativeState,
  tokenIds: Set<string>,
): Promise<void> {
  const order = (state.order ?? []).filter((c) => !(c.tokenId && tokenIds.has(c.tokenId)));
  if (order.length === (state.order?.length ?? 0)) return Promise.resolve();
  // No combatants left → end combat. (Never persist order: [] — Firebase drops empty
  // arrays, which would leave an "active" initiative with an undefined order.)
  if (order.length === 0) return writeValue(`games/${gameId}/initiative`, null);
  const removedBefore = state.order
    .slice(0, state.turnIndex)
    .filter((c) => c.tokenId && tokenIds.has(c.tokenId)).length;
  let turnIndex = state.turnIndex - removedBefore;
  if (turnIndex >= order.length) turnIndex = 0;
  if (turnIndex < 0) turnIndex = 0;
  return writeValue(`games/${gameId}/initiative`, { ...state, order, turnIndex });
}

/**
 * Single entry point for "delete this token," used by every remove button on the board
 * (token right-click menu, the tapped-token card, the GM monster stat card) — it also drops
 * the matching combatant row from initiative in the same call, so none of those callers need
 * their own copy of that bookkeeping or even have the initiative state in scope. Mirrors
 * `removeCombatantsByToken`, just self-contained (reads the live state itself) for callers that
 * only have a token id. 2026-10-06 playtest: "removing a token from the board should remove it
 * from the initiative tracker too."
 */
export async function removeTokenAndCombatant(gameId: string, tokenId: string): Promise<void> {
  await removeToken(gameId, tokenId);
  const state = await readValue<InitiativeState>(`games/${gameId}/initiative`);
  if (state?.active) await removeCombatantsByToken(gameId, state, new Set([tokenId]));
}

/** Drop any combatants owned by the given player account (used when a player is removed from
 * the game) so they can't still be mid-fight, or sitting in the roll-in pool, for a game they
 * were just kicked from. Keeps the active actor where possible, exactly like
 * `removeCombatantsByToken`. 2026-10-06 playtest: "if a player is removed from the game, take
 * them out of the pool of potential initiative rolls too." */
export function removeCombatantsByOwner(
  gameId: string,
  state: InitiativeState,
  uid: string,
): Promise<void> {
  const order = (state.order ?? []).filter((c) => c.ownerUserId !== uid);
  if (order.length === (state.order?.length ?? 0)) return Promise.resolve();
  if (order.length === 0) return writeValue(`games/${gameId}/initiative`, null);
  const removedBefore = state.order.slice(0, state.turnIndex).filter((c) => c.ownerUserId === uid).length;
  let turnIndex = state.turnIndex - removedBefore;
  if (turnIndex >= order.length) turnIndex = 0;
  if (turnIndex < 0) turnIndex = 0;
  return writeValue(`games/${gameId}/initiative`, { ...state, order, turnIndex });
}

/** GM switch: let attacks happen off-turn (reactions, readied actions) — or not. */
export function setAllowOffTurn(gameId: string, state: InitiativeState, allow: boolean): Promise<void> {
  return writeValue(`games/${gameId}/initiative`, { ...state, allowOffTurn: allow });
}

/**
 * Why `actor` can't attack right now, in plain words, or null when they can. Mirrors
 * mayAttackNow (the GM's computer enforces the same rule for players).
 */
export function turnBlockReason(
  state: InitiativeState | null | undefined,
  actor: { uid?: string; tokenId?: string },
  nameOf: (c: Combatant) => string = (c) => c.name,
): string | null {
  if (!state?.active || state.phase === 'rolling' || state.allowOffTurn) return null;
  const current = (state.order ?? [])[state.turnIndex];
  if (!current) return null;
  if (actor.tokenId && current.tokenId === actor.tokenId) return null;
  if (actor.uid && current.ownerUserId === actor.uid) return null;
  return `It's ${nameOf(current)}'s turn — attacks wait for your turn (the GM can allow off-turn attacks).`;
}
