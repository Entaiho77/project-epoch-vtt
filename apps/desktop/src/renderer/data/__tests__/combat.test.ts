import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Combatant, InitiativeState } from '@epoch/shared-types';
import {
  beginCombat,
  creatureCombatant,
  creatureInitiativeMod,
  groupRoll,
  joinCombat,
  leaveCombat,
  mayMoveNow,
  removeCombatantsByOwner,
  removeTokenAndCombatant,
  setTurn,
  sortOrder,
  startCombat,
  withCombatant,
} from '../combat';

// setTurn writes through realtime; mock it so we can assert the guard logic without Firebase.
const { writeValueMock, readValueMock } = vi.hoisted(() => ({
  writeValueMock: vi.fn((_p: string, _v: unknown) => Promise.resolve()),
  readValueMock: vi.fn((_p: string): Promise<unknown> => Promise.resolve(null)),
}));
vi.mock('../realtime', () => ({ writeValue: writeValueMock, readValue: readValueMock }));

// removeTokenAndCombatant also deletes the token itself; mock board.ts's removeToken so this
// stays a pure unit test (no Firebase/Tauri asset-store dependency).
const { removeTokenMock } = vi.hoisted(() => ({ removeTokenMock: vi.fn((_g: string, _id: string) => Promise.resolve()) }));
vi.mock('../board', () => ({ removeToken: removeTokenMock }));

const c = (
  id: string,
  kind: 'character' | 'creature',
  initiative: number,
  tieBreak = 0,
): Combatant => ({ id, name: id, kind, initiative, tieBreak });

describe('sortOrder', () => {
  it('orders highest initiative first', () => {
    const order = sortOrder([c('a', 'creature', 10), c('b', 'character', 20)]);
    expect(order.map((o) => o.id)).toEqual(['b', 'a']);
  });

  it('players win ties versus monsters', () => {
    const order = sortOrder([c('goblin', 'creature', 15), c('hero', 'character', 15)]);
    expect(order[0].id).toBe('hero');
  });

  it('breaks remaining ties by tieBreak (modifier)', () => {
    const order = sortOrder([c('a', 'character', 12, 1), c('b', 'character', 12, 3)]);
    expect(order[0].id).toBe('b');
  });
});

describe('setTurn (GM jump-to-combatant)', () => {
  const state: InitiativeState = {
    active: true,
    round: 2,
    turnIndex: 1,
    order: [c('a', 'character', 20), c('b', 'creature', 15), c('hero', 'character', 10)],
  };

  beforeEach(() => writeValueMock.mockClear());

  it('writes the new turnIndex for a valid, different target', () => {
    void setTurn('g', state, 2);
    expect(writeValueMock).toHaveBeenCalledWith('games/g/initiative', {
      ...state,
      turnIndex: 2,
    });
  });

  it('no-ops when the target is already the current turn', () => {
    void setTurn('g', state, 1);
    expect(writeValueMock).not.toHaveBeenCalled();
  });

  it('no-ops when the index is out of range', () => {
    void setTurn('g', state, 9);
    void setTurn('g', state, -1);
    expect(writeValueMock).not.toHaveBeenCalled();
  });
});


