import { useState } from 'react';
import type { Combatant, Game, MapDef } from '@epoch/shared-types';
import type { SystemDefinition } from '@epoch/shared-types';
import { creatureCombatant, endCombat, isRolling, joinCombat, leaveCombat, removeCombatantsByToken, rollInitiative, startCombat } from '../../../data/combat';
import { useGameCharacters } from '../../../data/characters';
import { initiativeModifier } from '../../../data/initiativeModifier';
import { removeToken } from '../../../data/board';
import type { BestiaryEntry } from '@epoch/shared-types';
import type { CampaignRules } from '../../../data/homebrew';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { MonsterStatCard } from './MonsterStatCard';
import s from './drawers.module.css';

export function InitiativeDrawer({
  gameId,
  game,
  activeMap,
  system,
  uid,
  homebrewEntries,
  rules,
  target,
}: {
  gameId: string;
  game: Game;
  activeMap?: MapDef;
  system: SystemDefinition;
  uid?: string;
  /** The GM's library monsters as BestiaryEntry[], so the stat card resolves them like SRD. */
  homebrewEntries: BestiaryEntry[];
  /** Campaign crit rules, forwarded to the creature stat card. */
  rules?: CampaignRules;
  /** Current click-to-target token, forwarded so the stat card resolves attacks vs its defense
   *  (5e AC / Solryn DR) — same as the main board monster panel. */
  target?: { id: string; name: string; ac?: number; dr?: number };
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [card, setCard] = useState<{ name: string; creatureId?: string } | null>(null);
  // Pending bulk-clear awaiting confirmation (replaces window.confirm).
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const init = game.initiative;
  const characters = useGameCharacters(gameId);
  const creatures = activeMap
    ? Object.values(game.tokens ?? {}).filter(
        (t) => t.kind === 'creature' && t.mapId === activeMap.id,
      )
    : [];

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // --- bulk token clearing (GM, manual; never tied to End Combat) -----------
  // Scoped to the active map. Loops the single-token removeToken, then prunes
  // initiative so removed tokens don't linger as ghost combatants.
  function bulkRemove(label: string, predicate: (t: import('@epoch/shared-types').Token) => boolean) {
    if (!activeMap) return;
    const targets = Object.values(game.tokens ?? {}).filter(
      (t) => t.mapId === activeMap.id && predicate(t),
    );
    if (targets.length === 0) return;
    setConfirm({
      message: `${label}: remove ${targets.length} token(s)? This can't be undone.`,
      onConfirm: () => {
        const ids = new Set(targets.map((t) => t.id));
        targets.forEach((t) => void removeToken(gameId, t.id));
        if (init) void removeCombatantsByToken(gameId, init, ids);
        setCard(null);
      },
    });
  }
  const removeDefeated = () => bulkRemove('Remove defeated', (t) => Boolean(t.defeated));
  const clearAllMonsters = () => bulkRemove('Clear all monsters', (t) => t.kind === 'creature');

  const cleanup = (
    <div className={s.section}>
      <span className={s.label}>Board cleanup</span>
      <Button variant="ghost" size="sm" onClick={removeDefeated}>
        Remove defeated
      </Button>
      <Button variant="danger" size="sm" onClick={clearAllMonsters}>
        Clear all monsters
      </Button>
      <ConfirmDialog
        open={!!confirm}
        title="Clear tokens"
        message={confirm?.message ?? ''}
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          confirm?.onConfirm();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );

  function roll() {
    const monsters: Combatant[] = creatures.filter((t) => selected.has(t.id)).map(creatureCombatant);
    void startCombat(gameId, monsters);
    setSelected(new Set());
  }

  /** The GM rolls a player's initiative for them (the player can also roll themselves in). */
  function rollFor(ch: (typeof characters)[number]) {
    const token = activeMap
      ? Object.values(game.tokens ?? {}).find((tk) => tk.characterId === ch.id && tk.mapId === activeMap.id)
      : undefined;
    void joinCombat(gameId, {
      id: `char:${ch.id}`,
      name: ch.name,
      kind: 'character',
      characterId: ch.id,
      ownerUserId: ch.ownerUserId,
      ...(token ? { tokenId: token.id } : {}),
      ...rollInitiative(initiativeModifier(system, ch)),
    });
  }

  if (card) {
    return (
      <div className={s.section}>
        <button type="button" className={s.place} onClick={() => setCard(null)} style={{ alignSelf: 'flex-start' }}>
          ‹ Back
        </button>
        <MonsterStatCard system={system} name={card.name} creatureId={card.creatureId} extraEntries={homebrewEntries} uid={uid} rules={rules} target={target} />
      </div>
    );
  }

  if (init?.active) {
    const order = init.order ?? []; // Firebase drops empty arrays → guard against undefined.
    const rolling = isRolling(init);
    const inOrder = new Set(order.map((c) => c.characterId).filter(Boolean));
    const notIn = characters.filter((ch) => !inOrder.has(ch.id));
    const outCreatures = creatures.filter((t) => !order.some((c) => c.tokenId === t.id));
    return (
      <div className={s.section}>
        <span className={s.label}>{rolling ? 'Rolling initiative' : 'Combat running'}</span>
        <p className={s.hint}>
          {rolling
            ? `${order.length} rolled in so far. Click Begin on the tracker when everyone's in — round 1 starts with the highest roll.`
            : `Round ${init.round ?? 1} · ${order.length} combatants. Tap a monster to open its card.`}
        </p>
        <div className={s.list}>
          {order.map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {c.kind === 'creature' ? (
                <button
                  type="button"
                  className={s.item}
                  style={{ flex: 1 }}
                  onClick={() =>
                    setCard({ name: c.name, creatureId: (c.tokenId ? game.tokens?.[c.tokenId] : undefined)?.creatureId })
                  }
                >
                  <span className={s.itemName}>{c.name}</span>
                  <span className={s.itemMeta}>{c.initiative}</span>
                </button>
              ) : (
                <div className={s.item} style={{ flex: 1 }}>
                  <span className={s.itemName}>{c.name}</span>
                  <span className={s.itemMeta}>{c.initiative}</span>
                </div>
              )}
              <button
                type="button"
                className={s.place}
                onClick={() => {
                  void leaveCombat(gameId, c.id);
                  // A monster's token and its fight are meant to stay in sync — taking it out of
                  // the tracker here removes the token too. A player combatant keeps their token
                  // (it's their character, not a disposable monster) when just taken out of the
                  // order. 2026-10-06 playtest.
                  if (c.kind === 'creature' && c.tokenId) void removeToken(gameId, c.tokenId);
                }}
                title={c.kind === 'creature' ? 'Remove from the fight and the board' : 'Take out of the initiative order'}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {notIn.length > 0 && (
          <>
            <span className={s.label}>Players not rolled in</span>
            <p className={s.hint}>They have a pulsing “Roll initiative” button on their tracker, or you can roll for them.</p>
            <div className={s.list}>
              {notIn.map((ch) => (
                <div key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className={s.item} style={{ flex: 1 }}>
                    <span className={s.itemName}>{ch.name}</span>
                  </span>
                  <button type="button" className={s.place} onClick={() => rollFor(ch)}>
                    Roll for them
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {outCreatures.length > 0 && (
          <>
            <span className={s.label}>Creatures not in the fight</span>
            <div className={s.list}>
              {outCreatures.map((t) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className={s.item} style={{ flex: 1 }}>
                    <span className={s.itemName}>{t.name}</span>
                  </span>
                  <button type="button" className={s.place} onClick={() => void joinCombat(gameId, creatureCombatant(t))}>
                    Add &amp; roll
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        <Button variant="danger" onClick={() => void endCombat(gameId)}>
          End combat
        </Button>
        {cleanup}
      </div>
    );
  }

  if (!activeMap) return <p className={s.hint}>Add a map and place creatures first.</p>;

  return (
    <div className={s.section}>
      <span className={s.label}>Start combat</span>
      <p className={s.hint}>
        Pick the creatures in this fight (or none — for a chase or a duel) and start. Their initiative
        is rolled now; players roll themselves in, then you click <strong>Begin</strong> and the
        highest roll goes first. Creatures you place during combat join automatically.
      </p>
      {creatures.length === 0 && <p className={s.hint}>No creatures on this map yet.</p>}
      <div className={s.list}>
        {creatures.map((t) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <label className={s.item} style={{ flex: 1 }}>
              <input
                type="checkbox"
                checked={selected.has(t.id)}
                onChange={() => toggle(t.id)}
              />
              <span className={s.itemMain}>
                <span className={s.itemName}>{t.name}</span>
              </span>
            </label>
            <button type="button" className={s.place} onClick={() => setCard({ name: t.name, creatureId: t.creatureId })}>
              Card
            </button>
          </div>
        ))}
      </div>
      <Button onClick={roll} full>
        {selected.size === 0 ? 'Start combat (no creatures)' : `Start combat · roll for ${selected.size}`}
      </Button>
      {cleanup}
    </div>
  );
}
