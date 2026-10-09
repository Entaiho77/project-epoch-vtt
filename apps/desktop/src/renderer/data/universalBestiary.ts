/**
 * The DM Tools "universal bestiary" — every creature the DM can see from one place, across
 * both systems and both sources: the built-in SRD/Solryn bestiaries and the DM's own homebrew
 * (Matthew, voice, 2026-10-09: "if you have a D&D 5e monster and a Solryn monster, they live
 * in the same area"). A dual-stat comingled creature (tagged for both systems) is shown once,
 * not twice.
 *
 * Only homebrew entries are editable here — the SRD/comingled bestiary is read-only content
 * the app ships with.
 */
import { dnd5eSystem } from '@epoch/systems/dnd5e/index';
import { solrynSystem } from '@epoch/systems/solryn/index';
import type { BestiaryEntry } from '@epoch/shared-types';
import { homebrewList, homebrewToBestiaryEntry, solrynHomebrewList, type HomebrewMonster, type Library } from './homebrew';

export type BestiarySource = 'srd' | 'comingled' | 'homebrew-5e' | 'homebrew-solryn';

export interface UniversalBestiaryEntry {
  entry: BestiaryEntry;
  source: BestiarySource;
  /** Which system(s) this entry shows up under (for display, not filtering — the DM sees one
   *  universal list regardless of which game system it belongs to). */
  systems: Array<'dnd5e' | 'solryn'>;
  /** Only set for a homebrew-5e entry — the raw monster, for the direct-edit form. */
  homebrew?: HomebrewMonster;
  /** The CR/TR label shown in search and in the list — "2", "1/4", or Solryn's "Easy", etc. */
  crLabel: string;
  /** Free-form creature type/category shown in search and in the list. */
  typeLabel: string;
}

function crLabelOf(e: BestiaryEntry): string {
  return String(e.stats.crLabel ?? e.stats.cr ?? e.stats.threatLevel ?? '—');
}

function typeLabelOf(e: BestiaryEntry): string {
  return String(e.stats.type ?? '—');
}

/** Build the universal bestiary from the app's two built-in SRD bestiaries plus the DM's
 *  homebrew library. Pass `library` as null/undefined before it has loaded — you'll just get
 *  the built-in content until it does. */
export function buildUniversalBestiary(library: Library | null | undefined): UniversalBestiaryEntry[] {
  const bySystem = new Map<string, Array<'dnd5e' | 'solryn'>>();
  const track = (id: string, systemId: 'dnd5e' | 'solryn') => {
    const existing = bySystem.get(id);
    if (existing) existing.push(systemId);
    else bySystem.set(id, [systemId]);
  };
  dnd5eSystem.bestiary.forEach((e) => track(e.id, 'dnd5e'));
  solrynSystem.bestiary.forEach((e) => track(e.id, 'solryn'));

  const seen = new Set<string>();
  const srdEntries: UniversalBestiaryEntry[] = [];
  for (const e of [...dnd5eSystem.bestiary, ...solrynSystem.bestiary]) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    const systems = bySystem.get(e.id) ?? [];
    srdEntries.push({
      entry: e,
      source: systems.length > 1 ? 'comingled' : 'srd',
      systems,
      crLabel: crLabelOf(e),
      typeLabel: typeLabelOf(e),
    });
  }

  const homebrew5e = homebrewList(library?.monsters).map((hb): UniversalBestiaryEntry => {
    const entry = homebrewToBestiaryEntry(hb);
    return { entry, source: 'homebrew-5e', systems: ['dnd5e'], homebrew: hb, crLabel: hb.cr, typeLabel: hb.type };
  });

  const homebrewSolryn = solrynHomebrewList(library?.solrynMonsters).map((entry): UniversalBestiaryEntry => ({
    entry,
    source: 'homebrew-solryn',
    systems: ['solryn'],
    crLabel: crLabelOf(entry),
    typeLabel: typeLabelOf(entry),
  }));

  return [...homebrew5e, ...homebrewSolryn, ...srdEntries].sort((a, b) => a.entry.name.localeCompare(b.entry.name));
}

export type BestiarySearchField = 'name' | 'type' | 'cr';

/** Filter the universal bestiary by a single query string, checked against whichever fields
 *  are toggled on (the "little squares" checkbox row, per the voice discussion). An empty
 *  query or no fields toggled returns everything. */
export function filterUniversalBestiary(
  entries: UniversalBestiaryEntry[],
  query: string,
  fields: Set<BestiarySearchField>,
): UniversalBestiaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q || fields.size === 0) return entries;
  return entries.filter((e) => {
    if (fields.has('name') && e.entry.name.toLowerCase().includes(q)) return true;
    if (fields.has('type') && e.typeLabel.toLowerCase().includes(q)) return true;
    if (fields.has('cr') && e.crLabel.toLowerCase().includes(q)) return true;
    return false;
  });
}
