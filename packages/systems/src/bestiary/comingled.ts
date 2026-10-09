import type { BestiaryEntry } from '@epoch/shared-types';
import { comingledBestiary as generated } from './comingled.generated';

/**
 * The comingled (dual-stat) bestiary: creatures authored once with both a 5e and a
 * Solryn stat block, tagged `systems: ['dnd5e', 'solryn']` on each entry. Source data
 * lives in data/solryn-bestiary/volume-*.json (plain-JSON exports of the Solryn Bestiary
 * PDF/text volumes); regenerate via scripts/genComingledBestiary.mjs after adding a new
 * volume file.
 *
 * Not wired into either system's `bestiary` array yet — dnd5eSystem.bestiary and
 * solrynSystem.bestiary each stay single-system for now. A game is locked to one system
 * for its whole lifetime (Game.systemId), so showing these from both sides needs a
 * decision on where they surface in the UI (merged into the existing creature picker,
 * or listed as a separate "Comingled" source) before wiring them in.
 */
export const comingledBestiary: BestiaryEntry[] = generated;

/** Comingled entries usable from a given system (checks the `systems` tag). */
export function comingledBestiaryFor(systemId: 'dnd5e' | 'solryn'): BestiaryEntry[] {
  return comingledBestiary.filter((e) => e.systems?.includes(systemId));
}

/**
 * Merges a system's own (hand-authored/SRD) bestiary with its comingled Volume One
 * creatures. Where a name collides — many Volume One creatures are richer dual-stat
 * versions of creatures that already existed as thinner stub entries — the Volume One
 * version wins and the old stub is dropped, so the picker shows one entry per creature,
 * not two.
 */
export function mergeWithComingled(ownBestiary: BestiaryEntry[], systemId: 'dnd5e' | 'solryn'): BestiaryEntry[] {
  const incoming = comingledBestiaryFor(systemId);
  const incomingNames = new Set(incoming.map((e) => e.name.toLowerCase()));
  const keptOwn = ownBestiary.filter((e) => !incomingNames.has(e.name.toLowerCase()));
  return [...keptOwn, ...incoming];
}
