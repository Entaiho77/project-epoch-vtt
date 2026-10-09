// Backlog item 1 (loot generator): the GM-triggered, scene-wide loot search. Lives at
// games/$gameId/lootSearch (one at a time per game — same "one ephemeral shared slot" shape as
// games/$gameId/initiative). Mirrors combat.ts's style: pure read/write helpers here, the actual
// trigger/roll/review UI lives in the board drawer that calls these.
//
// Resolution is automatic, not a GM click (Matthew, Oct 9, 2026 — "I think it should be
// automatic"): once at least one player has rolled in, the GM's own client watches
// `lastRollAt` and calls resolveLootSearch() a short grace period after the most recent roll,
// the same way other ephemeral board state (e.g. the encounter generator's bulk-place) is
// driven client-side by whoever's looking at the GM's own UI.

import type { GeneratedLootItem, HomebrewEquipment, InventoryItem, LootSearchState } from '@epoch/shared-types';
import { generateLootPool, type GeneratedLootPool } from '@epoch/systems/dnd5e/lootTables';
import { readValue, writeValue } from './realtime';
import { giveInventoryItem } from './characters';

/** How long to wait after the last roll before auto-resolving — long enough that a second
 *  player mid-roll isn't cut off, short enough the table isn't left waiting. */
export const LOOT_RESOLVE_GRACE_MS = 8000;

function pruneUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj };
  for (const k of Object.keys(out)) {
    if (out[k] === undefined) delete out[k];
  }
  return out;
}

/** GM: start a new scene-wide loot search over the given defeated creatures. Generates the
 *  pool immediately (so it's ready the moment everyone's done rolling) but keeps it unrevealed
 *  until resolveLootSearch — the drawer only shows players a prompt to roll, never the pool. */
export function startLootSearch(
  gameId: string,
  creatures: { name: string; cr: number }[],
  tokenIds: string[],
  homebrewEquipment: HomebrewEquipment[] = [],
): Promise<void> {
  const pool = generateLootPool(creatures, homebrewEquipment);
  const state: LootSearchState = { active: true, tokenIds, pool, rollers: {} };
  return writeValue(`games/${gameId}/lootSearch`, state);
}

export function isLootSearchOpen(state: LootSearchState | null | undefined): boolean {
  return !!state?.active && !state.resolved;
}

/** A player opts in and rolls — re-reads live state so two players rolling at once don't
 *  overwrite each other, same pattern as combat.ts's joinCombat. No-ops once resolved or if the
 *  player already rolled in. */
export async function joinLootSearch(
  gameId: string,
  characterId: string,
  name: string,
  roll: number,
): Promise<boolean> {
  const state = await readValue<LootSearchState>(`games/${gameId}/lootSearch`);
  if (!state?.active || state.resolved || state.rollers[characterId]) return false;
  await writeValue(`games/${gameId}/lootSearch`, {
    ...state,
    rollers: { ...state.rollers, [characterId]: { characterId, name, roll } },
    lastRollAt: Date.now(),
  });
  return true;
}

/** True once there's at least one roll in and the grace period has elapsed — the GM's client
 *  polls this to decide when to call resolveLootSearch(). */
export function dueToResolve(state: LootSearchState | null | undefined, now = Date.now()): boolean {
  if (!state?.active || state.resolved) return false;
  if (Object.keys(state.rollers).length === 0 || !state.lastRollAt) return false;
  return now - state.lastRollAt >= LOOT_RESOLVE_GRACE_MS;
}

/** Highest-roll-first pick order: ties keep roll order (first to roll in wins the tie). Loops
 *  back to the top roller again if there are more items than rollers (Matthew's call not yet
 *  explicitly confirmed, flagged as my default — see the backlog doc). */
function pickOrderAssignments(
  rollerOrder: string[],
  items: GeneratedLootItem[],
): Record<string, string> {
  const assignments: Record<string, string> = {};
  items.forEach((item, i) => {
    assignments[item.id] = rollerOrder[i % rollerOrder.length];
  });
  return assignments;
}

/** Auto-resolve: split gold evenly (floored; the odd remainder goes to the top roller) and hand
 *  out items via the highest-roll-first draft. No-ops if already resolved or nobody rolled in. */
