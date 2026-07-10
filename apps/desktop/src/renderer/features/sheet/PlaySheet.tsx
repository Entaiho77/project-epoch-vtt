import { useState } from 'react';
import type { SemanticColor, SystemDefinition } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import { computeDerived, computeModifiers } from '@solryn/engine';
import { setPoolCurrent } from '../../data/characters';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { ResourceTracker, type ResourceColor } from './ResourceTracker';
import { SkillsSection } from './SkillsSection';
import { AttacksSection } from './AttacksSection';
import { SpellBookOverlay } from './SpellBookOverlay';
import styles from './PlaySheet.module.css';

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
const trackerColor = (c?: SemanticColor): ResourceColor =>
  c === 'purple' ? 'purple' : c === 'amber' ? 'amber' : 'teal';

/**
 * Play-mode character sheet (§4.6) — the same data the builder produced, now freely
 * editable and writing live to Firebase. Read-only structural values (core stats),
 * easy-to-touch live values (pools), GM-involved values (reputation) calmer.
 */
export function PlaySheet({
  system,
  character,
}: {
  system: SystemDefinition;
  character: Character;
}) {
  const [bookOpen, setBookOpen] = useState(false);

  const scores = character.definition.coreScores;
  const mods = computeModifiers(system, scores);
  const armor = system.equipment.armor.find(
    (a) => a.id === character.play.equippedArmorId,
  );
  const equip = armor
    ? { armor: { dr: armor.dr, speedPenalty: armor.speedPenalty } }
    : undefined;
  const derived = computeDerived(system, scores, equip);
  const ancestry = system.ancestries.find(
    (a) => a.id === character.definition.ancestryId,
  );

  const pools = derived.filter((d) => d.resourcePool);
  const strip = derived.filter((d) => !d.resourcePool);
  const isCaster = character.definition.knownSpellIds.length > 0;

  return (
    <div className={styles.sheet}>
      <header className={styles.header}>
        <Avatar name={character.name} size={48} />
        <div className={styles.headText}>
          <h2 className={styles.name}>{character.name}</h2>
          <p className={styles.sub}>
            {ancestry?.name ?? 'Unknown'} · Level {character.play.level} ·{' '}
            {character.play.reputation}
          </p>
        </div>
        {isCaster && (
          <Button variant="secondary" size="sm" onClick={() => setBookOpen(true)}>
            Spells
          </Button>
        )}
      </header>

      <section className={styles.stats}>
        {system.coreStats.map((c) => (
          <div key={c.id} className={styles.stat}>
            <span className={styles.statAbbr}>{c.abbreviation}</span>
            <span className={styles.statScore}>{scores[c.id] ?? 0}</span>
            <span className={styles.statMod}>{sign(mods[c.id] ?? 0)}</span>
          </div>
        ))}
      </section>

      <section className={styles.pools}>
        {pools.map((p) => {
          const max = p.value;
          const current = character.play.pools?.[p.id]?.current ?? max;
          return (
            <ResourceTracker
              key={p.id}
              label={p.abbreviation ?? p.name}
              color={trackerColor(p.color)}
              current={current}
              max={max}
              onChange={(n) => void setPoolCurrent(character.id, p.id, n)}
            />
          );
        })}
      </section>

      <section className={styles.strip}>
        {strip.map((d) => (
          <div key={d.id} className={styles.ref}>
            <span className={styles.refLabel}>{d.abbreviation ?? d.name}</span>
            <span className={styles.refVal}>
              {d.isRoll ? sign(d.value) : d.value}
              {d.unit ? ` ${d.unit}` : ''}
            </span>
          </div>
        ))}
      </section>

      <SkillsSection system={system} character={character} />
      <AttacksSection system={system} character={character} />

      <section>
        <h3 className={styles.h3}>Gear</h3>
        <div className={styles.gear}>
          {armor && <span className={styles.gearItem}>{armor.name}</span>}
          {character.play.equippedWeaponIds.map((id) => {
            const w = system.equipment.weapons.find((x) => x.id === id);
            return w ? (
              <span key={id} className={styles.gearItem}>
                {w.name}
              </span>
            ) : null;
          })}
          {system.equipment.startingKit.map((k, i) => (
            <span key={i} className={`${styles.gearItem} ${styles.kit}`}>
              {k.name}
              {k.quantity ? ` ×${k.quantity}` : ''}
            </span>
          ))}
        </div>
      </section>

      <SpellBookOverlay
        system={system}
        character={character}
        open={bookOpen}
        onClose={() => setBookOpen(false)}
      />
    </div>
  );
}
