import type { ReactNode } from 'react';
import { Button } from '../../components/ui/Button';
import styles from './StepFrame.module.css';

export interface StepFrameNav {
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  onNext: () => void;
  nextLabel: string;
  nextDisabled: boolean;
  /** Omit to hide Back (the stat-roll gate — steps 1 & 2 have no Back). */
  onBack?: () => void;
}

interface StepFrameProps extends StepFrameNav {
  /** The persistent "why" panel on the right. */
  teaching: ReactNode;
  /** The action area on the left. */
  children: ReactNode;
}

/**
 * Shared frame for every builder step (§4.5): progress bar, "Step N of M", title +
 * plain-language instruction, a left action area, a right persistent teaching panel, and
 * a gated Next that names the next step.
 */
export function StepFrame({
  stepNumber,
  totalSteps,
  title,
  instruction,
  teaching,
  children,
  onNext,
  nextLabel,
  nextDisabled,
  onBack,
}: StepFrameProps) {
  const pct = Math.round((stepNumber / totalSteps) * 100);

  return (
    <div className={styles.frame}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>

      <header className={styles.head}>
        <span className={styles.stepCount}>
          Step {stepNumber} of {totalSteps}
        </span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.instruction}>{instruction}</p>
      </header>

      <div className={styles.columns}>
        <section className={styles.action}>{children}</section>
        <aside className={styles.teaching}>
          <span className={styles.teachingLabel}>Why this matters</span>
          {teaching}
        </aside>
      </div>

      <footer className={styles.footer}>
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            ‹ Back
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </Button>
      </footer>
    </div>
  );
}
