import { useState } from 'react';
import type { SystemDefinition } from '@solryn/shared-types';
import type { Character, CharacterSkillState } from '@solryn/shared-types';
import { computeSkillState } from '@solryn/engine';
import {
  setSkillState,
  setUnspentSkillPoints,
} from '../../data/characters';
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
  const unspent = character.play.unspentSkillPoints ?? 0;
  const skillById = (id: string) => system.skills.find((s) => s.id === id);

  function placePoint(skillId: string) {
    const cur = character.play.skills[skillId] ?? {
      investedPoints: 0,
      realizedPoints: 0,
    };
    const investedPoints = Math.min(cur.investedPoints + 1, mode.maxPointsPerSkill);
    if (investedPoints === cur.investedPoints) return;
    void setSkillState(character.id, skillId, {
      investedPoints,
      realizedPoints: cur.realizedPoints,
    });
    void setUnspentSkillPoints(character.id, unspent - 1);
  }

  function learnSkill(skillId: string) {
    void setSkillState(character.id, skillId, {
      investedPoints: 1,
      realizedPoints: 0,
    });
    void setUnspentSkillPoints(character.id, unspent - 1);
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
          Unspent points: {unspent}
        </span>
      </div>

      <div className={styles.columns}>
        {system.skillCategories.map((cat) => {
          const knownIds = Object.keys(character.play.skills).filter(
            (id) => skillById(id)?.categoryId === cat.id,
          );
          const unknown = system.skills.filter(
            (s) => s.categoryId === cat.id && !character.play.skills[s.id],
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
                    state={character.play.skills[id]}
                    mode={mode}
                    canPlace={unspent > 0}
                    onPlace={() => placePoint(id)}
                    onTrain={() => train(id)}
                  />
                ))}
              </div>
              {unspent > 0 && unknown.length > 0 && (
                <select
                  className={styles.learn}
                  value=""
                  onChange={(e) => e.target.value && learnSkill(e.target.value)}
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
  onPlace,
  onTrain,
}: {
  name: string;
  description?: string;
  exampleUse?: string;
  state: CharacterSkillState;
  mode: SystemDefinition['modes']['skill'];
  canPlace: boolean;
  onPlace: () => void;
  onTrain: () => void;
}) {
  const [open, setOpen] = useState(false);
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
        <span className={styles.skillName}>{name}</span>
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
            {s.pendingTraining && (
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
