import type { MapDef, Token } from '@solryn/shared-types';
import {
  multiUpdate,
  newKey,
  updateValue,
  writeValue,
} from './realtime';

/** Board state lives inside the game object, riding the same sync mechanism (§4.12). */

export const squareKey = (col: number, row: number) => `${col},${row}`;

// --- Maps ---

export async function addMap(
  gameId: string,
  map: Omit<MapDef, 'id'>,
): Promise<string> {
  const id = newKey(`games/${gameId}/maps`);
  await multiUpdate({
    [`/games/${gameId}/maps/${id}`]: { ...map, id },
    [`/games/${gameId}/activeMapId`]: id, // a freshly added map becomes active
  });
  return id;
}

export function setActiveMap(gameId: string, mapId: string): Promise<void> {
  return writeValue(`games/${gameId}/activeMapId`, mapId);
}

export function setGridVisible(
  gameId: string,
  mapId: string,
  visible: boolean,
): Promise<void> {
  return writeValue(`games/${gameId}/maps/${mapId}/gridVisible`, visible);
}

export function setGridSize(
  gameId: string,
  mapId: string,
  size: number,
): Promise<void> {
  return writeValue(`games/${gameId}/maps/${mapId}/gridSize`, size);
}

// --- Fog (grid-square level) ---

export function toggleFogSquare(
  gameId: string,
  mapId: string,
  col: number,
  row: number,
  fogged: boolean,
): Promise<void> {
  // Writing null removes the key (reveals the square).
  return writeValue(
    `games/${gameId}/maps/${mapId}/fog/${squareKey(col, row)}`,
    fogged ? true : null,
  );
}

export function coverAllFog(
  gameId: string,
  map: MapDef,
): Promise<void> {
  const cols = Math.max(1, Math.ceil(map.width / map.gridSize));
  const rows = Math.max(1, Math.ceil(map.height / map.gridSize));
  const fog: Record<string, true> = {};
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) fog[squareKey(c, r)] = true;
  }
  return writeValue(`games/${gameId}/maps/${map.id}/fog`, fog);
}

export function clearFog(gameId: string, mapId: string): Promise<void> {
  return writeValue(`games/${gameId}/maps/${mapId}/fog`, null);
}

// --- Tokens ---

export async function addToken(
  gameId: string,
  token: Omit<Token, 'id'>,
): Promise<string> {
  const id = newKey(`games/${gameId}/tokens`);
  await writeValue(`games/${gameId}/tokens/${id}`, { ...token, id });
  return id;
}

export function moveToken(
  gameId: string,
  tokenId: string,
  col: number,
  row: number,
): Promise<void> {
  return multiUpdate({
    [`/games/${gameId}/tokens/${tokenId}/col`]: col,
    [`/games/${gameId}/tokens/${tokenId}/row`]: row,
  });
}

/** Mark a loot item as distributed from this token instance (GM loot flow, Phase B1). */
export function markLootGiven(
  gameId: string,
  tokenId: string,
  equipmentId: string,
): Promise<void> {
  return writeValue(`games/${gameId}/tokens/${tokenId}/lootGiven/${equipmentId}`, true);
}

export function updateToken(
  gameId: string,
  tokenId: string,
  patch: Partial<Token>,
): Promise<void> {
  return updateValue(
    `games/${gameId}/tokens/${tokenId}`,
    patch as Record<string, unknown>,
  );
}

export function removeToken(gameId: string, tokenId: string): Promise<void> {
  return writeValue(`games/${gameId}/tokens/${tokenId}`, null);
}

// --- Token conditions (applied/removed by any game member) ---

/** Toggle a single condition on a token (writing null removes it). */
export function setTokenCondition(
  gameId: string,
  tokenId: string,
  conditionId: string,
  on: boolean,
): Promise<void> {
  return writeValue(
    `games/${gameId}/tokens/${tokenId}/conditions/${conditionId}`,
    on ? true : null,
  );
}

/**
 * Set an exclusive-group condition (e.g. one Exhaustion level): activate `activeId` and clear every
 * other id in the group. Pass activeId = null to clear the whole group.
 */
export function setExclusiveCondition(
  gameId: string,
  tokenId: string,
  groupIds: string[],
  activeId: string | null,
): Promise<void> {
  const updates: Record<string, unknown> = {};
  for (const id of groupIds) {
    updates[`/games/${gameId}/tokens/${tokenId}/conditions/${id}`] = id === activeId ? true : null;
  }
  return multiUpdate(updates);
}

/**
 * Party-token soft-lock. Grabbing stamps the holder's uid + the current time so other
 * clients can't drag it meanwhile; releasing clears both. A crashed drag self-heals once
 * the timestamp goes stale (see `partyLockHeldByOther`).
 */
export function grabPartyToken(
  gameId: string,
  tokenId: string,
  uid: string,
): Promise<void> {
  return updateToken(gameId, tokenId, { draggedBy: uid, draggedAt: Date.now() });
}

export function releasePartyToken(gameId: string, tokenId: string): Promise<void> {
  return updateValue(`games/${gameId}/tokens/${tokenId}`, {
    draggedBy: null,
    draggedAt: null,
  });
}
