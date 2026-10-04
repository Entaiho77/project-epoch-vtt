// @vitest-environment node
/**
 * Runs the real peer-to-peer helper (swarm/helper.js on the Bare runtime) on a
 * private HyperDHT network, with the test playing the desktop app on each side.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { startTestnet, startHelper, isMsg, isStatus } = require('../testkit.cjs');

type Helper = Awaited<ReturnType<typeof startHelper>>;

describe('peer-to-peer session helper', () => {
  let net: { testnet: { destroy(): Promise<void> }; bootstrap: string };
  const helpers: Helper[] = [];
  const helper = async (): Promise<Helper> => {
    const h = await startHelper({ bootstrap: net.bootstrap });
    helpers.push(h);
    return h;
  };
  let room = 0;
  const code = () => `TEST-${String(++room).padStart(4, '0')}`;

  beforeAll(async () => {
    net = await startTestnet();
  }, 30_000);

  afterAll(async () => {
    await Promise.all(helpers.map((h) => h.close()));
    await net.testnet.destroy();
  }, 30_000);

  async function hostAndJoin(roomCode: string) {
    const gm = await helper();
    const player = await helper();
    gm.send({ cmd: 'host', roomCode, uid: 'gm-1', displayName: 'Entaiho' });
    await gm.waitFor(isMsg('hosted'), 15_000, 'hosted');
    player.send({ cmd: 'join', roomCode, uid: 'player-1', displayName: 'Thomas' });
    const req = await gm.waitFor(isMsg('join-request'), 15_000, 'join-request');
    return { gm, player, req };
  }

  it('a player finds the GM by room code and waits for approval', async () => {
    const { gm, player, req } = await hostAndJoin(code());
    expect(req.message.payload).toMatchObject({ playerId: 'player-1', displayName: 'Thomas' });
    expect(req.message.payload.peerKey).toBe(player.key);
    await player.waitFor(isMsg('waiting'), 5_000, 'waiting');
    expect(player.events.some(isStatus('open'))).toBe(false); // not in yet

    gm.send({ cmd: 'approve', peerKey: req.message.payload.peerKey, allow: true });
    await player.waitFor(isStatus('open'), 5_000, 'player open');
    const joined = await gm.waitFor(isMsg('player-joined'), 5_000, 'player-joined');
    expect(joined.message.payload).toMatchObject({ playerId: 'player-1', peerKey: player.key });
  }, 40_000);

  it('routes messages: player → GM, GM → everyone, GM → one player', async () => {
    const roomCode = code();
    const { gm, player, req } = await hostAndJoin(roomCode);
    gm.send({ cmd: 'approve', peerKey: req.message.payload.peerKey, allow: true });
    await player.waitFor(isStatus('open'), 5_000, 'open');

    // A second player.
    const p2 = await helper();
    p2.send({ cmd: 'join', roomCode, uid: 'player-2', displayName: 'Angie' });
    const req2 = await gm.waitFor(
      (e: { ev: string; message?: { type: string; payload: { playerId: string } } }) =>
        isMsg('join-request')(e) && e.message!.payload.playerId === 'player-2',
      15_000,
      'second join-request',
    );
    gm.send({ cmd: 'approve', peerKey: req2.message.payload.peerKey, allow: true });
    await p2.waitFor(isStatus('open'), 5_000, 'p2 open');

    player.send({ cmd: 'send', data: { t: 'write', path: 'x', value: 1 } });
    const got = await gm.waitFor(isMsg('game-message'), 5_000, 'gm got');
    expect(got.message.payload).toEqual({ from: 'player-1', data: { t: 'write', path: 'x', value: 1 } });

    gm.send({ cmd: 'send', data: { hello: 'all' } });
    await player.waitFor(isMsg('game-message'), 5_000, 'player got broadcast');
    await p2.waitFor(isMsg('game-message'), 5_000, 'p2 got broadcast');

    gm.send({ cmd: 'send', to: 'player-2', data: { secret: 'only angie' } });
    await p2.waitFor(
      (e: { ev: string; message?: { type: string; payload: { data: { secret?: string } } } }) =>
        isMsg('game-message')(e) && e.message!.payload.data.secret === 'only angie',
      5_000,
      'targeted',
    );
    await new Promise((r) => setTimeout(r, 300));
    expect(
      player.messages('game-message').some((e: { message: { payload: { data: { secret?: string } } } }) => e.message.payload.data.secret),
    ).toBe(false);
  }, 60_000);

  it('drops game messages from a player the GM has not approved', async () => {
    const { gm, player } = await hostAndJoin(code());
    player.send({ cmd: 'send', data: { t: 'write', path: 'games/x', value: 'evil' } });
    await new Promise((r) => setTimeout(r, 800));
    expect(gm.messages('game-message')).toHaveLength(0);
  }, 40_000);

  it('a denied player is told and disconnected', async () => {
    const { gm, player, req } = await hostAndJoin(code());
    gm.send({ cmd: 'approve', peerKey: req.message.payload.peerKey, allow: false });
    const err = await player.waitFor(isMsg('error'), 5_000, 'denied error');
    expect(err.message.payload.message).toMatch(/declined/);
    await player.waitFor(isStatus('closed'), 5_000, 'closed');
  }, 40_000);

  it('a kicked player is removed and cannot come back on the same code', async () => {
    const roomCode = code();
    const { gm, player, req } = await hostAndJoin(roomCode);
    gm.send({ cmd: 'approve', peerKey: req.message.payload.peerKey, allow: true });
    await player.waitFor(isStatus('open'), 5_000, 'open');
    gm.send({ cmd: 'kick', playerId: 'player-1' });
    await player.waitFor(isMsg('kicked'), 5_000, 'kicked');

    const before = gm.messages('join-request').length;
    player.send({ cmd: 'join', roomCode, uid: 'player-1', displayName: 'Thomas' });
    await new Promise((r) => setTimeout(r, 3000));
    expect(gm.messages('join-request')).toHaveLength(before);
  }, 40_000);

  it('a new code keeps current players and stops the old code working', async () => {
    const oldCode = code();
    const newCode = code();
    const { gm, player, req } = await hostAndJoin(oldCode);
    gm.send({ cmd: 'approve', peerKey: req.message.payload.peerKey, allow: true });
    await player.waitFor(isStatus('open'), 5_000, 'open');

    gm.send({ cmd: 'retopic', roomCode: newCode });
    await gm.waitFor(
      (e: { ev: string; message?: { type: string; payload: { roomCode: string } } }) =>
        isMsg('hosted')(e) && e.message!.payload.roomCode === newCode,
      15_000,
      'rehosted',
    );
    // The existing player is still connected.
    player.send({ cmd: 'send', data: { still: 'here' } });
    await gm.waitFor(isMsg('game-message'), 5_000, 'still connected');

    // Someone with the old code finds nothing; the new code works.
    const late = await helper();
    late.send({ cmd: 'join', roomCode: oldCode, uid: 'late', displayName: 'Late' });
    await new Promise((r) => setTimeout(r, 3000));
    expect(gm.messages('join-request').filter((e: any) => e.message.payload.playerId === 'late')).toHaveLength(0);
    const fresh = await helper();
    fresh.send({ cmd: 'join', roomCode: newCode, uid: 'fresh', displayName: 'Fresh' });
    await gm.waitFor(
      (e: { ev: string; message?: { type: string; payload: { playerId: string } } }) =>
        isMsg('join-request')(e) && e.message!.payload.playerId === 'fresh',
      15_000,
      'join on new code',
    );
  }, 60_000);

  describe('voice', () => {
    type VoiceEv = { ev: string; from: string; seq: number; data: string };
    const isVoice = (from: string, data?: string) => (e: VoiceEv) =>
      e.ev === 'voice' && e.from === from && (data === undefined || e.data === data);
    const frame = (text: string) => Buffer.from(text).toString('base64');
    const voices = (h: Helper, from: string) =>
      (h.events as VoiceEv[]).filter((e) => e.ev === 'voice' && e.from === from);

    /** Sends a few frames (datagrams can drop) and waits for one to land. */
    async function speak(h: Helper, listener: Helper, from: string, text: string) {
      const data = frame(text);
      for (let seq = 0; seq < 5; seq++) {
        h.send({ cmd: 'voice', seq, data });
        await new Promise((r) => setTimeout(r, 40));
      }
      return listener.waitFor(isVoice(from, data), 5_000, `voice ${from} → ${text}`);
    }

    async function table() {
      const roomCode = code();
      const { gm, player, req } = await hostAndJoin(roomCode);
      gm.send({ cmd: 'approve', peerKey: req.message.payload.peerKey, allow: true });
      await player.waitFor(isStatus('open'), 5_000, 'open');
      const p2 = await helper();
      p2.send({ cmd: 'join', roomCode, uid: 'player-2', displayName: 'Angie' });
      const req2 = await gm.waitFor(
        (e: { ev: string; message?: { type: string; payload: { playerId: string } } }) =>
          isMsg('join-request')(e) && e.message!.payload.playerId === 'player-2',
        15_000,
        'second join-request',
      );
      gm.send({ cmd: 'approve', peerKey: req2.message.payload.peerKey, allow: true });
      await p2.waitFor(isStatus('open'), 5_000, 'p2 open');
      return { gm, player, p2 };
    }

    it('a player is heard by the GM and the other players, labelled by the GM', async () => {
      const { gm, player, p2 } = await table();
      const got = await speak(player, gm, 'player-1', 'hello from thomas');
      expect(got.seq).toBeGreaterThanOrEqual(0);
      await p2.waitFor(isVoice('player-1', frame('hello from thomas')), 5_000, 'p2 hears thomas');
      // Nobody hears themselves.
      expect(voices(player, 'player-1')).toHaveLength(0);
      // The GM is heard by everyone, under the GM's id.
      await speak(gm, player, 'gm-1', 'gm speaking');
      await p2.waitFor(isVoice('gm-1', frame('gm speaking')), 5_000, 'p2 hears gm');
    }, 60_000);

    it('voice from a player still waiting for approval is dropped', async () => {
      const { gm, player } = await hostAndJoin(code());
      for (let seq = 0; seq < 5; seq++) player.send({ cmd: 'voice', seq, data: frame('let me in') });
      await new Promise((r) => setTimeout(r, 800));
      expect(voices(gm, 'player-1')).toHaveLength(0);
    }, 40_000);

    it('the GM can mute a player for everyone, and unmute them', async () => {
      const { gm, player, p2 } = await table();
      gm.send({ cmd: 'voice-mute', playerId: 'player-1', muted: true });
      await player.waitFor(
        (e: { ev: string; message?: { type: string; payload: { muted: boolean } } }) =>
          isMsg('voice-muted')(e) && e.message!.payload.muted === true,
        5_000,
        'told muted',
      );
      for (let seq = 0; seq < 5; seq++) player.send({ cmd: 'voice', seq, data: frame('muted words') });
      await new Promise((r) => setTimeout(r, 800));
      expect(voices(gm, 'player-1')).toHaveLength(0);
      expect(voices(p2, 'player-1')).toHaveLength(0);

      gm.send({ cmd: 'voice-mute', playerId: 'player-1', muted: false });
      await speak(player, p2, 'player-1', 'back again');
    }, 60_000);

    it('a player cannot pretend to be someone else', async () => {
      const { gm, player, p2 } = await table();
      // Whatever the player puts in its own packets, the GM labels them with the
      // identity it approved.
      await speak(player, p2, 'player-1', 'who am i');
      expect(voices(p2, 'gm-1')).toHaveLength(0);
      expect(voices(gm, 'player-1').length).toBeGreaterThan(0);
    }, 60_000);
  });

  it('players are told when the GM ends the session', async () => {
    const { gm, player, req } = await hostAndJoin(code());
    gm.send({ cmd: 'approve', peerKey: req.message.payload.peerKey, allow: true });
    await player.waitFor(isStatus('open'), 5_000, 'open');
    gm.send({ cmd: 'leave' });
    await player.waitFor(isMsg('gm-disconnected'), 5_000, 'gm-disconnected');
  }, 40_000);
});