export async function resolveLootSearch(gameId: string): Promise<void> {
  const state = await readValue<LootSearchState>(`games/${gameId}/lootSearch`);
  if (!state?.active || state.resolved) return;
  const rollers = Object.values(state.rollers);
  if (rollers.length === 0) return;
  const order = [...rollers].sort((a, b) => b.roll - a.roll).map((r) => r.characterId);
  const n = order.length;
  const goldEach = Math.floor(state.pool.gold / n);
  const goldRemainder = state.pool.gold - goldEach * n;
  await writeValue(`games/${gameId}/lootSearch`, {
    ...state,
    resolved: {
      goldEach,
      ...(goldRemainder > 0 ? { goldRemainder } : {}),
      assignments: pickOrderAssignments(order, state.pool.items),
    },
  });
}

/** GM override: skip the pick-order draft. Gold still splits evenly across whoever's rolled in
 *  so far; every item is left unassigned in the shared pool for the GM to hand out manually
 *  (the existing Give Loot flow already does one-at-a-time, GM-picks-the-recipient — exactly
 *  what "the table prefers pooling" wants). Can be called before or after the grace timer. */
export async function splitLootEvenly(gameId: string): Promise<void> {
  const state = await readValue<LootSearchState>(`games/${gameId}/lootSearch`);
  if (!state?.active || state.resolved) return;
  const rollers = Object.values(state.rollers);
  const n = Math.max(1, rollers.length);
  const goldEach = Math.floor(state.pool.gold / n);
  const goldRemainder = state.pool.gold - goldEach * n;
  await writeValue(`games/${gameId}/lootSearch`, {
    ...state,
    resolved: {
      goldEach,
      ...(goldRemainder > 0 ? { goldRemainder } : {}),
      assignments: {},
      splitEvenly: true,
    },
  });
}

/** Turns a generated loot item into a snapshotted inventory record, same shape the Give Loot
 *  flow already uses for a library item — the rarity (if any) folds into the stored
 *  description so a kept item's sheet entry carries the full mechanical text, not the
 *  withheld reveal blurb (that blurb is only for the pool-review display, before it's theirs). */
export function lootItemToInventoryItem(item: GeneratedLootItem): Omit<InventoryItem, 'id'> {
  const { id, revealDescription, rarity, ...rest } = item;
  const description = rarity
    ? `(${rarity}) ${item.description}`
    : item.description;
  return pruneUndefined({ ...rest, description, equipmentId: id, equipped: false });
}

/** GM/player: claim one item from a resolved search into the recipient's inventory. Guards
 *  against a double-give with `resolved.claimed`, same role `lootGiven` plays on a token. */
export async function claimLootItem(
  gameId: string,
  characterId: string,
  item: GeneratedLootItem,
): Promise<void> {
  const state = await readValue<LootSearchState>(`games/${gameId}/lootSearch`);
  if (!state?.resolved || state.resolved.claimed?.[item.id]) return;
  await giveInventoryItem(characterId, lootItemToInventoryItem(item));
  await writeValue(`games/${gameId}/lootSearch`, {
    ...state,
    resolved: { ...state.resolved, claimed: { ...state.resolved.claimed, [item.id]: true } },
  });
}

/** GM/player: claim this roller's gold share. Uses the synthetic 'gold' claim key since gold
 *  isn't an item id. Gives the top roller (first in the resolved order) the leftover remainder
 *  too — caller passes `isTopRoller` since the order isn't stored, only the final assignments. */
export async function claimLootGold(
  gameId: string,
  characterId: string,
  isTopRoller: boolean,
): Promise<void> {
  const state = await readValue<LootSearchState>(`games/${gameId}/lootSearch`);
  if (!state?.resolved) return;
  const claimKey = `gold:${characterId}`;
  if (state.resolved.claimed?.[claimKey]) return;
  const amount = state.resolved.goldEach + (isTopRoller ? state.resolved.goldRemainder ?? 0 : 0);
  if (amount > 0) {
    await giveInventoryItem(characterId, {
      equipmentId: 'generated-gold',
      name: `${amount} gp (loot search)`,
      category: 'other',
      description: 'Coin recovered from the loot search.',
      equipped: false,
    });
  }
  await writeValue(`games/${gameId}/lootSearch`, {
    ...state,
    resolved: { ...state.resolved, claimed: { ...state.resolved.claimed, [claimKey]: true } },
  });
}

/** GM: clear a resolved (or abandoned) search so the next fight starts clean. */
export function clearLootSearch(gameId: string): Promise<void> {
  return writeValue(`games/${gameId}/lootSearch`, null);
}

export type { GeneratedLootPool };
