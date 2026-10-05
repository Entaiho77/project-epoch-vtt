import { useSyncExternalStore } from 'react';
import type { DieToShow } from './diceScene';

/**
 * 3D dice: only the person rolling sees their dice tumble; everyone else sees the result as
 * usual (roll log, pop-up card). Switchable per person, remembered on this computer. The
 * three.js code loads the first time dice are shown, so it doesn't slow down starting the app.
 */

const KEY = 'epoch.dice3d';
let enabled = (() => {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
})();
const listeners = new Set<() => void>();

export function setDice3dEnabled(on: boolean): void {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Only for this session then.
  }
  listeners.forEach((l) => l());
}

export function dice3dEnabled(): boolean {
  return enabled;
}

export function useDice3dEnabled(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => enabled,
  );
}

/** Tumble these dice over `container`; resolves once they've landed (or right away if off). */
export async function playDice(container: HTMLElement | null, dice: DieToShow[]): Promise<void> {
  if (!enabled || !container || dice.length === 0) return;
  try {
    const { showDice } = await import('./diceScene');
    await showDice(container, dice);
  } catch {
    // No 3D on this computer — the result still shows as usual.
  }
}
