import { useState } from 'react';
import type { BoardShape, MapDef, Role, ShapeKind } from '@solryn/shared-types';
import type { ShapeDraft } from '../BoardCanvas';
import { clearShapes, removeShape } from '../../../data/shapes';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

const SHAPES: { kind: ShapeKind; label: string; glyph: string }[] = [
  { kind: 'circle', label: 'Circle', glyph: '◯' },
  { kind: 'cone', label: 'Cone', glyph: '◁' },
  { kind: 'line', label: 'Line', glyph: '▭' },
  { kind: 'square', label: 'Square', glyph: '□' },
];
const PRESETS = [10, 15, 20, 30];
const aimed = (k: ShapeKind) => k === 'cone' || k === 'line';

/**
 * The Shapes tool box (GM + players). Picking a shape arms the canvas tool; size/anchor/
 * color/hidden settings persist locally so they survive disarming. Lists the active shapes
 * with per-row dismiss + Clear mine + (GM) Clear all. Shapes themselves are read from the
 * object-keyed `shapes` map — never assumed to exist.
 */
export function ShapesDrawer({
  gameId,
  uid,
  role,
  activeMap,
  shapes,
  draft,
  onChangeDraft,
}: {
  gameId: string;
  uid: string;
  role: Role;
  activeMap?: MapDef;
  shapes: Record<string, BoardShape>;
  draft: ShapeDraft | null;
  onChangeDraft: (next: ShapeDraft | null) => void;
}) {
  const [sizeFt, setSizeFt] = useState(20);
  const [color, setColor] = useState('#5dcaa5');
  const [anchorMode, setAnchorMode] = useState<'grid' | 'token'>('grid');
  const [hidden, setHidden] = useState(false);

  if (!activeMap) return <p className={s.hint}>Add a map first, then place shapes.</p>;

  const armedKind = draft?.kind ?? null;
  // Re-emit the draft when a setting changes while a shape is armed.
  const settings = (over?: Partial<ShapeDraft>) => ({
    sizeFt,
    color,
    anchorMode,
    hidden,
    ...over,
  });
  const reArm = (over: Partial<ShapeDraft>) => {
    if (armedKind) onChangeDraft({ kind: armedKind, ...settings(over) });
  };

  const pick = (kind: ShapeKind) =>
    onChangeDraft(armedKind === kind ? null : { kind, ...settings() });

  const active = Object.values(shapes).filter((sh) => sh.mapId === activeMap.id);
  const mine = active.filter((sh) => sh.ownerUid === uid);

  return (
    <div className={s.section}>
      <span className={s.label}>Shape</span>
      <div className={s.tabs}>
        {SHAPES.map((sp) => (
          <button
            key={sp.kind}
            className={`${s.tab} ${armedKind === sp.kind ? s.tabActive : ''}`}
            onClick={() => pick(sp.kind)}
            title={sp.label}
          >
            {sp.glyph} {sp.label}
          </button>
        ))}
      </div>
      {armedKind && (
        <p className={s.hint}>
          {anchorMode === 'token' ? 'Click a token to anchor' : 'Click a grid cell to anchor'}
          {aimed(armedKind) ? ', then drag to aim.' : '.'}
        </p>
      )}

      <span className={s.label}>Size (ft)</span>
      <input
        className={s.input}
        type="number"
        min={5}
        step={5}
        value={sizeFt}
        onChange={(e) => {
          const v = Math.max(5, Number(e.target.value) || 0);
          setSizeFt(v);
          reArm({ sizeFt: v });
        }}
      />
      <div className={s.row}>
        {PRESETS.map((p) => (
          <button
            key={p}
            className={`${s.tab} ${sizeFt === p ? s.tabActive : ''}`}
            onClick={() => {
              setSizeFt(p);
              reArm({ sizeFt: p });
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <span className={s.label}>Anchor</span>
      <div className={s.tabs}>
        {(['grid', 'token'] as const).map((m) => (
          <button
            key={m}
            className={`${s.tab} ${anchorMode === m ? s.tabActive : ''}`}
            onClick={() => {
              setAnchorMode(m);
              reArm({ anchorMode: m });
            }}
          >
            {m === 'grid' ? 'Grid point' : 'Token'}
          </button>
        ))}
      </div>

      <label className={s.toggleRow}>
        <span>Outline color</span>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            reArm({ color: e.target.value });
          }}
        />
      </label>

      {role === 'gm' && (
        <label className={s.toggleRow}>
          <span>Hidden (GM only)</span>
          <input
            type="checkbox"
            checked={hidden}
            onChange={(e) => {
              setHidden(e.target.checked);
              reArm({ hidden: e.target.checked });
            }}
          />
        </label>
      )}

      <span className={s.label}>On this map ({active.length})</span>
      {active.length === 0 && <p className={s.hint}>No shapes placed.</p>}
      <div className={s.list}>
        {active.map((sh) => {
          const canRemove = sh.ownerUid === uid || role === 'gm';
          return (
            <div key={sh.id} className={s.item}>
              <span className={s.itemMain}>
                <span className={s.itemName}>
                  <span style={{ color: sh.color ?? '#5dcaa5' }}>■</span> {sh.kind}
                </span>
                <span className={s.itemMeta}>
                  {sh.sizeFt} ft{sh.ownerUid === uid ? ' · yours' : ''}
                  {sh.hidden ? ' · hidden' : ''}
                </span>
              </span>
              {canRemove && (
                <button
                  className={s.place}
                  onClick={() => void removeShape(gameId, sh.id)}
                  aria-label={`Dismiss ${sh.kind}`}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className={s.row}>
        {mine.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => void clearShapes(gameId, shapes, uid)}>
            Clear mine
          </Button>
        )}
        {role === 'gm' && active.length > 0 && (
          <Button variant="danger" size="sm" onClick={() => void clearShapes(gameId, shapes)}>
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
