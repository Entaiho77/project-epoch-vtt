import { useSyncExternalStore } from 'react';

/**
 * How loud ambient scene audio plays on THIS computer — each person sets their own (mute it,
 * or just turn it down), same pattern as gridPrefs.ts. Never synced: the track and whether it's
 * playing are shared (MapDef.ambientAudio); how loud YOU hear it is not.
 */
const KEY = 'epoch.ambientVolume';
const DEFAULT_VOLUME = 0.6;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function normalize(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? clamp(v, 0, 1) : DEFAULT_VOLUME;
}

function load(): number {
  try {
    return normalize(JSON.parse(localStorage.getItem(KEY) ?? 'null'));
  } catch {
    return DEFAULT_VOLUME;
  }
}

let volume = load();
const listeners = new Set<() => void>();

export function setAmbientVolume(v: number): void {
  volume = normalize(v);
  try {
    localStorage.setItem(KEY, JSON.stringify(volume));
  } catch {
    // Remembering is a convenience.
  }
  listeners.forEach((l) => l());
}

export function useAmbientVolume(): number {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => volume,
  );
}
