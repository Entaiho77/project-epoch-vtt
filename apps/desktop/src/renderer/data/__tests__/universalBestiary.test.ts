import { describe, it, expect } from 'vitest';
import { buildUniversalBestiary, filterUniversalBestiary, type BestiarySearchField } from '../universalBestiary';
import type { HomebrewMonster } from '../homebrew';
import type { Library } from '../homebrew';

function hb(over: Partial<HomebrewMonster> = {}): HomebrewMonster {
  return {
    id: 'hb1', name: 'Gloom Stalker', size: 'Medium', type: 'monstrosity', alignment: 'neutral evil',
    hp: 45, ac: 15, speed: 40, cr: '3',
    str: 16, dex: 18, con: 14, int: 8, wis: 12, cha: 6,
    damageResistances: [], damageImmunities: [], damageVulnerabilities: [], conditionImmunities: [],
    attacks: {}, traits: {}, actions: {}, legendaryActions: {},
    ...over,
  };
}

describe('buildUniversalBestiary', () => {
  it('includes built-in SRD/Solryn creatures even with no library loaded', () => {
    const list = buildUniversalBestiary(null);
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((e) => e.source === 'srd' || e.source === 'comingled')).toBe(true);
  });

  it('adds the DM\'s homebrew 5e and Solryn monsters, each tagged and editable only for homebrew', () => {
    const library: Library = {
      monsters: { m0: hb({ id: 'm0', name: 'Zzzyxx the Homebrewed' }) },
      solrynMonsters: {
        s0: { id: 's0', name: 'Aaaa Solryn Thing', category: 'creature', stats: { hp: 10, dr: 0, type: 'Beast', threatLevel: 'Easy' } },
      },
    };
    const list = buildUniversalBestiary(library);
    const brewed5e = list.find((e) => e.entry.name === 'Zzzyxx the Homebrewed');
    expect(brewed5e?.source).toBe('homebrew-5e');
    expect(brewed5e?.homebrew?.id).toBe('m0');
    const brewedSolryn = list.find((e) => e.entry.name === 'Aaaa Solryn Thing');
    expect(brewedSolryn?.source).toBe('homebrew-solryn');
    expect(brewedSolryn?.homebrew).toBeUndefined();
    // SRD entries carry no `homebrew` and aren't editable from this view.
    const srd = list.find((e) => e.source === 'srd');
    expect(srd?.homebrew).toBeUndefined();
  });

  it('sorts the merged list by name', () => {
    const library: Library = { monsters: { m0: hb({ id: 'm0', name: 'Zzzyxx the Homebrewed' }) } };
    const list = buildUniversalBestiary(library);
    const names = list.map((e) => e.entry.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});

describe('filterUniversalBestiary', () => {
  const library: Library = { monsters: { m0: hb({ id: 'm0', name: 'Zzzyxx the Homebrewed', type: 'ooze', cr: '7' }) } };
  const list = buildUniversalBestiary(library);

  it('returns everything when the query is empty', () => {
    expect(filterUniversalBestiary(list, '', new Set(['name']))).toHaveLength(list.length);
    expect(filterUniversalBestiary(list, 'zzzyxx', new Set())).toHaveLength(list.length);
  });

  it('matches only the toggled fields', () => {
    const byName = filterUniversalBestiary(list, 'zzzyxx', new Set<BestiarySearchField>(['name']));
    expect(byName.map((e) => e.entry.name)).toEqual(['Zzzyxx the Homebrewed']);

    const byType = filterUniversalBestiary(list, 'ooze', new Set<BestiarySearchField>(['type']));
    expect(byType.some((e) => e.entry.name === 'Zzzyxx the Homebrewed')).toBe(true);

    // "ooze" shouldn't match when only searching CR.
    const wrongField = filterUniversalBestiary(list, 'ooze', new Set<BestiarySearchField>(['cr']));
    expect(wrongField.some((e) => e.entry.name === 'Zzzyxx the Homebrewed')).toBe(false);
  });

  it('matches CR/TR labels', () => {
    const byCr = filterUniversalBestiary(list, '7', new Set<BestiarySearchField>(['cr']));
    expect(byCr.some((e) => e.entry.name === 'Zzzyxx the Homebrewed')).toBe(true);
  });
});
