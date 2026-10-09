import { describe, it, expect } from 'vitest';
import { parseStatBlock, parseCrFraction, type Highlight } from '../pasteParser';
import { parsedCreatureToHomebrewMonster, crNumberToLabel } from '../pasteParserAdapter';

// SYNTHETIC fixture with invented names — not a copyrighted stat block.
const FIXTURE = [
  'Test Cultist',
  'Medium humanoid (any race), neutral evil',
  'Armor Class 14 (natural armor)',
  'Hit Points 45 (6d8 + 18)',
  'Speed 30 ft.',
  'STR DEX CON INT WIS CHA',
  '10 (+0) 16 (+3) 16 (+3) 12 (+1) 14 (+2) 9 (-1)',
  'Skills Deception +3, Religion +3',
  'Senses passive Perception 12',
  'Languages Common, Deep Speech',
  'Challenge 2 (450 XP)',
  '',
  'Traits',
  'Hollow Zeal. The cultist has advantage on saving throws against being charmed.',
  '',
  'Actions',
  'Multiattack. The cultist makes two dagger attacks.',
  'Dagger. Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 5 (1d4 + 3) piercing damage.',
  'Whispers. The cultist targets one creature it can see within 30 feet. The target must succeed on a',
  'DC 12 Wisdom saving throw or take 7 (2d6) psychic damage.',
  '',
  'Reactions',
  'Ward Against Light. When a creature the cultist can see hits it with an attack, the cultist can impose',
  'disadvantage on that attack.',
  '',
  'The cultists pursue quiet, forbidden knowledge in the dark places of the realm.',
].join('\n');

function mark(text: string, substring: string, kind: Highlight['kind']): Highlight {
  const start = text.indexOf(substring);
  expect(start).toBeGreaterThanOrEqual(0);
  return { start, end: start + substring.length, kind };
}

const LORE = 'The cultists pursue quiet, forbidden knowledge in the dark places of the realm.';

describe('parseStatBlock', () => {
  it('extracts fields, abilities, skills, and CR from a plain paste', () => {
    const { creature } = parseStatBlock(FIXTURE);
    expect(creature?.name).toBe('Test Cultist');
    expect(creature?.type).toBe('Medium humanoid (any race), neutral evil');
    expect(creature?.ac).toBe(14);
    expect(creature?.hp).toBe(45);
    expect(creature?.hpDice).toBe('6d8 + 18');
    expect(creature?.speed).toBe('30 ft.');
    expect(creature?.abilities).toEqual({ str: 10, dex: 16, con: 16, int: 12, wis: 14, cha: 9 });
    expect(creature?.skills).toEqual(['Deception +3', 'Religion +3']);
    expect(creature?.senses).toBe('passive Perception 12');
    expect(creature?.languages).toBe('Common, Deep Speech');
    expect(creature?.cr).toBe(2);
    expect(creature?.initiative).toBeNull();
  });

  it('splits entries on "Name." and joins continuation lines', () => {
    const { creature } = parseStatBlock(FIXTURE, [mark(FIXTURE, LORE, 'lore')]);
    expect(creature?.traits.map((t) => t.name)).toEqual(['Hollow Zeal']);
    expect(creature?.actions.map((a) => a.name)).toEqual(['Multiattack', 'Dagger', 'Whispers']);
    const whispers = creature?.actions[2];
    expect(whispers?.description).toBe(
      'The cultist targets one creature it can see within 30 feet. The target must succeed on a DC 12 Wisdom saving throw or take 7 (2d6) psychic damage.',
    );
    expect(creature?.reactions.map((r) => r.name)).toEqual(['Ward Against Light']);
  });

  it('removes a lore highlight from the stat parse and stores it as written', () => {
    const { creature, warnings } = parseStatBlock(FIXTURE, [mark(FIXTURE, LORE, 'lore')]);
    expect(creature?.lore).toBe(LORE);
    expect(warnings).toEqual([]);
  });

  it('routes toHit/damage highlights to the entry that contains them, and no other', () => {
    const marks: Highlight[] = [
      mark(FIXTURE, LORE, 'lore'),
      mark(FIXTURE, '+5 to hit', 'toHit'),
      mark(FIXTURE, '5 (1d4 + 3) piercing damage', 'damage'),
    ];
    const { creature, warnings } = parseStatBlock(FIXTURE, marks);
    const dagger = creature?.actions.find((a) => a.name === 'Dagger');
    expect(dagger?.toHit).toBe('+5 to hit');
    expect(dagger?.damage).toBe('5 (1d4 + 3) piercing damage');
    expect(dagger?.range).toBeUndefined();
    expect(creature?.actions.find((a) => a.name === 'Multiattack')?.toHit).toBeUndefined();
    expect(warnings).toEqual([]);
  });

  it('routes a DC highlight on a save-based action', () => {
    const marks: Highlight[] = [mark(FIXTURE, LORE, 'lore'), mark(FIXTURE, 'DC 12', 'dc')];
    const { creature } = parseStatBlock(FIXTURE, marks);
    expect(creature?.actions.find((a) => a.name === 'Whispers')?.dc).toBe('DC 12');
  });

  it('accepts bold markdown names as well as plain Name.', () => {
    const text = [
      'Bold Test', 'Medium humanoid, neutral', 'Armor Class 12', 'Hit Points 9 (2d8)', 'Speed 30 ft.',
      'STR DEX CON INT WIS CHA', '8 (-1) 14 (+2) 11 (+0) 10 (+0) 10 (+0) 10 (+0)', 'Challenge 1/8 (25 XP)',
      'Actions', '**Club.** Melee Weapon Attack: +2 to hit.',
    ].join('\n');
    const { creature } = parseStatBlock(text);
    expect(creature?.actions[0].name).toBe('Club');
    expect(creature?.actions[0].description).toBe('Melee Weapon Attack: +2 to hit.');
    expect(creature?.cr).toBe(0.125);
  });

  it('reports missing fields rather than guessing them', () => {
    const text = 'Mystery Thing\nLarge beast\nHit Points 30\nSpeed 40 ft.\nChallenge 3\nActions\nBite. Melee Weapon Attack: +5 to hit.';
    const { creature, warnings } = parseStatBlock(text);
    expect(creature?.ac).toBeNull();
    expect(creature?.abilities.str).toBeNull();
    expect(warnings).toContain('Could not find ac.');
    expect(warnings).toContain('Could not find STR.');
  });

  it('warns when a highlight falls outside any entry', () => {
    const text = 'Mystery Thing\nLarge beast\nArmor Class 13\nHit Points 30 (4d10 + 8)\nSpeed 40 ft.\nChallenge 3\nActions\nBite. Melee Weapon Attack: +5 to hit.';
    const { warnings } = parseStatBlock(text, [mark(text, 'Large beast', 'toHit')]);
    expect(warnings.some((w) => w.startsWith('Highlighted toHit text is not inside'))).toBe(true);
  });
});

