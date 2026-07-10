import { StepFrame } from '../StepFrame';
import type { StepProps } from '../stepTypes';
import { effectiveScores } from '../builderModel';
import s from './steps.module.css';

export function ChooseRaceStep({ system, draft, dispatch, nav }: StepProps) {
  const eff = effectiveScores(system, draft);
  const abbr = (id: string) =>
    system.coreStats.find((c) => c.id === id)?.abbreviation ?? id;

  const selected = system.ancestries.find((a) => a.id === draft.ancestryId);
  const hasChoice = Boolean(selected?.bonuses.some((b) => b.kind === 'choice'));

  // "Why this matters": a pinned orientation line that always shows, then EITHER the rest of
  // the orientation (no race chosen) OR the selected race's full detail (replace-on-select).
  const pinned = (
    <p className={s.pinnedNote}>
      A race’s bonuses apply to your <strong>rolled stats right now</strong>; its advantages
      and weaknesses are <strong>recorded</strong> for play, not creation.
    </p>
  );

  const teaching = (
    <>
      {pinned}
      {selected ? (
        <div className={s.raceDetail}>
          <span className={s.raceDetailName}>{selected.name}</span>
          <span className={s.optionSummary}>{selected.bonusSummary}</span>

          {selected.advantages.length > 0 && (
            <div className={s.detailGroup}>
              <span className={s.detailLabel}>Advantages</span>
              <ul className={s.detailList}>
                {selected.advantages.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {selected.weaknesses.length > 0 && (
            <div className={s.detailGroup}>
              <span className={s.detailLabel}>
                {selected.weaknesses.length === 1 ? 'Weakness' : 'Weaknesses'}
              </span>
              <ul className={`${s.detailList} ${s.weak}`}>
                {selected.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Flavor renders only once the ruleset supplies it (optional Ancestry.flavor). */}
          {selected.flavor && <p className={s.flavor}>{selected.flavor}</p>}
        </div>
      ) : (
        <>
          <p className={s.teachText}>
            There’s no going back from here to the stat roll — those rolls are sealed.
          </p>
          <p className={s.detailPrompt}>Select a race to see its full details here.</p>
        </>
      )}
    </>
  );

  return (
    <StepFrame {...nav} teaching={teaching}>
      <div className={s.toolbar}>
        <div className={s.assignRow}>
          {system.coreStats.map((c) => {
            const base = draft.coreScores[c.id] ?? 0;
            const e = eff[c.id] ?? base;
            const delta = e - base;
            return (
              <span key={c.id} className={s.statToggle} style={{ cursor: 'default' }}>
                {c.abbreviation} {e}
                {delta !== 0 && <span className={s.delta}> +{delta}</span>}
              </span>
            );
          })}
        </div>
      </div>

      {/* Compact 3-column grid — all races visible, no scroll for the current 6–9. */}
      <div className={s.raceGrid}>
        {system.ancestries.map((a) => {
          const isSel = draft.ancestryId === a.id;
          const select = () => dispatch({ type: 'chooseAncestry', ancestryId: a.id });
          return (
            <div
              key={a.id}
              className={[s.raceCard, isSel ? s.selected : ''].filter(Boolean).join(' ')}
              role="button"
              tabIndex={0}
              aria-pressed={isSel}
              onClick={select}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  select();
                }
              }}
            >
              <span className={s.raceCardName}>
                {a.name}
                {a.provisional && <span className={s.provisional}>draft</span>}
              </span>
              <span className={s.raceCardBonus}>{a.bonusSummary}</span>
            </div>
          );
        })}
      </div>

      {/* Flexible-bonus picker: appears under the grid only when the chosen race needs it. */}
      {selected && hasChoice && (
        <div className={s.assignSection}>
          {selected.bonuses.map((b, i) =>
            b.kind === 'choice' ? (
              <div key={i}>
                <span className={s.fieldLabel}>
                  {selected.name}: assign +{b.amount} to {b.count}{' '}
                  {b.count === 1 ? 'stat' : 'stats'}
                  {b.from ? ` (${b.from.map(abbr).join(' or ')})` : ' of your choice'}
                </span>
                <div className={s.assignRow}>
                  {(b.from ?? system.coreStats.map((c) => c.id)).map((statId) => {
                    const picks = draft.choiceSelections[i] ?? [];
                    const on = picks.includes(statId);
                    const full = picks.length >= b.count && !on;
                    return (
                      <button
                        key={statId}
                        type="button"
                        className={[s.statToggle, on ? s.on : ''].filter(Boolean).join(' ')}
                        disabled={full}
                        onClick={() =>
                          dispatch({
                            type: 'setChoiceSelection',
                            bonusIndex: i,
                            statIds: on
                              ? picks.filter((p) => p !== statId)
                              : [...picks, statId],
                          })
                        }
                      >
                        {abbr(statId)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null,
          )}
        </div>
      )}
    </StepFrame>
  );
}
