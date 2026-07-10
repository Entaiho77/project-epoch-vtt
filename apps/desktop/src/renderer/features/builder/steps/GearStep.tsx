import type { KeyboardEvent } from 'react';
import { StepFrame } from '../StepFrame';
import type { StepProps } from '../stepTypes';
import { computeDerived } from '@solryn/engine';
import { allowedWeapons, effectiveScores, equipmentContext } from '../builderModel';
import s from './steps.module.css';

function activate(handler: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };
}

export function GearStep({ system, draft, dispatch, nav }: StepProps) {
  const weapons = allowedWeapons(system, draft);
  // Starting armor is limited to the creation-allowed weights (Solryn: Light/Medium only).
  const armorWeights = system.creation.startingArmorWeights;
  const armorOptions = armorWeights
    ? system.equipment.armor.filter((a) => armorWeights.includes(a.weight))
    : system.equipment.armor;
  const derived = computeDerived(
    system,
    effectiveScores(system, draft),
    equipmentContext(system, draft),
  );
  // Generic: any derived stat that depends on equipment finalizes here (Solryn: DR, Speed).
  const equipDependentIds = new Set(
    system.derivedStats.filter((d) => d.dependsOnEquipment).map((d) => d.id),
  );
  const finalized = derived.filter((r) => equipDependentIds.has(r.id));

  const teaching = (
    <>
      <p className={s.teachText}>
        This is the payoff for your DR and Speed pages — choosing armor fills in the
        piece those steps left pending, and they finalize right here.
      </p>
      <p className={s.teachText}>
        You’re also given a starter kit automatically. When you finish, your character
        flips to <strong>play mode</strong> permanently — there’s no coming back to the
        builder.
      </p>
    </>
  );

  return (
    <StepFrame {...nav} teaching={teaching}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div>
          <span className={s.fieldLabel}>Armor</span>
          <div className={s.cardList} style={{ maxHeight: 'none' }}>
            {armorOptions.map((a) => {
              const on = draft.equippedArmorId === a.id;
              const select = () => dispatch({ type: 'setArmor', armorId: a.id });
              return (
                <div
                  key={a.id}
                  role="button"
                  tabIndex={0}
                  className={`${s.optionCard} ${on ? s.selected : ''}`}
                  onClick={select}
                  onKeyDown={activate(select)}
                >
                  <div className={s.optionHead}>
                    <span className={s.optionName}>{a.name}</span>
                    <span className={s.optionSummary}>DR +{a.dr}</span>
                  </div>
                  <div className={s.optionMeta}>
                    {a.weight} ·{' '}
                    {a.speedPenalty ? `−${a.speedPenalty} ft speed` : 'no speed penalty'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <span className={s.fieldLabel}>
            Weapon
            {weapons.length === 0 && ' — pick a weapon skill earlier to unlock weapons'}
          </span>
          <div className={s.cardList} style={{ maxHeight: 'none' }}>
            {weapons.map((w) => {
              const on = draft.equippedWeaponId === w.id;
              const select = () => dispatch({ type: 'setWeapon', weaponId: w.id });
              return (
                <div
                  key={w.id}
                  role="button"
                  tabIndex={0}
                  className={`${s.optionCard} ${on ? s.selected : ''}`}
                  onClick={select}
                  onKeyDown={activate(select)}
                >
                  <div className={s.optionHead}>
                    <span className={s.optionName}>{w.name}</span>
                    <span className={s.optionSummary}>{w.damageDice}</span>
                  </div>
                  <div className={s.optionMeta}>
                    {[w.twoHanded ? 'two-handed' : '', w.range ? `range ${w.range}` : '']
                      .filter(Boolean)
                      .join(' · ') || 'melee'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {draft.equippedArmorId && finalized.length > 0 && (
          <div className={s.finalizedPanel}>
            {finalized.map((r) => (
              <div key={r.id} className={s.finalizedItem}>
                <span className={s.finalizedLabel}>{r.name} — now finalized</span>
                <span className={s.finalizedValue}>
                  {r.value}
                  {r.unit ? ` ${r.unit}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        <div>
          <span className={s.fieldLabel}>Included starter kit</span>
          <ul className={s.kit}>
            {system.equipment.startingKit.map((k, i) => (
              <li key={i}>
                {k.name}
                {k.quantity ? ` ×${k.quantity}` : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StepFrame>
  );
}
