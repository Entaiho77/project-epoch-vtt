/**
 * Bridges the paste-parser's system-agnostic ParsedCreature to the HomebrewMonster shape the
 * library actually saves (data/homebrew.ts), so pasteParser.ts can stay free of app-level types
 * and be unit-tested on its own.
 */
import type { ParsedCreature, ParsedEntry } from './pasteParser';
import type { HomebrewFeature, HomebrewMonster, HomebrewSize } from './homebrew';

const SIZES: HomebrewSize[] = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];

/** Decimal CR back to the library's label convention ("1/8", "1", "5"). */
export function crNumberToLabel(cr: number | null): string {
  if (cr == null) return '0';
  if (cr === 0.125) return '1/8';
  if (cr === 0.25) return '1/4';
  if (cr === 0.5) return '1/2';
  return String(Math.round(cr));
}

function splitTypeLine(type: string | null): { size: HomebrewSize; type: string; alignment: string } {
  // "Medium humanoid (any race), neutral evil" -> size / type / alignment.
  const fallback = { size: 'Medium' as HomebrewSize, type: 'humanoid', alignment: 'unaligned' };
  if (!type) return fallback;
  const sizeMatch = SIZES.find((s) => type.toLowerCase().startsWith(s.toLowerCase()));
  const rest = sizeMatch ? type.slice(sizeMatch.length).trim() : type;
  const [typePart, ...alignParts] = rest.split(',');
  const alignment = alignParts.join(',').trim() || fallback.alignment;
  // Drop a parenthetical subtype, e.g. "humanoid (any race)" -> "humanoid".
  const typeName = typePart.replace(/\([^)]*\)/g, '').trim().toLowerCase() || fallback.type;
  return { size: sizeMatch ?? fallback.size, type: typeName, alignment };
}

function toFeatures(entries: ParsedEntry[]): Record<string, HomebrewFeature> {
  return Object.fromEntries(
    entries.map((e, i) => {
      const f: HomebrewFeature = { name: e.name, description: e.description };
      if (e.toHit) f.toHit = e.toHit;
      if (e.range) f.range = e.range;
      if (e.damage) f.damage = e.damage;
      if (e.dc) f.dc = e.dc;
      return [`e${i}`, f];
    }),
  );
}

/**
 * Build a HomebrewMonster ready to pass to saveHomebrewMonster. Fields the parser couldn't find
 * fall back to safe, obviously-placeholder defaults (0 HP/AC, "Medium humanoid") rather than
 * blocking the save — the preview step's warnings are what tells the DM to fix them, and direct
 * field editing (in the bestiary, afterward) is always available too.
 */
export function parsedCreatureToHomebrewMonster(c: ParsedCreature): Omit<HomebrewMonster, 'id'> {
  const { size, type, alignment } = splitTypeLine(c.type);
  const a = c.abilities;
  return {
    name: c.name || 'Unnamed Creature',
    size,
    type,
    alignment,
    hp: c.hp ?? 0,
    ac: c.ac ?? 0,
    ...(c.initiative != null ? { initiative: c.initiative } : {}),
    speed: c.speed ? Number(c.speed.match(/\d+/)?.[0] ?? 0) : 0,
    cr: crNumberToLabel(c.cr),
    str: a.str ?? 10,
    dex: a.dex ?? 10,
    con: a.con ?? 10,
    int: a.int ?? 10,
    wis: a.wis ?? 10,
    cha: a.cha ?? 10,
    damageResistances: [],
    damageImmunities: [],
    damageVulnerabilities: [],
    conditionImmunities: [],
    attacks: {},
    traits: toFeatures(c.traits),
    actions: toFeatures(c.actions),
    reactions: toFeatures(c.reactions),
    legendaryActions: toFeatures(c.legendaryActions),
    ...(c.lore ? { lore: c.lore } : {}),
  };
}
