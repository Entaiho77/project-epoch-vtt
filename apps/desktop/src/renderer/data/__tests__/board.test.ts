import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  setDefeated,
  setExclusiveCondition,
  setTokenCondition,
  setTokenHp,
} from '../board';

// Pure unit tests: mock the Firebase-backed writers so these just assert the exact paths/values
// written, same pattern combat.test.ts uses.
const { multiUpdateMock, writeValueMock } = vi.hoisted(() => ({
  multiUpdateMock: vi.fn((_u: Record<string, unknown>) => Promise.resolve()),
  writeValueMock: vi.fn((_p: string, _v: unknown) => Promise.resolve()),
}));
vi.mock('../realtime', () => ({
  multiUpdate: multiUpdateMock,
  writeValue: writeValueMock,
  updateValue: vi.fn(() => Promise.resolve()),
  newKey: vi.fn(() => 'new-key'),
}));

beforeEach(() => {
  multiUpdateMock.mockClear();
  writeValueMock.mockClear();
});

describe('setTokenCondition (fatal conditions — Solryn exhaustion 3)', () => {
  it('a plain condition just toggles, no defeated/permaDead side effect', async () => {
    await setTokenCondition('g', 't1', 'poisoned', true);
    expect(multiUpdateMock).toHaveBeenCalledWith({ 'games/g/tokens/t1/conditions/poisoned': true });
  });

  it('turning ON a fatal condition also marks defeated + permaDead in the same write', async () => {
    await setTokenCondition('g', 't1', 'exhaustion_3', true, true);
    expect(multiUpdateMock).toHaveBeenCalledWith({
      'games/g/tokens/t1/conditions/exhaustion_3': true,
      'games/g/tokens/t1/defeated': true,
      'games/g/tokens/t1/permaDead': true,
    });
  });

  it('turning OFF a fatal condition does not touch defeated/permaDead (never clears death)', async () => {
    await setTokenCondition('g', 't1', 'exhaustion_3', false, true);
    expect(multiUpdateMock).toHaveBeenCalledWith({ 'games/g/tokens/t1/conditions/exhaustion_3': null });
  });
});

describe('setExclusiveCondition (fatal conditions — Solryn exhaustion 3)', () => {
  const ids = ['exhaustion_1', 'exhaustion_2', 'exhaustion_3'];

  it('stepping to a non-fatal level clears the others, no defeated/permaDead', async () => {
    await setExclusiveCondition('g', 't1', ids, 'exhaustion_2');
    expect(multiUpdateMock).toHaveBeenCalledWith({
      '/games/g/tokens/t1/conditions/exhaustion_1': null,
      '/games/g/tokens/t1/conditions/exhaustion_2': true,
      '/games/g/tokens/t1/conditions/exhaustion_3': null,
    });
  });

  it('activating the fatal level also marks defeated + permaDead', async () => {
    await setExclusiveCondition('g', 't1', ids, 'exhaustion_3', true);
    expect(multiUpdateMock).toHaveBeenCalledWith({
      '/games/g/tokens/t1/conditions/exhaustion_1': null,
      '/games/g/tokens/t1/conditions/exhaustion_2': null,
      '/games/g/tokens/t1/conditions/exhaustion_3': true,
      '/games/g/tokens/t1/defeated': true,
      '/games/g/tokens/t1/permaDead': true,
    });
  });

  it('clearing the whole group (activeId null) never writes defeated/permaDead even if fatal is passed', async () => {
    await setExclusiveCondition('g', 't1', ids, null, true);
    const call = multiUpdateMock.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    expect(Object.keys(call)).not.toContain('/games/g/tokens/t1/defeated');
    expect(Object.keys(call)).not.toContain('/games/g/tokens/t1/permaDead');
  });
});

describe('setTokenHp (permaDead tokens never heal)', () => {
  it('a normal creature can be healed back up from 0', async () => {
    await setTokenHp('g', { id: 't1', kind: 'creature', hp: { current: 0, max: 10 } }, 5);
    expect(multiUpdateMock).toHaveBeenCalledWith({
      '/games/g/tokens/t1/hp': { current: 5, max: 10 },
      '/games/g/tokens/t1/defeated': null,
    });
  });

  it('a permaDead creature is forced back to 0 HP no matter what was requested', async () => {
    await setTokenHp('g', { id: 't1', kind: 'creature', hp: { current: 0, max: 10 }, permaDead: true }, 999);
    expect(multiUpdateMock).toHaveBeenCalledWith({
      '/games/g/tokens/t1/hp': { current: 0, max: 10 },
      '/games/g/tokens/t1/defeated': true,
    });
  });
});

describe('setDefeated (permaDead tokens refuse to be revived)', () => {
  it('a normal defeated creature can be revived (defeated: false)', async () => {
    await setDefeated('g', { id: 't1', hp: { current: 0, max: 10 } }, false);
    expect(multiUpdateMock).toHaveBeenCalledWith({
      '/games/g/tokens/t1/defeated': null,
      '/games/g/tokens/t1/hp/current': 1,
    });
  });

  it('reviving a permaDead creature is a silent no-op', async () => {
    await setDefeated('g', { id: 't1', hp: { current: 0, max: 10 }, permaDead: true }, false);
    expect(multiUpdateMock).not.toHaveBeenCalled();
  });

  it('a permaDead creature can still be (redundantly) marked defeated — only reviving is blocked', async () => {
    await setDefeated('g', { id: 't1', hp: { current: 0, max: 10 }, permaDead: true }, true);
    expect(multiUpdateMock).toHaveBeenCalledWith({ '/games/g/tokens/t1/defeated': true });
  });
});
