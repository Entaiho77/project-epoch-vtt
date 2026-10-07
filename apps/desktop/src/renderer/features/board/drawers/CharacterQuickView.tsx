import { useState } from 'react';
import type { SemanticColor, SystemDefinition } from '@epoch/shared-types';
import type { Character } from '@epoch/shared-types';
import { computeDerived } from '@epoch/engine';
import { setCharacterImage, setPoolCurrent } from '../../../data/characters';
import { restSolryn, SOLRYN_EXHAUSTION_IDS, type SolrynRest } from '../../../data/rests';
import { multiUpdate } from '../../../data/realtime';
import { useRollLog } from '../../rolllog/rollLog';
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
  gameId,
  tokenId,
}: {
  system: SystemDefinition;
  character: Character;
  canLevelUp?: boolean;
  /** Current click-to-target creature (Solryn): its DR is shown in and used by the attack UI. */
  target?: { name: string; dr?: number; conditions?: Record<string, true> };
  /** The viewer's own token conditions (attacker) — passed through to the attack UI, and read
   *  here to find the character's current exhaustion level before a rest steps it down. */
  attackerConditions?: Record<string, true>;
  /** Needed (with tokenId) only to let a long rest step exhaustion down on this character's
   *  token; omit and rest buttons still work, they just can't touch exhaustion. */
  gameId?: string;
  tokenId?: string;
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
  const { postRoll } = useRollLog();
  const poolOf = (id: string) => {
    const p = pools.find((x) => x.id === id);
    return p ? { id, max: p.value, current: character.play.pools?.[id]?.current ?? p.value } : undefined;
  };
  // Highest exhaustion level currently active on this character's token (0 = none).
  const exhaustionLevel = SOLRYN_EXHAUSTION_IDS.reduce(
    (level, id, i) => (attackerConditions?.[id] ? i + 1 : level),
    0,
  );
  function rest(kind: SolrynRest) {
    const r = restSolryn(
      character.id,
      character.name,
      kind,
      { hp: poolOf('hp'), ap: poolOf('arcanaPoints'), luck: poolOf('luckPoints') },
      gameId && tokenId ? { gameId, tokenId, level: exhaustionLevel } : undefined,
    );
    void multiUpdate(r.updates).then(() => postRoll(r.text));
  }

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

      <div className={s.row} style={{ flexWrap: 'wrap' }}>
        <Button variant="ghost" size="sm" onClick={() => rest('short')} title="1 hour: AP recovers half its max">
          Short rest
        </Button>
        <Button variant="ghost" size="sm" onClick={() => rest('long-field')} title="8 hours in the field: HP +half max, AP and Luck full">
          Long rest (field)
        </Button>
        <Button variant="ghost" size="sm" onClick={() => rest('long-town')} title="8 hours in town: HP, AP and Luck full">
          Long rest (town)
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
