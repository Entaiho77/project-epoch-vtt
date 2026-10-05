import type { Token } from '@epoch/shared-types';

/**
 * Auto-damage: when someone attacks the token they've targeted, the damage comes off that
 * token's HP straight away. The roll-log entry carries `hit: { tokenId, amount }`; the GM's
 * computer applies it (for players, after checking the dice behind the roll).
 */

export interface Hit {
  tokenId: string;
  amount: number;
}

/** A creature at 0 HP (or marked defeated) — it can't be targeted any more. */
export function isDefeated(t: Pick<Token, 'kind' | 'defeated' | 'hp'> | null | undefined): boolean {
  if (!t || t.kind !== 'creature') return false;
  return !!t.defeated || (t.hp !== undefined && t.hp.current <= 0);
}

/**
 * The most damage one checked roll can plausibly claim: twice the dice (crits double dice)
 * plus room for modifiers. Stops a modified app from claiming 500 damage off a d6.
 */
export function maxClaimableDamage(dice: { s: number; f: number }[]): number {
  const sum = dice.filter((d) => d.s !== 20).reduce((a, d) => a + d.f, 0);
  return sum * 2 + 40;
}

/**
 * Database changes that apply a hit to a token: a creature's HP on its token (0 → defeated);
 * a player character's HP on their character sheet. Returns null when there's nothing to
 * apply to (no HP tracked, unknown character).
 */
export function hitChanges(
  gameId: string,
  token: Token,
  amount: number,
  characterHp?: number,
): Record<string, unknown> | null {
  const dmg = Math.max(0, Math.floor(amount));
  if (token.kind === 'character' && token.characterId) {
    if (typeof characterHp !== 'number') return null;
    return { [`/characters/${token.characterId}/play/pools/hp/current`]: Math.max(0, characterHp - dmg) };
  }
  if (!token.hp) return null;
  const current = Math.max(0, token.hp.current - dmg);
  return {
    [`/games/${gameId}/tokens/${token.id}/hp/current`]: current,
    ...(current === 0 && token.kind === 'creature' ? { [`/games/${gameId}/tokens/${token.id}/defeated`]: true } : {}),
  };
}

/** "Goblin takes 9 — down!" — shown under the roll (no HP numbers, so monster HP stays the GM's). */
export function hitNote(name: string, amount: number, down: boolean): string {
  return `${name} takes ${Math.max(0, Math.floor(amount))}${down ? ' — down!' : ''}`;
}

/**
 * Whether someone may attack right now: outside combat, always; while everyone is rolling in,
 * yes; otherwise only on their own turn — a player's character (`uid`) or, for the GM's
 * monsters, that creature's token (`tokenId`) — unless the GM has allowed off-turn attacks
 * (reactions, readied actions).
 */
export function mayAttackNow(
  init:
    | { active?: boolean; phase?: string; turnIndex: number; order?: { ownerUserId?: string; tokenId?: string }[]; allowOffTurn?: boolean }
    | null
    | undefined,
  actor: { uid?: string; tokenId?: string },
): boolean {
  if (!init?.active || init.phase === 'rolling' || init.allowOffTurn) return true;
  const current = (init.order ?? [])[init.turnIndex];
  if (!current) return true;
  if (actor.tokenId && current.tokenId === actor.tokenId) return true;
  return !!actor.uid && current.ownerUserId === actor.uid;
}
