import type { MapDef, Token } from '@epoch/shared-types';
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

/** Reveal every hidden creature on one map at once (GM). Traps stay hidden. */
export function revealAllCreatures(gameId: string, tokens: Token[], mapId: string): Promise<void> {
  const patch: Record<string, unknown> = {};
  for (const t of tokens) {
    if (t.mapId === mapId && t.kind === 'creature' && t.visible === false) {
      patch[`/games/${gameId}/tokens/${t.id}/visible`] = true;
    }
  }
  return Object.keys(patch).length ? multiUpdate(patch) : Promise.resolve();
}

/**
 * Set a token's HP. For creatures, 0 HP marks it defeated and anything above 0 brings it back
 * (so a healed monster is targetable and takes turns again) — UNLESS the token is `permaDead`
 * (Solryn exhaustion level 3: "Death. Permanent. No resurrection."), in which case HP is forced
 * to stay at 0 no matter what value was requested; nothing heals that back.
 */
export function setTokenHp(
  gameId: string,
  token: Pick<Token, 'id' | 'kind' | 'hp' | 'permaDead'>,
  current: number,
): Promise<void> {
  const max = token.hp?.max ?? current;
  const hp = token.permaDead ? 0 : Math.max(0, Math.min(Math.round(current), max));
  return multiUpdate({
    [`/games/${gameId}/tokens/${token.id}/hp`]: { current: hp, max },
    ...(token.kind === 'creature' ? { [`/games/${gameId}/tokens/${token.id}/defeated`]: hp === 0 ? true : null } : {}),
  });
}

/**
 * Mark a creature defeated, or bring it back (at least 1 HP so it's really back in the fight) —
 * UNLESS the token is `permaDead`, in which case a revive attempt (defeated: false) is silently
 * refused; `permaDead` itself is never cleared here (nothing short of the GM editing it directly
 * undoes "no resurrection").
 */
export function setDefeated(gameId: string, token: Pick<Token, 'id' | 'hp' | 'permaDead'>, defeated: boolean): Promise<void> {
  if (!defeated && token.permaDead) return Promise.resolve();
  return multiUpdate({
    [`/games/${gameId}/tokens/${token.id}/defeated`]: defeated ? true : null,
    ...(!defeated && token.hp && token.hp.current <= 0
      ? { [`/games/${gameId}/tokens/${token.id}/hp/current`]: 1 }
      : {}),
  });
}

export function removeToken(gameId: string, tokenId: string): Promise<void> {
  return writeValue(`games/${gameId}/tokens/${tokenId}`, null);
}

// --- Token conditions (applied/removed by any game member) ---

/**
 * Toggle a single condition on a token (writing null removes it). Pass `fatal: true` (from the
 * condition's own `effects.fatal`) when turning one ON to also mark the token `defeated` +
 * `permaDead` in the same write — e.g. Solryn exhaustion level 3 ("Death. Permanent. No
 * resurrection."). Never clears `permaDead` itself; nothing here undoes that.
 */
export function setTokenCondition(
  gameId: string,
  tokenId: string,
  conditionId: string,
  on: boolean,
  fatal?: boolean,
): Promise<void> {
  const updates: Record<string, unknown> = {
    [`games/${gameId}/tokens/${tokenId}/conditions/${conditionId}`]: on ? true : null,
  };
  if (on && fatal) {
    updates[`games/${gameId}/tokens/${tokenId}/defeated`] = true;
    updates[`games/${gameId}/tokens/${tokenId}/permaDead`] = true;
  }
  return multiUpdate(updates);
}

/**
 * Set an exclusive-group condition (e.g. one Exhaustion level): activate `activeId` and clear every
 * other id in the group. Pass activeId = null to clear the whole group. Pass `fatal: true` (the
 * newly-active condition's own `effects.fatal`) to also mark the token `defeated` + `permaDead` in
 * the same write — see `setTokenCondition`.
 */
export function setExclusiveCondition(
  gameId: string,
  tokenId: string,
  groupIds: string[],
  activeId: string | null,
  fatal?: boolean,
): Promise<void> {
  const updates: Record<string, unknown> = {};
  for (const id of groupIds) {
    updates[`/games/${gameId}/tokens/${tokenId}/conditions/${id}`] = id === activeId ? true : null;
  }
  if (activeId && fatal) {
    updates[`/games/${gameId}/tokens/${tokenId}/defeated`] = true;
    updates[`/games/${gameId}/tokens/${tokenId}/permaDead`] = true;
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
