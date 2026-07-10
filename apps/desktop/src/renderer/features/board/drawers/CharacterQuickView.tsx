import { useState } from 'react';
import type { SemanticColor, SystemDefinition } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import { computeDerived } from '@solryn/engine';
import { setCharacterImage, setPoolCurrent } from '../../../data/characters';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { TokenArtUpload } from '../../../components/ui/TokenArtUpload';
import { ResourceTracker, type ResourceColor } from '../../sheet/ResourceTracker';
import { AttacksSection } from '../../sheet/AttacksSection';
import { SpellBookOverlay } from '../../sheet/SpellBookOverlay';
import { PlaySheet } from '../../sheet/PlaySheet';
import { LevelUpCeremony } from '../../sheet/LevelUpCeremony';
import s from './drawers.module.css';

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
const trackerColor = (c?: SemanticColor): ResourceColor =>
  c === 'purple' ? 'purple' : c === 'amber' ? 'amber' : 'teal';

/** The player's quick-view drawer: the things touched every turn (§4.8). */
export function CharacterQuickView({
  system,
  character,
  canLevelUp = false,
  target,
  attackerConditions,
}: {
  system: SystemDefinition;
  character: Character;
  canLevelUp?: boolean;
  /** Current click-to-target creature (Solryn): its DR is shown in and used by the attack UI. */
  target?: { name: string; dr?: number; conditions?: Record<string, true> };
  /** The viewer's own token conditions (attacker) — passed through to the attack UI. */
  attackerConditions?: Record<string, true>;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);

  const scores = character.definition.coreScores;
  const armor = system.equipment.armor.find(
    (a) => a.id === character.play.equippedArmorId,
  );
  const equip = armor
    ? { armor: { dr: armor.dr, speedPenalty: armor.speedPenalty } }
    : undefined;
  const derived = computeDerived(system, scores, equip);
  const pools = derived.filter((d) => d.resourcePool);
  const refs = derived.filter((d) => !d.resourcePool);
  const isCaster = character.definition.knownSpellIds.length > 0;

  return (
    <div className={s.section}>
      <TokenArtUpload
        scope={character.id}
        imageUrl={character.imageUrl}
        label="token"
        onChange={(url) => void setCharacterImage(character.id, url)}
        onClear={() => void setCharacterImage(character.id, null)}
      />

      {canLevelUp && (
        <Button
          full
          onClick={() => setLevelOpen(true)}
          style={{ background: 'var(--accent-amber)', color: 'var(--on-accent)' }}
        >
          ⬆ Level up available
        </Button>
      )}

      {pools.map((p) => {
        const max = p.value;
        const current = character.play.pools?.[p.id]?.current ?? max;
        return (
          <ResourceTracker
            key={p.id}
            label={p.abbreviation ?? p.name}
            title={p.name}
            color={trackerColor(p.color)}
            current={current}
            max={max}
            onChange={(n) => void setPoolCurrent(character.id, p.id, n)}
          />
        );
      })}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {refs.map((d) => (
          <span key={d.id} className={s.preview} title={d.name}>
            {d.abbreviation ?? d.name}:{' '}
            <strong>
              {d.isRoll ? sign(d.value) : d.value}
              {d.unit ? ` ${d.unit}` : ''}
            </strong>
          </span>
        ))}
      </div>

      <AttacksSection system={system} character={character} target={target} attackerConditions={attackerConditions} />

      <div className={s.row}>
        {isCaster && (
          <Button variant="secondary" size="sm" onClick={() => setBookOpen(true)}>
            Spells
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={() => setSheetOpen(true)}>
          Full sheet
        </Button>
      </div>

      {isCaster && (
        <SpellBookOverlay
          system={system}
          character={character}
          open={bookOpen}
          onClose={() => setBookOpen(false)}
        />
      )}

      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={character.name}
        width={780}
      >
        <PlaySheet system={system} character={character} />
      </Modal>

      <LevelUpCeremony
        system={system}
        character={character}
        open={levelOpen}
        onClose={() => setLevelOpen(false)}
      />
    </div>
  );
}
