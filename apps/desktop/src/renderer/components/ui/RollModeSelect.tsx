import styles from './RollModeSelect.module.css';

export type RollMode = 'advantage' | 'disadvantage' | undefined;

/**
 * Normal / Advantage / Disadvantage — one segmented control shared by character sheets and
 * monster cards so the GM and players pick a roll mode the same way.
 */
export function RollModeSelect({ value, onChange }: { value: RollMode; onChange: (m: RollMode) => void }) {
  const opts: { id: RollMode; label: string }[] = [
    { id: 'disadvantage', label: 'Disadv.' },
    { id: undefined, label: 'Normal' },
    { id: 'advantage', label: 'Adv.' },
  ];
  return (
    <div className={styles.group} role="radiogroup" aria-label="Roll mode">
      {opts.map((o) => (
        <button
          key={o.label}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          title={o.id === 'advantage' ? 'Advantage' : o.id === 'disadvantage' ? 'Disadvantage' : 'Normal'}
          className={`${styles.opt} ${value === o.id ? styles[o.id ?? 'normal'] : ''}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
