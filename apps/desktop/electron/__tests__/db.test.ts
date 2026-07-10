import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { openKv, type KvStore } from '../db';

describe('kv store (RTDB semantics over SQLite)', () => {
  let dir: string;
  let kv: KvStore;
  let events: Array<{ subId: string; path: string; value: unknown }>;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'epoch-kv-'));
    events = [];
    kv = openKv(join(dir, 'test.db'), (subId, path, value) =>
      events.push({ subId, path, value }),
    );
  });

  afterEach(() => {
    kv.close();
    rmSync(dir, { recursive: true, force: true });
  });

  it('round-trips primitives and objects', () => {
    kv.write('games/g1/name', 'Curse of Strahd');
    expect(kv.read('games/g1/name')).toBe('Curse of Strahd');

    kv.write('games/g2', { name: 'Solryn', members: { u1: { role: 'gm' } } });
    expect(kv.read('games/g2')).toEqual({ name: 'Solryn', members: { u1: { role: 'gm' } } });
    expect(kv.read('games/g2/members/u1/role')).toBe('gm');
  });

  it('assembles prefix reads into nested objects', () => {
    kv.write('games/g1/name', 'A');
    kv.write('games/g2/name', 'B');
    const all = kv.read('games') as Record<string, { name: string }>;
    expect(all.g1.name).toBe('A');
    expect(all.g2.name).toBe('B');
  });

  it('object write replaces the subtree (RTDB set semantics)', () => {
    kv.write('games/g1', { name: 'Old', stale: true });
    kv.write('games/g1', { name: 'New' });
    expect(kv.read('games/g1')).toEqual({ name: 'New' });
  });

  it('update merges shallowly per key (RTDB update semantics)', () => {
    kv.write('games/g1', { name: 'Keep', hp: { cur: 5, max: 10 } });
    kv.update('games/g1', { 'hp/cur': 7 });
    expect(kv.read('games/g1')).toEqual({ name: 'Keep', hp: { cur: 7, max: 10 } });
  });

  it('writing null (and delete) removes the subtree', () => {
    kv.write('games/g1', { name: 'X' });
    kv.write('games/g1', null);
    expect(kv.read('games/g1')).toBeNull();

    kv.write('games/g2', { name: 'Y' });
    kv.remove('games/g2');
    expect(kv.read('games/g2')).toBeNull();
  });

  it('multiUpdate applies several absolute paths atomically', () => {
    kv.multiUpdate({
      '/games/g1/name': 'A',
      '/inviteCodes/XY': 'g1',
      '/userGames/u1/g1': true,
    });
    expect(kv.read('games/g1/name')).toBe('A');
    expect(kv.read('inviteCodes/XY')).toBe('g1');
    expect(kv.read('userGames/u1/g1')).toBe(true);
  });

  it('returns arrays for contiguous 0..n-1 numeric keys (snap.val() behavior)', () => {
    kv.write('board/points', [{ x: 1 }, { x: 2 }, { x: 3 }]);
    const points = kv.read('board/points') as Array<{ x: number }>;
    expect(Array.isArray(points)).toBe(true);
    expect(points.map((p) => p.x)).toEqual([1, 2, 3]);
  });

  it('writing under a leaf converts it to a tree', () => {
    kv.write('a/b', 1);
    kv.write('a/b/c', 2);
    expect(kv.read('a/b')).toEqual({ c: 2 });
  });

  it('notifies subscriptions on writes at, below, and above their path', () => {
    kv.subscribe('s1', 'games/g1');
    events = []; // drop the initial onValue-style fire

    kv.write('games/g1/name', 'Below'); // below sub path
    kv.write('games', { g1: { name: 'Above' } }); // above sub path
    kv.write('other/thing', 1); // unrelated

    const forSub = events.filter((e) => e.subId === 's1');
    expect(forSub).toHaveLength(2);
    expect(forSub[1].value).toEqual({ name: 'Above' });
  });

  it('fires immediately on subscribe with the current value', () => {
    kv.write('games/g1/name', 'Now');
    kv.subscribe('s1', 'games/g1');
    expect(events.at(-1)).toMatchObject({ subId: 's1', value: { name: 'Now' } });
  });

  it('persists across reopen', () => {
    kv.write('games/g1', { name: 'Durable' });
    kv.close();
    const reopened = openKv(join(dir, 'test.db'), () => {});
    expect(reopened.read('games/g1')).toEqual({ name: 'Durable' });
    reopened.close();
  });
});
