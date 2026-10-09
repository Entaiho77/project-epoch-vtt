/**
 * Paste-parser core (Paste-Parser Feature Specification, 2026-10-09; see claude/CHANGE_REQUESTS.md).
 *
 * Turns a 5e-style stat block (plain text, after OCR/extraction and the DM's own review-and-edit
 * pass) into a structured creature. Regex and pattern matching only — no AI, no network call —
 * per the spec's "Decided" list. The DM's highlights ("marks") resolve ambiguity the regex alone
 * can't: a lore mark pulls text out of the mechanical parse entirely, and a toHit/range/damage/dc
 * mark tags a piece of an action or reaction's text without trying to guess which words they are.
 *
 * Output is a system-agnostic ParsedCreature, not a HomebrewMonster — this module has no
 * knowledge of the save/library shape, so it can be unit-tested on its own. See
 * parsedCreatureToHomebrewMonster (pasteParserAdapter.ts) for the one place that bridges the two.
 */

export type HighlightKind = 'lore' | 'toHit' | 'range' | 'damage' | 'dc';
const MECH_KINDS: HighlightKind[] = ['toHit', 'range', 'damage', 'dc'];

/** A DM highlight: a span of the (already-reviewed) input text, and what it means. */
export interface Highlight {
  start: number;
  end: number;
  kind: HighlightKind;
}

export interface ParsedEntry {
  name: string;
  description: string;
  toHit?: string;
  range?: string;
  damage?: string;
  dc?: string;
}

export interface ParsedCreature {
  name: string;
  /** Size + type + alignment line, kept as one string (e.g. "Medium humanoid, neutral evil"). */
  type: string | null;
  ac: number | null;
  initiative: number | null;
  hp: number | null;
  hpDice: string | null;
  speed: string | null;
  abilities: { str: number | null; dex: number | null; con: number | null; int: number | null; wis: number | null; cha: number | null };
  skills: string[];
  senses: string | null;
  languages: string | null;
  /** Decimal CR (0.125 for 1/8, etc.) so it sorts/compares the same way the rest of the app does. */
  cr: number | null;
  lore: string | null;
  traits: ParsedEntry[];
  actions: ParsedEntry[];
  reactions: ParsedEntry[];
  legendaryActions: ParsedEntry[];
}

export interface ParseResult {
  creature: ParsedCreature | null;
  /** Things the DM should check in the preview. Nothing is ever silently guessed. */
  warnings: string[];
}

const SIZE_RE = /^(Tiny|Small|Medium|Large|Huge|Gargantuan)\b/i;
type SectionKey = 'traits' | 'actions' | 'reactions' | 'legendaryActions';
const SECTION_KEYS: Record<string, SectionKey> = {
  'traits': 'traits',
  'special traits': 'traits',
  'actions': 'actions',
  'reactions': 'reactions',
  'legendary actions': 'legendaryActions',
};
const SECTION_RE = /^(Traits|Special Traits|Actions|Reactions|Legendary Actions)\s*:?$/i;
// Plain-pasted text loses bold formatting, so an entry name is recognized as a short run of
// Title-Case words (optionally joined by small connector words) ending in a period.
const SMALL = 'of|the|and|a|an|in|to|on|for|with|from';
const BOLD_RE = /^\*\*(.+?)\*\*\s*(.*)$/;
const PLAIN_RE = new RegExp(
  "^([A-Z][A-Za-z'’\\-]*(?:\\s+(?:[A-Z][A-Za-z'’\\-]*|" + SMALL + "))*)\\.(?:\\s+(.*))?$",
);
const ABILITIES: Array<[keyof ParsedCreature['abilities'], string]> = [
  ['str', 'STR'], ['dex', 'DEX'], ['con', 'CON'], ['int', 'INT'], ['wis', 'WIS'], ['cha', 'CHA'],
];

/** "1/8" -> 0.125, "5" -> 5. Returns null for anything that isn't a plain number or fraction. */
export function parseCrFraction(s: string): number | null {
  const m = String(s).trim().match(/^(\d+)(?:\/(\d+))?$/);
  if (!m) return null;
  return m[2] ? Number(m[1]) / Number(m[2]) : Number(m[1]);
}

