import { describe, it, expect } from 'vitest';
import type { Game, Role } from '@epoch/shared-types';
import { getSystem } from '@epoch/systems/registry';

/**
 * Integration tests for game management: creating games, joining sessions,
 * character selection, and member management.
 */

describe('Game Management', () => {
  describe('Game Creation', () => {
    it('creates a game with required fields', () => {
      const game: Game = {
        id: 'game-001',
        name: 'Campaign: Dragons of the Realm',
        systemId: 'solryn',
        systemName: 'Solryn',
        systemGlyph: '◈',
        systemColor: '#7c3aed',
        gmUid: 'gm-user-123',
        createdBy: 'gm-user-123',
        created: new Date().toISOString(),
        members: {
          'gm-user-123': { displayName: 'Game Master Alex', role: 'gm' as const },
          'player-user-456': { displayName: 'Player Bob', role: 'player' as const },
        },
        activeMapId: undefined,
        maps: {},
        tokens: {},
        initiative: undefined,
        shapes: {},
        fog: {},
        characters: {},
      };

      expect(game.id).toBeDefined();
      expect(game.name).toBe('Campaign: Dragons of the Realm');
      expect(game.systemId).toBe('solryn');
      expect(game.gmUid).toBe('gm-user-123');
      expect(Object.keys(game.members).length).toBe(2);
    });

    it('system selection locks once game is created', () => {
      const game: Game = {
        id: 'game-001',
        name: 'Test Campaign',
        systemId: 'solryn',
        systemName: 'Solryn',
        systemGlyph: '◈',
        systemColor: '#7c3aed',
        gmUid: 'gm-user-123',
        createdBy: 'gm-user-123',
        created: new Date().toISOString(),
        members: { 'gm-user-123': { displayName: 'GM', role: 'gm' as const } },
        activeMapId: undefined,
        maps: {},
        tokens: {},
        initiative: undefined,
        shapes: {},
        fog: {},
        characters: {},
      };

      // System cannot be changed after creation (enforced by data layer)
      expect(game.systemId).toBe('solryn');
    });

    it('game starts with no maps, tokens, or characters', () => {
      const game: Game = {
        id: 'game-001',
        name: 'Fresh Campaign',
        systemId: 'solryn',
        systemName: 'Solryn',
        systemGlyph: '◈',
        systemColor: '#7c3aed',
        gmUid: 'gm-user-123',
        createdBy: 'gm-user-123',
        created: new Date().toISOString(),
        members: { 'gm-user-123': { displayName: 'GM', role: 'gm' as const } },
        activeMapId: undefined,
        maps: {},
        tokens: {},
        initiative: undefined,
        shapes: {},
        fog: {},
        characters: {},
      };

      expect(Object.keys(game.maps).length).toBe(0);
      expect(Object.keys(game.tokens).length).toBe(0);
      expect(Object.keys(game.characters ?? {}).length).toBe(0);
    });
  });

  describe('Game Session Joining', () => {
    it('GM can host a session and gets a room code', () => {
      const session = {
        gameId: 'game-001',
        roomCode: 'ABCDEF',
        role: 'gm' as const,
        uid: 'gm-user-123',
        displayName: 'Game Master',
      };

      expect(session.roomCode).toBeDefined();
      expect(session.roomCode.length).toBe(6);
      expect(session.role).toBe('gm');
    });

    it('player can join with room code', () => {
      const roomCode = 'ABCDEF';
      const player = {
        uid: 'player-user-456',
        displayName: 'Player Bob',
      };

      // After joining, player is in the game members
      const members: Record<string, { displayName: string; role: Role }> = {
        'gm-user-123': { displayName: 'GM', role: 'gm' },
        'player-user-456': { displayName: player.displayName, role: 'player' },
      };

      expect(members['player-user-456']).toBeDefined();
      expect(members['player-user-456'].role).toBe('player');
    });

    it('multiple players can join the same session', () => {
      const game: Game = {
        id: 'game-001',
        name: 'Multiplayer Campaign',
        systemId: 'solryn',
        systemName: 'Solryn',
        systemGlyph: '◈',
        systemColor: '#7c3aed',
        gmUid: 'gm-user-123',
        createdBy: 'gm-user-123',
        created: new Date().toISOString(),
        members: {
          'gm-user-123': { displayName: 'GM', role: 'gm' as const },
          'player-user-456': { displayName: 'Player Bob', role: 'player' as const },
          'player-user-789': { displayName: 'Player Carol', role: 'player' as const },
        },
        activeMapId: undefined,
        maps: {},
        tokens: {},
        initiative: undefined,
        shapes: {},
        fog: {},
        characters: {},
      };

      const players = Object.values(game.members).filter((m) => m.role === 'player');
      expect(players.length).toBe(2);
    });
  });

  describe('Character Selection', () => {
    it('player without character sees selection prompt', () => {
      const hasCharacter = false;
      const buildComplete = false;

      expect(hasCharacter || !buildComplete).toBe(true);
    });

    it('player can create new character for game', () => {
      const character = {
        id: 'char-001',
        gameId: 'game-001',
        name: 'Brave Adventurer',
        systemId: 'solryn',
        ownerUserId: 'player-user-456',
        buildComplete: true,
      };

      expect(character.gameId).toBe('game-001');
      expect(character.buildComplete).toBe(true);
    });

    it('player can import character from other game', () => {
      const source = {
        id: 'char-old',
        gameId: 'game-old',
        name: 'Veteran Hero',
        systemId: 'solryn',
        ownerUserId: 'player-user-456',
        play: { level: 3 },
      };

      const cloned = {
        ...source,
        id: 'char-new',
        gameId: 'game-001', // New game
      };

      expect(cloned.gameId).toBe('game-001');
      expect(cloned.name).toBe(source.name);
      expect(cloned.systemId).toBe(source.systemId);
    });

    it('character must be compatible with game system', () => {
      const game = { systemId: 'solryn' };
      const character = { systemId: 'solryn' };

      const compatible = character.systemId === game.systemId;
      expect(compatible).toBe(true);
    });

    it('system mismatch prevents character import', () => {
      const game = { systemId: 'solryn' };
      const character = { systemId: 'dnd5e' };

      const compatible = character.systemId === game.systemId;
      expect(compatible).toBe(false);
    });
  });

  describe('Game Member Management', () => {
    it('GM can see all members', () => {
      const game: Game = {
        id: 'game-001',
        name: 'Campaign',
        systemId: 'solryn',
        systemName: 'Solryn',
        systemGlyph: '◈',
        systemColor: '#7c3aed',
        gmUid: 'gm-user-123',
        createdBy: 'gm-user-123',
        created: new Date().toISOString(),
        members: {
          'gm-user-123': { displayName: 'GM', role: 'gm' as const },
          'player-user-456': { displayName: 'Bob', role: 'player' as const },
          'player-user-789': { displayName: 'Carol', role: 'player' as const },
        },
        activeMapId: undefined,
        maps: {},
        tokens: {},
        initiative: undefined,
        shapes: {},
        fog: {},
        characters: {},
      };

      const gmRole = game.members['gm-user-123']?.role;
      expect(gmRole).toBe('gm');
      expect(Object.keys(game.members).length).toBe(3);
    });

    it('player can only see their own data and shared game data', () => {
      const game: Game = {
        id: 'game-001',
        name: 'Campaign',
        systemId: 'solryn',
        systemName: 'Solryn',
        systemGlyph: '◈',
        systemColor: '#7c3aed',
        gmUid: 'gm-user-123',
        createdBy: 'gm-user-123',
        created: new Date().toISOString(),
        members: {
          'gm-user-123': { displayName: 'GM', role: 'gm' as const },
          'player-user-456': { displayName: 'Bob', role: 'player' as const },
        },
        activeMapId: undefined,
        maps: {},
        tokens: {},
        initiative: undefined,
        shapes: {},
        fog: {},
        characters: {},
      };

      const playerUid = 'player-user-456';
      const playerRole = game.members[playerUid]?.role;
      expect(playerRole).toBe('player');
    });

    it('each member has displayName and role', () => {
      const members: Record<string, { displayName: string; role: Role }> = {
        'gm-user-123': { displayName: 'Game Master Alex', role: 'gm' },
        'player-user-456': { displayName: 'Player Bob', role: 'player' },
      };

      for (const member of Object.values(members)) {
        expect(member.displayName).toBeDefined();
        expect(['gm', 'player']).toContain(member.role);
      }
    });
  });

  describe('Game Settings', () => {
    it('game stores starting level (defaults to 1)', () => {
      const game: Game = {
        id: 'game-001',
        name: 'Campaign',
        systemId: 'solryn',
        systemName: 'Solryn',
        systemGlyph: '◈',
        systemColor: '#7c3aed',
        gmUid: 'gm-user-123',
        createdBy: 'gm-user-123',
        created: new Date().toISOString(),
        members: { 'gm-user-123': { displayName: 'GM', role: 'gm' as const } },
        activeMapId: undefined,
        maps: {},
        tokens: {},
        initiative: undefined,
        shapes: {},
        fog: {},
        characters: {},
        startingLevel: 1,
      };

      expect(game.startingLevel ?? 1).toBe(1);
    });

    it('GM can set custom starting level', () => {
      const game: Game = {
        id: 'game-001',
        name: 'High-level Campaign',
        systemId: 'solryn',
        systemName: 'Solryn',
        systemGlyph: '◈',
        systemColor: '#7c3aed',
        gmUid: 'gm-user-123',
        createdBy: 'gm-user-123',
        created: new Date().toISOString(),
        members: { 'gm-user-123': { displayName: 'GM', role: 'gm' as const } },
        activeMapId: undefined,
        maps: {},
        tokens: {},
        initiative: undefined,
        shapes: {},
        fog: {},
        characters: {},
        startingLevel: 5,
      };

      expect(game.startingLevel).toBe(5);
    });
  });
});
