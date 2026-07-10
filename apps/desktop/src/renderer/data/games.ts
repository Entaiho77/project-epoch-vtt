import { useEffect, useState } from 'react';
import type { Game, GameMember } from '@solryn/shared-types';
import { generateInviteCode, normalizeInviteCode } from './ids';
import {
  multiUpdate,
  newKey,
  readValue,
  subscribe,
  writeValue,
} from './realtime';
import { firebaseConfigured } from '../firebase/app';
import { requireSystem } from '@solryn/systems/registry';

/**
 * Game operations. Multi-path atomic writes keep the denormalized indexes consistent:
 *  - games/{id}              the game
 *  - inviteCodes/{CODE}      → gameId (reverse lookup for joining)
 *  - userGames/{uid}/{id}    → true   (which games a user belongs to, for the lobby)
 */

export interface Actor {
  uid: string;
  displayName: string;
}

export async function createGame(params: {
  name: string;
  systemId: string;
  owner: Actor;
}): Promise<Game> {
  const system = requireSystem(params.systemId);
  const id = newKey('games');
  const inviteCode = generateInviteCode();
  const now = Date.now();

  const game: Game = {
    id,
    name: params.name.trim(),
    systemId: system.id,
    systemName: system.name,
    systemGlyph: system.glyph,
    systemColor: system.color,
    inviteCode,
    createdBy: params.owner.uid,
    gmUid: params.owner.uid,
    createdAt: now,
    members: {
      [params.owner.uid]: {
        role: 'gm',
        displayName: params.owner.displayName,
        joinedAt: now,
      },
    },
  };

  await multiUpdate({
    [`/games/${id}`]: game,
    [`/inviteCodes/${inviteCode}`]: id,
    [`/userGames/${params.owner.uid}/${id}`]: true,
  });
  return game;
}

export async function joinGameByCode(
  rawCode: string,
  user: Actor,
): Promise<string> {
  const code = normalizeInviteCode(rawCode);
  const gameId = await readValue<string>(`inviteCodes/${code}`);
  if (!gameId) throw new Error('No game found for that invite code.');

  // If already a member the game read succeeds — leave membership (and any GM role)
  // untouched. For a non-member the read is denied by the rules, so we fall through and
  // add ourselves as a player.
  try {
    const existing = await readValue<Game>(`games/${gameId}`);
    if (existing?.members?.[user.uid]) return gameId;
  } catch {
    /* not a member yet — read denied — proceed to join */
  }

  const member: GameMember = {
    role: 'player',
    displayName: user.displayName,
    joinedAt: Date.now(),
  };
  await multiUpdate({
    [`/games/${gameId}/members/${user.uid}`]: member,
    [`/userGames/${user.uid}/${gameId}`]: true,
  });
  return gameId;
}

export function updateGameName(gameId: string, name: string): Promise<void> {
  return writeValue(`games/${gameId}/name`, name.trim());
}

/** GM grants a party-wide level-up: raise the allowed party level by one (§4.9). */
export function grantLevelUp(gameId: string, currentGrant: number): Promise<void> {
  return writeValue(`games/${gameId}/levelGrant`, currentGrant + 1);
}

/** GM sets the level newly-built characters start at (5e). Clamped to 1–20. */
export function setStartingLevel(gameId: string, level: number): Promise<void> {
  return writeValue(`games/${gameId}/startingLevel`, Math.max(1, Math.min(20, Math.round(level))));
}

/** Regenerate the invite code, invalidating the old one (for leaks / to stop joins). */
export async function regenerateInviteCode(
  gameId: string,
  oldCode: string,
): Promise<string> {
  const inviteCode = generateInviteCode();
  await multiUpdate({
    [`/inviteCodes/${oldCode}`]: null,
    [`/inviteCodes/${inviteCode}`]: gameId,
    [`/games/${gameId}/inviteCode`]: inviteCode,
  });
  return inviteCode;
}

export async function removeMember(gameId: string, uid: string): Promise<void> {
  await multiUpdate({
    [`/games/${gameId}/members/${uid}`]: null,
    [`/userGames/${uid}/${gameId}`]: null,
  });
}

/** A GM removing a member (or the legacy leave) — membership only, character preserved. */
export const leaveGame = removeMember;

/**
 * Quit a game permanently (deliberate, destructive): remove the player's membership, their
 * lobby index, their character link, AND delete their character for THIS game. All four are
 * the player's own records, so the existing rules already permit it. The soft "exit to
 * lobby" is just navigation — it writes nothing, so membership/character stay intact and
 * rejoining drops straight back in.
 */
export async function quitGame(
  gameId: string,
  uid: string,
  characterId?: string,
): Promise<void> {
  const updates: Record<string, unknown> = {
    [`/games/${gameId}/members/${uid}`]: null,
    [`/userGames/${uid}/${gameId}`]: null,
    [`/gameCharacters/${gameId}/${uid}`]: null,
  };
  if (characterId) updates[`/characters/${characterId}`] = null;
  await multiUpdate(updates);
}

export async function deleteGame(game: Game): Promise<void> {
  const updates: Record<string, unknown> = {
    [`/games/${game.id}`]: null,
    [`/inviteCodes/${game.inviteCode}`]: null,
  };
  for (const uid of Object.keys(game.members ?? {})) {
    updates[`/userGames/${uid}/${game.id}`] = null;
  }
  await multiUpdate(updates);
}

export function subscribeGame(
  gameId: string,
  cb: (game: Game | null) => void,
) {
  return subscribe<Game>(`games/${gameId}`, cb);
}

/**
 * Live list of the games a user belongs to. Subscribes to the user's game-id index, then
 * to each game, so renames/joins/leaves reflect instantly.
 */
export function useUserGames(uid: string | null): {
  games: Game[];
  loading: boolean;
} {
  const [ids, setIds] = useState<string[] | null>(null);
  const [byId, setById] = useState<Record<string, Game>>({});

  useEffect(() => {
    if (!uid || !firebaseConfigured) {
      setIds([]);
      return;
    }
    setIds(null);
    return subscribe<Record<string, boolean>>(`userGames/${uid}`, (val) => {
      setIds(val ? Object.keys(val) : []);
    });
  }, [uid]);

  const idKey = (ids ?? []).join(',');
  useEffect(() => {
    if (!ids || ids.length === 0) {
      setById({});
      return;
    }
    const unsubs = ids.map((id) =>
      subscribe<Game>(`games/${id}`, (game) => {
        setById((prev) => {
          const next = { ...prev };
          if (game) next[id] = game;
          else delete next[id];
          return next;
        });
      }),
    );
    return () => unsubs.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey]);

  const games = (ids ?? [])
    .map((id) => byId[id])
    .filter((g): g is Game => Boolean(g))
    .sort((a, b) => b.createdAt - a.createdAt);

  return { games, loading: ids === null };
}