describe('parseCrFraction', () => {
  it('parses fractions and whole numbers', () => {
    expect(parseCrFraction('1/8')).toBe(0.125);
    expect(parseCrFraction('1/4')).toBe(0.25);
    expect(parseCrFraction('1/2')).toBe(0.5);
    expect(parseCrFraction('12')).toBe(12);
  });
});

describe('crNumberToLabel', () => {
  it('round-trips the common fractions', () => {
    expect(crNumberToLabel(0.125)).toBe('1/8');
    expect(crNumberToLabel(0.25)).toBe('1/4');
    expect(crNumberToLabel(0.5)).toBe('1/2');
    expect(crNumberToLabel(8)).toBe('8');
    expect(crNumberToLabel(null)).toBe('0');
  });
});

describe('parsedCreatureToHomebrewMonster', () => {
  it('maps a fully-parsed creature onto the HomebrewMonster shape', () => {
    const { creature } = parseStatBlock(FIXTURE, [
      mark(FIXTURE, LORE, 'lore'),
      mark(FIXTURE, '+5 to hit', 'toHit'),
      mark(FIXTURE, '5 (1d4 + 3) piercing damage', 'damage'),
    ]);
    const hb = parsedCreatureToHomebrewMonster(creature!);
    expect(hb.name).toBe('Test Cultist');
    expect(hb.size).toBe('Medium');
    expect(hb.type).toBe('humanoid');
    expect(hb.alignment).toBe('neutral evil');
    expect(hb.ac).toBe(14);
    expect(hb.hp).toBe(45);
    expect(hb.speed).toBe(30);
    expect(hb.cr).toBe('2');
    expect(hb.dex).toBe(16);
    expect(hb.lore).toBe(LORE);
    const dagger = Object.values(hb.actions).find((a) => a.name === 'Dagger');
    expect(dagger?.toHit).toBe('+5 to hit');
    expect(dagger?.damage).toBe('5 (1d4 + 3) piercing damage');
    expect(Object.values(hb.reactions!).map((r) => r.name)).toEqual(['Ward Against Light']);
  });

  it('falls back to safe placeholders for fields the parser could not find', () => {
    const text = 'Mystery Thing\nLarge beast\nHit Points 30\nSpeed 40 ft.\nChallenge 3\nActions\nBite. Melee Weapon Attack: +5 to hit.';
    const { creature } = parseStatBlock(text);
    const hb = parsedCreatureToHomebrewMonster(creature!);
    expect(hb.ac).toBe(0);
    expect(hb.str).toBe(10);
    expect(hb.size).toBe('Large');
  });
});
