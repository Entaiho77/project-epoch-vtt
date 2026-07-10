import { useState } from 'react';
import type { Combatant, Game, MapDef } from '@solryn/shared-types';
import type { SystemDefinition } from '@solryn/shared-types';
import { endCombat, removeCombatantsByToken, rollInitiative, startCombat } from '../../../data/combat';
import { removeToken } from '../../../data/board';
import type { BestiaryEntry } from '@solryn/shared-types';
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
  function bulkRemove(label: string, predicate: (t: import('@solryn/shared-types').Token) => boolean) {
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
    const monsters: Combatant[] = creatures
      .filter((t) => selected.has(t.id))
      .map((t) => ({
        id: t.id,
        name: t.name,
        kind: 'creature' as const,
        tokenId: t.id,
        ...rollInitiative(Number(t.stats?.initiativeMod) || 0),
      }));
    void startCombat(gameId, monsters);
    setSelected(new Set());
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
    return (
      <div className={s.section}>
        <span className={s.label}>Combat running</span>
        <p className={s.hint}>
          Round {init.round ?? 1} · {order.length} combatants.{' '}
          {order.length > 0 ? 'Tap a monster to open its card.' : 'No combatants left — end combat.'}
        </p>
        <div className={s.list}>
          {order
            .filter((c) => c.kind === 'creature')
            .map((c) => (
              <button
                key={c.id}
                type="button"
                className={s.item}
                onClick={() =>
                  setCard({ name: c.name, creatureId: (c.tokenId ? game.tokens?.[c.tokenId] : undefined)?.creatureId })
                }
              >
                <span className={s.itemName}>{c.name}</span>
              </button>
            ))}
        </div>
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
        Select the creatures in this fight, then roll initiative. Players roll
        themselves in afterward.
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
      <Button onClick={roll} disabled={selected.size === 0} full>
        Roll initiative ({selected.size})
      </Button>
      {cleanup}
    </div>
  );
}
