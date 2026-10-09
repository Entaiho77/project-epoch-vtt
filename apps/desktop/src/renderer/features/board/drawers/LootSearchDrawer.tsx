import { useMemo, useState } from 'react';
import { resolveCheck } from '@epoch/engine';
import type { Character, HomebrewEquipment, LootSearchState, SystemDefinition, Token } from '@epoch/shared-types';
import { pcDerived } from '@epoch/systems/dnd5e/character';
import {
  claimLootGold,
  claimLootItem,
  joinLootSearch,
  resolveLootSearch,
  splitLootEvenly,
  startLootSearch,
  clearLootSearch,
} from '../../../data/loot';
import { secureRoll } from '../../../data/secureDice';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--space-2)',
  paddingBlock: 'var(--space-1)',
};

/**
 * Backlog item 1 (loot generator), design settled Oct 9, 2026: a scene-wide loot search,
 * triggered by the GM over whichever defeated creatures the party just fought, rather than a
 * per-corpse pick (that's what the existing right-click "Search for loot" → LootCorpseModal
 * flow already covers for a GM-curated monster loot list — this is the new, generated-table
 * path for everything else). Each living, non-downed player can opt in and roll Investigation;
 * resolution is automatic once the grace timer in data/loot.ts elapses (watched from
 * BoardScreen, not here, so it still fires with this drawer closed) — no GM "resolve" click
 * needed, though the GM can also force either resolution path immediately.
 */
