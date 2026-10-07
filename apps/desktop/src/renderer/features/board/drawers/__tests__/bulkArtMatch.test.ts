import { describe, it, expect } from 'vitest';
import { matchCreatureFile, normalizeCreatureName } from '../bulkArtMatch';

describe('normalizeCreatureName', () => {
  it('folds case, separators, and extension', () => {
    expect(normalizeCreatureName('Dire_Wolf.png')).toBe('dire wolf');
    expect(normalizeCreatureName('dire-wolf.jpeg')).toBe('dire wolf');
    expect(normalizeCreatureName('DIRE WOLF.webp')).toBe('dire wolf');
  });

  it('drops a trailing numbered-duplicate suffix', () => {
    expect(normalizeCreatureName('Dire Wolf (2).png')).toBe('dire wolf');
    expect(normalizeCreatureName('dire_wolf_v2.png')).toBe('dire wolf');
    expect(normalizeCreatureName('dire wolf 2.png')).toBe('dire wolf');
  });

  it('strips punctuation that was not a separator', () => {
    expect(normalizeCreatureName("Will-o'-Wisp.png")).toBe('will o wisp');
  });
});

describe('matchCreatureFile', () => {
  const pool = [
    { id: '1', name: 'Dire Wolf' },
    { id: '2', name: 'Axe Beak' },
    { id: '3', name: 'Wolf' },
  ];

  it('matches an exact (normalized) name', () => {
    expect(matchCreatureFile('dire-wolf.png', pool)).toBe('1');
    expect(matchCreatureFile('Axe Beak.jpg', pool)).toBe('2');
  });

  it('matches a numbered-duplicate filename to the same creature', () => {
    expect(matchCreatureFile('dire-wolf (2).png', pool)).toBe('1');
  });

  it('returns null when nothing matches', () => {
    expect(matchCreatureFile('goblin.png', pool)).toBeNull();
  });

  it('returns null on an ambiguous fuzzy match rather than guessing', () => {
    const ambiguousPool = [
      { id: '1', name: 'Wolf' },
      { id: '2', name: 'Wolf Pup' },
    ];
    // "young wolf pup.png" contains-matches both "Wolf" and "Wolf Pup" — ambiguous, so no guess.
    expect(matchCreatureFile('young wolf pup.png', ambiguousPool)).toBeNull();
  });

  it('falls back to a unique containment match when there is no exact match', () => {
    const narrowPool = [{ id: '1', name: 'Dire Wolf' }, { id: '2', name: 'Axe Beak' }];
    expect(matchCreatureFile('dire-wolf-token-art.png', narrowPool)).toBe('1');
  });

  it('empty/unreadable filenames never match', () => {
    expect(matchCreatureFile('.png', pool)).toBeNull();
  });
});
