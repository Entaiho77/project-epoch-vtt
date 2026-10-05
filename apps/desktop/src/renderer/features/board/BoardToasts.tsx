import { useCallback, useEffect, useRef, useState } from 'react';
import type { RollSummary } from './toastSummaries';
import styles from './BoardToasts.module.css';

/**
 * Pop-up cards in the board's top-left corner: chat/whisper bubbles and roll results. Each
 * fades on its own after a few seconds; clicking one runs its action (open Chat / the Log)
 * and dismisses it.
 */

export type Toast =
  | { id: string; kind: 'chat' | 'whisper'; from: string; text: string }
  | { id: string; kind: 'roll'; by: string; mine: boolean; roll: RollSummary };

const LIFETIME_MS: Record<Toast['kind'], number> = { chat: 6000, whisper: 8000, roll: 6000 };
const MAX_SHOWN = 4;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
    const tm = timers.current.get(id);
    if (tm) clearTimeout(tm);
    timers.current.delete(id);
  }, []);

  const push = useCallback(
    (t: Toast) => {
      setToasts((ts) => [...ts.filter((x) => x.id !== t.id), t].slice(-MAX_SHOWN));
      timers.current.set(t.id, setTimeout(() => dismiss(t.id), LIFETIME_MS[t.kind]));
    },
    [dismiss],
  );

  useEffect(() => {
    const all = timers.current;
    return () => all.forEach((tm) => clearTimeout(tm));
  }, []);

  return { toasts, push, dismiss };
}

/**
 * Calls `onArrive` with items that show up after the first moment of mounting. Whatever is
 * already there when the board opens (chat history, old rolls) is treated as seen, so joining
 * a game doesn't replay it all. Tracks ids, not timestamps (other computers' clocks differ).
 */
export function useArrivals<T extends { id: string }>(items: T[], onArrive: (fresh: T[]) => void, warmupMs = 2500) {
  const seen = useRef(new Set<string>());
  const mountedAt = useRef(Date.now());
  const cb = useRef(onArrive);
  cb.current = onArrive;
  useEffect(() => {
    const fresh = items.filter((i) => !seen.current.has(i.id));
    for (const i of fresh) seen.current.add(i.id);
    if (fresh.length && Date.now() - mountedAt.current > warmupMs) cb.current(fresh);
  }, [items, warmupMs]);
}

export function BoardToasts({
  toasts,
  onDismiss,
  onOpen,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  onOpen: (t: Toast) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className={styles.stack} aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`${styles.card} ${styles[t.kind]} ${t.kind === 'roll' && !t.mine ? styles.others : ''}`}
          onClick={() => {
            onOpen(t);
            onDismiss(t.id);
          }}
          title={t.kind === 'roll' ? 'Open the roll log' : 'Open chat'}
        >
          {t.kind === 'roll' ? <RollCard t={t} /> : <ChatCard t={t} />}
        </button>
      ))}
    </div>
  );
}

function ChatCard({ t }: { t: Extract<Toast, { kind: 'chat' | 'whisper' }> }) {
  return (
    <>
      <span className={styles.head}>
        {t.kind === 'whisper' ? `${t.from} whispered to you` : t.from}
      </span>
      <span className={styles.text}>{t.text.length > 140 ? `${t.text.slice(0, 140)}…` : t.text}</span>
    </>
  );
}

const OUTCOME_LABEL: Record<NonNullable<RollSummary['outcome']>, string> = {
  crit: 'Critical!',
  hit: 'Hit',
  miss: 'Miss',
  success: 'Success',
  fail: 'Fail',
  blocked: 'Blocked',
};

function RollCard({ t }: { t: Extract<Toast, { kind: 'roll' }> }) {
  const { roll } = t;
  return (
    <>
      <span className={styles.head}>
        {t.mine ? '' : t.by ? `${t.by} — ` : ''}
        {roll.title}
      </span>
      <span className={styles.rollRow}>
        {roll.nat && (
          <span className={roll.nat === 20 ? styles.nat20 : styles.nat1}>Natural {roll.nat}</span>
        )}
        {roll.outcome && (
          <span className={`${styles.outcome} ${styles[`o_${roll.outcome}`]}`}>{OUTCOME_LABEL[roll.outcome]}</span>
        )}
      </span>
      <span className={styles.text}>{roll.body}</span>
      {roll.faces.length > 0 && <span className={styles.faces}>{roll.faces.join(' · ')}</span>}
    </>
  );
}
