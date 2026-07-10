import { multiUpdate, newKey, writeValue } from './realtime';
import type { RollEntry } from '@solryn/shared-types';

/**
 * Table-wide roll log. Stored as an OBJECT MAP at games/{gameId}/rollLog/{pushId} — never an
 * array (so an emptied log returns undefined, not the dropped-array crash we hit with
 * initiative). Push keys are globally time-ordered, so clients sort by key for a stable
 * newest-first order independent of client clocks.
 */

// RollEntry now lives in the shared data-model module; re-exported here for existing callers.
export type { RollEntry };

/** Keep at most this many entries in Firebase; oldest are trimmed on write. */
const CAP = 100;

export async function postRollEntry(
  gameId: string,
  entry: Omit<RollEntry, 'id'>,
): Promise<void> {
  const id = newKey(`games/${gameId}/rollLog`);
  await writeValue(`games/${gameId}/rollLog/${id}`, { ...entry, id });
}

/**
 * Trim the log to the newest CAP entries. Best-effort, called after a write: nulls the
 * oldest keys (push keys sort chronologically). Concurrent trims are harmless — nulling an
 * already-removed key is a no-op.
 */
export function trimRollLog(
  gameId: string,
  log: Record<string, RollEntry> | undefined,
): Promise<void> {
  const ids = Object.keys(log ?? {}).sort(); // chronological (oldest first)
  if (ids.length <= CAP) return Promise.resolve();
  const updates: Record<string, null> = {};
  for (const id of ids.slice(0, ids.length - CAP)) {
    updates[`/games/${gameId}/rollLog/${id}`] = null;
  }
  return multiUpdate(updates);
}

/** Clear the whole shared log (GM only — enforced by rules + UI). */
export function clearRollLog(gameId: string): Promise<void> {
  return writeValue(`games/${gameId}/rollLog`, null);
}
