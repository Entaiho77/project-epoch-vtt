import type { SystemDefinition } from '@solryn/shared-types';
import type { Character, InitiativeState, Role, Token } from '@solryn/shared-types';
import { computeDerived } from '@solryn/engine';
import {
  addCombatant,
  endCombat,
  nextTurn,
  rollInitiative,
  setTurn,
} from '../../data/combat';
import { Button } from '../../components/ui/Button';
import t from './InitiativeTracker.module.css';

/** Width (px) of one combatant slot in the carousel — must match `.slot` in the CSS. */
const SLOT = 100;

/**
 * Nested jagged condition rings drawn BEHIND an initiative disk, matching the board-canvas treatment:
 * one SOLID filled spiked ring per active condition, concentric — the first is outermost, each later
 * one nested inward. Capped at 4 (the 4 most recently applied). Rendered as an SVG overlay centered
 * on the disk; the disk (higher z-index) covers the innermost center, leaving colored jagged bands.
 */
function ConditionRing({ colors, size }: { colors: string[]; size: number }) {
  const ids = colors.slice(-4);
  if (ids.length === 0) return null;
  const n = ids.length;
  const c = size / 2;
  const rMax = size / 2; // outermost spike tips
  const rInner = 18; // just under the 38px disk radius so the innermost band tucks beneath its edge
  const spikes = 16;
  const spike = 3;
  const star = (r: number) => {
    const pts: string[] = [];
    for (let k = 0; k < spikes * 2; k++) {
      const rr = k % 2 === 0 ? r : r - spike;
      const a = (Math.PI / spikes) * k - Math.PI / 2;
      pts.push(`${(c + Math.cos(a) * rr).toFixed(1)},${(c + Math.sin(a) * rr).toFixed(1)}`);
    }
    return pts.join(' ');
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 0 }}
    >
      {/* Largest → smallest: each smaller disk carves the next band; first id = outermost. */}
      {ids.map((color, i) => (
        <polygon key={i} points={star(rMax - ((rMax - rInner) * i) / n)} fill={color} />
      ))}
    </svg>
  );
}

function initiativeModifier(system: SystemDefinition, character: Character): number {
  const armor = system.equipment.armor.find(
    (a) => a.id === character.play.equippedArmorId,
  );
  const equip = armor ? { armor: { dr: armor.dr, speedPenalty: armor.speedPenalty } } : undefined;
  const roll = computeDerived(system, character.definition.coreScores, equip).find(
    (d) => d.isRoll,
  );
  return roll?.value ?? 0;
}

export function InitiativeTracker({
  state,
  system,
  role,
  uid,
  character,
  gameId,
  tokens,
  activeMapId,
  onSelectToken,
}: {
  state: InitiativeState;
  system: SystemDefinition;
  role: Role;
  uid: string;
  character?: Character;
  gameId: string;
  tokens: Record<string, Token>;
  activeMapId?: string;
  onSelectToken?: (tokenId: string) => void;
}) {
  const order = state.order ?? []; // defensive: Firebase can drop an emptied order array
  const current = order[state.turnIndex];
  const isMyTurn = current?.ownerUserId === uid;
  const inOrder = character
    ? order.some((o) => o.characterId === character.id)
    : true;
  const canRollIn = role === 'player' && character && activeMapId && !inOrder;
  const canJump = role === 'gm'; // GM can jump the turn by clicking a combatant

  function rollMeIn() {
    if (!character || !activeMapId) return;
    const token = Object.values(tokens).find(
      (tk) => tk.characterId === character.id && tk.mapId === activeMapId,
    );
    void addCombatant(gameId, state, {
      id: `char:${character.id}`,
      name: character.name,
      kind: 'character',
      characterId: character.id,
      ownerUserId: uid,
      ...(token ? { tokenId: token.id } : {}),
      ...rollInitiative(initiativeModifier(system, character)),
    });
  }

  const advance = () => void nextTurn(gameId, state, tokens);
  const jumpTo = (i: number) => void setTurn(gameId, state, i);

  // Slide the track so the active combatant's center sits at the carousel's center.
  const trackX = -(state.turnIndex * SLOT + SLOT / 2);

  return (
    <div className={t.bar}>
      <div className={t.round}>
        <span className={t.roundLabel}>Round</span>
        <span className={t.roundNum}>{state.round}</span>
      </div>

      <div className={t.carousel}>
        <div className={t.track} style={{ transform: `translateX(${trackX}px)` }}>
          {order.map((com, i) => {
            const isCurrent = i === state.turnIndex;
            const dist = Math.abs(i - state.turnIndex);
            // Shrink + fade with distance from center; the active one is full-size.
            const scale = isCurrent ? 1 : Math.max(0.6, 1 - 0.17 * dist);
            const opacity = isCurrent ? 1 : Math.max(0.25, 1 - 0.3 * dist);
            const tok = com.tokenId ? tokens[com.tokenId] : undefined;
            const defeated = com.kind === 'creature' && tok?.defeated;
            // Condition colors for this combatant's token → the spiked-ring overlay on the disk.
            const ringColors = Object.keys(tok?.conditions ?? {})
              .map((id) => system.tokenConditions?.find((c) => c.id === id)?.color)
              .filter((c): c is string => !!c);
            const canJumpHere = canJump && !isCurrent;
            // A tap selects the token (surfaces its card); GMs also jump the turn.
            const interactive = canJumpHere || Boolean(tok && onSelectToken);
            const activate = () => {
              if (tok && onSelectToken) onSelectToken(tok.id);
              if (canJumpHere) jumpTo(i);
            };
            return (
              <div key={com.id} className={t.slot}>
                <div
                  className={[
                    t.combatant,
                    isCurrent ? t.current : '',
                    defeated ? t.defeated : '',
                    interactive ? t.clickable : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ transform: `scale(${scale})`, opacity }}
                  onClick={interactive ? activate : undefined}
                  role={interactive ? 'button' : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  onKeyDown={
                    interactive
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            activate();
                          }
                        }
                      : undefined
                  }
                  title={
                    tok
                      ? `View ${com.name}${canJumpHere ? ' · jump to turn' : ''}`
                      : canJumpHere
                        ? `Jump to ${com.name}’s turn`
                        : undefined
                  }
                >
                  {isCurrent && <span className={t.turnLabel}>current turn</span>}
                  <span style={{ position: 'relative', display: 'inline-flex' }}>
                    <span
                      className={t.disk}
                      style={{ background: com.kind === 'character' ? '#5dcaa5' : '#b05a5a', position: 'relative', zIndex: 1 }}
                    >
                      {com.name[0]?.toUpperCase() ?? '?'}
                    </span>
                    <ConditionRing colors={ringColors} size={50} />
                  </span>
                  <span className={t.cname}>{com.name}</span>
                  <span className={t.init}>{com.initiative}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={t.controls}>
        {canRollIn && (
          <Button size="sm" onClick={rollMeIn} className={t.pulse}>
            Roll initiative
          </Button>
        )}
        {isMyTurn && (
          <Button size="sm" onClick={advance}>
            End turn
          </Button>
        )}
        {role === 'gm' && (
          <>
            <Button size="sm" onClick={advance}>
              Next ›
            </Button>
            <Button size="sm" variant="danger" onClick={() => void endCombat(gameId)}>
              End
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