function blankRanges(text: string, ranges: Array<{ start: number; end: number }>): string {
  const chars = text.split('');
  for (const { start, end } of ranges) {
    for (let i = start; i < end && i < chars.length; i++) {
      if (chars[i] !== '\n') chars[i] = ' ';
    }
  }
  return chars.join('');
}

interface Line { raw: string; start: number; end: number; content: string }

function splitLines(text: string): Line[] {
  const out: Line[] = [];
  let pos = 0;
  for (const raw of text.split('\n')) {
    out.push({ raw, start: pos, end: pos + raw.length, content: raw.replace(/\s+/g, ' ').trim() });
    pos += raw.length + 1;
  }
  return out.filter((l) => l.content !== '');
}

function parseAbilities(header: string[]): ParsedCreature['abilities'] {
  const result: Partial<ParsedCreature['abilities']> = {};
  const hi = header.findIndex((l) => /\bSTR\b/i.test(l) && /\bDEX\b/i.test(l) && /\bCON\b/i.test(l));
  if (hi >= 0) {
    // Scores sit on the line(s) right after the header: "10 (+0) 16 (+3) ..." or "10 16 ...".
    for (const line of header.slice(hi + 1, hi + 3)) {
      const withMods = [...line.matchAll(/(\d{1,2})\s*\(\s*[+-]?\d+\s*\)/g)].map((m) => Number(m[1]));
      const plain = [...line.matchAll(/\b(\d{1,2})\b/g)].map((m) => Number(m[1]));
      const nums = withMods.length >= 6 ? withMods : plain.length >= 6 ? plain : null;
      if (nums) {
        ABILITIES.forEach(([key], i) => { (result as any)[key] = nums[i]; });
        return result as ParsedCreature['abilities'];
      }
    }
  }
  const joined = header.join('\n');
  for (const [key, label] of ABILITIES) {
    const m = joined.match(new RegExp('\\b' + label + '\\b\\s*:?\\s*(\\d{1,2})', 'i'));
    (result as any)[key] = m ? Number(m[1]) : null;
  }
  return result as ParsedCreature['abilities'];
}

interface RawEntry { name: string; parts: string[]; start: number; end: number }

function parseEntries(lines: Line[], warnings: string[]): Array<ParsedEntry & { _start: number; _end: number }> {
  const entries: RawEntry[] = [];
  let cur: RawEntry | null = null;
  for (const l of lines) {
    let name: string | null = null;
    let body = '';
    const bold = l.content.match(BOLD_RE);
    const plain = !bold && l.content.match(PLAIN_RE);
    if (bold) {
      name = bold[1].replace(/\.$/, '').trim();
      body = bold[2] || '';
    } else if (plain && plain[1].split(' ').length <= 6) {
      name = plain[1].trim();
      body = plain[2] || '';
    }
    if (name) {
      cur = { name, parts: [body], start: l.start, end: l.end };
      entries.push(cur);
    } else if (cur) {
      cur.parts.push(l.content);
      cur.end = l.end;
    } else {
      warnings.push(`Text before the first entry was skipped: "${l.content.slice(0, 60)}"`);
    }
  }
  return entries.map((e) => ({
    name: e.name,
    description: e.parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim(),
    _start: e.start,
    _end: e.end,
  }));
}

/**
 * Parse a reviewed stat block into a ParsedCreature.
 * @param input The DM-reviewed text (after OCR/extraction, after their own edits).
 * @param marks The DM's highlights. Offsets are into `input` after \r\n is normalized to \n —
 *   callers building marks from a <textarea> selection should normalize the same way first.
 */
