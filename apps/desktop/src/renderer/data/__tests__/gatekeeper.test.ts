import { describe, expect, it } from 'vitest';
import {
  checkPlayerOp,
  isPrivatePath,
  projectForPlayer,
  visibilityRoot,
  type GateContext,
  type WriteOp,
} from '../gatekeeper';

const G = 'g1';
const ME = 'thomas';
const OTHER = 'angie';
const GM = 'gm';

/** A small GM-side world, read through paths like the real store. */
function world(): Record<string, unknown> {
  return {
    games: {
      [G]: {
        id: G,
        name: 'Test',
        members: { [GM]: { role: 'gm' }, [ME]: { role: 'player' }, [OTHER]: { role: 'player' } },
        maps: { m1: { id: 'm1', imageUrl: 'epoch-asset:x.png' } },
        tokens: {
          mine: { id: 'mine', kind: 'character', ownerUserId: ME, characterId: 'c-me', col: 1, row: 1, mapId: 'm1', name: 'Brannoc' },
          hers: { id: 'hers', kind: 'character', ownerUserId: OTHER, characterId: 'c-her', col: 2, row: 2, mapId: 'm1', name: 'Ila' },
          wolf: { id: 'wolf', kind: 'creature', col: 5, row: 5, mapId: 'm1', name: 'Wolf', hp: { current: 9, max: 11 }, stats: { ac: 13 } },
          lurker: { id: 'lurker', kind: 'creature', visible: false, col: 9, row: 9, mapId: 'm1', name: 'Lurker' },
          party: { id: 'party', kind: 'party', col: 3, row: 3, mapId: 'm1', name: 'Party' },
        },
        chat: {
          pub: { id: 'pub', senderId: GM, senderName: 'GM', audience: 'public', text: 'hi', ts: 1 },
          toMe: { id: 'toMe', senderId: GM, senderName: 'GM', audience: ME, text: 'psst', ts: 2 },
          toHer: { id: 'toHer', senderId: GM, senderName: 'GM', audience: OTHER, text: 'secret', ts: 3 },
        },
        shapes: {
          s1: { id: 's1', ownerUid: ME, kind: 'circle', mapId: 'm1' },
          s2: { id: 's2', ownerUid: GM, kind: 'circle', mapId: 'm1', hidden: true },
        },
        initiative: {
          active: true,
          round: 1,
          turnIndex: 0,
          order: [
            { id: 'a', kind: 'character', ownerUserId: ME, initiative: 15 },
            { id: 'b', kind: 'creature', initiative: 10 },
          ],
        },
        rollLog: { r1: { id: 'r1', text: 'd20: 4', byUid: OTHER, by: 'Angie', at: 1 } },
      },
      other: { id: 'other', name: "GM's other campaign" },
    },
    characters: {
      'c-me': { id: 'c-me', ownerUserId: ME, gameId: G, name: 'Brannoc', play: { level: 1 } },
      'c-her': { id: 'c-her', ownerUserId: OTHER, gameId: G, name: 'Ila', imageUrl: 'epoch-asset:i.png', play: { level: 2, hp: 7 } },
      'c-elsewhere': { id: 'c-elsewhere', ownerUserId: OTHER, gameId: 'other', name: 'Elsewhere' },
    },
    users: {
      [GM]: {
        library: { monsters: { m: { name: 'Secret boss' } }, rules: { crit: 20 }, playerOptions: { r: { name: 'Elf+' } } },
        creatureArt: { wolf: 'epoch-asset:w.png' },
        creatures: { c1: { id: 'c1', name: 'Saved', imageUrl: 'epoch-asset:s.png', stats: { hp: 99 } } },
        notes: { [G]: { n: { body: 'the butler did it' } } },
      },
      [OTHER]: { notes: { [G]: { n: { body: 'my diary' } } } },
    },
  };
}

