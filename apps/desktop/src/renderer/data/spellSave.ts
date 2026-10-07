import type { Token } from '@epoch/shared-types';
import { multiUpdate, readValue } from './realtime';
import { hitChanges, hitNote, isDefeated, pendingSaveAmount, type PendingSave } from './damage';

/**
 * GM resolves a save-based spell's damage once the target rolls at the table (2026-10-07
 * backlog item: auto-damage for spells). Unlike a weapon hit or an attack-spell hit, the final
 * amount depends on the *target's* roll, which the roll-proof pipeline (attacker rolls, their
 * own dice settle it) isn't built for — so this is a direct GM write, same trust tier as
 * "Apply damage to everyone" (AoE) / Give loot / Set HP, not a gatekeeper-checked one. Clears
 * `pendingSave` off the roll entry either way, so the resolve buttons disappear once handled.
 */
export async function resolveSpellSave(
  gameId: string,
  rollId: string,
  ps: PendingSave,
  failed: boolean,
): Promise<void> {
  const amount = pendingSaveAmount(ps, failed);
  const updates: Record<string, unknown> = {
    [`/games/${gameId}/rollLog/${rollId}/pendingSave`]: null,
  };

  if (amount <= 0) {
    updates[`/games/${gameId}/rollLog/${rollId}/applied`] = 'saved — no damage';
    await multiUpdate(updates);
    return;
  }

  const token = (await readValue(`games/${gameId}/tokens/${ps.tokenId}`)) as Token | null;
  if (!token || isDefeated(token)) {
    updates[`/games/${gameId}/rollLog/${rollId}/applied`] = 'target gone';
    await multiUpdate(updates);
    return;
  }

  let charHp: number | undefined;
  if (token.kind === 'character' && token.characterId) {
    const v = await readValue(`characters/${token.characterId}/play/pools/hp/current`);
    charHp = typeof v === 'number' ? v : undefined;
  }
  const changes = hitChanges(gameId, token, amount, charHp);
  if (changes) Object.assign(updates, changes);
  const after =
    token.kind === 'character'
      ? Math.max(0, (charHp ?? 0) - amount)
      : Math.max(0, (token.hp?.current ?? 0) - amount);
  updates[`/games/${gameId}/rollLog/${rollId}/applied`] =
    `${failed ? 'failed save' : 'saved for half'} — ${hitNote(token.name, amount, after === 0)}`;
  await multiUpdate(updates);
}
