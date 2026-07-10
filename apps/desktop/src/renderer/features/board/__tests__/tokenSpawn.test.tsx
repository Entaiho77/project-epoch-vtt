import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Character, Game } from '@solryn/shared-types';
import { dnd5eSystem } from '@solryn/systems/dnd5e/index';

// Spy on the token writer; stub heavy children so BoardScreen commits and its effects run.
const addToken = vi.fn().mockResolvedValue('tok');
vi.mock('../../../data/board', () => ({
  addToken: (...a: unknown[]) => addToken(...a),
  updateToken: vi.fn(), removeToken: vi.fn(), moveToken: vi.fn(), markLootGiven: vi.fn(),
}));
vi.mock('../BoardCanvas', () => ({ BoardCanvas: () => null }));
vi.mock('../BoardShell', () => ({ BoardShell: () => null }));
vi.mock('../TokenCard', () => ({ TokenCard: () => null }));
vi.mock('../TokenContextMenu', () => ({ TokenContextMenu: () => null }));
vi.mock('../InitiativeTracker', () => ({ InitiativeTracker: () => null }));
vi.mock('../../rolllog/rollLog', () => ({ RollLog: () => null, useRollLog: () => ({ postRoll: vi.fn() }) }));

import { BoardScreen } from '../BoardScreen';

const character = (id: string): Character => ({
  id, gameId: 'g1', ownerUserId: 'u1', systemId: 'dnd5e', name: id, buildComplete: true,
  definition: { ancestryId: 'human', classId: 'fighter', coreScores: { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 }, chosenSkillIds: ['athletics'], knownSpellIds: [] },
  play: { level: 1, reputation: 'Unaligned', pools: { hp: { current: 12 } }, skills: {}, equippedWeaponIds: ['longsword'] },
});
const game: Game = {
  id: 'g1', name: 'G', systemId: 'dnd5e', systemName: 'D&D', systemGlyph: 'd', systemColor: '#000',
  inviteCode: 'X', createdBy: 'gm1', createdAt: 0,
  members: { u1: { role: 'player', displayName: 'P', joinedAt: 0 } },
  activeMapId: 'm1',
  maps: { m1: { id: 'm1', name: 'M', typeId: 'battlemap', imageUrl: '', width: 500, height: 500, gridSize: 50, gridVisible: true } },
  tokens: {},
};
const spawnedIds = () => addToken.mock.calls.map((c) => (c[1] as { characterId?: string }).characterId);
const settle = () => new Promise((r) => setTimeout(r, 10));

describe('player character token auto-spawn', () => {
  beforeEach(() => addToken.mockClear());

  it('spawns a token when a new player lands on the board', async () => {
    render(<BoardScreen system={dnd5eSystem} game={game} role="player" uid="u1" character={character('charA')} />, { wrapper: MemoryRouter });
    await settle();
    expect(spawnedIds()).toContain('charA');
  });

  it('spawns a token for a replacement character on a still-mounted board (regression)', async () => {
    const { rerender } = render(<BoardScreen system={dnd5eSystem} game={game} role="player" uid="u1" character={character('charA')} />, { wrapper: MemoryRouter });
    await settle();
    // The player's character is replaced (new id) without the board unmounting.
    rerender(<BoardScreen system={dnd5eSystem} game={game} role="player" uid="u1" character={character('charB')} />);
    await settle();
    // Previously the map was already "attempted" from charA, so charB got no token.
    expect(spawnedIds()).toContain('charB');
  });

  it('does not double-spawn the same character while the write is in flight', async () => {
    // tokens stays empty (write not yet synced back) across a re-render with the same character.
    const { rerender } = render(<BoardScreen system={dnd5eSystem} game={game} role="player" uid="u1" character={character('charA')} />, { wrapper: MemoryRouter });
    await settle();
    rerender(<BoardScreen system={dnd5eSystem} game={{ ...game }} role="player" uid="u1" character={character('charA')} />);
    await settle();
    expect(spawnedIds().filter((id) => id === 'charA')).toHaveLength(1);
  });
});
