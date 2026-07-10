import { useEffect, useReducer, useRef, useState, type MouseEvent } from 'react';
import type { BoardShape, MapDef, Role, ShapeKind, Token } from '@solryn/shared-types';
import { squareKey } from '../../data/board';
import { canControlToken, fogStyle, tokenVisibility } from '../../permissions';
import {
  canLandOn,
  cellCenter,
  clampCell,
  cycleSelection,
  gridDimensions,
  gridDistanceSquares,
  occupiedCells,
  pixelToCell,
  tokensAtCell,
} from './boardGeometry';
import {
  pan,
  screenToWorld,
  worldToScreen,
  zoomAt,
  type Camera,
} from './boardCamera';
import { partyLockHeldByOther, visibleOnMap } from './partyMode';
import styles from './BoardCanvas.module.css';

export type BoardTool = 'select' | 'fog' | 'measure' | 'shape';

/** The armed shape config from the Shapes drawer; the canvas resolves anchor/aim on click. */
export interface ShapeDraft {
  kind: ShapeKind;
  sizeFt: number;
  color: string;
  anchorMode: 'grid' | 'token';
  hidden: boolean;
}

/** What the canvas hands back when a shape is committed (id/createdAt added by the data layer). */
export type ShapeCommit = Omit<BoardShape, 'id' | 'createdAt' | 'mapId' | 'ownerUid'>;

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

const COLORS = {
  board: '#1a1d24',
  grid: 'rgba(255,255,255,0.10)',
  teal: '#5dcaa5',
  amber: '#ef9f27',
  red: '#e24b4a',
  text: '#e6e7ea',
  border: 'rgba(255,255,255,0.45)',
  gray: '#6b7280',
};

interface Segment {
  sc: number;
  sr: number;
  ec: number;
  er: number;
}

interface BoardCanvasProps {
  map: MapDef;
  tokens: Token[];
  role: Role;
  uid: string;
  tool: BoardTool;
  /** GM-chosen grid + measure line color (session-only): white for dark maps, black for light. */
  lineColor: 'white' | 'black';
  /** Travel-scale map: hide per-character tokens, show the shared party token. */
  partyScale: boolean;
  measureScale?: { value: number; unit: string };
  selectedTokenId?: string;
  /** Current-turn combatant's token, drawn with a glow. */
  highlightTokenId?: string;
  /** The viewer's current attack target (5e), drawn with a distinct ring. */
  targetTokenId?: string;
  /** Persisted AoE/measurement shapes to draw (already filtered to this map + visibility). */
  shapes?: BoardShape[];
  /** Armed shape from the Shapes drawer (tool === 'shape'); null when none armed. */
  shapeDraft?: ShapeDraft | null;
  onCommitShape?: (shape: ShapeCommit) => void;
  onMoveToken: (tokenId: string, col: number, row: number) => void;
  onToggleFog: (col: number, row: number, fogged: boolean) => void;
  onSelectToken: (token: Token | null) => void;
  /** Right-click a token → raise a context menu at (clientX, clientY). Absent → no menu. */
  onContextToken?: (token: Token, x: number, y: number) => void;
  /** Party-token soft-lock: grab on drag start, release on drop. */
  onGrabParty: (tokenId: string) => void;
  onReleaseParty: (tokenId: string) => void;
  /** conditionId → { name, color } for drawing token condition indicators + hover tooltips. */
  conditionDefs?: Record<string, { name: string; color: string }>;
}

/**
 * Draw a SOLID jagged spiked disk (condition indicator) filled with `color`: spike tips reach `r`,
 * valleys dip to `r - spike`, and the polygon is filled all the way to the center. Nested disks are
 * drawn largest→smallest so smaller ones cover the centers of larger ones, leaving concentric
 * jagged bands (one per condition); the token art on top covers the innermost center.
 */
