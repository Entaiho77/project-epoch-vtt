import { useSyncExternalStore } from 'react';

/**
 * How the grid looks on THIS computer — each player and the GM set their own (eye strain,
 * readability). Doesn't change anyone else's view; the GM's grid on/off per map stays shared.
 */
export interface GridPrefs {
  /** Line strength, 0.05 (barely there) … 1 (solid). */
  opacity: number;
  /** Line thickness on screen, in pixels. */
  width: number;
  /** Light lines for dark maps, dark lines for light maps (measure lines follow). */
  color: 'white' | 'black';
}

export const GRID_DEFAULTS: GridPrefs = { opacity: 0.45, width: 2, color: 'white' };
const KEY = 'epoch.gridPrefs';

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function normalizeGridPrefs(v: unknown): GridPrefs {
  const o = (v && typeof v === 'object' ? v : {}) as Partial<GridPrefs>;
  return {
    opacity: typeof o.opacity === 'number' && Number.isFinite(o.opacity) ? clamp(o.opacity, 0.05, 1) : GRID_DEFAULTS.opacity,
    width: typeof o.width === 'number' && Number.isFinite(o.width) ? clamp(Math.round(o.width), 1, 4) : GRID_DEFAULTS.width,
    color: o.color === 'black' ? 'black' : 'white',
  };
}

function load(): GridPrefs {
  try {
    return normalizeGridPrefs(JSON.parse(localStorage.getItem(KEY) ?? '{}'));
  } catch {
    return GRID_DEFAULTS;
  }
}

let prefs = load();
const listeners = new Set<() => void>();

export function setGridPrefs(patch: Partial<GridPrefs>): void {
  prefs = normalizeGridPrefs({ ...prefs, ...patch });
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // Remembering is a convenience.
  }
  listeners.forEach((l) => l());
}

export function useGridPrefs(): GridPrefs {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => prefs,
  );
}

/** The canvas stroke color for the grid. */
export function gridStroke(p: GridPrefs): string {
  const rgb = p.color === 'black' ? '0, 0, 0' : '255, 255, 255';
  return `rgba(${rgb}, ${p.opacity})`;
}
