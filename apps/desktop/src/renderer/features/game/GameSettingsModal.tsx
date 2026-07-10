import { useEffect, useMemo, useState } from 'react';
import type { Game, Role } from '@solryn/shared-types';
import type { SystemDefinition } from '@solryn/shared-types';
import {
  deleteGame,
  grantLevelUp,
  quitGame,
  regenerateInviteCode,
  removeMember,
  setStartingLevel,
  updateGameName,
} from '../../data/games';
import { setLevelUpPending, setXp, useGameCharacters } from '../../data/characters';
import { monsterXp } from '@solryn/systems/dnd5e/xp';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/ui/Badge';
import styles from './GameSettingsModal.module.css';

interface GameSettingsModalProps {
  open: boolean;
  onClose: () => void;
  game: Game;
  role: Role;
  currentUid: string;
  /** The current player's character for this game (so "Quit permanently" can delete it). */
  characterId?: string;
  /** True for class-and-level (5e) games → per-player milestone level-up grants. */
  is5e?: boolean;
  /** The active system (for the 5e XP encounter picker's bestiary). */
  system?: SystemDefinition;
  /** Called after the user exits/quits or the GM deletes — navigate back to the lobby. */
  onExit: () => void;
}

export function GameSettingsModal({
  open,
  onClose,
  game,
  role,
  currentUid,
  characterId,
  is5e,
  system,
  onExit,
}: GameSettingsModalProps) {
  const isGM = role === 'gm';
  const gameCharacters = useGameCharacters(isGM && is5e ? game.id : null);
  // 5e XP award state: per-player manual award inputs + an encounter picker (creatureId → count).
  const [xpInputs, setXpInputs] = useState<Record<string, string>>({});
  const [encounter, setEncounter] = useState<Record<string, number>>({});
  const [monsterQuery, setMonsterQuery] = useState('');
  const encounterList = useMemo(
    () =>
      Object.entries(encounter)
        .map(([id, count]) => {
          const b = system?.bestiary.find((m) => m.id === id);
          const cr = typeof b?.stats?.cr === 'number' ? b.stats.cr : 0;
          return { id, name: b?.name ?? id, count, each: monsterXp(cr) };
        })
        .filter((e) => e.count > 0),
    [encounter, system],
  );
  const encounterTotal = encounterList.reduce((sum, e) => sum + e.each * e.count, 0);
  const partySize = Math.max(1, gameCharacters.length);
  const perHead = Math.floor(encounterTotal / partySize);
  const monsterMatches = (() => {
    const q = monsterQuery.trim().toLowerCase();
    if (!q || !system) return [];
    return system.bestiary.filter((m) => m.name.toLowerCase().includes(q) && typeof m.stats?.cr === 'number').slice(0, 6);
  })();

  const awardManual = (charId: string, current: number) => {
    const amt = Number(xpInputs[charId]);
    if (!Number.isFinite(amt) || amt === 0) return;
    void setXp(charId, current + amt);
    setXpInputs((x) => ({ ...x, [charId]: '' }));
  };
  const [name, setName] = useState(game.name);
  const [startLevel, setStartLevel] = useState(game.startingLevel ?? 1);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);

  // Keep the editable name in sync if the live game updates elsewhere.
  useEffect(() => setName(game.name), [game.name]);
  useEffect(() => setStartLevel(game.startingLevel ?? 1), [game.startingLevel]);

  const saveStartLevel = (n: number) => {
    const clamped = Math.max(1, Math.min(20, Math.round(n) || 1));
    setStartLevel(clamped);
    if (clamped !== (game.startingLevel ?? 1)) void setStartingLevel(game.id, clamped);
  };

  const members = Object.entries(game.members ?? {});

  async function saveName() {
    if (name.trim() && name.trim() !== game.name) {
      await updateGameName(game.id, name);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard?.writeText(game.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable; ignore */
    }
  }

  async function regenerate() {
    setBusy(true);
    try {
      await regenerateInviteCode(game.id, game.inviteCode);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${game.name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteGame(game);
      onExit();
    } finally {
      setBusy(false);
    }
  }

  // Soft exit — pure navigation, no writes. Membership, character, and the gameCharacters
  // link all stay, so the game remains in the lobby and rejoining skips the wizard.
  function handleExit() {
    onClose();
    onExit();
  }

  // Permanent quit — removes membership + character link + deletes this game's character.
  async function handleQuit() {
    setBusy(true);
    try {
      await quitGame(game.id, currentUid, characterId);
      setQuitOpen(false);
      onExit();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Game settings" width={520}>
      <div className={styles.body}>
        {/* Game name */}
        <section className={styles.section}>
          {isGM ? (
            <div className={styles.nameRow}>
              <div className={styles.nameField}>
                <TextField
                  label="Game name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => void saveName()}
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => void saveName()}
                disabled={!name.trim() || name.trim() === game.name}
              >
                Save
              </Button>
            </div>
          ) : (
            <Field label="Game name" value={game.name} />
          )}
        </section>

        {/* System (read-only, locked) */}
        <section className={styles.section}>
          <span className={styles.label}>System</span>
          <div className={styles.systemRow}>
            <span
              className={styles.systemGlyph}
              style={{ color: game.systemColor }}
              aria-hidden="true"
            >
              {game.systemGlyph}
            </span>
            <span className={styles.systemName}>{game.systemName}</span>
            <span className={styles.locked}>locked at creation</span>
          </div>
        </section>

        {/* Invite code (GM only controls) */}
        {isGM && (
          <section className={styles.section}>
            <span className={styles.label}>Invite code</span>
            <div className={styles.codeRow}>
              <code className={styles.code}>{game.inviteCode}</code>
              <Button variant="secondary" size="sm" onClick={() => void copyCode()}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void regenerate()}
                disabled={busy}
              >
                Regenerate
              </Button>
            </div>
            <p className={styles.hint}>
              Regenerating invalidates the old code — useful if it leaks or to stop
              new players from joining.
            </p>
          </section>
        )}

        {/* Starting level (GM, 5e). New characters build at level 1, then chain the level-up flow
            up to this level right after finishing — for players joining an existing party, or a
            replacement character after a death. */}
        {isGM && is5e && (
          <section className={styles.section}>
            <span className={styles.label}>Starting level (new characters)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Button
                variant="ghost"
                size="sm"
                disabled={startLevel <= 1}
                onClick={() => saveStartLevel(startLevel - 1)}
                aria-label="Decrease starting level"
              >
                −
              </Button>
              <input
                type="number"
                min={1}
                max={20}
                value={startLevel}
                onChange={(e) => setStartLevel(Number(e.target.value))}
                onBlur={(e) => saveStartLevel(Number(e.target.value))}
                style={{ width: 64, textAlign: 'center' }}
                aria-label="Starting level"
              />
              <Button
                variant="ghost"
                size="sm"
                disabled={startLevel >= 20}
                onClick={() => saveStartLevel(startLevel + 1)}
                aria-label="Increase starting level"
              >
                +
              </Button>
            </div>
            <p className={styles.hint}>
              {startLevel <= 1
                ? 'New characters start at level 1 (default).'
                : `New characters finish the level-1 builder, then immediately level up to ${startLevel} — making the same choices (subclass, ASI/feat, spells) back-to-back. Existing characters are unaffected.`}
            </p>
          </section>
        )}

        {/* Party level-up (GM). 5e uses per-character milestone grants; Solryn levels together. */}
        {isGM && is5e && (
          <section className={styles.section}>
            <span className={styles.label}>Level up (milestone)</span>
            {gameCharacters.length === 0 && <p className={styles.hint}>No player characters yet.</p>}
            {gameCharacters.map((ch) => {
              const atMax = ch.play.level >= 20;
              return (
                <div key={ch.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                  <span>
                    {game.members[ch.ownerUserId]?.displayName ?? 'Player'} — Level {ch.play.level}
                    {ch.play.levelUpPending ? ' · pending' : ''}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={atMax || !!ch.play.levelUpPending}
                    onClick={() => void setLevelUpPending(ch.id, true)}
                  >
                    {atMax ? 'Max level' : 'Grant level up'}
                  </Button>
                </div>
              );
            })}
            {gameCharacters.some((ch) => ch.play.level < 20 && !ch.play.levelUpPending) && (
              <Button
                size="sm"
                onClick={() =>
                  gameCharacters
                    .filter((ch) => ch.play.level < 20 && !ch.play.levelUpPending)
                    .forEach((ch) => void setLevelUpPending(ch.id, true))
                }
              >
                Level up party
              </Button>
            )}
            <p className={styles.hint}>
              Grants a milestone level-up. Each player then applies it (features, HP, ASI, spells)
              from their character sheet.
            </p>
          </section>
        )}

        {/* XP awards (GM, 5e). Coexists with milestone leveling — use either or both. */}
        {isGM && is5e && (
          <section className={styles.section}>
            <span className={styles.label}>Award XP</span>
            {gameCharacters.map((ch) => (
              <div key={ch.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                <span>{game.members[ch.ownerUserId]?.displayName ?? 'Player'} — {(ch.play.xp ?? 0).toLocaleString()} XP</span>
                <span style={{ display: 'flex', gap: 'var(--space-1)' }}>
                  <input
                    type="number"
                    placeholder="+XP"
                    value={xpInputs[ch.id] ?? ''}
                    onChange={(e) => setXpInputs((x) => ({ ...x, [ch.id]: e.target.value }))}
                    style={{ width: 80 }}
                  />
                  <Button size="sm" variant="secondary" onClick={() => awardManual(ch.id, ch.play.xp ?? 0)}>Award</Button>
                </span>
              </div>
            ))}

            {/* Encounter XP: pick defeated monsters, split their total among the party. */}
            <span className={styles.label} style={{ marginTop: 'var(--space-2)' }}>Encounter XP</span>
            <input
              type="text"
              placeholder="Search a defeated creature…"
              value={monsterQuery}
              onChange={(e) => setMonsterQuery(e.target.value)}
            />
            {monsterMatches.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                <span className={styles.hint} style={{ margin: 0 }}>{m.name} · CR {m.stats.crLabel ?? m.stats.cr} · {monsterXp(m.stats.cr as number)} XP</span>
                <Button size="sm" variant="ghost" onClick={() => setEncounter((c) => ({ ...c, [m.id]: (c[m.id] ?? 0) + 1 }))}>+ Add</Button>
              </div>
            ))}
            {encounterList.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                <span>{e.name} ×{e.count} · {(e.each * e.count).toLocaleString()} XP</span>
                <Button size="sm" variant="ghost" onClick={() => setEncounter((c) => { const n = { ...c }; delete n[e.id]; return n; })}>Remove</Button>
              </div>
            ))}
            {encounterTotal > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                <span>Total {encounterTotal.toLocaleString()} XP → {perHead.toLocaleString()} each ({partySize})</span>
                <Button
                  size="sm"
                  onClick={() => {
                    gameCharacters.forEach((ch) => void setXp(ch.id, (ch.play.xp ?? 0) + perHead));
                    setEncounter({});
                    setMonsterQuery('');
                  }}
                >
                  Award to party
                </Button>
              </div>
            )}
            <p className={styles.hint}>
              XP is cumulative. When a player crosses the next threshold, a “Level Up!” button
              appears on their sheet. Milestone grants above still work independently.
            </p>
          </section>
        )}

        {isGM && !is5e && (
          <section className={styles.section}>
            <span className={styles.label}>Party</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
              <span>Levels granted: up to {game.levelGrant ?? 1}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => void grantLevelUp(game.id, game.levelGrant ?? 1)}
              >
                Grant level-up
              </Button>
            </div>
            <p className={styles.hint}>
              In Solryn the party levels together. Each player then takes their level-up
              ceremony (roll, recalculate, place skill points) from their character view.
            </p>
          </section>
        )}

        {/* Members */}
        <section className={styles.section}>
          <span className={styles.label}>Members ({members.length})</span>
          <ul className={styles.members}>
            {members.map(([uid, m]) => (
              <li key={uid} className={styles.memberRow}>
                <Avatar name={m.displayName} size={28} />
                <span className={styles.memberName}>
                  {m.displayName}
                  {uid === currentUid && (
                    <span className={styles.you}> (you)</span>
                  )}
                </span>
                <RoleBadge role={m.role} />
                {isGM && uid !== currentUid && (
                  <button
                    className={styles.remove}
                    onClick={() => void removeMember(game.id, uid)}
                    title="Remove from game"
                    aria-label={`Remove ${m.displayName}`}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Leaving / danger zone */}
        <section className={styles.danger} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
          {/* Everyday action (prominent): return to the lobby, keeping everything. */}
          <Button variant="secondary" onClick={handleExit} disabled={busy}>
            Exit to lobby
          </Button>
          <p className={styles.hint} style={{ margin: 0 }}>
            {isGM
              ? 'Returns to the lobby; the game stays put.'
              : 'Returns to the lobby. Your character and membership are kept — rejoin anytime.'}
          </p>

          {/* Destructive action (less prominent), role-specific. */}
          {isGM ? (
            <Button variant="danger" size="sm" onClick={() => void handleDelete()} disabled={busy}>
              Delete this game
            </Button>
          ) : (
            <button
              type="button"
              className={styles.remove}
              onClick={() => setQuitOpen(true)}
              disabled={busy}
            >
              Quit permanently…
            </button>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={quitOpen}
        title="Quit permanently"
        message={`Leave "${game.name}" for good? Your character for this game will be permanently deleted — this can't be undone. (To just step away and keep your character, use "Exit to lobby" instead.)`}
        confirmLabel="Quit & delete character"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => void handleQuit()}
        onCancel={() => setQuitOpen(false)}
      />
    </Modal>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className={styles.label}>{label}</span>
      <div className={styles.readonly}>{value}</div>
    </div>
  );
}