function ctxFor(data = world()): GateContext {
  return {
    gameId: G,
    gmUid: GM,
    read: async (path) => {
      let node: unknown = data;
      for (const s of path.split('/').filter(Boolean)) {
        node = node && typeof node === 'object' ? (node as Record<string, unknown>)[s] : undefined;
      }
      return node === undefined ? null : node;
    },
  };
}

const allowed = async (op: WriteOp) => expect((await checkPlayerOp(op, ME, ctxFor())).ok).toBe(true);
const blocked = async (op: WriteOp) => expect((await checkPlayerOp(op, ME, ctxFor())).ok).toBe(false);

describe('gatekeeper: what honest players do is allowed', () => {
  it('move my token, set conditions on it', async () => {
    await allowed({ t: 'multi', updates: { [`/games/${G}/tokens/mine/col`]: 4, [`/games/${G}/tokens/mine/row`]: 6 } });
    await allowed({ t: 'write', path: `games/${G}/tokens/mine/conditions/poisoned`, value: true });
    await allowed({ t: 'write', path: `games/${G}/tokens/mine/conditions/poisoned`, value: null });
  });

  it('place my own character token once', async () => {
    await allowed({
      t: 'write',
      path: `games/${G}/tokens/new1`,
      value: { id: 'new1', kind: 'character', ownerUserId: ME, characterId: 'c-me', col: 0, row: 0, mapId: 'm1', name: 'Brannoc', visible: true },
    });
  });

  it('drag the party token', async () => {
    await allowed({ t: 'update', path: `games/${G}/tokens/party`, partial: { draggedBy: ME, draggedAt: 123 } });
    await allowed({ t: 'multi', updates: { [`/games/${G}/tokens/party/col`]: 7, [`/games/${G}/tokens/party/row`]: 8 } });
    await allowed({ t: 'update', path: `games/${G}/tokens/party`, partial: { draggedBy: null, draggedAt: null } });
  });

  it('create my character and point the game at it', async () => {
    await allowed({
      t: 'multi',
      updates: {
        '/characters/new-c': { id: 'new-c', ownerUserId: ME, gameId: G, name: 'Second' },
        [`/gameCharacters/${G}/${ME}`]: 'new-c',
      },
    });
  });

  it('play my character: HP, spell slots, level up, art', async () => {
    await allowed({ t: 'write', path: 'characters/c-me/play/pools/hp/current', value: 3 });
    await allowed({ t: 'update', path: 'characters/c-me/play', partial: { level: 2 } });
    await allowed({ t: 'write', path: 'characters/c-me/imageUrl', value: 'epoch-asset:me.png' });
  });

  it('chat, whisper, roll, draw and remove my shape', async () => {
    await allowed({ t: 'write', path: `games/${G}/chat/m9`, value: { id: 'm9', senderId: ME, senderName: 'Thomas', audience: 'public', text: 'hello', ts: 9 } });
    await allowed({ t: 'write', path: `games/${G}/chat/m10`, value: { id: 'm10', senderId: ME, senderName: 'Thomas', audience: OTHER, text: 'psst', ts: 10 } });
    await allowed({ t: 'write', path: `games/${G}/rollLog/r9`, value: { id: 'r9', text: 'd20: 17', byUid: ME, by: 'Thomas', at: 9 } });
    await allowed({ t: 'write', path: `games/${G}/shapes/s9`, value: { id: 's9', ownerUid: ME, kind: 'cone', mapId: 'm1' } });
    await allowed({ t: 'write', path: `games/${G}/shapes/s1`, value: null });
  });

  it('end my turn (it is my turn)', async () => {
    const data = world();
    const init = (data.games as any)[G].initiative;
    await expect(
      checkPlayerOp({ t: 'write', path: `games/${G}/initiative`, value: { ...init, turnIndex: 1 } }, ME, ctxFor(data)),
    ).resolves.toEqual({ ok: true });
  });

  it('roll myself into combat', async () => {
    const data = world();
    (data.games as any)[G].initiative.order[0] = { id: 'b', kind: 'creature', initiative: 10 };
    (data.games as any)[G].initiative.order.length = 1;
    const init = (data.games as any)[G].initiative;
    const me = { id: 'me', kind: 'character', ownerUserId: ME, initiative: 18, tieBreak: 2 };
    const value = { ...init, order: [me, init.order[0]], turnIndex: 1 };
    await expect(checkPlayerOp({ t: 'write', path: `games/${G}/initiative`, value }, ME, ctxFor(data))).resolves.toEqual({ ok: true });
  });
});

