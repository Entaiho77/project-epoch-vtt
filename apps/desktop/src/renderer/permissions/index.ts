import type { Game, Role } from '@solryn/shared-types';

/**
 * Permission / ownership model (Design Doc §4.11–§4.12). Control follows ownership;
 * visibility decreases with distance from you. This is pure logic with no Firebase
 * dependency — the sync layer and token interactions both lean on it, and it is the
 * basis for client-side render-time filtering ("GM sees all, players see what's revealed").
 */

export type TokenKind = 'character' | 'creature' | 'trap' | 'party';

export interface TokenLike {
  kind: TokenKind;
  /** For character tokens: the controlling player's uid. */
  ownerUserId?: string;
  /** Hidden-token flag; false means players don't render it. */
  visible?: boolean;
}

/** How much of a token a viewer may see. */
export type TokenView = 'full' | 'name-image' | 'basics' | 'hidden';

export function roleOf(game: Pick<Game, 'members'>, uid: string): Role | undefined {
  return game.members?.[uid]?.role;
}

export function isMember(game: Pick<Game, 'members'>, uid: string): boolean {
  return Boolean(game.members?.[uid]);
}

export function isGM(game: Pick<Game, 'members'>, uid: string): boolean {
  return roleOf(game, uid) === 'gm';
}

/** Only the GM manages a game (settings, members, delete). */
export function canManageGame(game: Pick<Game, 'members'>, uid: string): boolean {
  return isGM(game, uid);
}

/**
 * Players edit their own character; the GM has READ-ONLY on player characters (respects
 * player agency). So edit rights are simply: you own it.
 */
export function canEditCharacter(ownerUserId: string, uid: string): boolean {
  return ownerUserId === uid;
}

/**
 * Control of a token: players control their own character token; the GM controls
 * monster/trap tokens. This single-owner-per-token rule is also what makes sync
 * conflict-free (two people can never grab the same token).
 */
export function canControlToken(
  token: TokenLike,
  uid: string,
  role: Role | undefined,
): boolean {
  if (token.kind === 'party') return true; // shared travel token — any member may move it
  if (token.kind === 'character') return token.ownerUserId === uid;
  return role === 'gm'; // creature / trap
}

/** Monsters stay mysterious: only the GM sees their stats. */
export function canSeeMonsterStats(role: Role | undefined): boolean {
  return role === 'gm';
}

/** What a viewer may see of a given token. */
export function tokenVisibility(
  token: TokenLike,
  uid: string,
  role: Role | undefined,
): TokenView {
  if (role === 'gm') return 'full'; // GM sees all (hidden tokens drawn dimmed)
  if (token.kind === 'party') return 'full'; // the shared party marker is visible to everyone

  const hidden = token.visible === false;
  if (token.kind === 'character') {
    if (token.ownerUserId === uid) return 'full'; // own character
    return hidden ? 'hidden' : 'basics'; // other player: name + visible status
  }
  // creature / trap
  return hidden ? 'hidden' : 'name-image'; // name + image only, no stats
}

/** Fog renders from the same data two ways: GM semi-transparent, players opaque. */
export function fogStyle(role: Role | undefined): 'semi-transparent' | 'opaque' {
  return role === 'gm' ? 'semi-transparent' : 'opaque';
}
