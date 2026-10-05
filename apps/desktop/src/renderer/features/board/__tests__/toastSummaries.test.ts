import { describe, expect, it } from 'vitest';
import type { RollEntry } from '@epoch/shared-types';
import type { ChatMessage } from '../../../data/chat';
import { rollsToShow, summarizeRoll, unreadMessages } from '../toastSummaries';

const msg = (id: string, senderId: string, audience = 'public'): ChatMessage => ({
  id, senderId, senderName: senderId, audience, text: 'hi', ts: 1,
});

describe('chat unread', () => {
  it("counts others' visible messages not yet seen; never my own or other people's whispers", () => {
    const msgs = [msg('a', 'gm'), msg('b', 'me'), msg('c', 'gm', 'me'), msg('d', 'gm', 'angie'), msg('e', 'angie')];
    expect(unreadMessages(msgs, 'me', new Set(['a'])).map((m) => m.id)).toEqual(['c', 'e']);
  });
});

describe('roll cards', () => {
  const entry = (id: string, byUid: string): RollEntry => ({ id, byUid, by: byUid, text: 'x: 1', at: 0 });
  it('players see their own rolls; the GM sees everyone’s; nothing already seen', () => {
    const es = [entry('1', 'me'), entry('2', 'angie'), entry('3', 'me')];
    expect(rollsToShow(es, 'me', false, new Set(['1'])).map((e) => e.id)).toEqual(['3']);
    expect(rollsToShow(es, 'gm', true, new Set()).map((e) => e.id)).toEqual(['1', '2', '3']);
  });
  it('splits label from result and spots hits, misses, saves and natural 20s/1s', () => {
    const hit = summarizeRoll({
      text: 'Thorn → Goblin — Longsword: 17 vs AC 15 — HIT, rolled 6+3 = 9 slashing damage',
      dice: [{ s: 20, f: 14 }, { s: 8, f: 6 }],
    });
    expect(hit.title).toBe('Thorn → Goblin — Longsword');
    expect(hit.body).toContain('17 vs AC 15');
    expect(hit.outcome).toBe('hit');
    expect(hit.nat).toBeNull();
    expect(hit.faces).toEqual(['d20 14', 'd8 6']);
    expect(summarizeRoll({ text: 'X: natural 1 — MISS', dice: [{ s: 20, f: 1 }] })).toMatchObject({ outcome: 'miss', nat: 1 });
    expect(summarizeRoll({ text: 'X: 1d20+2 = 22 vs DC 12 — SUCCESS', dice: [{ s: 20, f: 20 }] })).toMatchObject({ outcome: 'success', nat: 20 });
    expect(summarizeRoll({ text: 'Goblin: CRITICAL HIT! Rolled 8 damage' }).outcome).toBe('crit');
    expect(summarizeRoll({ text: 'Orc — Axe: natural 20 — CRIT, 3+5+3 = 11 damage' })).toMatchObject({ outcome: 'crit', nat: 20 });
    expect(summarizeRoll({ text: 'plain' })).toMatchObject({ title: 'Roll', body: 'plain', outcome: null });
  });
  it('advantage with one 20 among the d20s still counts as a natural 20', () => {
    expect(summarizeRoll({ text: 'a: b', dice: [{ s: 20, f: 3 }, { s: 20, f: 20 }] }).nat).toBe(20);
    expect(summarizeRoll({ text: 'a: b', dice: [{ s: 20, f: 1 }, { s: 20, f: 9 }] }).nat).toBeNull();
    expect(summarizeRoll({ text: 'a: 1d20+2 = 5 (dis) vs AC 12 — MISS', dice: [{ s: 20, f: 20 }, { s: 20, f: 3 }] }).nat).toBeNull();
    expect(summarizeRoll({ text: 'a: (disadvantage)', dice: [{ s: 20, f: 1 }, { s: 20, f: 15 }] }).nat).toBe(1);
  });
});
