import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Combatant, InitiativeState } from '@solryn/shared-types';
import { setTurn, sortOrder } from '../combat';

// setTurn writes through realtime; mock it so we can assert the guard logic without Firebase.
const { writeValueMock } = vi.hoisted(() => ({
  writeValueMock: vi.fn(() => Promise.resolve()),
}));
vi.mock('../realtime', () => ({ writeValue: writeValueMock }));

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