describe('rolling phase, joining and leaving', () => {
  beforeEach(() => {
    writeValueMock.mockClear();
    readValueMock.mockReset();
    removeTokenMock.mockClear();
  });

  it('combat opens in a rolling phase, even with no monsters', () => {
    void startCombat('g', []);
    expect(writeValueMock).toHaveBeenCalledWith('games/g/initiative', {
      active: true, phase: 'rolling', round: 1, turnIndex: 0, order: [],
    });
  });

  it('Begin starts round 1 with the highest roll, whoever was first before', () => {
    const state: InitiativeState = {
      active: true, phase: 'rolling', round: 1, turnIndex: 0,
      order: [c('goblin', 'creature', 12), c('hero', 'character', 18)],
    };
    void beginCombat('g', state);
    const written = writeValueMock.mock.calls[0][1] as InitiativeState;
    expect(written.phase).toBe('running');
    expect(written.turnIndex).toBe(0);
    expect(written.order[0].id).toBe('hero');
  });

  it("a creature joining mid-combat slots in without changing whose turn it is", () => {
    const state: InitiativeState = {
      active: true, phase: 'running', round: 2, turnIndex: 1,
      order: [c('a', 'character', 20), c('b', 'creature', 15), c('hero', 'character', 10)],
    };
    const next = withCombatant(state, c('wolf', 'creature', 17));
    expect(next.order.map((o) => o.id)).toEqual(['a', 'wolf', 'b', 'hero']);
    expect(next.order[next.turnIndex].id).toBe('b');
    expect(withCombatant(state, c('b', 'creature', 1))).toBe(state); // already in
  });

  it('joinCombat reads the latest state first and does nothing outside combat', async () => {
    readValueMock.mockResolvedValueOnce(null);
    expect(await joinCombat('g', c('wolf', 'creature', 10))).toBe(false);
    readValueMock.mockResolvedValueOnce({ active: true, phase: 'rolling', round: 1, turnIndex: 0 }); // order dropped
    expect(await joinCombat('g', c('wolf', 'creature', 10))).toBe(true);
    expect((writeValueMock.mock.calls[0][1] as InitiativeState).order.map((o) => o.id)).toEqual(['wolf']);
  });

  it('leaveCombat keeps the current turn and ends combat when the last one leaves', async () => {
    readValueMock.mockResolvedValueOnce({
      active: true, phase: 'running', round: 1, turnIndex: 2,
      order: [c('a', 'character', 20), c('b', 'creature', 15), c('hero', 'character', 10)],
    });
    await leaveCombat('g', 'a');
    const w = writeValueMock.mock.calls[0][1] as InitiativeState;
    expect(w.order[w.turnIndex].id).toBe('hero');
    readValueMock.mockResolvedValueOnce({ active: true, phase: 'running', round: 1, turnIndex: 0, order: [c('a', 'creature', 1)] });
    await leaveCombat('g', 'a');
    expect(writeValueMock.mock.calls[1][1]).toBeNull();
  });

  it("monsters use their initiative modifier, else their DEX modifier (5e)", () => {
    expect(creatureInitiativeMod({ initiativeMod: 3 })).toBe(3);
    expect(creatureInitiativeMod({ dex: 14 })).toBe(2);
    expect(creatureInitiativeMod({ dex: 9 })).toBe(-1);
    expect(creatureInitiativeMod({})).toBe(0);
    expect(creatureInitiativeMod(undefined)).toBe(0);
  });

  it('removeTokenAndCombatant deletes the token and drops its combatant row from initiative', async () => {
    readValueMock.mockResolvedValueOnce({
      active: true, phase: 'running', round: 1, turnIndex: 1,
      order: [
        { ...c('a', 'character', 20), tokenId: 'tok-a' },
        { ...c('b', 'creature', 15), tokenId: 'tok-b' },
        { ...c('hero', 'character', 10), tokenId: 'tok-hero' },
      ],
    });
    await removeTokenAndCombatant('g', 'tok-b');
    expect(removeTokenMock).toHaveBeenCalledWith('g', 'tok-b');
    const written = writeValueMock.mock.calls[0][1] as InitiativeState;
    expect(written.order.map((o) => o.id)).toEqual(['a', 'hero']);
  });

  it("removeTokenAndCombatant still deletes the token when there's no active combat", async () => {
    readValueMock.mockResolvedValueOnce(null);
    await removeTokenAndCombatant('g', 'tok-b');
    expect(removeTokenMock).toHaveBeenCalledWith('g', 'tok-b');
    expect(writeValueMock).not.toHaveBeenCalled();
  });

  it('removeCombatantsByOwner drops every combatant owned by that player, keeping the current turn', () => {
    const state: InitiativeState = {
      active: true, phase: 'running', round: 1, turnIndex: 2,
      order: [
        { ...c('a', 'character', 20), ownerUserId: 'uid-1' },
        { ...c('b', 'creature', 15) },
        { ...c('hero', 'character', 10), ownerUserId: 'uid-2' },
      ],
    };
    void removeCombatantsByOwner('g', state, 'uid-1');
    const written = writeValueMock.mock.calls[0][1] as InitiativeState;
    expect(written.order.map((o) => o.id)).toEqual(['b', 'hero']);
    expect(written.order[written.turnIndex].id).toBe('hero'); // same combatant stayed current
  });

  it('removeCombatantsByOwner ends combat when it empties the order, and no-ops when the owner has no combatant', () => {
    const solo: InitiativeState = {
      active: true, phase: 'running', round: 1, turnIndex: 0,
      order: [{ ...c('a', 'creature', 10), ownerUserId: 'uid-1' }],
    };
    void removeCombatantsByOwner('g', solo, 'uid-1');
    expect(writeValueMock.mock.calls[0][1]).toBeNull();

    writeValueMock.mockClear();
    void removeCombatantsByOwner('g', solo, 'nobody-here');
    expect(writeValueMock).not.toHaveBeenCalled();
  });
});