describe('gatekeeper: cheats are blocked', () => {
  it("can't touch maps, fog, settings, members or the active map", async () => {
    await blocked({ t: 'write', path: `games/${G}/maps`, value: null });
    await blocked({ t: 'write', path: `games/${G}/maps/m1/fog/1,1`, value: null });
    await blocked({ t: 'write', path: `games/${G}/name`, value: 'pwned' });
    await blocked({ t: 'write', path: `games/${G}/members/${ME}/role`, value: 'gm' });
    await blocked({ t: 'write', path: `games/${G}/activeMapId`, value: 'x' });
    await blocked({ t: 'write', path: `games/${G}`, value: null });
    await blocked({ t: 'write', path: 'games/other/name', value: 'pwned' });
  });

  it("can't move, edit, reveal or delete other tokens", async () => {
    await blocked({ t: 'write', path: `games/${G}/tokens/hers/col`, value: 0 });
    await blocked({ t: 'write', path: `games/${G}/tokens/wolf/hp`, value: { current: 0, max: 11 } });
    await blocked({ t: 'write', path: `games/${G}/tokens/lurker/visible`, value: true });
    await blocked({ t: 'write', path: `games/${G}/tokens/wolf`, value: null });
    await blocked({ t: 'write', path: `games/${G}/tokens`, value: null });
  });

  it("can't misuse their own token", async () => {
    await blocked({ t: 'write', path: `games/${G}/tokens/mine/ownerUserId`, value: OTHER });
    await blocked({ t: 'write', path: `games/${G}/tokens/mine/visible`, value: false });
    await blocked({ t: 'write', path: `games/${G}/tokens/mine/col`, value: 'nowhere' });
    await blocked({ t: 'write', path: `games/${G}/tokens/mine`, value: null });
  });

  it("can't place monsters or tokens for someone else", async () => {
    await blocked({ t: 'write', path: `games/${G}/tokens/x`, value: { id: 'x', kind: 'creature', col: 0, row: 0, mapId: 'm1', name: 'Dragon' } });
    await blocked({ t: 'write', path: `games/${G}/tokens/x`, value: { id: 'x', kind: 'character', ownerUserId: OTHER, characterId: 'c-her', col: 0, row: 0, mapId: 'm1', name: 'Ila' } });
    await blocked({ t: 'write', path: `games/${G}/tokens/x`, value: { id: 'x', kind: 'character', ownerUserId: ME, characterId: 'c-her', col: 0, row: 0, mapId: 'm1', name: 'Ila' } });
  });

  it("can't rewrite, steal or delete another player's character", async () => {
    await blocked({ t: 'write', path: 'characters/c-her/play/hp', value: 0 });
    await blocked({ t: 'write', path: 'characters/c-her', value: { id: 'c-her', ownerUserId: ME, gameId: G } });
    await blocked({ t: 'write', path: 'characters/c-her', value: null });
    await blocked({ t: 'write', path: `gameCharacters/${G}/${OTHER}`, value: 'c-me' });
    await blocked({ t: 'write', path: `gameCharacters/${G}/${ME}`, value: 'c-her' });
  });

  it("can't move their character to another game or give it away", async () => {
    await blocked({ t: 'write', path: 'characters/c-me/gameId', value: 'other' });
    await blocked({ t: 'write', path: 'characters/c-me/ownerUserId', value: OTHER });
    await blocked({ t: 'write', path: 'characters/c-me', value: { id: 'c-me', ownerUserId: ME, gameId: 'other' } });
  });

  it("can't fake, edit or erase chat and rolls", async () => {
    await blocked({ t: 'write', path: `games/${G}/chat/m9`, value: { id: 'm9', senderId: GM, senderName: 'GM', audience: 'public', text: 'everyone gets 1000 gold', ts: 9 } });
    await blocked({ t: 'write', path: `games/${G}/chat/pub/text`, value: 'edited' });
    await blocked({ t: 'write', path: `games/${G}/chat/pub`, value: null });
    await blocked({ t: 'write', path: `games/${G}/chat`, value: null });
    await blocked({ t: 'write', path: `games/${G}/rollLog/r1`, value: null });
    await blocked({ t: 'write', path: `games/${G}/rollLog/r9`, value: { id: 'r9', text: 'nat 20', byUid: OTHER, by: 'Angie', at: 9 } });
    await blocked({ t: 'write', path: `games/${G}/rollLog`, value: null });
  });

  it("can't draw hidden shapes or remove other people's", async () => {
    await blocked({ t: 'write', path: `games/${G}/shapes/s9`, value: { id: 's9', ownerUid: ME, kind: 'cone', hidden: true } });
    await blocked({ t: 'write', path: `games/${G}/shapes/s2`, value: null });
  });

  it("can't run combat", async () => {
    const data = world();
    const init = (data.games as any)[G].initiative;
    const check = (value: unknown) => checkPlayerOp({ t: 'write', path: `games/${G}/initiative`, value }, ME, ctxFor(data));
    await expect(check(null)).resolves.toMatchObject({ ok: false }); // end combat
    await expect(check({ ...init, order: [init.order[0]] })).resolves.toMatchObject({ ok: false }); // remove the monster
    await expect(check({ ...init, order: [{ ...init.order[0], initiative: 99 }, init.order[1]] })).resolves.toMatchObject({ ok: false });
    // Not my turn → can't end it.
    (data.games as any)[G].initiative.turnIndex = 1;
    await expect(check({ ...init, turnIndex: 0, round: 2 })).resolves.toMatchObject({ ok: false });
  });

  it("can't touch the GM's library, other users, or anything outside the game", async () => {
    await blocked({ t: 'write', path: `users/${GM}/library/monsters/m`, value: null });
    await blocked({ t: 'write', path: `users/${OTHER}/notes`, value: null });
    await blocked({ t: 'write', path: 'inviteCodes/AAAA-BBBB', value: G });
    await blocked({ t: 'write', path: 'local/identity', value: {} });
  });

  it('rejects oversized or malformed changes', async () => {
    await blocked({ t: 'write', path: `games/${G}/chat/big`, value: { id: 'big', senderId: ME, senderName: 'T', audience: 'public', text: 'x'.repeat(300_000), ts: 1 } });
    await blocked({ t: 'bogus' } as unknown as WriteOp);
    await blocked({ t: 'multi', updates: {} });
  });

  it('an op with one bad part is rejected whole', async () => {
    await blocked({
      t: 'multi',
      updates: { [`/games/${G}/tokens/mine/col`]: 2, [`/games/${G}/tokens/wolf/col`]: 2 },
    });
  });
});

