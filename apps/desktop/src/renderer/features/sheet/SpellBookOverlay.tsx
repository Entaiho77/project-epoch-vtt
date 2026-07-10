import { useState } from 'react';
import type { Spell, SystemDefinition } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import { Modal } from '../../components/ui/Modal';
import styles from './SpellBookOverlay.module.css';

/** The caster's full known-spells book — offensive AND utility (§4.7). */
export function SpellBookOverlay({
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
  const [q, setQ] = useState('');

  const known = character.definition.knownSpellIds
    .map((id) => system.spells.find((s) => s.id === id))
    .filter((s): s is Spell => Boolean(s));

  const arcanaPoolId = system.modes.casting.poolStatId;
  const arcana = arcanaPoolId
    ? (character.play.pools[arcanaPoolId]?.current ?? 0)
    : 0;

  const query = q.trim().toLowerCase();
  const list = known.filter(
    (s) =>
      !query ||
      s.name.toLowerCase().includes(query) ||
      (s.synopsis ?? '').toLowerCase().includes(query),
  );

  return (
    <Modal open={open} onClose={onClose} title={`Known spells · ${known.length}`} width={640}>
      <div className={styles.top}>
        <span className={styles.arcana}>Arcana pool: {arcana}</span>
        <input
          className={styles.search}
          placeholder="Search spells…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className={styles.cards}>
        {list.map((s) => (
          <div key={s.id} className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardName}>{s.name}</span>
              <span
                className={`${styles.tag} ${s.type === 'offensive' ? styles.offensive : styles.utility}`}
              >
                {s.type}
              </span>
              <span className={styles.die}>
                {s.damageDice ? `${s.damageDice}${s.damageType ? ` ${s.damageType}` : ''}` : '—'}
              </span>
            </div>
            {s.synopsis && <p className={styles.syn}>{s.synopsis}</p>}
            <p className={styles.facts}>
              range {s.range} · {s.cost} AP · {s.duration}
            </p>
          </div>
        ))}
        {list.length === 0 && <p className={styles.none}>No spells found.</p>}
      </div>
    </Modal>
  );
}
