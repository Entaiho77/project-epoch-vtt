import { useState } from 'react';
import type { SystemDefinition } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import { computeDerived, dieForLevel, rollDice } from '@solryn/engine';
import { applyLevelUp } from '../../data/characters';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import s from './LevelUpCeremony.module.css';

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

/** The player level-up ceremony (§4.9): roll increases → recalculate → +skill points. */
export function LevelUpCeremony({
  system,
  character,
  open,
  onClose,
}: {
  system: SystemDefinition;
  character: Character;
  open: boolean;
  onClose: () => void;
}) {
  const newLevel = character.play.level + 1;
  const die = dieForLevel(newLevel, system.modes.progression);
  const order = system.creation.statOrder;
  const pointsPerLevel = system.modes.progression.skillPointsPerLevel ?? 2;

  const [step, setStep] = useState(0);
  const [inc, setInc] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);

  const oldScores = character.definition.coreScores;
  const newScores: Record<string, number> = Object.fromEntries(
    order.map((id) => [id, (oldScores[id] ?? 0) + (inc[id] ?? 0)]),
  );
  const allRolled = order.every((id) => inc[id] !== undefined);
  const nextToRoll = order.find((id) => inc[id] === undefined);

  const armor = system.equipment.armor.find((a) => a.id === character.play.equippedArmorId);
  const equip = armor ? { armor: { dr: armor.dr, speedPenalty: armor.speedPenalty } } : undefined;
  const oldDerived = computeDerived(system, oldScores, equip);
  const newDerived = computeDerived(system, newScores, equip);

  async function finish() {
    setBusy(true);
    const pools: Record<string, { current: number }> = {};
    newDerived.filter((d) => d.resourcePool).forEach((d) => (pools[d.id] = { current: d.value }));
    await applyLevelUp(character.id, {
      coreScores: newScores,
      level: newLevel,
      pools,
      unspentSkillPoints: (character.play.unspentSkillPoints ?? 0) + pointsPerLevel,
    });
    setStep(0);
    setInc({});
    setBusy(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Level up → ${newLevel}`} width={520}>
      {step === 0 && (
        <div className={s.body}>
          <p className={s.lead}>
            Roll each stat’s increase in order with <strong>{die}</strong>. Each locks as
            you roll — watch a bump cross a +3 threshold and raise the modifier.
          </p>
          <div className={s.rows}>
            {order.map((id) => {
              const st = system.coreStats.find((c) => c.id === id);
              const rolled = inc[id] !== undefined;
              const active = id === nextToRoll;
              return (
                <div key={id} className={`${s.row} ${active ? s.active : ''}`}>
                  <span className={s.name}>{st?.name ?? id}</span>
                  {rolled ? (
                    <span className={s.vals}>
                      {oldScores[id] ?? 0} → <strong>{newScores[id]}</strong>{' '}
                      <span className={s.inc}>(+{inc[id]})</span>
                    </span>
                  ) : active ? (
                    <Button size="sm" onClick={() => setInc((p) => ({ ...p, [id]: rollDice(die).total }))}>
                      Roll {die}
                    </Button>
                  ) : (
                    <span className={s.muted}>—</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className={s.footer}>
            <span />
            <Button disabled={!allRolled} onClick={() => setStep(1)}>
              Next: Recalculate
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className={s.body}>
          <p className={s.lead}>
            Your derived values refresh from the new stats. HP fully recalculates from
            your new Endurance (it doesn’t just add the increase on top).
          </p>
          <div className={s.rows}>
            {newDerived.map((d, i) => (
              <div key={d.id} className={s.row}>
                <span className={s.name}>{d.name}</span>
                <span className={s.vals}>
                  {oldDerived[i].isRoll ? sign(oldDerived[i].value) : oldDerived[i].value} →{' '}
                  <strong>{d.isRoll ? sign(d.value) : d.value}</strong>
                  {d.unit ? ` ${d.unit}` : ''}
                </span>
              </div>
            ))}
          </div>
          <div className={s.footer}>
            <Button variant="ghost" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button onClick={() => setStep(2)}>Next: Skill points</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={s.body}>
          <p className={s.lead}>
            You gain <strong>{pointsPerLevel} skill points</strong>. Place them on your
            sheet — they stay <span className={s.pending}>pending</span> until you train in
            town.
          </p>
          <div className={s.footer}>
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={finish} disabled={busy}>
              {busy ? 'Saving…' : 'Finish level-up'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
