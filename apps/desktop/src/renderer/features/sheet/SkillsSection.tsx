import { useState } from 'react';
import type { SystemDefinition } from '@epoch/shared-types';
import type { Character, CharacterSkillState } from '@epoch/shared-types';
import { computeSkillState } from '@epoch/engine';
import { confirmSkillPoints, setSkillState } from '../../data/characters';
import { adjustDraft, draftSpent, withDraft, type SkillDraft } from './skillDraft';
import styles from './SkillsSection.module.css';

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

export function SkillsSection({
  system,
  character,
}: {
  system: SystemDefinition;
  character: Character;
}) {
  const mode = system.modes.skill;
  const saved = character.play.unspentSkillPoints ?? 0;
  const skillById = (id: string) => system.skills.find((s) => s.id === id);
  // Points are pencilled in first: move them around freely, then Confirm to lock them in.
  const [draft, setDraft] = useState<SkillDraft>({});
  const spent = draftSpent(draft);
  const unspent = saved - spent;
  const shown = withDraft(character.play.skills, draft, mode.maxPointsPerSkill);

  const nudge = (skillId: string, delta: 1 | -1) =>
    setDraft((d) =>
      adjustDraft(d, skillId, delta, {
        available: saved,
        current: character.play.skills[skillId]?.investedPoints ?? 0,
        maxPerSkill: mode.maxPointsPerSkill,
      }),
    );

  function confirm() {
    const changed: Record<string, CharacterSkillState> = {};
    for (const id of Object.keys(draft)) changed[id] = shown[id];
    void confirmSkillPoints(character.id, changed, unspent).then(() => setDraft({}));
  }

  function train(skillId: string) {
    const cur = character.play.skills[skillId];
    if (!cur) return;
    void setSkillState(character.id, skillId, {
      investedPoints: cur.investedPoints,
      realizedPoints: cur.investedPoints,
    });
  }

  return (
    <section>
      <div className={styles.head}>
        <h3 className={styles.title}>Skills</h3>
        <span className={`${styles.unspent} ${unspent > 0 ? styles.has : ''}`}>
          {unspent > 0 ? `${unspent} point${unspent === 1 ? '' : 's'} to spend` : 'No points to spend'}
        </span>
      </div>
      {spent > 0 && (
        <div className={styles.confirmBar}>
          <span>
            {spent} point{spent === 1 ? '' : 's'} placed — not locked in yet. Move them with + / − until you're happy.
          </span>
          <span className={styles.confirmActions}>
            <button type="button" className={styles.smallBtn} onClick={() => setDraft({})}>
              Undo
            </button>
            <button type="button" className={`${styles.smallBtn} ${styles.trainBtn}`} onClick={confirm}>
              Confirm
            </button>
          </span>
        </div>
      )}

      <div className={styles.columns}>
        {system.skillCategories.map((cat) => {
          const knownIds = Object.keys(shown).filter(
            (id) => skillById(id)?.categoryId === cat.id,
          );
          const unknown = system.skills.filter(
            (s) => s.categoryId === cat.id && !shown[s.id],
          );
          return (
            <div key={cat.id} className={styles.col}>
              <h4 className={styles.colTitle}>{cat.name}</h4>
              <div className={styles.rows}>
                {knownIds.length === 0 && (
                  <p className={styles.none}>None yet</p>
                )}
                {knownIds.map((id) => (
                  <SkillRow
                    key={id}
                    name={skillById(id)?.name ?? id}
                    description={skillById(id)?.description}
                    exampleUse={skillById(id)?.exampleUse}
                    state={shown[id]}
                    mode={mode}
                    canPlace={unspent > 0}
                    pencilled={draft[id] ?? 0}
                    onPlace={() => nudge(id, 1)}
                    onRemove={() => nudge(id, -1)}
                    onTrain={() => train(id)}
                  />
                ))}
              </div>
              {unspent > 0 && unknown.length > 0 && (
                <select
                  className={styles.learn}
                  value=""
                  onChange={(e) => e.target.value && nudge(e.target.value, 1)}
                  aria-label={`Learn a new ${cat.name} skill`}
                >
                  <option value="">+ Learn new…</option>
                  {unknown.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SkillRow({
  name,
  description,
  exampleUse,
  state,
  mode,
  canPlace,
  pencilled,
  onPlace,
  onRemove,
  onTrain,
}: {
  name: string;
  description?: string;
  exampleUse?: string;
  state: CharacterSkillState;
  mode: SystemDefinition['modes']['skill'];
  canPlace: boolean;
  /** Points pencilled into this skill, not confirmed yet. */
  pencilled: number;
  onPlace: () => void;
  onRemove: () => void;
  onTrain: () => void;
}) {
  const [open, setOpen] = useState(pencilled > 0);
  const s = computeSkillState(state.investedPoints, state.realizedPoints, mode);
  const tierLabel = s.activeTier ? s.activeTier.label.slice(0, 4) : 'Untr';
  const bubbles = Array.from({ length: mode.pointsPerTier }, (_, i) => i < s.invested.bubblesFilled);

  return (
    <div className={styles.skill}>
      <button
        type="button"
        className={styles.skillMain}
        onClick={() => setOpen((o) => !o)}
        title={
          description ? `${description}${exampleUse ? `\n\nExample: ${exampleUse}` : ''}` : undefined
        }
      >
        <span className={styles.skillName}>
          {name}
          {pencilled > 0 && <span className={styles.pencil}> +{pencilled}</span>}
        </span>
        <span
          className={`${styles.tier} ${s.pendingTraining ? styles.pending : ''}`}
        >
          {tierLabel} {sign(s.activeBonus)}
        </span>
        <span className={styles.bubbles}>
          {bubbles.map((filled, i) => (
            <span
              key={i}
              className={`${styles.bubble} ${
                filled ? (s.pendingTraining ? styles.bubblePending : styles.bubbleOn) : ''
              }`}
            />
          ))}
        </span>
      </button>

      {open && (
        <div className={styles.detail}>
          {description && <p className={styles.detailText}>{description}</p>}
          <p className={styles.detailMeta}>
            Invested {s.investedPoints} · trained to {s.realizedPoints}
            {s.pendingTraining && (
              <span className={styles.needsTraining}> · needs training</span>
            )}
          </p>
          <div className={styles.detailActions}>
            {canPlace && s.investedPoints < mode.maxPointsPerSkill && (
              <button type="button" className={styles.smallBtn} onClick={onPlace}>
                + Place point
              </button>
            )}
            {pencilled > 0 && (
              <button type="button" className={styles.smallBtn} onClick={onRemove}>
                − Take back
              </button>
            )}
            {s.pendingTraining && pencilled === 0 && (
              <button
                type="button"
                className={`${styles.smallBtn} ${styles.trainBtn}`}
                onClick={onTrain}
                title="Mark as trained (done in town with a trainer)"
              >
                Train
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
