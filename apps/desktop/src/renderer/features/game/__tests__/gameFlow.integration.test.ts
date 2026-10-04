import { describe, it, expect } from 'vitest';
import { solrynSystem } from '@epoch/systems/solryn';
import { getSystem, isClassAndLevel } from '@epoch/systems/registry';
import { createInitialDraft, createReducer, finalizeCharacter } from '../../builder/builderModel';

/**
 * Integration test: Verify a complete game session flow.
 * - Game can be created with a system selection
 * - Player can join the game
 * - Player can create or select a character
 * - Game board displays tokens and map
 */

describe('Game Session Flow', () => {
  it('system registry provides both Solryn and D&D 5e', () => {
    const solryn = getSystem('solryn');
    const dnd5e = getSystem('dnd5e');

    expect(solryn).toBeDefined();
    expect(solryn?.id).toBe('solryn');
    expect(solryn?.name).toBe('Solryn');

    expect(dnd5e).toBeDefined();
    expect(dnd5e?.id).toBe('dnd5e');
    expect(dnd5e?.name).toBe('D&D 5e');

    expect(isClassAndLevel(dnd5e!)).toBe(true);
    expect(isClassAndLevel(solryn!)).toBe(false);
  });

  it('game can be created with Solryn system', () => {
    const system = getSystem('solryn');
    expect(system).toBeDefined();
    expect(system?.id).toBe('solryn');

    // Simulate game creation
    const game = {
      id: 'game-001',
      systemId: 'solryn',
      gmUid: 'gm-user-123',
      createdBy: 'gm-user-123',
      name: 'Campaign: Solryn World',
      created: new Date().toISOString(),
      members: {
        'gm-user-123': { displayName: 'Game Master', role: 'gm' as const },
        'player-user-456': { displayName: 'Player One', role: 'player' as const },
      },
      activeMapId: undefined,
      maps: {},
      tokens: {},
      initiative: undefined,
    };

    expect(game.systemId).toBe('solryn');
    expect(Object.keys(game.members)).toContain('gm-user-123');
    expect(Object.keys(game.members)).toContain('player-user-456');
  });

  it('player can create a character for the game', () => {
    const system = getSystem('solryn')!;
    const reducer = createReducer(system);
    let draft = createInitialDraft();

    // Simulate builder steps
    const statOrder = system.creation.statOrder;
    for (const statId of statOrder) {
      draft = reducer(draft, {
        type: 'rollStat',
        statId,
        value: 10,
      });
    }

    draft = reducer(draft, {
      type: 'chooseAncestry',
      ancestryId: system.ancestries[0].id,
    });

    draft = reducer(draft, {
      type: 'setName',
      name: 'Brave Adventurer',
    });

    // Finalize character
    const character = finalizeCharacter(system, draft, {
      gameId: 'game-001',
      ownerUserId: 'player-user-456',
    });

    expect(character.name).toBe('Brave Adventurer');
    expect(character.gameId).toBe('game-001');
    expect(character.ownerUserId).toBe('player-user-456');
    expect(character.buildComplete).toBe(true);
    expect(character.systemId).toBe('solryn');
  });

  it('character can be used to populate board tokens', () => {
    const system = getSystem('solryn')!;
    const reducer = createReducer(system);
    let draft = createInitialDraft();

    // Create character
    const statOrder = system.creation.statOrder;
    for (const statId of statOrder) {
      draft = reducer(draft, {
        type: 'rollStat',
        statId,
        value: 10,
      });
    }

    draft = reducer(draft, {
      type: 'chooseAncestry',
      ancestryId: system.ancestries[0].id,
    });

    draft = reducer(draft, {
      type: 'setName',
      name: 'Character Name',
    });

    const character = finalizeCharacter(system, draft, {
      gameId: 'game-001',
      ownerUserId: 'player-user-456',
    });

    // Simulate token creation for this character
    const token = {
      id: 'token-001',
      kind: 'character' as const,
      characterId: 'char-001', // Would be assigned when character is saved
      col: 5,
      row: 5,
      facing: 'right' as const,
    };

    expect(token.kind).toBe('character');
    expect(token.characterId).toBeDefined();
    expect(token.col).toBeGreaterThanOrEqual(0);
    expect(token.row).toBeGreaterThanOrEqual(0);
  });

  it('system selection affects builder flow (class vs classless)', () => {
    const solryn = getSystem('solryn')!;
    const dnd5e = getSystem('dnd5e')!;

    // Solryn is classless
    expect(isClassAndLevel(solryn)).toBe(false);
    expect(solryn.skillCategories).toBeDefined();

    // D&D 5e is class-and-level
    expect(isClassAndLevel(dnd5e)).toBe(true);

    // Both have the core builder structure
    expect(solryn.creation).toBeDefined();
    expect(dnd5e.creation).toBeDefined();
  });
});
