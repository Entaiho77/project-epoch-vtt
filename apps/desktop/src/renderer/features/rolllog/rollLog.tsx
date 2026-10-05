import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { clearRollLog, postRollEntry, trimRollLog, type RollEntry } from '../../data/rollLog';
import { takeProof } from '../../data/secureDice';
import { multiUpdate, readValue } from '../../data/realtime';
import { hitFollowUps } from '../../data/gatekeeper';
import type { Hit } from '../../data/damage';
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
  /** Post a roll. `hit` = damage to the roller's target, taken off its HP automatically. */
  postRoll: (text: string, opts?: { hit?: Hit }) => void;
  clear: () => void;
  /** GM-only: the Clear button is hidden otherwise. */
  canClear: boolean;
}

const RollLogContext = createContext<RollLogValue | null>(null);

/** How many entries are kept for the log (the DB keeps up to its CAP). */
const RENDER_LIMIT = 300;
/** Newest rolls shown before "Show older rolls". */
export const SHOWN_AT_FIRST = 10;

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
    (text: string, opts?: { hit?: Hit }) => {
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
        // Damage only rides on a roll with dice behind it (the GM's computer checks them).
        ...(opts?.hit && proof ? { hit: opts.hit } : {}),
      };
      void postRollEntry(gameId, entry).then(async (id) => {
        if (!canClear) return; // players: the GM's computer applies the hit after checking it
        // The GM's own roll: apply the hit here, the same way a checked player hit is applied.
        if (entry.hit) {
          const changes = await hitFollowUps(id, entry.hit, { gameId, read: (p) => readValue(p) });
          if (Object.keys(changes).length) await multiUpdate(changes);
        }
        await trimRollLog(gameId, log);
      });
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
  const [showAll, setShowAll] = useState(false);
  if (entries.length === 0) {
    return <p className={s.hint}>No rolls yet. Attacks, dice, and monster rolls land here.</p>;
  }
  const older = Math.max(0, entries.length - SHOWN_AT_FIRST);
  const shown = showAll ? entries : entries.slice(0, SHOWN_AT_FIRST);
  return (
    <div className={s.section}>
      {canClear && (
        <button type="button" className={s.place} onClick={clear} style={{ alignSelf: 'flex-end' }} title="Clear the roll log for everyone">
          Clear log
        </button>
      )}
      <div className={s.list}>
        {shown.map((e) => (
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
            {e.applied && <span className={r.applied}> · {e.applied}</span>}
            <RollCheck entry={e} />
          </div>
        ))}
      </div>
      {older > 0 && (
        <button type="button" className={s.place} onClick={() => setShowAll((v) => !v)} style={{ alignSelf: 'flex-start' }}>
          {showAll ? 'Show only the newest rolls' : `Show older rolls (${older})`}
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
