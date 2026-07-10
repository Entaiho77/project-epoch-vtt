import { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { createGame } from '../../data/games';
import type { Game } from '@solryn/shared-types';
import { DEFAULT_SYSTEM_ID, listSystems } from '@solryn/systems/registry';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import styles from './CreateGameModal.module.css';

interface CreateGameModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (game: Game) => void;
}

export function CreateGameModal({
  open,
  onClose,
  onCreated,
}: CreateGameModalProps) {
  const { user, displayName } = useAuth();
  const systems = listSystems();
  const [name, setName] = useState('');
  const [systemId, setSystemId] = useState(DEFAULT_SYSTEM_ID);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    if (!user || !name.trim()) return;
    setBusy(true);
    setError('');
    try {
      const game = await createGame({
        name,
        systemId,
        owner: { uid: user.uid, displayName },
      });
      setName('');
      onClose();
      onCreated(game);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a game"
      width={520}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={busy || !name.trim()}>
            {busy ? 'Creating…' : 'Create game'}
          </Button>
        </>
      }
    >
      <div className={styles.body}>
        <TextField
          label="Game name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. The Ashfall Campaign"
          autoFocus
        />

        <div>
          <span className={styles.fieldLabel}>System</span>
          <div className={styles.systems}>
            {systems.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`${styles.systemCard} ${
                  systemId === s.id ? styles.selected : ''
                }`}
                onClick={() => setSystemId(s.id)}
                aria-pressed={systemId === s.id}
              >
                <span
                  className={styles.systemGlyph}
                  style={{ color: s.color }}
                  aria-hidden="true"
                >
                  {s.glyph}
                </span>
                <span className={styles.systemText}>
                  <span className={styles.systemName}>{s.name}</span>
                  {s.tagline && (
                    <span className={styles.systemTagline}>{s.tagline}</span>
                  )}
                </span>
              </button>
            ))}

            {/* The deferred system builder lives behind this option. */}
            <div
              className={`${styles.systemCard} ${styles.disabled}`}
              aria-disabled="true"
            >
              <span className={styles.systemGlyph} aria-hidden="true">
                +
              </span>
              <span className={styles.systemText}>
                <span className={styles.systemName}>Custom system</span>
                <span className={styles.systemTagline}>
                  Build your own — coming soon
                </span>
              </span>
            </div>
          </div>
        </div>

        <p className={styles.note}>
          The system is locked once the game is created. Other settings can be
          changed later in game settings.
        </p>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </Modal>
  );
}
