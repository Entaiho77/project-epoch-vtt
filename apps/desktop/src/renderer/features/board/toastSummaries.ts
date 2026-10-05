import type { RollEntry } from '@epoch/shared-types';
import type { ChatMessage } from '../../data/chat';
import { canSeeMessage } from '../../data/chat';

/**
 * Pure helpers behind the board's pop-up cards: new chat/whisper bubbles, the Chat button's
 * unread count, and roll-result cards. No React, no I/O — unit-tested.
 */

/**
 * Messages this person can see, didn't send, and hasn't seen yet (`seen` holds message ids —
 * ids, not times, so a sender's clock being off can't hide or replay a message).
 */
export function unreadMessages(msgs: ChatMessage[], uid: string, seen: ReadonlySet<string>): ChatMessage[] {
  return msgs.filter((m) => !seen.has(m.id) && m.senderId !== uid && canSeeMessage(m, uid));
}

export type RollOutcome = 'crit' | 'hit' | 'miss' | 'success' | 'fail' | 'blocked' | null;

export interface RollSummary {
  /** What the roll was for ("Goblin → Thorn — Scimitar"). */
  title: string;
  /** The result text after the label. */
  body: string;
  outcome: RollOutcome;
  /** A natural 20 or 1 on a d20 in this roll, if any. */
  nat: 20 | 1 | null;
  /** The dice faces ("d20 17", "d6 4"). */
  faces: string[];
}

/** Turn a roll-log entry into a card: label, result, hit/miss etc., and nat 20 / nat 1. */
export function summarizeRoll(e: Pick<RollEntry, 'text' | 'dice'>): RollSummary {
  const text = e.text ?? '';
  const i = text.indexOf(': ');
  const title = i > 0 ? text.slice(0, i) : 'Roll';
  const body = i > 0 ? text.slice(i + 2) : text;
  const up = body.toUpperCase();
  let outcome: RollOutcome = null;
  if (/\bCRIT/.test(up)) outcome = 'crit';
  else if (/\bMISS\b/.test(up)) outcome = 'miss';
  else if (/\bHIT\b/.test(up)) outcome = 'hit';
  else if (/\bSUCCESS\b/.test(up)) outcome = 'success';
  else if (/\bFAIL\b/.test(up)) outcome = 'fail';
  else if (/BLOCKED/.test(up)) outcome = 'blocked';
  const d20s = (e.dice ?? []).filter((d) => d.s === 20).map((d) => d.f);
  // With advantage the higher d20 counts, with disadvantage the lower one.
  // The log says "natural 1"/"natural 20" when it matters; otherwise read the kept d20
  // (with advantage the higher one counts, with disadvantage the lower).
  const kept = d20s.length === 0 ? null : /\(dis\)|disadv/i.test(text) ? Math.min(...d20s) : Math.max(...d20s);
  const nat = /natural 20\b/i.test(text) ? 20 : /natural 1\b/i.test(text) ? 1 : kept === 20 ? 20 : kept === 1 ? 1 : null;
  const faces = (e.dice ?? []).map((d) => `d${d.s} ${d.f}`);
  return { title, body, outcome, nat, faces };
}

/**
 * Which new roll-log entries pop up a card for this person: their own rolls always; the GM
 * also sees everyone else's. Only entries not already `seen` (so joining a game doesn't
 * replay the whole history).
 */
export function rollsToShow(entries: RollEntry[], uid: string, isGm: boolean, seen: ReadonlySet<string>): RollEntry[] {
  return entries.filter((e) => !seen.has(e.id) && (e.byUid === uid || isGm));
}
