import { randomInt } from 'node:crypto';

/** Room-code alphabet: uppercase letters only (no digits — avoids O/0, I/1 confusion). */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CODE_LENGTH = 6;

/**
 * Generate a random 6-character uppercase room code that satisfies `isFree` (uniqueness check
 * against the active rooms). Retries on collision; throws if it can't find a free code, which in
 * practice only happens when the room map is saturated (26^6 ≈ 300M combinations).
 */
export function generateRoomCode(isFree: (code: string) => boolean): string {
  for (let attempt = 0; attempt < 1000; attempt++) {
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) code += ALPHABET[randomInt(ALPHABET.length)];
    if (isFree(code)) return code;
  }
  throw new Error('Unable to allocate a unique room code');
}
