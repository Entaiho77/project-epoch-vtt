import { useState } from 'react';
import { isClassAndLevel } from '@epoch/systems/registry';
import { pcDerived } from '@epoch/systems/dnd5e/character';
import type { SystemDefinition } from '@epoch/shared-types';
import type { Character, Role, Token } from '@epoch/shared-types';
import { updateToken, setTokenHp, setDefeated } from '../../data/board';
import { removeTokenAndCombatant } from '../../data/combat';
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
  viewedCharacter,
  onClose,
}: {
  token: Token;
  system: SystemDefinition;
  role: Role;
  uid: string;
  gameId: string;
  viewerCharacter?: Character;
  /** GM only (2026-10-06 playtest): the full record for ANOTHER player's character token, so
   *  the GM can read their current HP/AC at a glance without opening their sheet. Read-only —
   *  the GM adjusts a player's HP from the player's own sheet, not from here. */
  viewedCharacter?: Character;
  onClose: () => void;
}) {
  const view = tokenVisibility(token, uid, role);
  const [harvestOpen, setHarvestOpen] = useState(false);
  // Solryn harvests corpses with crafting skills via this card's Harvest button. 5e has no
  // harvest — loot there comes from the GM's right-click "Search for loot" (a monster's own
  // curated loot list) or the GM-triggered loot search in the board toolbar (backlog item 1);
  // this card used to also show a dead, cosmetic "Search for loot" button for 5e with no roll
  // or generator behind it — removed Oct 9, 2026 (Matthew: "the dead one") now that both real
  // paths exist elsewhere.
  const lootByHarvest = !isClassAndLevel(system);
  const canLoot =
    token.kind !== 'character' && Boolean(token.defeated) && Boolean(viewerCharacter);

  function body() {
    // Character tokens
    if (token.kind === 'character') {
      const own = token.characterId === viewerCharacter?.id && viewerCharacter;
      if (own) {
        return (
          <p className={styles.muted}>
            Your character — manage HP and more in the quick-view on the right.
          </p>
        );
      }
      // GM looking at another player's token (2026-10-06 playtest): show their current HP/AC
      // at a glance, read-only — the GM adjusts HP from the player's own sheet, not here.
      if (view === 'full' && viewedCharacter) {
        const hp = viewedCharacter.play.pools?.hp?.current ?? 0;
        const maxHp = isClassAndLevel(system) ? pcDerived(system, viewedCharacter).maxHp : hp;
        const ac = token.stats?.ac;
        return (
          <div className={styles.body}>
            <div className={styles.stats}>
              <span>
                HP {hp}/{maxHp}
              </span>
              {ac != null && <span>AC {String(ac)}</span>}
            </div>
          </div>
        );
      }
      return (
        <p className={styles.muted}>
          {view === 'full' ? 'Player character (read-only).' : 'Another player’s character.'}
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
                void removeTokenAndCombatant(gameId, token.id);
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
              void setTokenHp(gameId, token, n)
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
            disabled={!!token.permaDead}
            title={token.permaDead ? 'Dead — permanent, no resurrection.' : undefined}
            onClick={() => void setDefeated(gameId, token, !token.defeated)}
          >
            {token.permaDead ? 'Dead' : token.defeated ? 'Revive' : 'Defeat'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              void removeTokenAndCombatant(gameId, token.id);
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
      {canLoot && lootByHarvest && (
        <div className={styles.loot}>
          <Button full size="sm" onClick={() => setHarvestOpen(true)}>
            Harvest
          </Button>
        </div>
      )}
      {canLoot && lootByHarvest && viewerCharacter && (
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
