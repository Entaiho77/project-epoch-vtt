import { useState } from 'react';
import styles from './ResourceTracker.module.css';

export type ResourceColor = 'teal' | 'purple' | 'amber';

interface ResourceTrackerProps {
  label: string;
  /** Full name shown as a hover tooltip on the (often abbreviated) label. */
  title?: string;
  color?: ResourceColor;
  current: number;
  max: number;
  onChange: (next: number) => void;
}

/**
 * Reusable current/max tracker used 3× (HP / Arcana / Luck). Type an amount, press −
 * to spend/take damage or + to recover/heal. For HP the player enters the FINAL
 * post-DR number — this control never auto-subtracts DR. Clamps to 0–max.
 */
export function ResourceTracker({
  label,
  title,
  color = 'teal',
  current,
  max,
  onChange,
}: ResourceTrackerProps) {
  const [amount, setAmount] = useState('1');
  const amt = Math.max(0, Math.floor(Number(amount) || 0));
  const clamp = (n: number) => Math.max(0, Math.min(n, max));
  const disabled = max <= 0;

  return (
    <div className={`${styles.tracker} ${styles[color]}`}>
      <div className={styles.head}>
        <span className={styles.label} title={title}>{label}</span>
        <span className={styles.value}>
          {current}
          <span className={styles.max}>/{max}</span>
        </span>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.minus}
          onClick={() => onChange(clamp(current - amt))}
          disabled={disabled}
          aria-label={`Reduce ${label} by ${amt}`}
        >
          −
        </button>
        <input
          className={styles.amount}
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
          inputMode="numeric"
          aria-label={`${label} amount`}
        />
        <button
          type="button"
          className={styles.plus}
          onClick={() => onChange(clamp(current + amt))}
          disabled={disabled}
          aria-label={`Increase ${label} by ${amt}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
