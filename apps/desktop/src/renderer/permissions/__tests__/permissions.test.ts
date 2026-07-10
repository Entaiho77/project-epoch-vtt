import { describe, it, expect } from 'vitest';
import type { Game } from '@solryn/shared-types';
import {
  canControlToken,
  canEditCharacter,
  canManageGame,
  canSeeMonsterStats,
  fogStyle,
  isGM,
  roleOf,
  tokenVisibility,
} from '../index';

const game = {
  members: {
    gm1: { role: 'gm', displayName: 'GM', joinedAt: 0 },
    p1: { role: 'player', displayName: 'Ana', joinedAt: 0 },
    p2: { role: 'player', displayName: 'Bo', joinedAt: 0 },
  },
} as unknown as Game;

describe('roles', () => {
  it('reads role from membership, not the user', () => {
    expect(roleOf(game, 'gm1')).toBe('gm');
    expect(roleOf(game, 'p1')).toBe('player');
    expect(roleOf(game, 'stranger')).toBeUndefined();
  });

  it('only the GM manages the game', () => {
    expect(isGM(game, 'gm1')).toBe(true);
    expect(canManageGame(game, 'gm1')).toBe(true);
    expect(canManageGame(game, 'p1')).toBe(false);
  });
});

describe('character editing', () => {
  it('owner edits; GM is read-only on player characters', () => {
    expect(canEditCharacter('p1', 'p1')).toBe(true);
    expect(canEditCharacter('p1', 'gm1')).toBe(false);
  });
});

describe('token control (single-owner → conflict-free)', () => {
  it('players control only their own character token', () => {
    const ana = { kind: 'character', ownerUserId: 'p1' } as const;
    expect(canControlToken(ana, 'p1', 'player')).toBe(true);
    expect(canControlToken(ana, 'p2', 'player')).toBe(false);
  });

  it('the GM controls monster/trap tokens', () => {
    const goblin = { kind: 'creature' } as const;
    expect(canControlToken(goblin, 'gm1', 'gm')).toBe(true);
    expect(canControlToken(goblin, 'p1', 'player')).toBe(false);
  });
});

describe('visibility filtering', () => {
  it('GM sees everything; only GM sees monster stats', () => {
    expect(canSeeMonsterStats('gm')).toBe(true);
    expect(canSeeMonsterStats('player')).toBe(false);
    expect(tokenVisibility({ kind: 'creature', visible: false }, 'gm1', 'gm')).toBe('full');
  });

  it('players see own=full, other player=basics, monster=name+image', () => {
    expect(tokenVisibility({ kind: 'character', ownerUserId: 'p1' }, 'p1', 'player')).toBe('full');
    expect(tokenVisibility({ kind: 'character', ownerUserId: 'p2' }, 'p1', 'player')).toBe('basics');
    expect(tokenVisibility({ kind: 'creature' }, 'p1', 'player')).toBe('name-image');
  });

  it('players do not render hidden tokens', () => {
    expect(tokenVisibility({ kind: 'creature', visible: false }, 'p1', 'player')).toBe('hidden');
  });

  it('fog renders GM semi-transparent, players opaque', () => {
    expect(fogStyle('gm')).toBe('semi-transparent');
    expect(fogStyle('player')).toBe('opaque');
  });
});
