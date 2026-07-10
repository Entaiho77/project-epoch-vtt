import type { Spell, SystemDefinition, WeaponItem } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import { computeModifier, computeSkillState, effectsFor } from '@solryn/engine';
import { attemptLuckCrit, resolveSolrynAttack, type CritState } from '@solryn/systems/solryn/combat';
import { setLoadedSpell, setPoolCurrent } from '../../data/characters';
import { Button } from '../../components/ui/Button';
import { useRollLog } from '../rolllog/rollLog';
import styles from './AttacksSection.module.css';

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
/** The Luck Points resource pool id (Solryn derived stat). */
const LUCK_POOL = 'luckPoints';

export function AttacksSection({
  system,
  character,
  target,
  attackerConditions,
}: {
  system: SystemDefinition;
  character: Character;
  /** Current click-to-target creature (Solryn): its DR drives auto-hit damage resolution. */
  target?: { name: string; dr?: number; conditions?: Record<string, true> };
  /** The attacker's own token conditions (Solryn: can't-act disables the attack buttons). */
  attackerConditions?: Record<string, true>;
}) {
  const { postRoll } = useRollLog();
  const mode = system.modes.skill;
  const scores = character.definition.coreScores;

  // Luck drives crits: the modifier sets the crit threshold, and each attempt spends a Luck Point.
  const luckMod = computeModifier(scores.LCK ?? 0, system.modifierRule);
  const arcanaMod = computeModifier(scores.ARC ?? 0, system.modifierRule);
  const luckMax = Math.max(0, luckMod);
  const luckCurrent = character.play.pools?.[LUCK_POOL]?.current ?? luckMax;
  const canCrit = luckCurrent >= 1;

  // Token conditions: a Stunned/Paralyzed/Unconscious target forces ignore-DR + auto-crit; an
  // attacker that can't act has its attack controls disabled.
  const forcedCrit = !!effectsFor(system.tokenConditions, target?.conditions).ignoreDrAgainst;
  const attackerCantAct = !!effectsFor(system.tokenConditions, attackerConditions).cantAct;

  const weapons = character.play.equippedWeaponIds
    .map((id) => system.equipment.weapons.find((w) => w.id === id))
    .filter((w): w is WeaponItem => Boolean(w));

  const knownOffensive = character.definition.knownSpellIds
    .map((id) => system.spells.find((s) => s.id === id))
    .filter((s): s is Spell => Boolean(s) && s!.type === 'offensive');

  const arcanaPoolId = system.modes.casting.poolStatId;
  const arcanaCurrent = arcanaPoolId
    ? (character.play.pools[arcanaPoolId]?.current ?? 0)
    : 0;

  const loadedId =
    character.play.loadedSpellId &&
    knownOffensive.some((s) => s.id === character.play.loadedSpellId)
      ? character.play.loadedSpellId
      : knownOffensive[0]?.id;
  const loaded = knownOffensive.find((s) => s.id === loadedId);

  function weaponBonus(w: WeaponItem): number {
    const st = character.play.skills[w.weaponSkillId];
    if (!st) return 0;
    return computeSkillState(st.investedPoints, st.realizedPoints, mode).activeBonus;
  }

  const attackLabel = (name: string) =>
    target?.name ? `${character.name} → ${target.name} — ${name}` : `${character.name} — ${name}`;

  // Spend a Luck Point, roll the d20, and return the crit outcome + a log suffix noting the roll.
  function rollCrit(): { crit: CritState; suffix: string } {
    void setPoolCurrent(character.id, LUCK_POOL, Math.max(0, luckCurrent - 1));
    const a = attemptLuckCrit(luckMod);
    return { crit: a.success ? 'success' : 'failed', suffix: ` · Luck d20 ${a.roll} vs ${a.threshold} (−1 LP)` };
  }

  function rollWeapon(w: WeaponItem, useCrit: boolean) {
    const lc = useCrit ? rollCrit() : null;
    const crit: CritState = forcedCrit ? 'success' : lc ? lc.crit : 'none';
    const suffix = (lc ? lc.suffix : '') + (forcedCrit ? ' · target condition: DR ignored (auto-crit)' : '');
    const res = resolveSolrynAttack({
      label: attackLabel(w.name),
      dice: w.damageDice,
      bonus: weaponBonus(w),
      targetDr: target?.dr,
      crit,
    });
    postRoll(res.logText + suffix);
  }

  function cast(useCrit: boolean) {
    if (!loaded || !arcanaPoolId || arcanaCurrent < loaded.cost) return;
    if (useCrit && !canCrit) return;
    void setPoolCurrent(character.id, arcanaPoolId, arcanaCurrent - loaded.cost);
    const lc = useCrit ? rollCrit() : null;
    const crit: CritState = forcedCrit ? 'success' : lc ? lc.crit : 'none';
    const suffix = (lc ? lc.suffix : '') + (forcedCrit ? ' · target condition: DR ignored (auto-crit)' : '');
    if (loaded.damageDice) {
      // Solryn spell save: DC = 10 + Arcana modifier (+ skill bonus, unused here). Success = half,
      // which the target/GM then compares against DR — surfaced as a note on the log line.
      const saveDc = 10 + arcanaMod;
      const res = resolveSolrynAttack({ label: attackLabel(loaded.name), dice: loaded.damageDice, targetDr: target?.dr, crit });
      postRoll(`${res.logText} · save DC ${saveDc} (success: half vs DR) · −${loaded.cost} AP${suffix}`);
    } else {
      postRoll(`${character.name} — ${loaded.name}: cast (−${loaded.cost} AP)`);
    }
  }

  const nothing = weapons.length === 0 && knownOffensive.length === 0;

  return (
    <section>
      <h3 className={styles.title}>Attacks &amp; damage</h3>

      {target && (
        <p className={styles.synopsis}>
          Target: <strong>{target.name}</strong>
          {typeof target.dr === 'number' ? ` — DR ${target.dr}` : ' — no DR'}
        </p>
      )}

      {attackerCantAct && (
        <p className={styles.synopsis} style={{ color: 'var(--accent-red)' }}>Can’t act — attacks are disabled.</p>
      )}

      {nothing ? (
        <p className={styles.empty}>No attacks equipped.</p>
      ) : (
        <div className={styles.rows}>
          {weapons.map((w) => {
            const bonus = weaponBonus(w);
            return (
              <div key={w.id} className={styles.row}>
                <span className={styles.name}>{w.name}</span>
                <span className={styles.feed}>
                  {w.damageDice}
                  {bonus ? ` ${sign(bonus)}` : ''} · auto-hit vs DR
                </span>
                <Button size="sm" disabled={attackerCantAct} onClick={() => rollWeapon(w, false)}>
                  Roll
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!canCrit || attackerCantAct}
                  title={canCrit ? 'Attempt Critical Hit (spend 1 Luck Point)' : 'No Luck Points'}
                  onClick={() => rollWeapon(w, true)}
                >
                  ⚡ Crit
                </Button>
              </div>
            );
          })}

          {loaded && (
            <div className={`${styles.row} ${styles.spellRow}`}>
              <select
                className={styles.spellSelect}
                value={loadedId}
                onChange={(e) => void setLoadedSpell(character.id, e.target.value)}
                aria-label="Loaded spell"
              >
                {knownOffensive.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <span className={styles.feed}>
                {loaded.damageDice ?? '—'}
                {loaded.damageType ? ` ${loaded.damageType}` : ''} ·{' '}
                {loaded.cost > 0 ? `costs ${loaded.cost} AP` : 'base 0 AP'} · auto-hit vs DR
              </span>
              <button
                type="button"
                className={styles.cast}
                onClick={() => cast(false)}
                disabled={arcanaCurrent < loaded.cost}
                title={arcanaCurrent < loaded.cost ? 'Not enough Arcana' : undefined}
              >
                Cast
              </button>
              <Button
                size="sm"
                variant="secondary"
                disabled={!canCrit || arcanaCurrent < loaded.cost}
                title={canCrit ? 'Attempt Critical Hit (spend 1 Luck Point)' : 'No Luck Points'}
                onClick={() => cast(true)}
              >
                ⚡ Crit
              </Button>
            </div>
          )}

          {loaded && (
            <p className={styles.synopsis}>
              {loaded.synopsis} · range {loaded.range}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