describe('mayMoveNow (playtest #2: turn-gate movement)', () => {
  const running: InitiativeState = {
    active: true,
    phase: 'running',
    round: 1,
    turnIndex: 1,
    order: [
      { ...c('a', 'character', 20), tokenId: 'tok-a', ownerUserId: 'uid-a' },
      { ...c('b', 'creature', 15), tokenId: 'tok-b' },
      { ...c('hero', 'character', 10), tokenId: 'tok-hero', ownerUserId: 'uid-hero' },
    ],
  };

  it('no active combat → always true', () => {
    expect(mayMoveNow(null, { uid: 'uid-a', tokenId: 'tok-a' })).toBe(true);
    expect(mayMoveNow(undefined, { tokenId: 'tok-a' })).toBe(true);
  });

  it('rolling phase → always true (nobody has a turn yet)', () => {
    expect(mayMoveNow({ ...running, phase: 'rolling' }, { tokenId: 'tok-a' })).toBe(true);
  });

  it('GM allowOffTurn switch → always true', () => {
    expect(mayMoveNow({ ...running, allowOffTurn: true }, { tokenId: 'tok-a' })).toBe(true);
  });

  it("a token that isn't an active combatant at all is never turn-gated", () => {
    expect(mayMoveNow(running, { tokenId: 'tok-scenery' })).toBe(true);
    expect(mayMoveNow(running, {})).toBe(true);
  });

  it("the current combatant's own token may move", () => {
    expect(mayMoveNow(running, { tokenId: 'tok-b' })).toBe(true);
  });

  it("the current combatant's owner may move it by uid, even without matching tokenId logic", () => {
    expect(mayMoveNow(running, { uid: undefined, tokenId: 'tok-b' })).toBe(true);
  });

  it('a different combatant on someone else\'s turn may not move', () => {
    expect(mayMoveNow(running, { uid: 'uid-a', tokenId: 'tok-a' })).toBe(false);
    expect(mayMoveNow(running, { uid: 'uid-hero', tokenId: 'tok-hero' })).toBe(false);
  });
});

describe('groupRoll (campaign rule: same-named monsters share one roll)', () => {
  it('finds an existing creature combatant with the same name and returns its roll', () => {
    const order = [c('goblin-1', 'creature', 14, 2), c('wolf-1', 'creature', 9, 1)];
    expect(groupRoll(order, 'goblin-1')).toEqual({ initiative: 14, tieBreak: 2 });
  });

  it('returns undefined when no combatant of that name exists yet (first of the group rolls fresh)', () => {
    const order = [c('wolf-1', 'creature', 9, 1)];
    expect(groupRoll(order, 'goblin-1')).toBeUndefined();
  });

  it('ignores a player character sharing the same name as a monster', () => {
    const order: Combatant[] = [{ id: 'hero', name: 'goblin-1', kind: 'character', initiative: 20, tieBreak: 5 }];
    expect(groupRoll(order, 'goblin-1')).toBeUndefined();
  });

  it('creatureCombatant reuses a shared roll instead of rolling fresh', () => {
    const shared = { initiative: 11, tieBreak: 3 };
    const combatant = creatureCombatant({ id: 'goblin-2', name: 'goblin-2', stats: { dex: 18 } }, shared);
    expect(combatant.initiative).toBe(11);
    expect(combatant.tieBreak).toBe(3);
  });
});
