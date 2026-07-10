import type { Combatant, InitiativeState, Token } from '@solryn/shared-types';
import { rollDice } from '@solryn/engine';
import { writeValue } from './realtime';

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

export function startCombat(gameId: string, monsters: Combatant[]): Promise<void> {
  const state: InitiativeState = {
    active: true,
    round: 1,
    turnIndex: 0,
    order: sortOrder(monsters),
  };
  return writeValue(`games/${gameId}/initiative`, state);
}

/** Players trickle in; keep the same combatant's turn after re-sorting. */
export function addCombatant(
  gameId: string,
  state: InitiativeState,
  c: Combatant,
): Promise<void> {
  if (state.order.some((o) => o.id === c.id)) return Promise.resolve();
  const currentId = state.order[state.turnIndex]?.id;
  const order = sortOrder([...state.order, c]);
  const turnIndex = Math.max(0, order.findIndex((o) => o.id === currentId));
  return writeValue(`games/${gameId}/initiative`, { ...state, order, turnIndex });
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
