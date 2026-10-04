import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { clearRollLog, postRollEntry, trimRollLog, type RollEntry } from '../../data/rollLog';
import { takeProof } from '../../data/secureDice';
import s from '../board/drawers/drawers.module.css';
import r from './RollLog.module.css';

// `describeRoll` now lives in the engine (so the combat resolver can produce it); re-exported
// here for back-compat with existing importers.
export { describeRoll } from '@epoch/engine';

// Shared roll log: every roll source (character attacks, the free-form dice drawer, the
// monster card) posts here, and it syncs table-wide via Firebase (games/{id}/rollLog).
// `postRoll(text)` keeps its simple signature; the provider attaches the roller's identity
// and writes to the DB. Entries come live from game state, so all clients see every roll.

export type { RollEntry };

interface RollLogValue {
  entries: RollEntry[];
  postRoll: (text: string) => void;
  clear: () => void;
  /** GM-only: the Clear button is hidden otherwise. */
  canClear: boolean;
}

const RollLogContext = createContext<RollLogValue | null>(null);

/** How many entries to render (the DB keeps up to CAP=100; we show the newest slice). */
const RENDER_LIMIT = 50;

export function RollLogProvider({
  gameId,
  uid,
  byName,
  log,
  canClear,
  children,
}: {
  gameId: string;
  uid: string;
  /** Attribution prefix for this roller's entries: character name for players, '' for the GM. */
  byName: string;
  log?: Record<string, RollEntry>;
  canClear: boolean;
  children: ReactNode;
}) {
  // Newest-first by push key (chronological, clock-skew-proof), limited for render.
  const entries = useMemo(
    () =>
      Object.values(log ?? {})
        .sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0))
        .slice(0, RENDER_LIMIT),
    [log],
  );

  const postRoll = useCallback(
    (text: string) => {
      // Only the GM trims old entries (players can't delete rolls during a session).
      // Rolled inside secureRoll: attach the dice so the GM's computer can check them.
      const proof = takeProof();
      const entry = {
        text,
        at: Date.now(),
        byUid: uid,
        by: byName,
        ...(proof ? { dice: proof.dice } : {}),
        ...(proof?.rngId ? { rngId: proof.rngId } : {}),
      };
      void postRollEntry(gameId, entry).then(() =>
        canClear ? trimRollLog(gameId, log) : undefined,
      );
    },
    [gameId, uid, byName, log, canClear],
  );

  const clear = useCallback(() => {
    if (canClear) void clearRollLog(gameId);
  }, [gameId, canClear]);

  return (
    <RollLogContext.Provider value={{ entries, postRoll, clear, canClear }}>
      {children}
    </RollLogContext.Provider>
  );
}

export function useRollLog(): RollLogValue {
  const ctx = useContext(RollLogContext);
  if (!ctx) throw new Error('useRollLog must be used within a RollLogProvider');
  return ctx;
}

/** The shared log window. Drop it anywhere inside a RollLogProvider. */
export function RollLog() {
  const { entries, clear, canClear } = useRollLog();
  if (entries.length === 0) {
    return <p className={s.hint}>No rolls yet. Attacks, dice, and monster rolls land here.</p>;
  }
  return (
    <div className={s.section}>
      <div className={s.list}>
        {entries.map((e) => (
          <div
            key={e.id}
            className={s.preview}
            // Match the stat panel's body text exactly: it inherits body's
            // font-family: var(--font-sans), font-size: var(--text-base) (1rem),
            // and color: var(--text-primary) (.preview otherwise renders muted).
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-base)',
              color: 'var(--text-primary)',
            }}
          >
            {e.by ? <strong>{e.by} — </strong> : null}
            {e.text}
            <RollCheck entry={e} />
          </div>
        ))}
      </div>
      {canClear && (
        <button type="button" className={s.place} onClick={clear} style={{ alignSelf: 'flex-start' }}>
          Clear log
        </button>
      )}
    </div>
  );
}

/** Entries from before checked dice existed aren't flagged. */
const CHECKED_DICE_SINCE = Date.UTC(2026, 9, 4, 12, 0);
/** Text that reads like a dice result ("2d6+3", "= 14", "d20 17"). */
const LOOKS_LIKE_A_ROLL = /\b\d*d\d+\b|=\s*-?\d+/i;

/** ✓ with the dice for rolls made by the app; a warning for roll-like text without dice. */
function RollCheck({ entry }: { entry: RollEntry }) {
  if (entry.dice?.length) {
    const faces = entry.dice.map((d) => `d${d.s} ${d.f}`).join(' · ');
    const title = entry.rngId
      ? "Rolled with dice from the GM's computer and checked there"
      : 'Rolled by the app';
    return (
      <span className={r.checked} title={title}>
        <span aria-hidden>✓</span> {faces}
        {entry.skipped ? (
          <span className={r.skipped}>
            {' '}
            · {entry.skipped} earlier roll{entry.skipped === 1 ? '' : 's'} not shown
          </span>
        ) : null}
      </span>
    );
  }
  if (entry.at >= CHECKED_DICE_SINCE && LOOKS_LIKE_A_ROLL.test(entry.text)) {
    return (
      <span className={r.unchecked} title="This line has no dice behind it — it was typed, not rolled by the app">
        not a checked roll
      </span>
    );
  }
  return null;
}
