import { useState } from 'react';
import type { SystemDefinition } from '@solryn/shared-types';
import type { Character, Role, Token } from '@solryn/shared-types';
import { removeToken, updateToken } from '../../data/board';
import { canSeeMonsterStats, tokenVisibility } from '../../permissions';
import { ResourceTracker } from '../sheet/ResourceTracker';
import { Button } from '../../components/ui/Button';
import { HarvestModal } from './HarvestModal';
import styles from './TokenCard.module.css';

const TRAP_STATES = ['hidden', 'revealed', 'sprung'] as const;

/** Floating card for a tapped token (§4.4), honoring the visibility matrix. */
export function TokenCard({
  token,
  system,
  role,
  uid,
  gameId,
  viewerCharacter,
  onClose,
}: {
  token: Token;
  system: SystemDefinition;
  role: Role;
  uid: string;
  gameId: string;
  viewerCharacter?: Character;
  onClose: () => void;
}) {
  const view = tokenVisibility(token, uid, role);
  const [harvestOpen, setHarvestOpen] = useState(false);
  const canLoot =
    token.kind !== 'character' && Boolean(token.defeated) && Boolean(viewerCharacter);

  function body() {
    // Character tokens
    if (token.kind === 'character') {
      const own = token.characterId === viewerCharacter?.id && viewerCharacter;
      return (
        <p className={styles.muted}>
          {own
            ? 'Your character — manage HP and more in the quick-view on the right.'
            : view === 'full'
              ? 'Player character (read-only).'
              : 'Another player’s character.'}
        </p>
      );
    }

    // Players: creatures/traps stay mysterious — name + image only.
    if (!canSeeMonsterStats(role)) {
      return <p className={styles.muted}>Its details are hidden.</p>;
    }

    // GM view of a trap.
    if (token.kind === 'trap') {
      return (
        <div className={styles.body}>
          <div className={styles.stats}>
            {token.stats?.detectionDC != null && <span>Spot DC {String(token.stats.detectionDC)}</span>}
            {token.stats?.disarmDC != null && <span>Disarm DC {String(token.stats.disarmDC)}</span>}
            {token.stats?.trigger != null && <span>Trigger: {String(token.stats.trigger)}</span>}
            {token.stats?.effect != null && <span>Effect: {String(token.stats.effect)}</span>}
          </div>
          <div className={styles.actions}>
            {TRAP_STATES.map((st) => (
              <Button
                key={st}
                variant={token.trapState === st ? 'primary' : 'ghost'}
                size="sm"
                onClick={() =>
                  void updateToken(gameId, token.id, {
                    trapState: st,
                    visible: st !== 'hidden',
                  })
                }
              >
                {st}
              </Button>
            ))}
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                void removeToken(gameId, token.id);
                onClose();
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      );
    }

    // GM view of a creature.
    return (
      <div className={styles.body}>
        {token.hp && (
          <ResourceTracker
            label="HP"
            current={token.hp.current}
            max={token.hp.max}
            onChange={(n) =>
              void updateToken(gameId, token.id, { hp: { current: n, max: token.hp!.max } })
            }
          />
        )}
        <div className={styles.stats}>
          {token.stats?.dr != null && <span>DR {String(token.stats.dr)}</span>}
          {token.stats?.damage != null && <span>Dmg {String(token.stats.damage)}</span>}
        </div>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void updateToken(gameId, token.id, { visible: token.visible === false })}
          >
            {token.visible === false ? 'Reveal' : 'Hide'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void updateToken(gameId, token.id, { defeated: !token.defeated })}
          >
            {token.defeated ? 'Revive' : 'Defeat'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              void removeToken(gameId, token.id);
              onClose();
            }}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.name}>{token.name}</span>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      {body()}
      {canLoot && (
        <div className={styles.loot}>
          <Button full size="sm" onClick={() => setHarvestOpen(true)}>
            Loot
          </Button>
        </div>
      )}
      {canLoot && viewerCharacter && (
        <HarvestModal
          system={system}
          character={viewerCharacter}
          sourceName={token.name}
          open={harvestOpen}
          onClose={() => setHarvestOpen(false)}
        />
      )}
    </div>
  );
}
