import { useEffect, useState } from 'react';
import { newKey, subscribe, writeValue } from './realtime';
import { firebaseConfigured } from '../firebase/app';

/** A GM's saved custom creature/trap, reusable across their games (per §4.11). */
export interface SavedCreature {
  id: string;
  name: string;
  category: 'creature' | 'trap';
  stats: Record<string, number | string>;
  /** Round token art (Firebase Storage URL or inline data URL). */
  imageUrl?: string;
}

export async function saveCreature(
  uid: string,
  creature: Omit<SavedCreature, 'id'>,
): Promise<string> {
  const id = newKey(`users/${uid}/creatures`);
  await writeValue(`users/${uid}/creatures/${id}`, { ...creature, id });
  return id;
}

export function deleteCreature(uid: string, id: string): Promise<void> {
  return writeValue(`users/${uid}/creatures/${id}`, null);
}

/** Set (or clear) a saved creature's token art. */
export function setSavedCreatureImage(
  uid: string,
  id: string,
  imageUrl: string | null,
): Promise<void> {
  return writeValue(`users/${uid}/creatures/${id}/imageUrl`, imageUrl);
}

// --- Per-GM bestiary art -----------------------------------------------------
// Static bestiary creatures can't carry a field in code, so their default token art lives
// in a Firebase map keyed by creatureId, scoped to the GM (set once → applies across all
// of that GM's games). The board resolves it via the game's owner (createdBy) uid.

export function setCreatureArt(
  uid: string,
  creatureId: string,
  imageUrl: string | null,
): Promise<void> {
  return writeValue(`users/${uid}/creatureArt/${creatureId}`, imageUrl);
}

/** Live creatureId → art-URL map for a GM (pass the game's owner uid on the board). */
export function useCreatureArt(uid: string | null): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!uid || !firebaseConfigured) {
      setMap({});
      return;
    }
    return subscribe<Record<string, string>>(
      `users/${uid}/creatureArt`,
      (val) => setMap(val ?? {}),
    );
  }, [uid]);
  return map;
}

export function useMyCreatures(uid: string | null): SavedCreature[] {
  const [list, setList] = useState<SavedCreature[]>([]);
  useEffect(() => {
    if (!uid || !firebaseConfigured) {
      setList([]);
      return;
    }
    return subscribe<Record<string, SavedCreature>>(
      `users/${uid}/creatures`,
      (val) => setList(val ? Object.values(val) : []),
    );
  }, [uid]);
  return list;
}
