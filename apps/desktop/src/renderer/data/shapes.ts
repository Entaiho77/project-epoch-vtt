import type { BoardShape } from '@solryn/shared-types';
import { newKey, writeValue } from './realtime';

/**
 * AoE/measurement shapes. Stored as an OBJECT MAP at games/{gameId}/shapes/{id} — never an
 * array. Deletion writes null to the key; "clear" writes null to the parent. This is the
 * same shape as tokens/fog and structurally avoids the empty-array Firebase drop that
 * crashed the board before (an emptied array comes back undefined; an emptied object map
 * just comes back undefined too, which callers guard with `?? {}`).
 */

export async function addShape(
  gameId: string,
  shape: Omit<BoardShape, 'id' | 'createdAt'>,
): Promise<string> {
  const id = newKey(`games/${gameId}/shapes`);
  const full: BoardShape = { ...shape, id, createdAt: Date.now() };
  await writeValue(`games/${gameId}/shapes/${id}`, full);
  return id;
}

export function removeShape(gameId: string, shapeId: string): Promise<void> {
  return writeValue(`games/${gameId}/shapes/${shapeId}`, null);
}

/**
 * Clear shapes. With no `ownerUid` → clears the whole map (GM). With an `ownerUid` → clears
 * only that user's shapes. Each removed individually (null per key) so other users' shapes
 * survive; a full clear nulls the parent map.
 */
export function clearShapes(
  gameId: string,
  shapes: Record<string, BoardShape>,
  ownerUid?: string,
): Promise<void> {
  if (!ownerUid) return writeValue(`games/${gameId}/shapes`, null);
  const mine = Object.values(shapes).filter((s) => s.ownerUid === ownerUid);
  return Promise.all(mine.map((s) => removeShape(gameId, s.id))).then(() => undefined);
}
