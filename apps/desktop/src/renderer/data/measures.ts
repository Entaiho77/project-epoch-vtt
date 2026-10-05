import type { SharedMeasure } from '@epoch/shared-types';
import { writeValue } from './realtime';

/**
 * Measuring lines stay on the board for everyone until removed. One per person, stored at
 * games/{gameId}/measures/{uid}: a new measurement replaces your last one.
 */
export function setMyMeasure(gameId: string, uid: string, m: SharedMeasure | null): Promise<void> {
  return writeValue(`games/${gameId}/measures/${uid}`, m);
}

/** GM: clear everyone's measuring lines. */
export function clearAllMeasures(gameId: string): Promise<void> {
  return writeValue(`games/${gameId}/measures`, null);
}

/** Move a placed shape (grid-anchored) to a new square. */
export function moveShape(gameId: string, shapeId: string, col: number, row: number): Promise<void> {
  return writeValue(`games/${gameId}/shapes/${shapeId}/anchor`, { col, row });
}
