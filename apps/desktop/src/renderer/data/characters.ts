import { useEffect, useState } from 'react';
import type { Character, CharacterPlayState, CharacterSkillState } from '@solryn/shared-types';
import type { InventoryItem } from './homebrew';
import {
  multiUpdate,
  newKey,
  subscribe,
  updateValue,
  writeValue,
} from './realtime';
import { firebaseConfigured } from '../firebase/app';

/**
 * Character data layer. One character per player per game; the
 * gameCharacters/{gameId}/{uid} index lets a game look up "my character" cheaply.
 * A character splits immutable `definition` (built once) from mutable `play` state.
 */

export async function createCharacter(
  character: Omit<Character, 'id'> & { id?: string },
): Promise<Character> {
  const id = character.id ?? newKey('characters');
  const full: Character = { ...character, id };
  await multiUpdate({
    [`/characters/${id}`]: full,
    [`/gameCharacters/${full.gameId}/${full.ownerUserId}`]: id,
  });
  return full;
}

/** Patch the mutable play-state (HP/pools, equipped, skills, etc.). */
export function updateCharacterPlay(
  characterId: string,
  patch: Partial<CharacterPlayState>,
): Promise<void> {
  return updateValue(`characters/${characterId}/play`, patch as Record<string, unknown>);
}

// --- Fine-grained play-state writes (the live subscription reflects them back) ---

export function setPoolCurrent(
  characterId: string,
  poolId: string,
  current: number,
): Promise<void> {
  return writeValue(`characters/${characterId}/play/pools/${poolId}/current`, current);
}

/** GM grants (or clears) a milestone level-up for a character. Writes only the flag leaf so the
 *  GM security rule for characters/{id}/play/levelUpPending applies. */
export function setLevelUpPending(characterId: string, pending: boolean): Promise<void> {
  return writeValue(`characters/${characterId}/play/levelUpPending`, pending);
}

/**
 * Apply a completed 5e level-up atomically: new level, bumped HP, ASI'd scores, spell gains, and
 * refreshed slots — and clear the pending flag — in one multi-path update on characters/{id}.
 * (Solryn's classless level-up ceremony is the separate applyLevelUp below.)
 */
export function applyLevelUp5e(
  characterId: string,
  result: {
    level: number;
    hpCurrent: number;
    coreScores: Record<string, number>;
    knownSpellIds: string[];
    spellbookSpellIds?: string[];
    spellSlots?: Record<number, number>;
    subclassId?: string;
    featIds?: string[];
    featChoices?: Record<string, string>;
  },
): Promise<void> {
  const paths: Record<string, unknown> = {
    [`/characters/${characterId}/play/level`]: result.level,
    [`/characters/${characterId}/play/levelUpPending`]: false,
    [`/characters/${characterId}/play/pools/hp/current`]: result.hpCurrent,
    [`/characters/${characterId}/definition/coreScores`]: result.coreScores,
    [`/characters/${characterId}/definition/knownSpellIds`]: result.knownSpellIds,
  };
  if (result.spellbookSpellIds) paths[`/characters/${characterId}/definition/spellbookSpellIds`] = result.spellbookSpellIds;
  if (result.spellSlots) paths[`/characters/${characterId}/play/spellSlots`] = result.spellSlots;
  if (result.subclassId) paths[`/characters/${characterId}/play/subclassId`] = result.subclassId;
  if (result.featIds) paths[`/characters/${characterId}/play/featIds`] = result.featIds;
  if (result.featChoices) paths[`/characters/${characterId}/play/featChoices`] = result.featChoices;
  return multiUpdate(paths);
}

/** Set (or clear) the active concentration spell (5e). Null ends concentration. */
export function setConcentrating(
  characterId: string,
  value: { spellId: string; spellName: string } | null,
): Promise<void> {
  return writeValue(`characters/${characterId}/play/concentrating`, value);
}

/** Set a character's subclass (5e). Owner-written from the level-up flow or the sheet prompt. */
export function setSubclass(characterId: string, subclassId: string): Promise<void> {
  return writeValue(`characters/${characterId}/play/subclassId`, subclassId);
}

