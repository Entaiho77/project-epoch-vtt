import { useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import styles from './AuthPage.module.css';

/**
 * First-launch identity screen. The desktop app has no accounts — your identity
 * lives on this machine. All we need is a table name.
 */
export function AuthPage() {
  const auth = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!displayName.trim()) {
      setError('Please choose a display name.');
      return;
    }
    setBusy(true);
    try {
      await auth.setDisplayName(displayName);
    } catch (err) {
      setError((err as Error)?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Left: brand / pitch */}
      <aside className={styles.brand}>
        <div className={styles.brandInner}>
          <div className={styles.logo} aria-hidden="true">
            ✶
          </div>
          <h1 className={styles.brandTitle}>Project Epoch VTT</h1>
          <p className={styles.brandPitch}>
            Buy once. Host free. Play forever. A system-agnostic virtual tabletop —
            your games live on your machine, and friends join your table with a room
            code.
          </p>
          <ul className={styles.brandPoints}>
            <li>Guided character creation that teaches as you build.</li>
            <li>Live shared board with fog, tokens, and initiative.</li>
            <li>Every rule is data — so any system can run on the same engine.</li>
          </ul>
        </div>
      </aside>

      {/* Right: name prompt */}
      <main className={styles.formPanel}>
        <div className={styles.formInner}>
          <h2 className={styles.formTitle}>Welcome to the table</h2>
          <p className={styles.formSub}>
            Pick the name other players will see. No account needed — everything is
            stored on this computer.
          </p>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <TextField
              label="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Shown in the lobby and on the board"
              autoComplete="nickname"
            />

            {error && <div className={styles.error}>{error}</div>}

            <Button type="submit" full disabled={busy}>
              {busy ? 'Please wait…' : 'Enter the lobby'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
