/**
 * Bulk creature token art (2026-10-04 backlog item): match an uploaded file's name to a
 * creature by name, across the bestiary and the GM's homebrew monsters together. Pure logic,
 * no I/O, so it's unit-tested on its own — see bulkArtMatch.test.ts.
 */

/** "Dire_Wolf (2).png" → "dire wolf" — strip the extension, fold separators to spaces, drop a
 *  trailing "(2)"/"v2"/"2" (common when a folder has duplicates or numbered exports), and
 *  normalize case/punctuation so "Dire Wolf" and "dire-wolf" compare equal. */
export function normalizeCreatureName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[_\-.]+/g, ' ')
    .replace(/\s*\(\s*\d+\s*\)\s*$/, '')
    .replace(/\s+v?\d+$/, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** A match target: anything with an id and a display name (a BestiaryEntry, homebrew or SRD). */
export interface MatchCandidate {
  id: string;
  name: string;
}

/**
 * Best-effort match for one filename against the pool. Tries an exact normalized match first;
 * if none, falls back to a containment match (the filename's name is a superset or subset of
 * a candidate's) but only when exactly one candidate qualifies — an ambiguous fuzzy match is
 * worse than asking the GM to pick, so it returns null rather than guessing.
 */
export function matchCreatureFile(fileName: string, pool: MatchCandidate[]): string | null {
  const norm = normalizeCreatureName(fileName);
  if (!norm) return null;

  const exact = pool.find((e) => normalizeCreatureName(e.name) === norm);
  if (exact) return exact.id;

  const candidates = pool.filter((e) => {
    const n = normalizeCreatureName(e.name);
    return n.length > 0 && (norm.includes(n) || n.includes(norm));
  });
  return candidates.length === 1 ? candidates[0].id : null;
}
