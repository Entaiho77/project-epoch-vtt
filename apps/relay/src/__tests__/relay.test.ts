import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { WebSocket } from 'ws';
import { startRelay, type Relay } from '../server';
import type { ClientMessage, ServerMessage } from '../protocol';

/**
 * A buffered WebSocket test client: it records every server message, so `waitFor` can match
 * against already-received messages OR pending ones — no listen-before-send races.
 */
class TestClient {
  private readonly buffer: ServerMessage[] = [];
  private readonly waiters: { predicate: (m: ServerMessage) => boolean; resolve: (m: ServerMessage) => void }[] = [];

  private constructor(private readonly ws: WebSocket) {
    ws.on('message', (raw) => this.onMessage(JSON.parse(raw.toString()) as ServerMessage));
  }

  static open(port: number): Promise<TestClient> {
    const ws = new WebSocket(`ws://127.0.0.1:${port}`);
    return new Promise((resolve, reject) => {
      ws.once('open', () => resolve(new TestClient(ws)));
      ws.once('error', reject);
    });
  }

  private onMessage(msg: ServerMessage): void {
    const i = this.waiters.findIndex((w) => w.predicate(msg));
    if (i >= 0) this.waiters.splice(i, 1)[0].resolve(msg);
    else this.buffer.push(msg);
  }

  waitFor<T extends ServerMessage['type']>(type: T, ms = 2000): Promise<Extract<ServerMessage, { type: T }>> {
    const predicate = (m: ServerMessage): m is Extract<ServerMessage, { type: T }> => m.type === type;
    const buffered = this.buffer.findIndex(predicate);
    if (buffered >= 0) return Promise.resolve(this.buffer.splice(buffered, 1)[0] as Extract<ServerMessage, { type: T }>);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timed out waiting for "${type}"`)), ms);
      this.waiters.push({
        predicate,
        resolve: (m) => {
          clearTimeout(timer);
          resolve(m as Extract<ServerMessage, { type: T }>);
        },
      });
    });
  }

  send(msg: ClientMessage): void {
    this.ws.send(JSON.stringify(msg));
  }

  close(): void {
    this.ws.close();
  }
}

/** Host a room and return the GM client + its assigned room code. */
async function hostRoom(port: number, gmId = 'gm-1', displayName = 'The DM'): Promise<{ gm: TestClient; roomCode: string }> {
  const gm = await TestClient.open(port);
  gm.send({ type: 'host', payload: { gmId, displayName } });
  const { payload } = await gm.waitFor('hosted');
  return { gm, roomCode: payload.roomCode };
}

describe('relay server', () => {
  let relay: Relay;

  beforeAll(async () => {
    relay = await startRelay({ port: 0, maxRooms: 50 }); // ephemeral port
  });

  afterAll(async () => {
    await relay.close();
  });

  it('a GM can connect and receive a 6-letter uppercase room code', async () => {
    const { gm, roomCode } = await hostRoom(relay.port);
    expect(roomCode).toMatch(/^[A-Z]{6}$/);
    expect(relay.rooms.has(roomCode)).toBe(true);
    gm.close();
  });

  it('a player can join using the room code (GM is notified)', async () => {
    const { gm, roomCode } = await hostRoom(relay.port);
    const player = await TestClient.open(relay.port);
    player.send({ type: 'join', payload: { roomCode, playerId: 'p-1', displayName: 'Alice' } });

    const joined = await gm.waitFor('player-joined');
    expect(joined.payload).toEqual({ playerId: 'p-1', displayName: 'Alice' });
    gm.close();
    player.close();
  });

  it('a message from the GM reaches all players', async () => {
    const { gm, roomCode } = await hostRoom(relay.port);
    const p1 = await TestClient.open(relay.port);
    const p2 = await TestClient.open(relay.port);
    p1.send({ type: 'join', payload: { roomCode, playerId: 'p-1', displayName: 'Alice' } });
    p2.send({ type: 'join', payload: { roomCode, playerId: 'p-2', displayName: 'Bob' } });
    await gm.waitFor('player-joined');
    await gm.waitFor('player-joined');

    gm.send({ type: 'game-message', payload: { data: { kind: 'move', tokenId: 't1' } } });

    const m1 = await p1.waitFor('game-message');
    const m2 = await p2.waitFor('game-message');
    expect(m1.payload).toEqual({ from: 'gm-1', data: { kind: 'move', tokenId: 't1' } });
    expect(m2.payload).toEqual({ from: 'gm-1', data: { kind: 'move', tokenId: 't1' } });
    gm.close();
    p1.close();
    p2.close();
  });

  it('a message from a player reaches the GM (only)', async () => {
    const { gm, roomCode } = await hostRoom(relay.port);
    const p1 = await TestClient.open(relay.port);
    p1.send({ type: 'join', payload: { roomCode, playerId: 'p-1', displayName: 'Alice' } });
    await gm.waitFor('player-joined');

    p1.send({ type: 'game-message', payload: { data: { kind: 'roll', total: 17 } } });
    const routed = await gm.waitFor('game-message');
    expect(routed.payload).toEqual({ from: 'p-1', data: { kind: 'roll', total: 17 } });
    gm.close();
    p1.close();
  });

  it('when the GM disconnects, players receive gm-disconnected and the room is removed', async () => {
    const { gm, roomCode } = await hostRoom(relay.port);
    const p1 = await TestClient.open(relay.port);
    p1.send({ type: 'join', payload: { roomCode, playerId: 'p-1', displayName: 'Alice' } });
    await gm.waitFor('player-joined');

    gm.close();
    await p1.waitFor('gm-disconnected');
    // Give the server a tick to finish teardown, then assert the room is gone.
    await new Promise((r) => setTimeout(r, 50));
    expect(relay.rooms.has(roomCode)).toBe(false);
    p1.close();
  });

  it('an invalid room code returns an error', async () => {
    const player = await TestClient.open(relay.port);
    player.send({ type: 'join', payload: { roomCode: 'ZZZZZZ', playerId: 'p-9', displayName: 'Nobody' } });
    const err = await player.waitFor('error');
    expect(err.payload.message).toContain('ZZZZZZ');
    player.close();
  });

  it('responds to ping with pong', async () => {
    const client = await TestClient.open(relay.port);
    client.send({ type: 'ping' });
    await client.waitFor('pong');
    client.close();
  });
});
