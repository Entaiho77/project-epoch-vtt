import type { MapType } from '@solryn/shared-types';
import type { Token } from '@solryn/shared-types';

/**
 * Party-scale (travel) maps: the party moves as one shared "party token" any player can drag,
 * and individual character tokens are hidden. This is all driven by the map type's `partyScale`
 * DATA flag — the engine never hardcodes which Solryn map ids are travel-scale.
 */

/** A party-token drag held by someone else is honoured for at most this long, then self-heals. */
export const PARTY_LOCK_STALE_MS = 8000;

export function isPartyScale(mapType?: Pick<MapType, 'partyScale'>): boolean {
  return mapType?.partyScale === true;
}

/**
 * Tokens to actually show / hit-test on a map. On party-scale maps the per-character tokens
 * fold into the shared party token (so characters are hidden); on tactical maps the party
 * token isn't shown. Per-viewer secrecy (hidden creatures/NPCs) is applied separately.
 */
export function visibleOnMap(
  tokens: Token[],
  mapId: string,
  partyScale: boolean,
): Token[] {
  return tokens.filter((t) => {
    if (t.mapId !== mapId) return false;
    return partyScale ? t.kind !== 'character' : t.kind !== 'party';
  });
}

/**
 * Is the party token's soft-lock currently held by another client? Free if unlocked, held
 * by me, or stale (the holder crashed/disconnected mid-drag and the timestamp aged out).
 */
export function partyLockHeldByOther(
  token: Pick<Token, 'draggedBy' | 'draggedAt'>,
  uid: string,
  now: number,
  staleMs = PARTY_LOCK_STALE_MS,
): boolean {
  if (!token.draggedBy || token.draggedBy === uid) return false;
  if (token.draggedAt && now - token.draggedAt > staleMs) return false;
  return true;
}
