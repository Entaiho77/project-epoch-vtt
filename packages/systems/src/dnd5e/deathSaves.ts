/**
 * 5e death saving throws (SRD): at 0 HP, roll a d20 at the start of each turn.
 *   10 or higher = a success; 9 or lower = a failure.
 *   Natural 1 = two failures. Natural 20 = you regain 1 HP (and the saves reset).
 *   Three successes = stable (unconscious, no more rolls). Three failures = dead.
 *   Taking damage at 0 HP = one failure (a critical hit = two). Any healing resets the saves.
 */
export interface DeathSaves {
  successes: number;
  failures: number;
}

export type DeathState = 'dying' | 'stable' | 'dead' | 'revived';

export const NO_SAVES: DeathSaves = { successes: 0, failures: 0 };

export function deathState(ds: DeathSaves | undefined): 'dying' | 'stable' | 'dead' {
  if ((ds?.failures ?? 0) >= 3) return 'dead';
  if ((ds?.successes ?? 0) >= 3) return 'stable';
  return 'dying';
}

/** Apply one death-save roll (the d20's natural face). */
export function applyDeathSave(ds: DeathSaves | undefined, face: number): { saves: DeathSaves; state: DeathState; text: string } {
  const cur = ds ?? NO_SAVES;
  if (face === 20) return { saves: NO_SAVES, state: 'revived', text: 'natural 20 — back up with 1 HP!' };
  const saves =
    face === 1
      ? { ...cur, failures: Math.min(3, cur.failures + 2) }
      : face >= 10
        ? { ...cur, successes: Math.min(3, cur.successes + 1) }
        : { ...cur, failures: Math.min(3, cur.failures + 1) };
  const state = deathState(saves);
  const what = face === 1 ? 'natural 1 — two failures' : face >= 10 ? 'success' : 'failure';
  const tail = state === 'dead' ? ' · DEAD' : state === 'stable' ? ' · stable' : ` · ${saves.successes}✓ ${saves.failures}✗`;
  return { saves, state, text: `${what}${tail}` };
}

/** Damage taken while at 0 HP: one failure, two on a critical hit. */
export function damageAtZero(ds: DeathSaves | undefined, crit = false): DeathSaves {
  const cur = ds ?? NO_SAVES;
  return { ...cur, failures: Math.min(3, cur.failures + (crit ? 2 : 1)) };
}