/** Set a character's total XP (5e). GM-awarded — see the play/xp security rule. */
export function setXp(characterId: string, xp: number): Promise<void> {
  return writeValue(`characters/${characterId}/play/xp`, Math.max(0, Math.round(xp)));
}

/** Set the remaining count of a feat's resource pool (5e), e.g. Lucky luck points. Owner-written. */
export function setFeatResource(
  characterId: string,
  resourceId: string,
  current: number,
): Promise<void> {
  return writeValue(`characters/${characterId}/play/featResources/${resourceId}`, Math.max(0, current));
}

/** Set the remaining slot count for one spell level (5e). Object-keyed under play.spellSlots. */
export function setSpellSlot(
  characterId: string,
  slotLevel: number,
  current: number,
): Promise<void> {
  return writeValue(`characters/${characterId}/play/spellSlots/${slotLevel}`, current);
}

/** Recover all slots to their maxima (long rest). Writes the whole object at once. */
export function restoreSpellSlots(
  characterId: string,
  maxSlots: Record<number, number>,
): Promise<void> {
  return writeValue(`characters/${characterId}/play/spellSlots`, maxSlots);
}

export function setSkillState(
  characterId: string,
  skillId: string,
  state: CharacterSkillState,
): Promise<void> {
  return writeValue(`characters/${characterId}/play/skills/${skillId}`, state);
}

export function setUnspentSkillPoints(
  characterId: string,
  n: number,
): Promise<void> {
  return writeValue(`characters/${characterId}/play/unspentSkillPoints`, n);
}

export function setLoadedSpell(
  characterId: string,
  spellId: string,
): Promise<void> {
  return writeValue(`characters/${characterId}/play/loadedSpellId`, spellId);
}

// --- Inventory (Phase B1: looted homebrew equipment) -------------------------
// Stored at characters/$id/inventory/$itemId. The owning player may write their own inventory
// (parent owner rule); the GM may write any character's inventory (the inventory GM-write rule)
// to distribute loot.

/** Add a (snapshotted) item to a character's inventory. Returns the new inventory-record id. */
export async function giveInventoryItem(
  characterId: string,
  item: Omit<InventoryItem, 'id'>,
): Promise<string> {
  const id = newKey(`characters/${characterId}/inventory`);
  await writeValue(`characters/${characterId}/inventory/${id}`, { ...item, id });
  return id;
}

/** Toggle an inventory item's equipped flag (raw single-leaf write). */
export function setInventoryEquipped(
  characterId: string,
  itemId: string,
  equipped: boolean,
): Promise<void> {
  return writeValue(`characters/${characterId}/inventory/${itemId}/equipped`, equipped);
}

/**
 * Equip (or unequip) an inventory item, enforcing 5e slot limits (Phase B2): equipping a body
 * armor auto-unequips any other equipped body armor, and equipping a shield auto-unequips any
 * other equipped shield — one of each at a time (shields still stack with armor). Weapons are
 * unrestricted. Atomic multi-path write so the swap can't leave two armors equipped.
 */
export function equipInventoryItem(
  characterId: string,
  inventory: Record<string, InventoryItem>,
  itemId: string,
  equip: boolean,
): Promise<void> {
  const target = inventory[itemId];
  const updates: Record<string, unknown> = {
    [`/characters/${characterId}/inventory/${itemId}/equipped`]: equip,
  };
  if (equip && target?.category === 'armor') {
    const isShield = target.armorType === 'shield';
    for (const other of Object.values(inventory)) {
      if (other.id === itemId || other.category !== 'armor' || !other.equipped) continue;
      if ((other.armorType === 'shield') === isShield) {
        updates[`/characters/${characterId}/inventory/${other.id}/equipped`] = false;
      }
    }
  }
  return multiUpdate(updates);
}

/** Discard an inventory item. */
export function removeInventoryItem(characterId: string, itemId: string): Promise<void> {
  return writeValue(`characters/${characterId}/inventory/${itemId}`, null);
}

