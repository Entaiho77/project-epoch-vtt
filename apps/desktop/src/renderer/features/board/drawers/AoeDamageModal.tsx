import { useMemo, useState } from 'react';
import type { BoardShape, Character, Token } from '@epoch/shared-types';
import { shapeAnchorCenter, tokensInShape } from '../boardGeometry';
import { hitChanges, hitNote, isDefeated } from '../../../data/damage';
import { multiUpdate } from '../../../data/realtime';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const row: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', paddingBlock: 'var(--space-1)' };

/**
 * GM tool (2026-10-06 playtest #8): apply one damage amount to every token caught in a placed
 * AoE shape at once, instead of setting a single target and hitting them one at a time. Reuses
 * the exact geometry BoardCanvas draws the shape with (`tokensInShape`) and the same per-token
 * HP math the checked-roll pipeline already uses (`hitChanges`) — this just applies it to
 * several tokens in one GM-authoritative write instead of going through the roll-proof pipeline,
 * the same trust level "Give loot" and "Set HP" already use.
 */
export function AoeDamageModal({
  gameId,
  shape,
  tokens,
  characters,
  gridSize,
  ftPerSquare,
  postRoll,
  onClose,
}: {
  gameId: string;
  shape: BoardShape;
  tokens: Token[];
  characters: Character[];
  gridSize: number;
  ftPerSquare: number;
  postRoll: (text: string) => void;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(0);
  const [applied, setApplied] = useState(false);

  const caught = useMemo(() => {
    const anchor = shapeAnchorCenter(shape.anchor, tokens, gridSize);
    if (!anchor) return [];
    return tokensInShape(shape, anchor, tokens, gridSize, ftPerSquare).filter(
      (t) => (t.kind === 'character' || t.kind === 'creature') && !isDefeated(t),
    );
  }, [shape, tokens, gridSize, ftPerSquare]);

  const apply = async () => {
    const updates: Record<string, unknown> = {};
    const notes: string[] = [];
    for (const t of caught) {
      const charHp = t.kind === 'character' && t.characterId
        ? characters.find((c) => c.id === t.characterId)?.play.pools?.hp?.current
        : undefined;
      const changes = hitChanges(gameId, t, amount, charHp);
      if (!changes) continue;
      Object.assign(updates, changes);
      const after = t.kind === 'character' ? Math.max(0, (charHp ?? 0) - amount) : Math.max(0, (t.hp?.current ?? 0) - amount);
      notes.push(hitNote(t.name, amount, after === 0));
    }
    if (Object.keys(updates).length) await multiUpdate(updates);
    postRoll(`${shape.kind} AoE hits ${caught.length} for ${amount} each — ${notes.join('; ') || 'nothing to apply'}`);
    setApplied(true);
  };

  return (
    <Modal open onClose={onClose} title={`Apply AoE damage — ${shape.kind} (${shape.sizeFt} ft)`} width={420}>
      <div className={s.section}>
        {caught.length === 0 && <p className={s.hint}>Nobody's caught in this shape right now.</p>}
        {caught.length > 0 && (
          <>
            <p className={s.hint}>Caught in the shape:</p>
            {caught.map((t) => (
              <div key={t.id} style={row}>
                <span className={s.itemName}>{t.name}</span>
                <span className={s.itemMeta}>{t.kind}</span>
              </div>
            ))}
            <span className={s.label}>Damage (to each)</span>
            <input
              className={s.input}
              type="number"
              min={0}
              value={amount}
              disabled={applied}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            />
            <Button disabled={applied} onClick={() => void apply()}>
              {applied ? 'Applied' : `Apply to all ${caught.length}`}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
