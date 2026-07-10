import { useEffect, useRef, useState } from 'react';
import {
  cellKey,
  parseCellKey,
  pointInToken,
  screenToWorld,
  worldToCell,
  zoomAt,
  type Point,
  type Viewport,
} from '../lib/geometry';
import type { Tabletop } from '../lib/useTabletop';

export type CanvasMode = 'select' | 'fog-add' | 'fog-erase';

interface Props {
  tabletop: Tabletop;
  mode: CanvasMode;
}

type Drag =
  | { type: 'pan'; startPan: Viewport; startPointer: Point }
  | { type: 'token'; id: string; startX: number; startY: number; grab: Point }
  | { type: 'fog' };

const DEFAULT_COLS = 30;
const DEFAULT_ROWS = 20;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function MapCanvas({ tabletop, mode }: Props): JSX.Element {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<Drag | null>(null);

  const [vp, setVp] = useState<Viewport>({ panX: 48, panY: 48, zoom: 1 });
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [imgTick, setImgTick] = useState(0);
  const [draftFog, setDraftFog] = useState<{ cells: Set<string>; erase: boolean } | null>(null);

  const gridSize = tabletop.scene?.gridSize ?? 70;

  // Load the map image whenever it changes.
  useEffect(() => {
    if (!tabletop.mapDataUrl) {
      imgRef.current = null;
      setImgTick((t) => t + 1);
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImgTick((t) => t + 1);
    };
    img.src = tabletop.mapDataUrl;
    return () => {
      img.onload = null;
    };
  }, [tabletop.mapDataUrl]);

  // Track the container size.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = (): void => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const extent = (): { w: number; h: number } => {
    const img = imgRef.current;
    if (img) return { w: img.naturalWidth, h: img.naturalHeight };
    return { w: DEFAULT_COLS * gridSize, h: DEFAULT_ROWS * gridSize };
  };

  // Redraw whenever anything visible changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;

    // Background (screen space).
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0b0c16';
    ctx.fillRect(0, 0, size.w, size.h);

    // World space (pan + zoom).
    ctx.setTransform(vp.zoom * dpr, 0, 0, vp.zoom * dpr, vp.panX * dpr, vp.panY * dpr);
    const ext = extent();
    const img = imgRef.current;
    if (img) {
      ctx.drawImage(img, 0, 0);
    } else {
      ctx.fillStyle = '#141626';
      ctx.fillRect(0, 0, ext.w, ext.h);
    }

    // Grid.
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1 / vp.zoom;
    ctx.beginPath();
    for (let x = 0; x <= ext.w; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ext.h);
    }
    for (let y = 0; y <= ext.h; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(ext.w, y);
    }
    ctx.stroke();

    // Tokens.
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const token of tabletop.tokens) {
      const half = (token.size * gridSize) / 2;
      const cx = token.x * gridSize + half;
      const cy = token.y * gridSize + half;
      const r = half * 0.9;
      ctx.globalAlpha = token.hidden ? 0.45 : 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = token.color;
      ctx.fill();
      ctx.lineWidth = 2 / vp.zoom;
      ctx.strokeStyle = token.hidden ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)';
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = `600 ${Math.max(10, r * 0.85)}px system-ui, sans-serif`;
      ctx.fillText(initials(token.name), cx, cy);
      ctx.globalAlpha = 1;
    }

    // Fog: opaque for players, semi-transparent for the GM (so they see under it).
    const display = new Set(tabletop.fog);
    if (draftFog) {
      for (const key of draftFog.cells) {
        if (draftFog.erase) display.delete(key);
        else display.add(key);
      }
    }
    ctx.fillStyle = tabletop.isGm ? 'rgba(6,8,18,0.55)' : '#000';
    for (const key of display) {
      const { col, row } = parseCellKey(key);
      ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
    }
  }, [vp, size, tabletop.tokens, tabletop.fog, tabletop.isGm, tabletop.mapDataUrl, imgTick, gridSize, draftFog]);

  const localPoint = (e: React.PointerEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onWheel = (e: React.WheelEvent): void => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setVp((v) => zoomAt(v, p.x, p.y, e.deltaY < 0 ? 1.1 : 1 / 1.1));
  };

  const onPointerDown = (e: React.PointerEvent): void => {
    const p = localPoint(e);
    const world = screenToWorld(p.x, p.y, vp);
    canvasRef.current?.setPointerCapture(e.pointerId);

    if (tabletop.isGm && (mode === 'fog-add' || mode === 'fog-erase')) {
      const cell = worldToCell(world.x, world.y, gridSize);
      dragRef.current = { type: 'fog' };
      setDraftFog({ cells: new Set([cellKey(cell.col, cell.row)]), erase: mode === 'fog-erase' });
      return;
    }

    // Topmost token under the cursor (GM only can grab).
    if (tabletop.isGm) {
      for (let i = tabletop.tokens.length - 1; i >= 0; i -= 1) {
        const t = tabletop.tokens[i];
        if (pointInToken(world, t, gridSize)) {
          dragRef.current = { type: 'token', id: t.id, startX: t.x, startY: t.y, grab: world };
          return;
        }
      }
    }

    dragRef.current = { type: 'pan', startPan: vp, startPointer: p };
  };

  const onPointerMove = (e: React.PointerEvent): void => {
    const drag = dragRef.current;
    if (!drag) return;
    const p = localPoint(e);
    const world = screenToWorld(p.x, p.y, vp);

    if (drag.type === 'pan') {
      setVp({
        zoom: drag.startPan.zoom,
        panX: drag.startPan.panX + (p.x - drag.startPointer.x),
        panY: drag.startPan.panY + (p.y - drag.startPointer.y),
      });
    } else if (drag.type === 'token') {
      const deltaCol = (world.x - drag.grab.x) / gridSize;
      const deltaRow = (world.y - drag.grab.y) / gridSize;
      tabletop.previewToken(
        drag.id,
        Math.round(drag.startX + deltaCol),
        Math.round(drag.startY + deltaRow),
      );
    } else if (drag.type === 'fog') {
      const cell = worldToCell(world.x, world.y, gridSize);
      setDraftFog((prev) => {
        if (!prev) return prev;
        const cells = new Set(prev.cells);
        cells.add(cellKey(cell.col, cell.row));
        return { ...prev, cells };
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent): void => {
    const drag = dragRef.current;
    dragRef.current = null;
    canvasRef.current?.releasePointerCapture(e.pointerId);
    if (!drag) return;

    if (drag.type === 'token') {
      const t = tabletop.tokens.find((tk) => tk.id === drag.id);
      if (t) tabletop.moveToken(drag.id, Math.round(t.x), Math.round(t.y));
    } else if (drag.type === 'fog' && draftFog) {
      const next = new Set(tabletop.fog);
      for (const key of draftFog.cells) {
        if (draftFog.erase) next.delete(key);
        else next.add(key);
      }
      tabletop.setFog(next);
      setDraftFog(null);
    }
  };

  const onDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    const characterId = e.dataTransfer.getData('text/plain');
    const character = tabletop.characters.find((c) => c.id === characterId);
    if (!character) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const world = screenToWorld(e.clientX - rect.left, e.clientY - rect.top, vp);
    const cell = worldToCell(world.x, world.y, gridSize);
    tabletop.placeCharacter(character, cell.col, cell.row);
  };

  const cursor = mode.startsWith('fog') ? 'crosshair' : 'grab';

  return (
    <div
      ref={wrapRef}
      className="map-canvas"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <canvas
        ref={canvasRef}
        style={{ cursor }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      {!tabletop.scene && <div className="map-empty">No scene loaded</div>}
    </div>
  );
}
