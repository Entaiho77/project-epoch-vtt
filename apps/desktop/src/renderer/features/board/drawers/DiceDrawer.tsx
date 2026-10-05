import { useState } from 'react';
import { parseDice, rollDice } from '@epoch/engine';
import { secureRoll } from '../../../data/secureDice';
import { Button } from '../../../components/ui/Button';
import { RollLog, useRollLog } from '../../rolllog/rollLog';
import s from './drawers.module.css';
import { setDice3dEnabled, useDice3dEnabled } from '../../dice3d/dice3d';

const QUICK = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

export function DiceDrawer() {
  const [custom, setCustom] = useState('');
  const { postRoll } = useRollLog();

  function roll(notation: string) {
    const parsed = parseDice(notation);
    if (!parsed || parsed.count > 100 || parsed.sides > 1000) {
      postRoll(`"${notation}" is not valid dice notation`);
      return;
    }
    setCustom('');
    void secureRoll(() => {
      const r = rollDice(notation);
      const mod = r.modifier ? (r.modifier > 0 ? `+${r.modifier}` : `${r.modifier}`) : '';
      postRoll(`${notation}: ${r.rolls.join('+')}${mod} = ${r.total}`);
    });
  }

  const show3d = useDice3dEnabled();
  return (
    <div className={s.section}>
      <label className={s.toggleRow}>
        <span>Show my dice in 3D (only you see them roll)</span>
        <input type="checkbox" checked={show3d} onChange={(e) => setDice3dEnabled(e.target.checked)} />
      </label>
      <span className={s.label}>Quick roll</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {QUICK.map((d) => (
          <Button key={d} variant="secondary" size="sm" onClick={() => roll(d)}>
            {d}
          </Button>
        ))}
      </div>

      <div className={s.row}>
        <input
          className={s.input}
          placeholder="2d6+3"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && custom.trim() && roll(custom.trim())}
        />
        <Button size="sm" onClick={() => custom.trim() && roll(custom.trim())} disabled={!custom.trim()}>
          Roll
        </Button>
      </div>

      <span className={s.label}>Log</span>
      <RollLog />
    </div>
  );
}
