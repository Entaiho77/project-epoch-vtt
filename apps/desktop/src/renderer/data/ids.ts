/**
 * Invite codes are short, human-shareable, and avoid visually ambiguous characters
 * (no I/L/O/0/1). Format: XXXX-XXXX (e.g. "SVLT-7K2P").
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function randomChars(n: number): string {
  let out = '';
  for (let i = 0; i < n; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
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
