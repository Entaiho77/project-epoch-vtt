/**
 * Invite codes are short, human-shareable, and avoid visually ambiguous characters
 * (no I/L/O/0/1). Format: XXXX-XXXX (e.g. "SVLT-7K2P").
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Cryptographically random: the invite code is what lets people find a hosted game. */
function randomChars(n: number): string {
  const max = 256 - (256 % ALPHABET.length); // reject values that would skew the odds
  let out = '';
  while (out.length < n) {
    const bytes = new Uint8Array(n * 2);
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b < max && out.length < n) out += ALPHABET[b % ALPHABET.length];
    }
  }
  return out;
}

export function generateInviteCode(): string {
  return `${randomChars(4)}-${randomChars(4)}`;
}

/** Normalize user-entered codes (case, spacing, optional dash). */
export function normalizeInviteCode(raw: string): string {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleaned.length === 8) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  return raw.trim().toUpperCase();
}