describe('gatekeeper: what each player is sent', () => {
  const ctx = ctxFor();
  const me = { uid: ME };

  it('hides hidden monsters and monster HP, keeps AC for attacks', () => {
    const tokens = projectForPlayer(`games/${G}/tokens`, (world().games as any)[G].tokens, me, ctx) as any;
    expect(Object.keys(tokens).sort()).toEqual(['hers', 'mine', 'party', 'wolf']);
    expect(tokens.wolf.hp).toBeUndefined();
    expect(tokens.wolf.stats.ac).toBe(13);
    expect(projectForPlayer(`games/${G}/tokens/lurker`, (world().games as any)[G].tokens.lurker, me, ctx)).toBeNull();
  });

  it('only sends whispers to the people in them', () => {
    const chat = projectForPlayer(`games/${G}/chat`, (world().games as any)[G].chat, me, ctx) as any;
    expect(Object.keys(chat).sort()).toEqual(['pub', 'toMe']);
  });

  it("hides GM-only shapes", () => {
    const shapes = projectForPlayer(`games/${G}/shapes`, (world().games as any)[G].shapes, me, ctx) as any;
    expect(Object.keys(shapes)).toEqual(['s1']);
  });

  it("shows other players' characters as name and art only", () => {
    const chars = projectForPlayer('characters', world().characters, me, ctx) as any;
    expect(Object.keys(chars).sort()).toEqual(['c-her', 'c-me']); // not the other game's
    expect(chars['c-me'].play.level).toBe(1);
    expect(chars['c-her']).toEqual({ id: 'c-her', name: 'Ila', imageUrl: 'epoch-asset:i.png', gameId: G, ownerUserId: OTHER });
  });

  it("never sends the GM's other games", () => {
    const games = projectForPlayer('games', world().games, me, ctx) as any;
    expect(Object.keys(games)).toEqual([G]);
    expect(projectForPlayer('games/other', (world().games as any).other, me, ctx)).toBeUndefined();
  });

  it("shares the GM's player options and rules, not monsters or notes", () => {
    const users = projectForPlayer('users', world().users, me, ctx) as any;
    expect(Object.keys(users)).toEqual([GM]);
    expect(users[GM].library).toEqual({ rules: { crit: 20 }, playerOptions: { r: { name: 'Elf+' } } });
    expect(users[GM].notes).toBeUndefined();
    expect(users[GM].creatures.c1).toEqual({ id: 'c1', name: 'Saved', imageUrl: 'epoch-asset:s.png' });
    expect(projectForPlayer(`users/${GM}/library/monsters`, {}, me, ctx)).toBeUndefined();
    expect(projectForPlayer(`users/${OTHER}`, {}, me, ctx)).toBeUndefined();
  });

  it('a whole-game read is filtered the same way', () => {
    const game = projectForPlayer(`games/${G}`, (world().games as any)[G], me, ctx) as any;
    expect(game.tokens.lurker).toBeUndefined();
    expect(Object.keys(game.chat).sort()).toEqual(['pub', 'toMe']);
    expect(game.maps.m1.imageUrl).toBe('epoch-asset:x.png');
  });

  it('never sends lobby indexes, invite lookups or local data', () => {
    expect(projectForPlayer('inviteCodes', { X: G }, me, ctx)).toBeUndefined();
    expect(projectForPlayer('userGames', { [GM]: { [G]: true } }, me, ctx)).toBeUndefined();
    expect(projectForPlayer('local/identity', {}, me, ctx)).toBeUndefined();
  });
});

describe('gatekeeper: helpers', () => {
  it('groups paths into the pieces visibility is decided on', () => {
    expect(visibilityRoot(`games/${G}/tokens/t1/col`)).toBe(`games/${G}/tokens/t1`);
    expect(visibilityRoot(`games/${G}/chat/m1`)).toBe(`games/${G}/chat/m1`);
    expect(visibilityRoot('characters/c1/play/hp')).toBe('characters/c1');
    expect(visibilityRoot(`users/${GM}/library/monsters/m1`)).toBe(`users/${GM}/library/monsters`);
    expect(visibilityRoot(`games/${G}/maps/m1/fog/1,2`)).toBe(`games/${G}/maps/m1/fog/1,2`);
  });

  it('keeps private things on this computer', () => {
    expect(isPrivatePath('local/identity')).toBe(true);
    expect(isPrivatePath(`users/${ME}/notes/${G}/n1`)).toBe(true);
    expect(isPrivatePath('userGames/x/y')).toBe(true);
    expect(isPrivatePath('inviteCodes/ABCD-EFGH')).toBe(true);
    expect(isPrivatePath(`games/${G}/chat/m1`)).toBe(false);
  });
});
