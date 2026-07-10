import { useState } from 'react';
import type { SystemDefinition } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import {
  computeSkillState,
  rollHarvestQuality,
  type HarvestRollResult,
} from '@solryn/engine';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import s from './HarvestModal.module.css';

const tierVar: Record<string, string> = {
  red: 'var(--accent-red)',
  teal: 'var(--accent-teal)',
  purple: 'var(--accent-purple)',
  amber: 'var(--accent-amber)',
  neutral: 'var(--text-primary)',
};

export function HarvestModal({
  system,
  character,
  sourceName,
  open,
  onClose,
}: {
  system: SystemDefinition;
  character: Character;
  sourceName: string;
  open: boolean;
  onClose: () => void;
}) {
  const mode = system.modes.skill;
  // Only crafting/trade skills the character actually has gate a harvest (no skill = no roll).
  const skills = system.skills
    .filter((sk) => sk.categoryId === 'crafting' && character.play.skills[sk.id])
    .map((sk) => {
      const st = character.play.skills[sk.id];
      return {
        id: sk.id,
        name: sk.name,
        bonus: computeSkillState(st.investedPoints, st.realizedPoints, mode).activeBonus,
      };
    });

  const [skillId, setSkillId] = useState(skills[0]?.id ?? '');
  const [assisted, setAssisted] = useState(false);
  const [result, setResult] = useState<HarvestRollResult | null>(null);

  const skill = skills.find((sk) => sk.id === skillId);

  function roll() {
    if (!skill) return;
    setResult(
      rollHarvestQuality({
        scale: system.qualityScale,
        skillBonus: skill.bonus,
        assisted,
      }),
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={`Harvest · ${sourceName}`} width={460}>
      {skills.length === 0 ? (
        <p className={s.gate}>
          You don’t have a crafting or trade skill, so you can’t attempt this harvest.
          Skills gate whole activities in Solryn.
        </p>
      ) : (
        <div className={s.body}>
          <label className={s.field}>
            <span className={s.label}>Governing skill</span>
            <select
              className={s.select}
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
            >
              {skills.map((sk) => (
                <option key={sk.id} value={sk.id}>
                  {sk.name} (+{sk.bonus})
                </option>
              ))}
            </select>
          </label>

          <label className={s.check}>
            <input
              type="checkbox"
              checked={assisted}
              onChange={(e) => setAssisted(e.target.checked)}
            />
            A party member with the skill assists (roll twice, take the highest)
          </label>

          <Button onClick={roll} full>
            Roll d100 {skill ? `+${skill.bonus}` : ''}
          </Button>

          {result && (
            <div className={s.result}>
              <span
                className={s.tier}
                style={{ color: tierVar[result.tier.color ?? 'neutral'] }}
              >
                {result.tier.label}
              </span>
              <span className={s.detail}>
                rolled {result.assisted ? result.rolls.join(' / ') : result.baseRoll}
                {result.skillBonus ? ` +${result.skillBonus}` : ''} = {result.total}
              </span>
            </div>
          )}

          <p className={s.note}>
            Combat loot: the whole party may roll — the highest result counts, then you
            divide the spoils among yourselves.
          </p>
        </div>
      )}
    </Modal>
  );
}