function drawSpikedDisk(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, spike: number, color: string) {
  const spikes = 18;
  ctx.beginPath();
  for (let i = 0; i <= spikes * 2; i++) {
    const rad = i % 2 === 0 ? r : r - spike;
    const a = (Math.PI / spikes) * i;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Token art radius in world pixels. Tiny/Small render visually smaller than Medium even though all
 * three occupy one square; Medium and larger scale with the footprint (`cells`). `hasConditions`
 * shrinks the art slightly to make room for the condition rings (Medium+ only).
 */
function tokenRadius(g: number, cells: number, hasConditions: boolean, sizeCategory?: string): number {
  switch (sizeCategory?.toLowerCase()) {
    case 'tiny':
      return g * 0.18;
    case 'small':
      return g * 0.25;
    default:
      return g * cells * (hasConditions ? 0.3 : 0.42);
  }
}

const fmt = (n: number) =>
  Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '');

/** Feet → pixels: ft / (ft-per-square) → squares, × gridSize. */
const ftToPx = (ft: number, ftPerSquare: number, gridSize: number) =>
  (ft / (ftPerSquare || 1)) * gridSize;

/**
 * Build a shape's path on `ctx` (caller fills/strokes). `px` is the radius (circle), side
 * (square), or length (cone/line). `angleDeg` aims cone/line (0 = east); circle/square ignore
 * it. Cone is D&D-style: its width at the far end equals its length.
 */
function shapePath(
  ctx: CanvasRenderingContext2D,
  kind: ShapeKind,
  cx: number,
  cy: number,
  px: number,
  angleDeg: number,
  gridSize: number,
): void {
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const nx = -dy; // unit perpendicular
  const ny = dx;
  ctx.beginPath();
  if (kind === 'circle') {
    ctx.arc(cx, cy, px, 0, Math.PI * 2);
  } else if (kind === 'square') {
    ctx.rect(cx - px / 2, cy - px / 2, px, px);
  } else if (kind === 'line') {
    const hw = gridSize / 2; // 1 square wide
    ctx.moveTo(cx + nx * hw, cy + ny * hw);
    ctx.lineTo(cx - nx * hw, cy - ny * hw);
    ctx.lineTo(cx - nx * hw + dx * px, cy - ny * hw + dy * px);
    ctx.lineTo(cx + nx * hw + dx * px, cy + ny * hw + dy * px);
    ctx.closePath();
  } else {
    // cone: apex at anchor, far edge width == length (≈53° spread)
    const fx = cx + dx * px;
    const fy = cy + dy * px;
    const hw = px / 2;
    ctx.moveTo(cx, cy);
    ctx.lineTo(fx + nx * hw, fy + ny * hw);
    ctx.lineTo(fx - nx * hw, fy - ny * hw);
    ctx.closePath();
  }
}

export function BoardCanvas({
  map,
  tokens,
  role,
  uid,
  tool,
  lineColor,
  partyScale,
  measureScale,
  selectedTokenId,
  highlightTokenId,
  targetTokenId,
  shapes,
  shapeDraft,
  onCommitShape,
  onMoveToken,
  onToggleFog,
  onSelectToken,
  onContextToken,
  onGrabParty,
  onReleaseParty,
  conditionDefs,
}: BoardCanvasProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const [version, bump] = useReducer((v) => v + 1, 0);

  // Camera: screen = world * zoom + (x, y). Kept in a ref so pan/zoom don't re-render React.
  const camera = useRef<Camera>({ zoom: 1, x: 0, y: 0 });

  const tokenDrag = useRef<{ id: string; party: boolean } | null>(null);
  const fogPaint = useRef<{ target: boolean; seen: Set<string> } | null>(null);
  const measuringRef = useRef(false);
  const panRef = useRef<{ lastX: number; lastY: number } | null>(null);
  const [panning, setPanning] = useState(false);
  const [ghost, setGhost] = useReducer(
    (_: unknown, v: { id: string; col: number; row: number } | null) => v,
    null,
  );
  const [measure, setMeasure] = useState<Segment | null>(null);
  // Hover tooltip listing a token's active conditions (screen coords + text), null when none.
  const [hoverTip, setHoverTip] = useState<{ x: number; y: number; text: string } | null>(null);
  // While aiming a cone/line: the fixed anchor (grid cell or token) + current angle (deg).
  const [shapeAim, setShapeAim] = useState<
    { col: number; row: number; tokenId?: string; angleDeg: number } | null
  >(null);

  const { cols, rows } = gridDimensions(map.width, map.height, map.gridSize);
  const fog = map.fog ?? {};
  // Tokens to draw / hit-test on this map: on travel-scale maps character tokens fold into the
  // shared party token; on tactical maps the party token isn't shown. (Per-viewer secrecy is
  // still applied on top.) Also the obstacle set for movement collision.
  const onMap = visibleOnMap(tokens, map.id, partyScale);

  // Leaving measure mode clears any drawn segment.
  useEffect(() => {
    if (tool !== 'measure') setMeasure(null);
  }, [tool]);

  // Escape clears an active measuring line.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        measuringRef.current = false;
        setMeasure(null);
        setShapeAim(null);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Size the canvas backing buffer to the viewport (the camera, not the map, defines size).
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const resize = () => {
      canvas.width = Math.max(1, wrap.clientWidth);
      canvas.height = Math.max(1, wrap.clientHeight);
      bump();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // Wheel zoom toward the cursor (non-passive so we can preventDefault the page scroll).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = canvas!.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const next = zoomAt(camera.current, sx, sy, factor, MIN_ZOOM, MAX_ZOOM);
      if (next === camera.current) return;
      camera.current = next;
      bump();
    }
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, []);

  function getImage(src?: string): HTMLImageElement | null {
    if (!src) return null;
    const cache = imgCache.current;
    const existing = cache.get(src);
    if (existing) return existing.complete && existing.naturalWidth > 0 ? existing : null;
    const img = new Image();
    img.onload = () => bump();
    img.src = src;
    cache.set(src, img);
    return null;
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const g = map.gridSize;
    const cam = camera.current;

    // Clear + viewport backdrop in screen space, then switch into world space via the camera.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLORS.board;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(cam.zoom, 0, 0, cam.zoom, cam.x, cam.y);

    const bg = getImage(map.imageUrl);
    if (bg) ctx.drawImage(bg, 0, 0, map.width, map.height);

    // Grid + measure line color: a single GM toggle (session-only), white or black, so the GM
    // can match whichever map is loaded (light maps → black, dark maps → white).
    const dark = lineColor === 'black';
    const gridColor = dark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.45)';
    const measureColor = dark ? '#000000' : '#ffffff';

    // While a token is being dragged, the cells a blocking token already occupies — used to
    // paint the drag ghost red when it's hovering a cell it isn't allowed to land on.
    const blocked = ghost ? occupiedCells(onMap, ghost.id) : null;

    if (map.gridVisible) {
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 2 / cam.zoom; // keep grid lines ~2px on screen at any zoom
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        ctx.moveTo(c * g, 0);
        ctx.lineTo(c * g, rows * g);
      }
      for (let r = 0; r <= rows; r++) {
        ctx.moveTo(0, r * g);
        ctx.lineTo(cols * g, r * g);
      }
      ctx.stroke();
    }

    // --- AoE/measurement shapes (under tokens) ----------------------------------
    const scaleValue = measureScale?.value ?? 1;
    const shapeCenter = (
      anchor: BoardShape['anchor'],
    ): { x: number; y: number } | null => {
      if ('tokenId' in anchor) {
        const t = tokens.find((tk) => tk.id === anchor.tokenId);
        return t ? cellCenter(t.col, t.row, g) : null; // token gone → drop the shape
      }
      return cellCenter(anchor.col, anchor.row, g);
    };
    const paintShape = (
      kind: ShapeKind,
      center: { x: number; y: number },
      sizeFt: number,
      angleDeg: number,
      color: string,
    ) => {
      const px = ftToPx(sizeFt, scaleValue, g);
      shapePath(ctx, kind, center.x, center.y, px, angleDeg, g);
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 / cam.zoom;
      ctx.stroke();
    };

    for (const shape of shapes ?? []) {
      const center = shapeCenter(shape.anchor);
      if (!center) continue;
      paintShape(shape.kind, center, shape.sizeFt, shape.angleDeg ?? 0, shape.color ?? COLORS.teal);
    }

    // Live preview while placing a shape (anchor chosen, aiming or about to commit).
    if (shapeDraft && shapeAim) {
      const center = shapeAim.tokenId
        ? shapeCenter({ tokenId: shapeAim.tokenId })
        : cellCenter(shapeAim.col, shapeAim.row, g);
      if (center) {
        paintShape(shapeDraft.kind, center, shapeDraft.sizeFt, shapeAim.angleDeg, shapeDraft.color);
      }
    }

    for (const token of onMap) {
      if (tokenVisibility(token, uid, role) === 'hidden') continue;

      const dragging = ghost?.id === token.id;
      const col = dragging ? ghost!.col : token.col;
      const row = dragging ? ghost!.row : token.row;
      // Multi-square creatures (Large 2×2, Huge 3×3, Gargantuan 4×4) center on the MIDDLE of their
      // footprint, not the anchor cell, and scale every ring/label off `cells`.
      const cells = token.size ?? 1;
      const x = (col + cells / 2) * g;
      const y = (row + cells / 2) * g;

      // Active conditions (defined in this system) → concentric jagged rings. Cap at 4; when more
      // are active, keep the 4 most recently applied (last keys — Firebase preserves insertion
      // order and stores no timestamps). First id = outermost ring.
      const condIds = Object.keys(token.conditions ?? {})
        .filter((id) => conditionDefs?.[id])
        .slice(-4);
      // Shrink the token art when rings are present so the token + all rings stay inside the
      // footprint. Radius also honours the size category (Tiny/Small render smaller than Medium).
      const radius = tokenRadius(g, cells, condIds.length > 0, token.sizeCategory);

      // Nested condition rings, drawn BEFORE (behind) the token art at full opacity — spike tips
      // reach rMax, innermost band meets the token art at `radius`. Ring geometry is derived from
      // `radius` so it hugs the token at any size (for Medium+ this reproduces the old
      // g·cells·0.48 / 0.06 band exactly, since a conditioned Medium radius is g·cells·0.30).
      if (condIds.length) {
        const rMax = radius * 1.6;
        const spike = radius * 0.2;
        const n = condIds.length;
        condIds.forEach((id, i) => {
          const r = rMax - ((rMax - radius) * i) / n;
          drawSpikedDisk(ctx, x, y, r, spike, conditionDefs![id].color);
        });
      }

      ctx.save();
      if (token.visible === false) ctx.globalAlpha = 0.45;
      if (token.defeated) ctx.globalAlpha = 0.35;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      const art = getImage(token.imageUrl);
      if (art) {
        ctx.save();
        ctx.clip();
        ctx.drawImage(art, x - radius, y - radius, radius * 2, radius * 2);
        ctx.restore();
      } else {
        ctx.fillStyle = token.color ?? COLORS.gray;
        ctx.fill();
        ctx.fillStyle = '#0f1115';
        ctx.font = `bold ${Math.round(radius)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((token.name[0] ?? '?').toUpperCase(), x, y + 1);
      }

      if (token.id === highlightTokenId) {
        ctx.strokeStyle = COLORS.teal;
        ctx.lineWidth = 3 / cam.zoom;
        ctx.beginPath();
        ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Attack-target reticle: a distinct dashed amber ring (5e click-to-target).
      if (token.id === targetTokenId) {
        ctx.save();
        ctx.strokeStyle = COLORS.amber;
        ctx.lineWidth = 3 / cam.zoom;
        ctx.setLineDash([5 / cam.zoom, 4 / cam.zoom]);
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const selected = token.id === selectedTokenId;
      const sprung = token.kind === 'trap' && token.trapState === 'sprung';
      // Red ring while the drag ghost is over a cell it can't legally land on.
      const cantLand = dragging && blocked ? !canLandOn(token, col, row, blocked) : false;
      ctx.lineWidth = (selected ? 4 : 2) / cam.zoom;
      ctx.strokeStyle = cantLand
        ? COLORS.red
        : selected
          ? COLORS.teal
          : sprung
            ? COLORS.red
            : token.defeated
              ? COLORS.gray
              : COLORS.border;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = COLORS.text;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(token.name, x, y + radius + 3);
      ctx.restore();
    }

    // Fog — GM semi-transparent, players opaque.
    const opaque = fogStyle(role) === 'opaque';
    ctx.fillStyle = opaque ? '#0c0e12' : 'rgba(10,12,16,0.55)';
    for (const key of Object.keys(fog)) {
      const [c, r] = key.split(',').map(Number);
      ctx.fillRect(c * g, r * g, g, g);
    }

    // Measure overlay.
    if (measure && measureScale) {
      const a = cellCenter(measure.sc, measure.sr, g);
      const b = cellCenter(measure.ec, measure.er, g);
      ctx.strokeStyle = measureColor;
      ctx.lineWidth = 2 / cam.zoom;
      ctx.setLineDash([6 / cam.zoom, 4 / cam.zoom]);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.setLineDash([]);

      const squares = gridDistanceSquares(measure.sc, measure.sr, measure.ec, measure.er);
      const label = `${squares} sq · ${fmt(squares * measureScale.value)} ${measureScale.unit}`;
      // Draw the label at a constant on-screen size regardless of zoom.
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const sb = worldToScreen(cam, b.x, b.y);
      ctx.font = 'bold 12px sans-serif';
      const w = ctx.measureText(label).width + 12;
      ctx.fillStyle = 'rgba(15,17,21,0.9)';
      ctx.fillRect(sb.x + 8, sb.y - 12, w, 22);
      ctx.fillStyle = COLORS.amber;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, sb.x + 14, sb.y - 1);
      ctx.restore();
    }
  }

  useEffect(draw, [
    map,
    tokens,
    partyScale,
    role,
    uid,
    selectedTokenId,
    highlightTokenId,
    targetTokenId,
    ghost,
    measure,
    shapes,
    shapeDraft,
    shapeAim,
    measureScale,
    conditionDefs,
    version,
  ]);

  /** Mouse event → world (map) pixel coords, undoing the camera. */
  function eventCell(e: MouseEvent<HTMLCanvasElement>) {
    const w = screenToWorld(camera.current, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    const cell = pixelToCell(w.x, w.y, map.gridSize);
    return clampCell(cell.col, cell.row, cols, rows);
  }

  function handleDown(e: MouseEvent<HTMLCanvasElement>) {
    if (e.button !== 0) return; // left button only (right-click handled separately)
    const { col, row } = eventCell(e);

    if (tool === 'measure') {
      measuringRef.current = true;
      setMeasure({ sc: col, sr: row, ec: col, er: row });
      return;
    }

    if (tool === 'shape' && shapeDraft) {
      // Anchor to a token (topmost visible at the cell) or to the grid cell itself.
      let tokenId: string | undefined;
      if (shapeDraft.anchorMode === 'token') {
        const stack = tokensAtCell(
          onMap.filter((t) => tokenVisibility(t, uid, role) !== 'hidden'),
          col,
          row,
        );
        tokenId = stack[stack.length - 1]?.id;
      }
      const anchor = tokenId ? { tokenId } : { col, row };
      if (shapeDraft.kind === 'circle' || shapeDraft.kind === 'square') {
        onCommitShape?.({
          kind: shapeDraft.kind,
          sizeFt: shapeDraft.sizeFt,
          color: shapeDraft.color,
          anchor,
          ...(shapeDraft.hidden ? { hidden: true } : {}),
        });
      } else {
        // cone/line: set the anchor, then drag to aim (committed on mouse-up).
        setShapeAim({ col, row, tokenId, angleDeg: 0 });
      }
      return;
    }

    if (tool === 'fog' && role === 'gm') {
      const fogged = !fog[squareKey(col, row)];
      fogPaint.current = { target: fogged, seen: new Set([squareKey(col, row)]) };
      onToggleFog(col, row, fogged);
      return;
    }

    // Repeated clicks on a stacked cell cycle through the tokens (topmost first, then
    // down through the pile) so every one is reachable even when they share a square.
    const stack = tokensAtCell(
      onMap.filter((t) => tokenVisibility(t, uid, role) !== 'hidden'),
      col,
      row,
    );
    const hit = cycleSelection(stack, selectedTokenId);
    onSelectToken(hit ?? null);

    // The shared party token is grabbable by anyone — unless someone else is mid-drag
    // (soft-lock). A held party token can be selected but not grabbed, and never pans.
    const isParty = hit?.kind === 'party';
    const lockedByOther = !!hit && isParty && partyLockHeldByOther(hit, uid, Date.now());

    if (hit && canControlToken(hit, uid, role) && !lockedByOther) {
      if (isParty) onGrabParty(hit.id);
      tokenDrag.current = { id: hit.id, party: isParty };
      setGhost({ id: hit.id, col, row });
    } else if (lockedByOther) {
      // Selected for info, but it's locked — do nothing else (no pan, no drag).
    } else {
      // Empty space (or a token you can't control) → pan the camera (Google-Maps style).
      panRef.current = { lastX: e.clientX, lastY: e.clientY };
      setPanning(true);
    }
  }

  function handleMove(e: MouseEvent<HTMLCanvasElement>) {
    // Hover tooltip: while idle, show the active conditions of the token under the cursor.
    if (!panRef.current && !tokenDrag.current && !fogPaint.current && !measuringRef.current && !shapeAim) {
      const { col, row } = eventCell(e);
      const stack = tokensAtCell(
        onMap.filter((t) => tokenVisibility(t, uid, role) !== 'hidden'),
        col,
        row,
      );
      const hit = stack[stack.length - 1];
      const names = hit
        ? Object.keys(hit.conditions ?? {}).map((id) => conditionDefs?.[id]?.name).filter(Boolean)
        : [];
      setHoverTip(names.length ? { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, text: names.join(', ') } : null);
    }
    if (panRef.current) {
      const dx = e.clientX - panRef.current.lastX;
      const dy = e.clientY - panRef.current.lastY;
      panRef.current = { lastX: e.clientX, lastY: e.clientY };
      camera.current = pan(camera.current, dx, dy);
      bump();
      return;
    }
    if (shapeAim) {
      // Aim the cone/line: angle from the fixed anchor center to the cursor (world space).
      const w = screenToWorld(camera.current, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      const anchorTok = shapeAim.tokenId ? tokens.find((t) => t.id === shapeAim.tokenId) : undefined;
      const c = anchorTok
        ? cellCenter(anchorTok.col, anchorTok.row, map.gridSize)
        : cellCenter(shapeAim.col, shapeAim.row, map.gridSize);
      const angleDeg = (Math.atan2(w.y - c.y, w.x - c.x) * 180) / Math.PI;
      setShapeAim((a) => (a ? { ...a, angleDeg } : a));
      return;
    }
    const { col, row } = eventCell(e);
    if (measuringRef.current) {
      setMeasure((m) => (m ? { ...m, ec: col, er: row } : m));
    } else if (tokenDrag.current) {
      if (ghost?.col !== col || ghost?.row !== row) {
        setGhost({ id: tokenDrag.current.id, col, row });
      }
    } else if (fogPaint.current) {
      const key = squareKey(col, row);
      if (!fogPaint.current.seen.has(key)) {
        fogPaint.current.seen.add(key);
        onToggleFog(col, row, fogPaint.current.target);
      }
    }
  }

  function handleUp() {
    if (shapeAim) {
      // Commit the aimed cone/line (drag released). A disarmed draft just clears the aim.
      if (shapeDraft) {
        const anchor = shapeAim.tokenId
          ? { tokenId: shapeAim.tokenId }
          : { col: shapeAim.col, row: shapeAim.row };
        onCommitShape?.({
          kind: shapeDraft.kind,
          sizeFt: shapeDraft.sizeFt,
          color: shapeDraft.color,
          anchor,
          angleDeg: shapeAim.angleDeg,
          ...(shapeDraft.hidden ? { hidden: true } : {}),
        });
      }
      setShapeAim(null);
      return;
    }
    const drag = tokenDrag.current;
    if (drag && ghost) {
      const mover = tokens.find((t) => t.id === drag.id);
      const moved = mover && (mover.col !== ghost.col || mover.row !== ghost.row);
      if (mover && moved) {
        // Soft-block: a token can pass through occupied cells while dragging but can't END
        // its move on one — a blocked drop is cancelled (snap back). The shared party token
        // is non-tactical travel, so it skips the landing check and moves freely.
        const canLand =
          drag.party ||
          canLandOn(mover, ghost.col, ghost.row, occupiedCells(onMap, mover.id));
        if (canLand) onMoveToken(mover.id, ghost.col, ghost.row);
      }
    }
    if (drag?.party) onReleaseParty(drag.id); // release the soft-lock however the drag ended
    tokenDrag.current = null;
    fogPaint.current = null;
    measuringRef.current = false;
    panRef.current = null;
    setPanning(false);
    setGhost(null);
    setHoverTip(null);
  }

  // Right-click: while measuring, clear the line. Otherwise raise a token context menu for the
  // topmost visible token under the cursor (hit-tested by cell, like a fresh left-click).
  function handleContextMenu(e: MouseEvent<HTMLCanvasElement>) {
    if (tool === 'measure') {
      e.preventDefault();
      measuringRef.current = false;
      setMeasure(null);
      return;
    }
    if (!onContextToken) return;
    const { col, row } = eventCell(e);
    const stack = tokensAtCell(
      onMap.filter((t) => tokenVisibility(t, uid, role) !== 'hidden'),
      col,
      row,
    );
    const hit = stack[stack.length - 1];
    if (hit) {
      e.preventDefault();
      onContextToken(hit, e.clientX, e.clientY);
    }
  }

  const cursor =
    tool === 'measure' || tool === 'fog' || tool === 'shape'
      ? 'crosshair'
      : panning
        ? 'grabbing'
        : 'grab';

  return (
    <div className={styles.scroll} ref={wrapRef}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{ cursor }}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onContextMenu={handleContextMenu}
      />
      {hoverTip && (
        <div
          style={{
            position: 'absolute',
            left: hoverTip.x + 14,
            top: hoverTip.y + 14,
            pointerEvents: 'none',
            background: 'rgba(15,17,21,0.92)',
            color: '#e6e7ea',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 4,
            padding: '2px 6px',
            fontSize: 12,
            whiteSpace: 'nowrap',
            zIndex: 5,
          }}
        >
          {hoverTip.text}
        </div>
      )}
    </div>
  );
}
