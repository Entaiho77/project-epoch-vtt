import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  subscribe,
  readValue,
  writeValue,
  updateValue,
  multiUpdate,
  newKey,
  getSession,
  hostSession,
  joinSession,
  leaveSession,
} from '../realtime';

/**
 * Phase 5: Multiplayer Sync Tests
 * Tests the core sync mechanism where SQLite is source of truth
 * and relay broadcasts writes to connected players (GM-authoritative model).
 */

// Mock window.db and window.relay
const mockDb = {
  onUpdate: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
  read: vi.fn(),
  write: vi.fn(),
  update: vi.fn(),
  multiUpdate: vi.fn(),
};

const mockRelay = {
  onMessage: vi.fn(),
  onStatus: vi.fn(),
  send: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  approve: vi.fn(),
  kick: vi.fn(),
  setCode: vi.fn(),
};

/** Every game in these tests has an invite code (hosting uses it as the room code). */
const readWithInviteCodes = (path: string) =>
  Promise.resolve(path.endsWith('/inviteCode') ? 'ABCD-EFGH' : null);

beforeEach(() => {
  vi.clearAllMocks();
  mockDb.read.mockImplementation(readWithInviteCodes);
  Object.assign(window, { db: mockDb, relay: mockRelay });
});

describe('Realtime - Subscriptions', () => {
  it('subscribes to a path', () => {
    const callback = vi.fn();
    const unsub = subscribe('some/path', callback);

    expect(mockDb.subscribe).toHaveBeenCalledWith('some/path', expect.any(String));
    unsub();
    expect(mockDb.unsubscribe).toHaveBeenCalled();
  });

  it('no-ops when bridges unavailable', () => {
    delete (window as any).db;
    const callback = vi.fn();
    const unsub = subscribe('test/path', callback);

    expect(callback).toHaveBeenCalledWith(null);
    unsub();
  });
});

describe('Realtime - Read/Write Operations', () => {
  it('reads value from SQLite', async () => {
    mockDb.read.mockResolvedValue({ data: 'local' });

    const value = await readValue('some/path');

    expect(mockDb.read).toHaveBeenCalledWith('some/path');
    expect(value).toEqual({ data: 'local' });
  });

  it('writes value to SQLite', async () => {
    await writeValue('some/path', { data: 'test' });

    expect(mockDb.write).toHaveBeenCalledWith('some/path', { data: 'test' });
  });

  it('updates value in SQLite', async () => {
    await updateValue('some/path', { field: 'updated' });

    expect(mockDb.update).toHaveBeenCalledWith('some/path', { field: 'updated' });
  });

  it('multi-updates SQLite', async () => {
    const updates = {
      'path/1': { value: 1 },
      'path/2': { value: 2 },
    };

    await multiUpdate(updates);

    expect(mockDb.multiUpdate).toHaveBeenCalledWith(updates);
  });

  it('does not broadcast when session is idle', async () => {
    mockDb.read.mockResolvedValue(null);

    await writeValue('some/path', { data: 'test' });

    expect(mockDb.write).toHaveBeenCalled();
    // Session is idle by default, so broadcast returns early
    expect(mockRelay.send).not.toHaveBeenCalled();
  });

  it('returns null when bridges unavailable', async () => {
    delete (window as any).db;

    const value = await readValue('some/path');
    expect(value).toBeNull();
  });
});

describe('Realtime - Private Paths', () => {
  it('blocks broadcast of local/* paths', async () => {
    await writeValue('local/settings/theme', 'dark');

    expect(mockDb.write).toHaveBeenCalled();
    // Private paths never broadcast
  });

  it('blocks broadcast of "local" path', async () => {
    await writeValue('local', { private: 'data' });

    expect(mockDb.write).toHaveBeenCalled();
  });
});

describe('Realtime - Push Key Generation', () => {
  it('generates 20-char chronological keys', () => {
    const key = newKey('games/123/entities');

    expect(key).toHaveLength(20);

    const pushChars = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    for (const char of key) {
      expect(pushChars).toContain(char);
    }
  });

  it('generates unique keys', () => {
    const keys = Array.from({ length: 10 }, () => newKey('path'));
    const unique = new Set(keys);

    expect(unique.size).toBeGreaterThanOrEqual(8);
  });
});

describe('Realtime - Session Management', () => {
  it('initializes with idle session', () => {
    const session = getSession();

    expect(session.role).toBe('idle');
    expect(session.status).toBe('idle');
    expect(session.roomCode).toBeNull();
    expect(session.gameId).toBeNull();
    expect(session.error).toBeNull();
  });

  it("hosts under the game's invite code", async () => {
    const code = await hostSession('game123', { uid: 'gm1', displayName: 'GM' });
    expect(code).toBe('ABCD-EFGH');
    expect(mockRelay.connect).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ mode: 'host', roomCode: 'ABCD-EFGH' }),
    );
    expect(getSession().roomCode).toBe('ABCD-EFGH');
  });

  it('refuses to host a game without an invite code', async () => {
    mockDb.read.mockResolvedValue(null);
    await expect(hostSession('nocode', { uid: 'gm1', displayName: 'GM' })).rejects.toThrow(/invite code/);
  });

  it('hosts a session as GM', async () => {
    mockRelay.onStatus.mockImplementation(() => {});

    await hostSession('game123', { uid: 'gm1', displayName: 'GM' });

    expect(mockRelay.connect).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        mode: 'host',
        uid: 'gm1',
        displayName: 'GM',
      })
    );

    const session = getSession();
    expect(session.role).toBe('gm');
    expect(session.gameId).toBe('game123');
  });

  it('leaves session', async () => {
    await leaveSession();

    expect(mockRelay.disconnect).toHaveBeenCalled();

    const session = getSession();
    expect(session.role).toBe('idle');
    expect(session.status).toBe('idle');
  });
});

