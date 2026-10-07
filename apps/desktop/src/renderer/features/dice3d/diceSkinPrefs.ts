import { useSyncExternalStore } from 'react';
import { DEFAULT_DICE_SKIN, DICE_SKINS } from './diceSkins';

/**
 * Which dice set shows on THIS computer when 3D dice are on (§ playtest: "add a dice selection
 * button so players can choose a dice set that they would like to use") — remembered per
 * person, like the 3D on/off toggle and the grid look. Only one skin exists today (Stone
 * Moss); dropping a new entry into DICE_SKINS (diceSkins.ts) makes it pickable here with no
 * other changes.
 */

const KEY = 'epoch.diceSkin';

function load(): string {
  try {
    const v = localStorage.getItem(KEY);
    return v && DICE_SKINS[v] ? v : DEFAULT_DICE_SKIN;
  } catch {
    return DEFAULT_DICE_SKIN;
  }
}

let skinId = load();
const listeners = new Set<() => void>();

export function setDiceSkin(id: string): void {
  if (!DICE_SKINS[id]) return;
  skinId = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // Only for this session then.
  }
  listeners.forEach((l) => l());
}

export function diceSkin(): string {
  return skinId;
}

export function useDiceSkin(): string {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => skinId,
  );
}
