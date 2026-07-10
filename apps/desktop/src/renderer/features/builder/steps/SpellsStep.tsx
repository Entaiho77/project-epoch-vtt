import { useState } from 'react';
import { StepFrame } from '../StepFrame';
import type { StepProps } from '../stepTypes';
import { spellAccess } from '../builderModel';
import s from './steps.module.css';

export function SpellsStep({ system, draft, dispatch, nav }: StepProps) {
  const [query, setQuery] = useState('');
  const access = spellAccess(system, draft);
  const chosenCount = draft.knownSpellIds.length;
  const full = chosenCount >= access.knownCount;

  const q = query.trim().toLowerCase();
  const list = system.spells.filter(
    (sp) =>
      !q ||
      sp.name.toLowerCase().includes(q) ||
      (sp.synopsis ?? '').toLowerCase().includes(q),
  );

  const teaching = (
    <>
      <p className={s.teachText}>
        Your known-spell count comes from your own stats: (Arcana mod × 2){' '}
        <strong>{access.modPart}</strong> + level <strong>{access.levelPart}</strong>
        {access.ancestryBonus > 0 && (
          <>
            {' '}
            + <strong>{access.ancestryBonus}</strong> (Elf, non-damaging)
          </>
        )}{' '}
        = <strong>{access.knownCount}</strong>.
      </p>
      <p className={s.teachText}>
        Spells <strong>auto-hit</strong> — offensive spells start at a{' '}
        {system.modes.combat.baseSpellDie ?? '1d4'} base die and are rolled directly.
        Hover a spell for its effect.
      </p>
    </>
  );

  return (
    <StepFrame {...nav} teaching={teaching}>
      <div className={s.toolbar}>
        <span className={`${s.counter} ${full ? s.done : ''}`}>
          Known: {chosenCount}/{access.knownCount}
        </span>
        <input
          className={s.search}
          placeholder="Search spells…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={s.chipGrid}>
        {list.map((sp) => {
          const on = draft.knownSpellIds.includes(sp.id);
          return (
            <button
              key={sp.id}
              type="button"
              className={`${s.chip} ${on ? s.selected : ''}`}
              disabled={full && !on}
              title={`${sp.synopsis ? `${sp.synopsis}\n\n` : ''}${sp.damageDice ? `${sp.damageDice} ${sp.damageType ?? ''} · ` : ''}${sp.cost} AP · ${sp.range}`}
              onClick={() => dispatch({ type: 'toggleSpell', spellId: sp.id })}
            >
              <span className={s.chipName}>{sp.name}</span>
              <span className={`${s.chipTag} ${sp.type === 'offensive' ? s.offensive : s.utility}`}>
                {sp.type}
                {sp.damageDice ? ` · ${sp.damageDice}` : ''}
              </span>
            </button>
          );
        })}
      </div>
    </StepFrame>
  );
}
