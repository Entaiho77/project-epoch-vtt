import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Combatant, InitiativeState } from '@epoch/shared-types';
import { beginCombat, creatureInitiativeMod, joinCombat, leaveCombat, setTurn, sortOrder, startCombat, withCombatant } from '../combat';

// setTurn writes through realtime; mock it so we can assert the guard logic without Firebase.
const { writeValueMock, readValueMock } = vi.hoisted(() => ({
  writeValueMock: vi.fn((_p: string, _v: unknown) => Promise.resolve()),
  readValueMock: vi.fn((_p: string): Promise<unknown> => Promise.resolve(null)),
}));
vi.mock('../realtime', () => ({ writeValue: writeValueMock, readValue: readValueMock }));

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
});