/** Apply a completed level-up: new core scores, level, refreshed pools, +skill points. */
export function applyLevelUp(
  characterId: string,
  data: {
    coreScores: Record<string, number>;
    level: number;
    pools: Record<string, { current: number }>;
    unspentSkillPoints: number;
  },
): Promise<void> {
  return multiUpdate({
    [`/characters/${characterId}/definition/coreScores`]: data.coreScores,
    [`/characters/${characterId}/play/level`]: data.level,
    [`/characters/${characterId}/play/pools`]: data.pools,
    [`/characters/${characterId}/play/unspentSkillPoints`]: data.unspentSkillPoints,
  });
}

/** Set (or clear) a character's round token art. */
export function setCharacterImage(
  characterId: string,
  imageUrl: string | null,
): Promise<void> {
  return writeValue(`characters/${characterId}/imageUrl`, imageUrl);
}

/**
 * Live characterId → art-URL map for every character in a game, so the board can resolve
 * art for any player's token (not just the viewer's own). Subscribes to the game's
 * character index, then to each character's `imageUrl`.
 */
export function useGameCharacterArt(gameId: string | null): Record<string, string> {
  const [ids, setIds] = useState<string[]>([]);
  const [art, setArt] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!gameId || !firebaseConfigured) {
      setIds([]);
      return;
    }
    return subscribe<Record<string, string>>(`gameCharacters/${gameId}`, (val) =>
      setIds(val ? Object.values(val) : []),
    );
  }, [gameId]);

  useEffect(() => {
    if (!firebaseConfigured || ids.length === 0) {
      setArt({});
      return;
    }
    const unsubs = ids.map((id) =>
      subscribe<string>(`characters/${id}/imageUrl`, (url) =>
        setArt((prev) => {
          if (url) return { ...prev, [id]: url };
          if (!(id in prev)) return prev;
          const next = { ...prev };
          delete next[id];
          return next;
        }),
      ),
    );
    return () => unsubs.forEach((u) => u());
  }, [ids.join(',')]);

  return art;
}

/** Live "my character" for a game (or null if none yet). */
export function useGameCharacter(
  gameId: string | null,
  uid: string | null,
): { character: Character | null; loading: boolean } {
  // undefined = index still resolving; null = no character; string = id
  const [charId, setCharId] = useState<string | null | undefined>(undefined);
  const [character, setCharacter] = useState<Character | null>(null);
  const [charLoading, setCharLoading] = useState(false);

  useEffect(() => {
    if (!gameId || !uid || !firebaseConfigured) {
      setCharId(null);
      return;
    }
    setCharId(undefined);
    return subscribe<string>(`gameCharacters/${gameId}/${uid}`, (v) =>
      setCharId(v ?? null),
    );
  }, [gameId, uid]);

  useEffect(() => {
    if (charId === undefined) return; // index still resolving
    if (!charId) {
      setCharacter(null);
      setCharLoading(false);
      return;
    }
    setCharLoading(true);
    return subscribe<Character>(`characters/${charId}`, (c) => {
      setCharacter(c);
      setCharLoading(false);
    });
  }, [charId]);

  return { character, loading: charId === undefined || charLoading };
}

/** Live list of every character in a game (via the gameCharacters index) — GM tools (e.g. the
 *  level-up grant panel) enumerate players' characters with this. */
export function useGameCharacters(gameId: string | null): Character[] {
  const [index, setIndex] = useState<Record<string, string>>({}); // uid → characterId
  const [chars, setChars] = useState<Record<string, Character>>({}); // characterId → Character

  useEffect(() => {
    if (!gameId || !firebaseConfigured) {
      setIndex({});
      return;
    }
    return subscribe<Record<string, string>>(`gameCharacters/${gameId}`, (v) => setIndex(v ?? {}));
  }, [gameId]);

  const ids = Object.values(index);
  const idsKey = [...ids].sort().join(',');
  useEffect(() => {
    if (!firebaseConfigured || ids.length === 0) {
      setChars({});
      return;
    }
    const unsubs = ids.map((id) =>
      subscribe<Character>(`characters/${id}`, (c) =>
        setChars((prev) => {
          if (!c) {
            const next = { ...prev };
            delete next[id];
            return next;
          }
          return { ...prev, [id]: c };
        }),
      ),
    );
    return () => unsubs.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return Object.values(chars);
}