export function parseStatBlock(input: string, marks: Highlight[] = []): ParseResult {
  const warnings: string[] = [];
  const src = String(input ?? '').replace(/\r\n?/g, '\n');

  for (const m of marks) {
    if (m.kind !== 'lore' && !MECH_KINDS.includes(m.kind)) {
      warnings.push(`Unknown highlight kind "${m.kind}" was ignored.`);
    }
  }

  const loreRanges = marks.filter((m) => m.kind === 'lore');
  const lore = loreRanges.map((m) => src.slice(m.start, m.end).trim()).filter(Boolean).join('\n\n');
  const work = blankRanges(src, loreRanges);

  const lines = splitLines(work);
  if (lines.length === 0) {
    return { creature: null, warnings: ['Nothing to parse.'] };
  }

  const name = lines[0].content;
  const header: string[] = [];
  const sectionLines: Partial<Record<SectionKey, Line[]>> = {};
  let current: SectionKey | null = null;
  for (const l of lines.slice(1)) {
    const sec = l.content.match(SECTION_RE);
    if (sec) {
      current = SECTION_KEYS[sec[1].toLowerCase()];
      sectionLines[current] = sectionLines[current] || [];
      continue;
    }
    if (current) sectionLines[current]!.push(l);
    else header.push(l.content);
  }

  const field = (label: string): string | null => {
    const re = new RegExp('^(?:' + label + ')\\s*:?\\s*(.*)$', 'i');
    for (const line of header) {
      const m = line.match(re);
      if (m) return m[1].trim();
    }
    return null;
  };

  const typeLine = header.find((l) => SIZE_RE.test(l)) ?? null;
  const acText = field('Armor Class|AC');
  const acMatch = acText?.match(/^(\d+)/);
  const hpText = field('Hit Points|HP');
  const hpMatch = hpText?.match(/^(\d+)\s*(?:\(([^)]*)\))?/);
  const crText = field('Challenge');
  const crMatch = crText?.match(/^(\d+(?:\/\d+)?)/);
  const initMatch = header.join('\n').match(/Initiative\s*:?\s*([+-]?\d+)/i);
  const skillsText = field('Skills');

  const entriesBySection: Partial<Record<SectionKey, Array<ParsedEntry & { _start: number; _end: number }>>> = {};
  const allEntries: Array<ParsedEntry & { _start: number; _end: number }> = [];
  for (const key of Object.keys(sectionLines) as SectionKey[]) {
    entriesBySection[key] = parseEntries(sectionLines[key]!, warnings);
    allEntries.push(...entriesBySection[key]!);
  }

  // Attach DM highlights for to-hit, range, damage, DC to the entry that contains them.
  for (const m of marks) {
    if (m.kind === 'lore' || !MECH_KINDS.includes(m.kind)) continue;
    const owner = allEntries.find((e) => m.start >= e._start && m.start < e._end);
    const snippet = src.slice(m.start, m.end).trim();
    if (!owner) {
      warnings.push(`Highlighted ${m.kind} text is not inside an action or reaction: "${snippet.slice(0, 60)}"`);
      continue;
    }
    const key = m.kind as 'toHit' | 'range' | 'damage' | 'dc';
    owner[key] = owner[key] ? `${owner[key]}, ${snippet}` : snippet;
  }

  const clean = (e: ParsedEntry & { _start: number; _end: number }): ParsedEntry => {
    const out: ParsedEntry = { name: e.name, description: e.description };
    if (e.toHit) out.toHit = e.toHit;
    if (e.range) out.range = e.range;
    if (e.damage) out.damage = e.damage;
    if (e.dc) out.dc = e.dc;
    return out;
  };
  const list = (key: SectionKey): ParsedEntry[] => (entriesBySection[key] ?? []).map(clean);

  const creature: ParsedCreature = {
    name,
    type: typeLine,
    ac: acMatch ? Number(acMatch[1]) : null,
    initiative: initMatch ? Number(initMatch[1]) : null,
    hp: hpMatch ? Number(hpMatch[1]) : null,
    hpDice: hpMatch?.[2] ? hpMatch[2].trim() : null,
    speed: field('Speed'),
    abilities: parseAbilities(header),
    skills: skillsText ? skillsText.split(/,\s*/).map((s) => s.trim()).filter(Boolean) : [],
    senses: field('Senses'),
    languages: field('Languages'),
    cr: crMatch ? parseCrFraction(crMatch[1]) : null,
    lore: lore || null,
    traits: list('traits'),
    actions: list('actions'),
    reactions: list('reactions'),
    legendaryActions: list('legendaryActions'),
  };

  const check: Record<string, unknown> = { type: creature.type, ac: creature.ac, hp: creature.hp, cr: creature.cr };
  for (const [k, v] of Object.entries(check)) {
    if (v == null) warnings.push(`Could not find ${k}.`);
  }
  for (const [key, label] of ABILITIES) {
    if (creature.abilities[key] == null) warnings.push(`Could not find ${label}.`);
  }
  if (creature.actions.length === 0 && creature.reactions.length === 0) {
    warnings.push('No actions or reactions found.');
  }

  return { creature, warnings };
}
