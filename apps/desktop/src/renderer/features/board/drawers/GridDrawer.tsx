import { GRID_DEFAULTS, setGridPrefs, useGridPrefs } from '../gridPrefs';
import s from './drawers.module.css';

/** "Grid" panel: how strong the grid looks on your screen only. */
export function GridDrawer({ gmToggle }: { gmToggle?: { on: boolean; onChange: (on: boolean) => void } }) {
  const p = useGridPrefs();
  return (
    <div className={s.section}>
      {gmToggle && (
        <label className={s.toggleRow}>
          <span>Show the grid on this map (everyone)</span>
          <input type="checkbox" checked={gmToggle.on} onChange={(e) => gmToggle.onChange(e.target.checked)} />
        </label>
      )}
      <span className={s.label}>On your screen</span>
      <p className={s.hint}>Only changes what you see — everyone sets their own.</p>
      <label className={s.label} htmlFor="grid-strength" style={{ marginBottom: 0 }}>
        Strength · {Math.round(p.opacity * 100)}%
      </label>
      <input
        id="grid-strength"
        type="range"
        min={5}
        max={100}
        step={5}
        value={Math.round(p.opacity * 100)}
        onChange={(e) => setGridPrefs({ opacity: Number(e.target.value) / 100 })}
      />
      <label className={s.label} htmlFor="grid-width" style={{ marginBottom: 0 }}>
        Thickness · {p.width}px
      </label>
      <input
        id="grid-width"
        type="range"
        min={1}
        max={4}
        step={1}
        value={p.width}
        onChange={(e) => setGridPrefs({ width: Number(e.target.value) })}
      />
      <span className={s.label}>Line color</span>
      <div className={s.row}>
        {(['white', 'black'] as const).map((c) => (
          <button
            key={c}
            type="button"
            className={`${s.tab} ${p.color === c ? s.tabActive : ''}`}
            onClick={() => setGridPrefs({ color: c })}
            aria-pressed={p.color === c}
          >
            {c === 'white' ? 'Light (dark maps)' : 'Dark (light maps)'}
          </button>
        ))}
      </div>
      <button type="button" className={s.place} onClick={() => setGridPrefs(GRID_DEFAULTS)} style={{ alignSelf: 'flex-start' }}>
        Reset
      </button>
    </div>
  );
}
