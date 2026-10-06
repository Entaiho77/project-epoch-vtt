import { useState } from 'react';
import type { CheckResolution } from '@epoch/engine';
import { resolveCheck } from '@epoch/engine';
import type { Token } from '@epoch/shared-types';
import type { HomebrewEquipment } from '../../../data/homebrew';
import { equipmentToInventoryItem } from '../../../data/homebrew';
import { giveInventoryItem } from '../../../data/characters';
import { markLootGiven } from '../../../data/board';
import { secureRoll } from '../../../data/secureDice';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const row: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', paddingBlock: 'var(--space-1)' };

/** Flat DC for searching a corpse — no existing convention in the rules, so this picks the
 * same "open check" default (`resolveCheck`'s own DC 10) everything else in the engine falls
 * back to when nothing more specific applies. */
const SEARCH_DC = 10;

/**
 * Player-facing corpse looting (2026-10-06 playtest #6): once combat is over, any player can
 * right-click a defeated creature and roll an Investigation check to search it themselves,
 * instead of only the GM's "Give loot". Success opens that creature's own loot list (same
 * lookup the GM's "Distribute loot" panel already uses) so they can take an item straight into
 * their own inventory; a failed check just logs the miss. 5e only — Solryn still uses Harvest.
 */
export function LootCorpseModal({
  gameId,
  token,
  characterId,
  characterName,
  investigationMod,
  lootItems,
  postRoll,
  onClose,
}: {
  gameId: string;
  token: Token;
  characterId: string;
  characterName: string;
  investigationMod: number;
  lootItems: HomebrewEquipment[];
  postRoll: (text: string) => void;
  onClose: () => void;
}) {
  const [result, setResult] = useState<CheckResolution | null>(null);
  const given = token.lootGiven ?? {};
  const [taken, setTaken] = useState<Record<string, boolean>>({});

  const search = () =>
    void secureRoll(() => {
      const res = resolveCheck({
        label: `${characterName} — search ${token.name} (Investigation)`,
        modifier: investigationMod,
        dc: SEARCH_DC,
      });
      postRoll(res.logText);
      setResult(res);
      return res;
    });

  const take = async (item: HomebrewEquipment) => {
    await giveInventoryItem(characterId, equipmentToInventoryItem(item));
    await markLootGiven(gameId, token.id, item.id);
    setTaken((t) => ({ ...t, [item.id]: true }));
  };

  return (
    <Modal open onClose={onClose} title={`Search ${token.name}`} width={420}>
      <div className={s.section}>
        {!result && (
          <>
            <p className={s.hint}>Combat's over — make an Investigation check to search the body.</p>
            <Button onClick={search}>Roll Investigation (DC {SEARCH_DC})</Button>
          </>
        )}
        {result && !result.success && (
          <>
            <p className={s.hint}>You didn't find anything worth taking.</p>
            <Button onClick={search}>Try again</Button>
          </>
        )}
        {result?.success && (
          <>
            <p className={s.hint}>You find what it was carrying:</p>
            {lootItems.length === 0 && <p className={s.hint}>Nothing — this one's empty-handed.</p>}
            {lootItems.map((item) => {
              const isGiven = !!given[item.id] || !!taken[item.id];
              return (
                <div key={item.id} style={row}>
                  <span className={s.itemMain} style={{ minWidth: 0 }}>
                    <span className={s.itemName}>{item.name}</span>
                    <span className={s.itemMeta}>{item.category}</span>
                  </span>
                  {isGiven ? (
                    <span className={s.itemMeta}>Taken</span>
                  ) : (
                    <Button size="sm" onClick={() => void take(item)}>Take</Button>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </Modal>
  );
}
