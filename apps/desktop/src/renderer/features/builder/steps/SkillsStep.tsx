import { useState } from 'react';
import { StepFrame } from '../StepFrame';
import type { StepProps } from '../stepTypes';
import { chosenInCategory } from '../builderModel';
import s from './steps.module.css';

export function SkillsStep({
  system,
  draft,
  dispatch,
  nav,
  subIndex,
}: StepProps & { subIndex: number }) {
  const [query, setQuery] = useState('');
  const category = system.skillCategories[subIndex];
  const chosen = chosenInCategory(system, draft, category.id);
  const limit = category.chooseAtCreation;
  const full = chosen.length >= limit;

  const q = query.trim().toLowerCase();
  const list = system.skills.filter(
    (sk) =>
      sk.categoryId === category.id &&
      (!q ||
        sk.name.toLowerCase().includes(q) ||
        (sk.description ?? '').toLowerCase().includes(q)),
  );

  const teaching = (
    <>
      <p className={s.teachText}>
        <strong>{category.name}:</strong> choose exactly <strong>{limit}</strong>. All
        different — you can’t double points into one skill at creation.
      </p>
      <p className={s.teachText}>
        Hover any skill to see what it does and a quick example. Skills improve later
        through use and in-town training.
      </p>
    </>
  );

  return (
    <StepFrame {...nav} teaching={teaching}>
      <div className={s.toolbar}>
        <span className={`${s.counter} ${chosen.length === limit ? s.done : ''}`}>
          {category.name}: {chosen.length}/{limit}
        </span>
        <input
          className={s.search}
          placeholder="Search skills…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={s.chipGrid}>
        {list.map((sk) => {
          const on = draft.chosenSkillIds.includes(sk.id);
          return (
            <button
              key={sk.id}
              type="button"
              className={`${s.chip} ${on ? s.selected : ''}`}
              disabled={full && !on}
              title={
                sk.description
                  ? `${sk.description}${sk.exampleUse ? `\n\nExample: ${sk.exampleUse}` : ''}`
                  : sk.name
              }
              onClick={() => dispatch({ type: 'toggleSkill', skillId: sk.id })}
            >
              <span className={s.chipName}>{sk.name}</span>
              {sk.attribute && (
                <span className={s.chipTag} style={{ color: 'var(--text-muted)' }}>
                  {sk.attribute}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </StepFrame>
  );
}
