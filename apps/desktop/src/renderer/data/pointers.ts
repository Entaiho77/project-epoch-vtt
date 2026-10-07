import type { SharedLightPenStroke, SharedPing } from '@epoch/shared-types';
import { writeValue } from './realtime';

/**
 * Board pointers (2026-10-07 MVP backlog): ephemeral, self-clearing marks any game member can
 * drop on the map to call attention to something, without leaving a permanent trace the way a
 * measuring line does — "Ping" (a pulsing marker) and "Light pen" (a fading glowing trail).
 *
 * Same "one per person, writer clears their own key" discipline as measures.ts/setMyMeasure.
 * There is no shared-state TTL mechanism anywhere in this codebase (confirmed — nothing reads
 * an `expiresAt`), so each client times its own write out locally (a `setTimeout` that writes
 * null, same style BoardToasts already uses for local-only ephemeral UI) rather than inventing
 * a filter-on-read expiry convention nothing else uses.
 */

/** Drop (or clear, with null) my ping. Pulses on everyone's screen for ~2s then clears itself. */
export function setMyPing(gameId: string, uid: string, p: SharedPing | null): Promise<void> {
  return writeValue(`games/${gameId}/pings/${uid}`, p);
}

/** Replace my light-pen stroke (the whole points array) as I drag, or clear it (null) once it's
 *  fully faded after the drag ends. */
export function setMyLightPen(gameId: string, uid: string, s: SharedLightPenStroke | null): Promise<void> {
  return writeValue(`games/${gameId}/lightPen/${uid}`, s);
}
