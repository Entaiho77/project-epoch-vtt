import { useState, type ChangeEvent } from 'react';
import type { SystemDefinition } from '@solryn/shared-types';
import type { Game } from '@solryn/shared-types';
import { addMap, setActiveMap, setGridSize, setGridVisible } from '../../../data/board';
import { prepareMapImage } from '../../../data/images';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

interface Pending {
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  typeId: string;
  gridSize: number;
}

export function MapsDrawer({
  system,
  gameId,
  game,
}: {
  system: SystemDefinition;
  gameId: string;
  game: Game;
}) {
  const [pending, setPending] = useState<Pending | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const maps = Object.values(game.maps ?? {});
  const active = game.activeMapId ? game.maps?.[game.activeMapId] : undefined;

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const prepared = await prepareMapImage(gameId, file);
      setPending({
        name: file.name.replace(/\.[^.]+$/, ''),
        imageUrl: prepared.imageUrl,
        width: prepared.width,
        height: prepared.height,
        typeId: system.mapTypes[0]?.id ?? 'battle',
        gridSize: 70,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function add() {
    if (!pending) return;
    await addMap(gameId, {
      name: pending.name || 'Map',
      typeId: pending.typeId,
      imageUrl: pending.imageUrl,
      width: pending.width,
      height: pending.height,
      gridSize: pending.gridSize,
      gridVisible: true,
    });
    setPending(null);
  }

  return (
    <div>
      <div className={s.section}>
        <span className={s.label}>Add a map</span>
        <input type="file" accept="image/*" onChange={onFile} className={s.input} />
        {uploading && <p className={s.hint}>Uploading…</p>}
        {error && <p className={s.error}>{error}</p>}

        {pending && (
          <>
            <p className={s.preview}>
              {pending.width}×{pending.height}px
            </p>
            <input
              className={s.input}
              value={pending.name}
              onChange={(e) => setPending({ ...pending, name: e.target.value })}
              placeholder="Map name"
            />
            <select
              className={s.select}
              value={pending.typeId}
              onChange={(e) => setPending({ ...pending, typeId: e.target.value })}
            >
              {system.mapTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.perSquare.value} {t.perSquare.unit}/sq)
                </option>
              ))}
            </select>
            <label className={s.toggleRow}>
              Grid square (px)
              <input
                type="number"
                className={s.input}
                style={{ maxWidth: 80 }}
                value={pending.gridSize}
                min={16}
                onChange={(e) =>
                  setPending({ ...pending, gridSize: Number(e.target.value) || 70 })
                }
              />
            </label>
            <Button onClick={add} full>
              Add to board
            </Button>
          </>
        )}
      </div>

      {maps.length > 0 && (
        <div className={s.section}>
          <span className={s.label}>This game’s maps</span>
          <div className={s.list}>
            {maps.map((m) => (
              <button
                key={m.id}
                className={`${s.item} ${m.id === game.activeMapId ? s.itemActive : ''}`}
                onClick={() => void setActiveMap(gameId, m.id)}
              >
                <span className={s.itemMain}>
                  <span className={s.itemName}>{m.name}</span>
                  <span className={s.itemMeta}>
                    {system.mapTypes.find((t) => t.id === m.typeId)?.name ?? m.typeId}
                  </span>
                </span>
                {m.id === game.activeMapId && <span className={s.itemMeta}>active</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {active && (
        <div className={s.section}>
          <span className={s.label}>Active map</span>
          <label className={s.toggleRow}>
            <span>Show grid</span>
            <input
              type="checkbox"
              checked={active.gridVisible}
              onChange={(e) => void setGridVisible(gameId, active.id, e.target.checked)}
            />
          </label>
          <label className={s.toggleRow}>
            <span>Grid square (px)</span>
            <input
              type="number"
              className={s.input}
              style={{ maxWidth: 80 }}
              value={active.gridSize}
              min={16}
              onChange={(e) =>
                void setGridSize(gameId, active.id, Number(e.target.value) || 70)
              }
            />
          </label>
        </div>
      )}
    </div>
  );
}
