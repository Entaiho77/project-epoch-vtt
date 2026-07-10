import { useState } from 'react';
import type { Token } from '@solryn/shared-types';
import type { HomebrewEquipment } from '../../../data/homebrew';
import { equipmentToInventoryItem } from '../../../data/homebrew';
import { giveInventoryItem, useGameCharacters } from '../../../data/characters';
import { markLootGiven } from '../../../data/board';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const row: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', paddingBlock: 'var(--space-1)' };

/**
 * GM loot distribution (Phase B1): assign each item this monster instance carries to a player.
 * "Give" snapshots the full item into that player's inventory and marks it given on the token so
 * the same item can't be handed out twice from this instance.
 */
export function LootDistributionModal({
  gameId,
  token,
  lootItems,
  onClose,
}: {
  gameId: string;
  token: Token;
  lootItems: HomebrewEquipment[];
  onClose: () => void;
}) {
  const characters = useGameCharacters(gameId).filter((c) => c.buildComplete);
  // Per-item chosen recipient (equipmentId → characterId); defaults to the first character.
  const [pick, setPick] = useState<Record<string, string>>({});
  const given = token.lootGiven ?? {};

  const give = async (item: HomebrewEquipment) => {
    const charId = pick[item.id] ?? characters[0]?.id;
    if (!charId) return;
    await giveInventoryItem(charId, equipmentToInventoryItem(item));
    await markLootGiven(gameId, token.id, item.id);
  };

  return (
    <Modal open onClose={onClose} title={`Distribute loot — ${token.name}`} width={460}>
      <div className={s.section}>
        {characters.length === 0 && <p className={s.hint}>No player characters in this game yet.</p>}
        {lootItems.length === 0 && <p className={s.hint}>This monster has no loot attached.</p>}
        {lootItems.map((item) => {
          const isGiven = !!given[item.id];
          return (
            <div key={item.id} style={{ ...row, opacity: isGiven ? 0.5 : 1 }}>
              <span className={s.itemMain} style={{ minWidth: 0 }}>
                <span className={s.itemName}>{item.name}</span>
                <span className={s.itemMeta}>{item.category}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <select
                  className={s.itemMeta}
                  value={pick[item.id] ?? characters[0]?.id ?? ''}
                  onChange={(e) => setPick((p) => ({ ...p, [item.id]: e.target.value }))}
                  disabled={isGiven || characters.length === 0}
                  aria-label={`Recipient for ${item.name}`}
                >
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {isGiven ? (
                  <span className={s.itemMeta}>Given</span>
                ) : (
                  <Button size="sm" disabled={characters.length === 0} onClick={() => void give(item)}>Give</Button>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