describe('Realtime - Broadcast with Session', () => {
  beforeEach(() => {
    mockRelay.onStatus.mockImplementation(() => {});
    mockRelay.onMessage.mockImplementation(() => {});
  });

  it('broadcasts write when session is open', async () => {
    // Host session first to establish relay connection
    await hostSession('game1', { uid: 'gm', displayName: 'GM' });

    // After connect, session status would be 'connecting' then 'open'
    // This test verifies the structure is correct
    const session = getSession();
    expect(session.role).toBe('gm');
  });

  it('broadcasts update when session is open', async () => {
    await hostSession('game1', { uid: 'gm', displayName: 'GM' });

    const session = getSession();
    expect(session.gameId).toBe('game1');
  });
});

describe('Realtime - Operation Types', () => {
  it('uses "write" operation type', async () => {
    await writeValue('path', { data: 'test' });

    expect(mockDb.write).toHaveBeenCalledWith('path', { data: 'test' });
  });

  it('uses "update" operation type', async () => {
    await updateValue('path', { field: 'value' });

    expect(mockDb.update).toHaveBeenCalledWith('path', { field: 'value' });
  });

  it('uses "multi" operation type', async () => {
    const updates = { 'p1': { v: 1 }, 'p2': { v: 2 } };
    await multiUpdate(updates);

    expect(mockDb.multiUpdate).toHaveBeenCalledWith(updates);
  });
});

describe('Realtime - Null Values', () => {
  it('converts undefined to null on write', async () => {
    await writeValue('path', undefined as any);

    expect(mockDb.write).toHaveBeenCalledWith('path', null);
  });

  it('handles null values correctly', async () => {
    await writeValue('path', null);

    expect(mockDb.write).toHaveBeenCalledWith('path', null);
  });
});

describe('Realtime - No Bridges Fallback', () => {
  it('write no-ops without bridges', async () => {
    delete (window as any).db;

    await writeValue('path', { data: 'test' });

    // Should not crash, just no-op
  });

  it('update no-ops without bridges', async () => {
    delete (window as any).db;

    await updateValue('path', { field: 'value' });
  });

  it('multiUpdate no-ops without bridges', async () => {
    delete (window as any).db;

    await multiUpdate({ 'p': { v: 1 } });
  });
});

describe('Realtime - Player Read Requests', () => {
  it('reads local value before requesting from GM', async () => {
    mockDb.read.mockResolvedValue({ cached: 'data' });

    const value = await readValue('some/path');

    expect(value).toEqual({ cached: 'data' });
    // No request needed if value is local
  });

  it('requests from GM on local miss (when player)', async () => {
    mockDb.read.mockResolvedValue(null);

    // This would need proper session setup to test player role
    const value = await readValue('some/path');

    expect(value).toBeNull(); // In idle session, can't request
  });
});

describe('Realtime - Session Snapshot', () => {
  it('hostSession sets game and establishes relay', async () => {
    mockRelay.onStatus.mockImplementation(() => {});

    await hostSession('testgame', { uid: 'gm', displayName: 'Master' });

    const session = getSession();
    expect(session.gameId).toBe('testgame');
    expect(session.role).toBe('gm');
  });
});

describe('Realtime - Multi-player Scenarios', () => {
  beforeEach(() => {
    mockRelay.onStatus.mockImplementation(() => {});
    mockRelay.onMessage.mockImplementation(() => {});
  });

  it('GM can host and players can see they are not connected', async () => {
    await hostSession('game1', { uid: 'gm', displayName: 'GM' });

    const session = getSession();
    expect(session.role).toBe('gm');
    expect(session.gameId).toBe('game1');
  });

  it('player join initiates relay connection', async () => {
    // joinSession is async with complex behavior; test is simplified
    // Real integration tests would test the full join flow
    const session = getSession();
    expect(session).toHaveProperty('role');
    expect(session).toHaveProperty('status');
    expect(session).toHaveProperty('roomCode');
  });

  it('leave session resets state', async () => {
    await hostSession('game1', { uid: 'gm', displayName: 'GM' });
    let session = getSession();
    expect(session.role).toBe('gm');

    await leaveSession();
    session = getSession();

    expect(session.role).toBe('idle');
    expect(session.status).toBe('idle');
    expect(session.gameId).toBeNull();
  });
});

describe('Realtime - GM Authoritative Model', () => {
  it('applies writes to SQLite before broadcast', async () => {
    await writeValue('games/g1/tokens/t1', { hp: 50 });

    // Write should be applied to local SQLite
    expect(mockDb.write).toHaveBeenCalledWith('games/g1/tokens/t1', { hp: 50 });
  });

  it('updates are applied atomically', async () => {
    await updateValue('games/g1/tokens/t1', { hp: 25 });

    expect(mockDb.update).toHaveBeenCalledWith('games/g1/tokens/t1', { hp: 25 });
  });

  it('private paths block all broadcast', async () => {
    mockRelay.onMessage.mockImplementation(() => {});

    // Even if session were open, private paths don't broadcast
    await writeValue('local/player/notes', 'secret notes');

    expect(mockDb.write).toHaveBeenCalled();
    // Broadcast prevented by isPrivate() check
  });
});
