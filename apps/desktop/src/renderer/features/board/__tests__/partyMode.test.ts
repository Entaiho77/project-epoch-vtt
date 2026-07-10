import { describe, it, expect } from 'vitest';
import type { Token } from '@solryn/shared-types';
import {
  PARTY_LOCK_STALE_MS,
  isPartyScale,
  partyLockHeldByOther,
  visibleOnMap,
} from '../partyMode';

describe('isPartyScale', () => {
  it('is true only when the map type opts in', () => {
    expect(isPartyScale({ partyScale: true })).toBe(true);
    expect(isPartyScale({ partyScale: false })).toBe(false);
    expect(isPartyScale({})).toBe(false);
    expect(isPartyScale(undefined)).toBe(false);
  });
});

describe('visibleOnMap', () => {
  const tokens = [
    { id: 'hero', kind: 'character', mapId: 'm1' },
    { id: 'orc', kind: 'creature', mapId: 'm1' },
    { id: 'party', kind: 'party', mapId: 'm1' },
    { id: 'elsewhere', kind: 'character', mapId: 'm2' },
  ] as Token[];

  it('on a travel map hides character tokens, keeps the party token', () => {
    const ids = visibleOnMap(tokens, 'm1', true).map((t) => t.id);
    expect(ids).toEqual(['orc', 'party']); // hero (character) folded away
  });

  it('on a tactical map hides the party token, keeps characters', () => {
    const ids = visibleOnMap(tokens, 'm1', false).map((t) => t.id);
    expect(ids).toEqual(['hero', 'orc']); // party token not shown
  });

  it('only returns tokens on the given map', () => {
    expect(visibleOnMap(tokens, 'm2', false).map((t) => t.id)).toEqual(['elsewhere']);
  });
});

describe('partyLockHeldByOther (soft-lock)', () => {
  const now = 1_000_000;

  it('is free when unlocked or held by me', () => {
    expect(partyLockHeldByOther({}, 'me', now)).toBe(false);
    expect(partyLockHeldByOther({ draggedBy: 'me', draggedAt: now }, 'me', now)).toBe(false);
  });

  it('is held when someone else grabbed it recently', () => {
    expect(partyLockHeldByOther({ draggedBy: 'you', draggedAt: now }, 'me', now)).toBe(true);
  });

  it('self-heals once another holder’s grab goes stale', () => {
    const stale = now - PARTY_LOCK_STALE_MS - 1;
    expect(partyLockHeldByOther({ draggedBy: 'you', draggedAt: stale }, 'me', now)).toBe(false);
  });

  it('honours a lock with no timestamp (can’t prove it’s stale)', () => {
    expect(partyLockHeldByOther({ draggedBy: 'you' }, 'me', now)).toBe(true);
  });
});
