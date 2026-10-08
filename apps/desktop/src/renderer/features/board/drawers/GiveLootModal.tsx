import { useMemo, useState } from 'react';
import type { Character, HomebrewEquipment } from '@epoch/shared-types';
import { equipmentToInventoryItem } from '../../../data/homebrew';
import { giveInventoryItem } from '../../../data/characters';
import { sendMessage } from '../../../data/chat';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

/**
 * GM: give a player an item — from the library, or something made up on the spot (a key, a
 * note, "25 gp"). **Openly** announces it in the roll log for the table; **Secretly** tells only
 * that player, in a whisper. Either way it lands in their inventory.
 *
 * Renders as plain drawer content (no backdrop of its own) so it opens and closes through the
 * same one-panel-per-side toggle as every other board drawer — switching straight to another
 * icon with a single click, instead of a modal backdrop swallowing that first click. The
 * drawer chrome (title + close ×) comes from BoardShell, same as any other drawer.
 */
export function GiveLootModal({
  gameId,
  gmUid,
  gmName,
  characters,
  equipment,
  initialCharacterId,
  announce,
}: {
  gameId: string;
  gmUid: string;
  gmName: string;
  characters: Character[];
  /** The GM's equipment library. */
  equipment: HomebrewEquipment[];
  initialCharacterId?: string;
  /** Post an open announcement (the roll log). */
  announce: (text: string) => void;
}) {
  const built = characters.filter((c) => c.buildComplete);
  const [charId, setCharId] = useState(initialCharacterId ?? built[0]?.id ?? '');
  const [source, setSource] = useState<'library' | 'custom'>(equipment.length ? 'library' : 'custom');
  const [equipId, setEquipId] = useState(equipment[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [secret, setSecret] = useState(false);
  const [done, setDone] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? equipment.filter((e) => e.name.toLowerCase().includes(q)) : equipment;
  }, [equipment, query]);

  const who = built.find((c) => c.id === charId);
  const item =
    source === 'library'
      ? equipment.find((e) => e.id === equipId)
      : name.trim()
        ? ({ id: `custom-${Date.now()}`, name: name.trim(), category: 'other', description: description.trim() } as HomebrewEquipment)
        : undefined;

  async function give() {
    if (!who || !item) return;
    await giveInventoryItem(who.id, equipmentToInventoryItem(item));
    if (secret) {
      await sendMessage(gameId, {
        senderId: gmUid,
        senderName: gmName,
        audience: who.ownerUserId,
        recipientName: who.name,
        text: `You received: ${item.name}${item.description ? ` — ${item.description}` : ''} (it's in your inventory)`,
      });
    } else {
      announce(`${who.name} receives ${item.name}.`);
    }
    setDone((d) => [...d, `${item.name} → ${who.name}${secret ? ' (secretly)' : ''}`]);
    if (source === 'custom') {
      setName('');
      setDescription('');
    }
  }

  return (
    <div className={s.section}>
      {built.length === 0 ? (
        <p className={s.hint}>No player characters in this game yet.</p>
      ) : (
        <>
          <label className={s.label} htmlFor="loot-who">To</label>
          <select id="loot-who" className={s.select} value={charId} onChange={(e) => setCharId(e.target.value)}>
            {built.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className={s.tabs}>
            <button type="button" className={`${s.tab} ${source === 'library' ? s.tabActive : ''}`} onClick={() => setSource('library')}>
              From my library
            </button>
            <button type="button" className={`${s.tab} ${source === 'custom' ? s.tabActive : ''}`} onClick={() => setSource('custom')}>
              Something else
            </button>
          </div>

          {source === 'library' ? (
            equipment.length === 0 ? (
              <p className={s.hint}>Your library has no equipment yet — use “Something else”, or add items in your Library.</p>
            ) : (
              <>
                <input className={s.input} placeholder="Search items…" value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className={s.select} value={equipId} onChange={(e) => setEquipId(e.target.value)} size={Math.min(6, Math.max(2, filtered.length))}>
                  {filtered.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} · {e.category}</option>
                  ))}
                </select>
              </>
            )
          ) : (
            <>
              <input className={s.input} placeholder="Item name (e.g. Silver key, 25 gp)" value={name} onChange={(e) => setName(e.target.value)} />
              <input className={s.input} placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            </>
          )}

          <label className={s.toggleRow}>
            <span>
              <strong>Give secretly</strong> — only {who?.name ?? 'the player'} is told (a whisper). Off = announced to the table.
            </span>
            <input type="checkbox" checked={secret} onChange={(e) => setSecret(e.target.checked)} />
          </label>

          <Button onClick={() => void give()} disabled={!who || !item} full>
            {item && who ? `Give ${item.name} to ${who.name}` : 'Give'}
          </Button>
          {done.length > 0 && (
            <p className={s.hint} role="status">Given: {done.join(' · ')}</p>
          )}
        </>
      )}
    </div>
  );
}