export function LootSearchDrawer({
  gameId,
  system,
  role,
  character,
  tokens,
  activeMapId,
  gameCharacters,
  equipment,
  lootSearch,
  postRoll,
}: {
  gameId: string;
  system: SystemDefinition;
  role: 'gm' | 'player';
  /** The viewing player's own character (role === 'player' only). */
  character?: Character;
  tokens: Token[];
  activeMapId?: string;
  /** Every player's character (GM only) — who the GM can hand resolved items/gold to. */
  gameCharacters: Character[];
  /** GM's own equipment library, merged into the generated pool per the original spec. */
  equipment: HomebrewEquipment[];
  lootSearch?: LootSearchState;
  postRoll: (text: string) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pick, setPick] = useState<Record<string, string>>({});

  const defeated = activeMapId
    ? tokens.filter((t) => t.kind === 'creature' && t.mapId === activeMapId && t.defeated)
    : [];

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function begin() {
    const chosen = defeated.filter((t) => selected.has(t.id));
    const creatures = chosen.map((t) => ({ name: t.name, cr: Number(t.stats?.cr) || 0 }));
    void startLootSearch(gameId, creatures, chosen.map((t) => t.id), equipment);
    setSelected(new Set());
  }

  // --- Player: opt in and roll ----------------------------------------------------------
  const investigationMod = character ? pcDerived(system, character).allSkills.find((sk) => sk.id === 'investigation')?.mod ?? 0 : 0;
  const hp = character?.play.pools?.hp?.current;
  const isDowned = typeof hp === 'number' && hp <= 0;
  const alreadyRolled = !!(character && lootSearch?.rollers[character.id]);

  function rollIn() {
    if (!character) return;
    void secureRoll(() => {
      const res = resolveCheck({ label: `${character.name} — loot search (Investigation)`, modifier: investigationMod, dc: null });
      postRoll(res.logText);
      void joinLootSearch(gameId, character.id, character.name, res.roll);
      return res;
    });
  }

  // --- Resolved view (either role) -------------------------------------------------------
  const resolved = lootSearch?.resolved;
  const rollerOrder = useMemo(
    () => (lootSearch ? Object.values(lootSearch.rollers).sort((a, b) => b.roll - a.roll) : []),
    [lootSearch],
  );
  const nameFor = (id: string) => gameCharacters.find((c) => c.id === id)?.name ?? rollerOrder.find((r) => r.characterId === id)?.name ?? id;

  if (!lootSearch?.active) {
    if (role !== 'gm') {
      return <p className={s.hint}>No loot search underway right now.</p>;
    }
    if (!activeMapId) return <p className={s.hint}>Add a map first.</p>;
    return (
      <div className={s.section}>
        <p className={s.hint}>
          Pick the defeated creatures from this fight; everyone still standing can opt in and roll
          Investigation. Gold splits evenly across whoever rolls in; items go to the highest roll
          first.
        </p>
        {defeated.length === 0 && <p className={s.hint}>No defeated creatures on this map yet.</p>}
        <div className={s.list}>
          {defeated.map((t) => (
            <label key={t.id} className={s.item}>
              <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggle(t.id)} />
              <span className={s.itemName}>{t.name}</span>
            </label>
          ))}
        </div>
        <Button onClick={begin} disabled={selected.size === 0} full>
          {selected.size === 0 ? 'Select at least one creature' : `Start loot search · ${selected.size} creature(s)`}
        </Button>
      </div>
    );
  }

  if (!resolved) {
    return (
      <div className={s.section}>
        <span className={s.label}>Loot search underway</span>
        {role === 'player' ? (
          !character ? null : isDowned ? (
            <p className={s.hint}>You're down — you can't search right now.</p>
          ) : alreadyRolled ? (
            <p className={s.hint}>
              You rolled a {lootSearch.rollers[character.id].roll} — waiting on the rest of the party.
            </p>
          ) : (
            <Button onClick={rollIn} full>
              Roll Investigation
            </Button>
          )
        ) : (
          <>
            <p className={s.hint}>
              {rollerOrder.length === 0
                ? 'Waiting for someone to roll in.'
                : `${rollerOrder.length} rolled in so far — resolves automatically a few seconds after the last roll, or force it now.`}
            </p>
            <div className={s.list}>
              {rollerOrder.map((r) => (
                <div key={r.characterId} className={s.item}>
                  <span className={s.itemName}>{r.name}</span>
                  <span className={s.itemMeta}>{r.roll}</span>
                </div>
              ))}
            </div>
            <div className={s.row}>
              <Button onClick={() => void resolveLootSearch(gameId)} disabled={rollerOrder.length === 0}>
                Resolve now
              </Button>
              <Button variant="ghost" onClick={() => void splitLootEvenly(gameId)}>
                Split evenly instead
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // --- Resolved: review/claim --------------------------------------------------------
  const topRollerId = rollerOrder[0]?.characterId;
  const myGoldClaimed = character ? !!resolved.claimed?.[`gold:${character.id}`] : false;
  const myGoldAmount = character ? resolved.goldEach + (character.id === topRollerId ? resolved.goldRemainder ?? 0 : 0) : 0;

  return (
    <div className={s.section}>
      <span className={s.label}>{resolved.splitEvenly ? 'Loot split evenly' : 'Loot search resolved'}</span>

      {role === 'player' && character && (
        <>
          {myGoldAmount > 0 && (
            <div style={rowStyle}>
              <span className={s.itemName}>{myGoldAmount} gp</span>
              {myGoldClaimed ? (
                <span className={s.itemMeta}>Claimed</span>
              ) : (
                <Button size="sm" onClick={() => void claimLootGold(gameId, character.id, character.id === topRollerId)}>
                  Claim
                </Button>
              )}
            </div>
          )}
          {lootSearch.pool.items
            .filter((item) => resolved.assignments[item.id] === character.id)
            .map((item) => {
              const claimed = !!resolved.claimed?.[item.id];
              return (
                <div key={item.id} style={rowStyle}>
                  <span className={s.itemMain} style={{ minWidth: 0 }}>
                    <span className={s.itemName}>{item.name}</span>
                    <span className={s.itemMeta}>{item.revealDescription ?? item.description}</span>
                  </span>
                  {claimed ? (
                    <span className={s.itemMeta}>Claimed</span>
                  ) : (
                    <Button size="sm" onClick={() => void claimLootItem(gameId, character.id, item)}>
                      Claim
                    </Button>
                  )}
                </div>
              );
            })}
          {resolved.splitEvenly && (
            <p className={s.hint}>Items are held by the GM to hand out by hand — ask your table.</p>
          )}
        </>
      )}

      {role === 'gm' && (
        <>
          <p className={s.hint}>
            {resolved.goldEach} gp each{resolved.goldRemainder ? ` (+${resolved.goldRemainder} to ${nameFor(topRollerId ?? '')})` : ''} ·
            review and hand out below — change who an item goes to, or just skip it to narrate it away.
          </p>
          {rollerOrder.map((r) => {
            const claimKey = `gold:${r.characterId}`;
            const amount = resolved.goldEach + (r.characterId === topRollerId ? resolved.goldRemainder ?? 0 : 0);
            const claimed = !!resolved.claimed?.[claimKey];
            return (
              <div key={r.characterId} style={rowStyle}>
                <span className={s.itemMain} style={{ minWidth: 0 }}>
                  <span className={s.itemName}>{r.name}</span>
                  <span className={s.itemMeta}>{amount} gp</span>
                </span>
                {claimed ? (
                  <span className={s.itemMeta}>Given</span>
                ) : (
                  <Button size="sm" onClick={() => void claimLootGold(gameId, r.characterId, r.characterId === topRollerId)}>
                    Give
                  </Button>
                )}
              </div>
            );
          })}
          {lootSearch.pool.items.map((item) => {
            const claimed = !!resolved.claimed?.[item.id];
            const defaultRecipient = resolved.assignments[item.id] ?? gameCharacters[0]?.id ?? '';
            const recipient = pick[item.id] ?? defaultRecipient;
            return (
              <div key={item.id} style={{ ...rowStyle, opacity: claimed ? 0.5 : 1 }}>
                <span className={s.itemMain} style={{ minWidth: 0 }}>
                  <span className={s.itemName}>{item.name}</span>
                  <span className={s.itemMeta}>{item.description}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <select
                    className={s.itemMeta}
                    value={recipient}
                    onChange={(e) => setPick((p) => ({ ...p, [item.id]: e.target.value }))}
                    disabled={claimed || gameCharacters.length === 0}
                  >
                    {gameCharacters.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {claimed ? (
                    <span className={s.itemMeta}>Given</span>
                  ) : (
                    <Button size="sm" disabled={!recipient} onClick={() => void claimLootItem(gameId, recipient, item)}>
                      Give
                    </Button>
                  )}
                </span>
              </div>
            );
          })}
          <Button variant="ghost" onClick={() => void clearLootSearch(gameId)} full>
            Clear — start fresh for the next fight
          </Button>
        </>
      )}
    </div>
  );
}
