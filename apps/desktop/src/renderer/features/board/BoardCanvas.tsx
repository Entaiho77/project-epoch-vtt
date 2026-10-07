import { useEffect, useReducer, useRef, useState, type MouseEvent } from 'react';
import type {
  BoardShape,
  MapDef,
  Role,
  ShapeKind,
  SharedLightPenStroke,
  SharedMeasure,
  SharedPing,
  Token,
} from '@epoch/shared-types';
import { squareKey } from '../../data/board';
import { imageSrc } from '../../data/images';
import { onAssetStored } from '../../data/assetSync';
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
  dragTopLeft,
  edgeAllowance,
  footprintCenter,
} from './boardGeometry';
import {
  loadView,
  pan,
  saveView,
  screenToWorld,
  worldToScreen,
  zoomAt,
  type Camera,
} from './boardCamera';
import { partyLockHeldByOther, visibleOnMap } from './partyMode';
import { gridStroke, type GridPrefs } from './gridPrefs';
import styles from './BoardCanvas.module.css';

export type BoardTool = 'select' | 'fog' | 'measure' | 'shape' | 'ping' | 'lightpen';

/** How long a ping pulses before it's gone (owner's client clears the shared write on this
 *  same timer — see BoardScreen). */
export const PING_LIFETIME_MS = 2000;
/** How long a light-pen point stays visible before it's fully faded. */
export const LIGHT_PEN_FADE_MS = 900;

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
  /** How the grid looks on this computer (each person's own setting). */
  gridLook: GridPrefs;
  /** Called (debounced) with the square at the middle of the screen after a pan/zoom. */
  onViewSettled?: (center: { col: number; row: number }) => void;
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
  /** Move a grid-anchored shape (only offered for shapes this viewer may move). */
  onMoveShape?: (shapeId: string, col: number, row: number) => void;
  /** Turn a cone / line / square to a new direction (degrees, 0 = east). */
  onRotateShape?: (shapeId: string, angleDeg: number) => void;
  /** Right-click a placed shape → delete it immediately (same reach as its move/rotate handles,
   * same ownership rule: yours, or any of them for the GM). Absent → right-click does nothing
   * to shapes (falls through to the token context menu). */
  onDeleteShape?: (shapeId: string) => void;
  /** Measuring lines everyone has left on this map. */
  measures?: SharedMeasure[];
  /** Leave my measuring line on the board for everyone. */
  onCommitMeasure?: (seg: { sc: number; sr: number; ec: number; er: number }) => void;
  /** Remove my measuring line (the GM's removes everyone's). */
  onClearMeasures?: () => void;
  /** Board pointers (2026-10-07): "look over here" pings everyone sees, on this map. */
  pings?: SharedPing[];
  /** Drop a ping at this grid cell (self-clears after PING_LIFETIME_MS — see BoardScreen). */
  onCommitPing?: (col: number, row: number) => void;
  /** Board pointers (2026-10-07): light-pen trails everyone sees, on this map. */
  lightPenStrokes?: SharedLightPenStroke[];
  /** Sync my light-pen stroke's points as I drag (called often, lightly throttled). */
  onCommitLightPen?: (points: { x: number; y: number; t: number }[]) => void;
  /** My light-pen drag just ended — BoardScreen starts fading the shared stroke out. */
  onEndLightPen?: () => void;
  /** Armed shape from the Shapes drawer (tool === 'shape'); null when none armed. */
  shapeDraft?: ShapeDraft | null;
  onCommitShape?: (shape: ShapeCommit) => void;
  onMoveToken: (tokenId: string, col: number, row: number) => void;
  /** Whether `tokenId` may be moved right now (turn gate during combat). Absent → never gated,
   * same as outside combat. 2026-10-06 playtest: "players can only move their token on their own
   * turn; same restriction for monsters (GM) on the monster's turn." */
  mayMoveToken?: (tokenId: string) => boolean;
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
    // Rotated by angleDeg around its middle (0 = square to the grid).
    const h = px / 2;
    const corners = [
      [-h, -h],
      [h, -h],
      [h, h],
      [-h, h],
    ].map(([u, v]) => [cx + u * dx - v * dy, cy + u * dy + v * dx]);
    ctx.moveTo(corners[0][0], corners[0][1]);
    for (const [x, y] of corners.slice(1)) ctx.lineTo(x, y);
    ctx.closePath();
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
  gridLook,
  onViewSettled,
  partyScale,
  measureScale,
  onMoveShape,
  onRotateShape,
  onDeleteShape,
  measures,
  onCommitMeasure,
  onClearMeasures,
  pings,
  onCommitPing,
  lightPenStrokes,
  onCommitLightPen,
  onEndLightPen,
  selectedTokenId,
  highlightTokenId,
  targetTokenId,
  shapes,
  shapeDraft,
  onCommitShape,
  onMoveToken,
  mayMoveToken,
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
  // When a missing image arrives from another player, drop its failed load and redraw.
  useEffect(
    () =>
      onAssetStored((name) => {
        for (const key of [...imgCache.current.keys()]) {
          if (key.includes(name)) imgCache.current.delete(key);
        }
        bump();
      }),
    [],
  );

  // Camera: screen = world * zoom + (x, y). Kept in a ref so pan/zoom don't re-render React.
  const camera = useRef<Camera>({ zoom: 1, x: 0, y: 0 });

  const tokenDrag = useRef<{ id: string; party: boolean; dc: number; dr: number; size: number } | null>(null);
  const fogPaint = useRef<{ target: boolean; seen: Set<string> } | null>(null);
  const measuringRef = useRef(false);
  // Light-pen drag in progress: the points accumulated so far (world pixels) and when we last
  // pushed them to shared state (lightly throttled — see handleMove).
  const lightPenRef = useRef<{ points: { x: number; y: number; t: number }[]; lastSync: number } | null>(null);
  const panRef = useRef<{ lastX: number; lastY: number } | null>(null);
  const [panning, setPanning] = useState(false);
  const [ghost, setGhost] = useReducer(
    (_: unknown, v: { id: string; col: number; row: number } | null) => v,
    null,
  );
  const [measure, setMeasure] = useState<Segment | null>(null);
  // Dragging a placed (grid-anchored) shape by its center square.
  const shapeDrag = useRef<{ id: string } | null>(null);
  const [shapeGhost, setShapeGhost] = useState<{ id: string; col: number; row: number } | null>(null);
  // Turning a shape by its rotate handle: the live angle while dragging.
  const shapeTurn = useRef<{ id: string } | null>(null);
  const [turnGhost, setTurnGhost] = useState<{ id: string; angleDeg: number } | null>(null);

  /**
   * Where each shape this viewer may change is, with its handles: a move handle in the middle
   * (grid-placed shapes; token-placed ones follow the token) and a rotate handle at the far end
   * of cones, lines and squares. World pixels.
   */
  function shapeHandles() {
    const g = map.gridSize;
    const scale = measureScale?.value ?? 1;
    const out: { id: string; cx: number; cy: number; angleDeg: number; move: boolean; rotate: { x: number; y: number } | null }[] = [];
    for (const sh of shapes ?? []) {
      if (!(role === 'gm' || sh.ownerUid === uid)) continue;
      let c: { x: number; y: number }, size = 1;
      if ('tokenId' in sh.anchor) {
        const tokId = sh.anchor.tokenId;
        const t = tokens.find((tk) => tk.id === tokId);
        if (!t) continue;
        c = footprintCenter(t.col, t.row, t.size, g);
        size = t.size ?? 1;
      } else {
        const a = shapeGhost?.id === sh.id ? shapeGhost : sh.anchor;
        c = cellCenter(a.col, a.row, g);
      }
      const angleDeg = turnGhost?.id === sh.id ? turnGhost.angleDeg : (sh.angleDeg ?? 0);
      const a = (angleDeg * Math.PI) / 180;
      const px = ftToPx(sh.sizeFt, scale, g);
      const edge = edgeAllowance(sh.kind, size, g);
      const reach = sh.kind === 'square' ? (px + edge) / 2 + g * 0.45 : sh.kind === 'circle' ? 0 : edge + px;
      out.push({
        id: sh.id,
        cx: c.x,
        cy: c.y,
        angleDeg,
        move: !('tokenId' in sh.anchor),
        rotate: sh.kind === 'circle' ? null : { x: c.x + Math.cos(a) * reach, y: c.y + Math.sin(a) * reach },
      });
    }
    return out;
  }
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

  // Each map opens where this computer last left it (zoom + position).
  const mapIdRef = useRef(map.id);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rememberView = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveView(mapIdRef.current, camera.current);
      // Tell the board which square is in the middle of this screen (the GM's is shared so
      // new player tokens appear where the GM is looking).
      const c = canvasRef.current;
      if (c && onViewSettledRef.current) {
        const w = screenToWorld(camera.current, c.clientWidth / 2, c.clientHeight / 2);
        const cell = pixelToCell(w.x, w.y, mapRef.current.gridSize);
        onViewSettledRef.current(clampCell(cell.col, cell.row, colsRef.current, rowsRef.current));
      }
    }, 300);
  };
  const onViewSettledRef = useRef(onViewSettled);
  onViewSettledRef.current = onViewSettled;
  const mapRef = useRef(map);
  mapRef.current = map;
  const colsRef = useRef(cols);
  colsRef.current = cols;
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  useEffect(() => {
    mapIdRef.current = map.id;
    camera.current = loadView(map.id) ?? { zoom: 1, x: 0, y: 0 };
    bump();
  }, [map.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Leaving measure mode clears any drawn segment.
  useEffect(() => {
    if (tool !== 'measure') setMeasure(null);
  }, [tool]);

  // Pings and light-pen trails animate (pulse / fade) on their own clock, not in response to any
  // other prop changing — so while at least one is live, redraw every frame; otherwise don't
  // pay for a render loop at all.
  useEffect(() => {
    if (!(pings?.length || lightPenStrokes?.length)) return;
    let raf = 0;
    const tick = () => {
      bump();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pings, lightPenStrokes]);

  // Escape clears an active measuring line (and, in measure mode, removes my shared one).
  const clearMeasuresRef = useRef(onClearMeasures);
  clearMeasuresRef.current = onClearMeasures;
  const onEndLightPenRef = useRef(onEndLightPen);
  onEndLightPenRef.current = onEndLightPen;
  const toolRef = useRef(tool);
  toolRef.current = tool;
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        measuringRef.current = false;
        setMeasure(null);
        setShapeAim(null);
        if (lightPenRef.current) {
          lightPenRef.current = null;
          onEndLightPenRef.current?.(); // start fading out whatever was last synced
        }
        if (toolRef.current === 'measure') clearMeasuresRef.current?.();
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
      rememberView();
    }
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, []);

  function getImage(stored?: string): HTMLImageElement | null {
    const src = imageSrc(stored);
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

    // Grid look is per person (strength, thickness, light/dark) — see gridPrefs. Measure
    // lines follow the same light/dark choice.
    const dark = gridLook.color === 'black';
    const gridColor = gridStroke(gridLook);
    const measureColor = dark ? '#000000' : '#ffffff';

    // While a token is being dragged, the cells a blocking token already occupies — used to
    // paint the drag ghost red when it's hovering a cell it isn't allowed to land on.
    const blocked = ghost ? occupiedCells(onMap, ghost.id) : null;

    if (map.gridVisible) {
      // Stop at the map's edge: a map that isn't a whole number of squares wide ends in a
      // part-square, and the grid shouldn't run on past the picture.
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, map.width, map.height);
      ctx.clip();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = gridLook.width / cam.zoom; // same on-screen thickness at any zoom
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
      ctx.restore();
    }

    // --- AoE/measurement shapes (under tokens) ----------------------------------
    const scaleValue = measureScale?.value ?? 1;
    // A shape on a token centers on the middle of the token's whole footprint (a Large 2×2's
    // center is the grid point in its middle) and, for big creatures, reaches from its edge.
    const shapeCenter = (
      anchor: BoardShape['anchor'],
    ): { x: number; y: number; size: number } | null => {
      if ('tokenId' in anchor) {
        const t = tokens.find((tk) => tk.id === anchor.tokenId);
        if (!t) return null; // token gone → drop the shape
        const dragging = ghost?.id === t.id;
        const c = footprintCenter(dragging ? ghost!.col : t.col, dragging ? ghost!.row : t.row, t.size, g);
        return { ...c, size: t.size ?? 1 };
      }
      return { ...cellCenter(anchor.col, anchor.row, g), size: 1 };
    };
    const paintShape = (
      kind: ShapeKind,
      center: { x: number; y: number; size: number },
      sizeFt: number,
      angleDeg: number,
      color: string,
    ) => {
      const edge = edgeAllowance(kind, center.size, g);
      let { x, y } = center;
      let px = ftToPx(sizeFt, scaleValue, g);
      if (kind === 'cone' || kind === 'line') {
        // Start at the creature's edge in the aimed direction.
        const a = (angleDeg * Math.PI) / 180;
        x += Math.cos(a) * edge;
        y += Math.sin(a) * edge;
      } else {
        px += edge;
      }
      shapePath(ctx, kind, x, y, px, angleDeg, g);
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
      const moved = shapeGhost?.id === shape.id ? { col: shapeGhost.col, row: shapeGhost.row } : shape.anchor;
      const center = shapeCenter(moved);
      if (!center) continue;
      const angle = turnGhost?.id === shape.id ? turnGhost.angleDeg : (shape.angleDeg ?? 0);
      paintShape(shape.kind, center, shape.sizeFt, angle, shape.color ?? COLORS.teal);
    }

    // Handles on the shapes this viewer may change: ✥ in the middle to move, ● at the end to turn.
    if (tool === 'select') {
      const r = 8 / cam.zoom;
      for (const hd of shapeHandles()) {
        if (hd.move) {
          ctx.beginPath();
          ctx.arc(hd.cx, hd.cy, r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(15,17,21,0.75)';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5 / cam.zoom;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(hd.cx - r * 0.6, hd.cy);
          ctx.lineTo(hd.cx + r * 0.6, hd.cy);
          ctx.moveTo(hd.cx, hd.cy - r * 0.6);
          ctx.lineTo(hd.cx, hd.cy + r * 0.6);
          ctx.stroke();
        }
        if (hd.rotate) {
          ctx.beginPath();
          ctx.moveTo(hd.cx, hd.cy);
          ctx.lineTo(hd.rotate.x, hd.rotate.y);
          ctx.setLineDash([3 / cam.zoom, 3 / cam.zoom]);
          ctx.strokeStyle = 'rgba(255,255,255,0.6)';
          ctx.lineWidth = 1 / cam.zoom;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(hd.rotate.x, hd.rotate.y, r * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = COLORS.amber;
          ctx.fill();
          ctx.strokeStyle = 'rgba(15,17,21,0.9)';
          ctx.lineWidth = 1.5 / cam.zoom;
          ctx.stroke();
        }
      }
    }

    // Live preview while placing a shape (anchor chosen, aiming or about to commit).
    if (shapeDraft && shapeAim) {
      const center = shapeAim.tokenId
        ? shapeCenter({ tokenId: shapeAim.tokenId })
        : { ...cellCenter(shapeAim.col, shapeAim.row, g), size: 1 };
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
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, map.width, map.height); // fog stops at the map's edge too
    ctx.clip();
    for (const key of Object.keys(fog)) {
      const [c, r] = key.split(',').map(Number);
      ctx.fillRect(c * g, r * g, g, g);
    }
    ctx.restore();

    // Measuring lines: everyone's that were left on the board, plus the one being drawn now.
    const lines: { seg: Segment; who?: string }[] = (measures ?? [])
      .filter((m) => !(measure && m.ownerUid === uid))
      .map((m) => ({ seg: m, who: m.ownerUid === uid ? undefined : m.ownerName }));
    if (measure) lines.push({ seg: measure });
    for (const { seg: measure, who } of measureScale ? lines : []) {
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
      const label = `${who ? `${who} · ` : ''}${squares} sq · ${fmt(squares * measureScale!.value)} ${measureScale!.unit}`;
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

    // Pings: an expanding, fading ring at the cell someone clicked — "look over here." Drawn
    // from shared state only; a ping vanishing here even before the owner's clear-write lands
    // is deliberate (defensive — see PING_LIFETIME_MS).
    const now = Date.now();
    for (const ping of pings ?? []) {
      const age = now - ping.createdAt;
      if (age < 0 || age > PING_LIFETIME_MS) continue;
      const t = age / PING_LIFETIME_MS; // 0 = just placed, 1 = about to disappear
      const c = cellCenter(ping.col, ping.row, g);
      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.strokeStyle = COLORS.amber;
      ctx.lineWidth = 3 / cam.zoom;
      ctx.beginPath();
      ctx.arc(c.x, c.y, g * (0.25 + t * 0.55), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Light-pen trails: a glowing line that fades out behind the cursor as it moves. Points are
    // world pixels (not grid cells), so the trail is smooth; each segment's alpha comes from how
    // old its *newer* endpoint is.
    for (const stroke of lightPenStrokes ?? []) {
      const pts = stroke.points;
      for (let i = 1; i < pts.length; i++) {
        const age = now - pts[i].t;
        if (age > LIGHT_PEN_FADE_MS) continue;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - age / LIGHT_PEN_FADE_MS) * 0.9;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = 4 / cam.zoom;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  useEffect(draw, [
    gridLook,
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
    measures,
    pings,
    lightPenStrokes,
    shapeGhost,
    turnGhost,
    tool,
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

    if (tool === 'ping') {
      onCommitPing?.(col, row);
      return;
    }

    if (tool === 'lightpen') {
      const w = screenToWorld(camera.current, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      const points = [{ x: w.x, y: w.y, t: Date.now() }];
      lightPenRef.current = { points, lastSync: 0 };
      onCommitLightPen?.(points);
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

    // Shape handles: the rotate dot, then the move handle in the middle (hit within ~12px).
    if (tool === 'select' && (onRotateShape || onMoveShape)) {
      const w = screenToWorld(camera.current, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      const reach = 12 / camera.current.zoom;
      const near = (x: number, y: number) => Math.hypot(w.x - x, w.y - y) <= reach;
      const handles = shapeHandles();
      const turn = onRotateShape ? handles.find((hd) => hd.rotate && near(hd.rotate.x, hd.rotate.y)) : undefined;
      if (turn) {
        shapeTurn.current = { id: turn.id };
        setTurnGhost({ id: turn.id, angleDeg: turn.angleDeg });
        return;
      }
      const mv = onMoveShape ? handles.find((hd) => hd.move && near(hd.cx, hd.cy)) : undefined;
      if (mv) {
        shapeDrag.current = { id: mv.id };
        setShapeGhost({ id: mv.id, col, row });
        return;
      }
    }
    // A placed shape can also be dragged by its center square (when no token is standing there).
    if (tool === 'select' && onMoveShape) {
      const onCell = tokensAtCell(onMap.filter((t) => tokenVisibility(t, uid, role) !== 'hidden'), col, row);
      const grab = onCell.length === 0
        ? (shapes ?? []).find((sh) => 'col' in sh.anchor && sh.anchor.col === col && sh.anchor.row === row && (role === 'gm' || sh.ownerUid === uid))
        : undefined;
      if (grab) {
        shapeDrag.current = { id: grab.id };
        setShapeGhost({ id: grab.id, col, row });
        return;
      }
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

    if (hit && canControlToken(hit, uid, role) && !lockedByOther && (!mayMoveToken || mayMoveToken(hit.id))) {
      if (isParty) onGrabParty(hit.id);
      // Remember which square of the token was grabbed so a big token doesn't jump.
      tokenDrag.current = { id: hit.id, party: isParty, dc: col - hit.col, dr: row - hit.row, size: hit.size ?? 1 };
      setGhost({ id: hit.id, col: hit.col, row: hit.row });
    } else if (lockedByOther) {
      // Selected for info, but it's locked — do nothing else (no pan, no drag).
    } else {
      // Empty space (or a token you can't control) → pan the camera (Google-Maps style).
      panRef.current = { lastX: e.clientX, lastY: e.clientY };
      setPanning(true);
    }
  }

  function handleMove(e: MouseEvent<HTMLCanvasElement>) {
    if (lightPenRef.current) {
      const w = screenToWorld(camera.current, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      const now = Date.now();
      const pts = lightPenRef.current.points;
      pts.push({ x: w.x, y: w.y, t: now });
      // Trim the locally-held window too — a long, slow drag shouldn't grow this forever.
      while (pts.length > 1 && now - pts[0].t > LIGHT_PEN_FADE_MS) pts.shift();
      // Lightly throttled: smooth enough to read as a trail, cheap enough not to flood shared
      // state with a write per mouse-move tick.
      if (now - lightPenRef.current.lastSync >= 30) {
        lightPenRef.current.lastSync = now;
        onCommitLightPen?.(pts.slice());
      }
      return;
    }
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
        ? footprintCenter(anchorTok.col, anchorTok.row, anchorTok.size, map.gridSize)
        : cellCenter(shapeAim.col, shapeAim.row, map.gridSize);
      const angleDeg = (Math.atan2(w.y - c.y, w.x - c.x) * 180) / Math.PI;
      setShapeAim((a) => (a ? { ...a, angleDeg } : a));
      return;
    }
    const { col, row } = eventCell(e);
    if (shapeTurn.current) {
      const hd = shapeHandles().find((x) => x.id === shapeTurn.current!.id);
      if (hd) {
        const w = screenToWorld(camera.current, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        const deg = (Math.atan2(w.y - hd.cy, w.x - hd.cx) * 180) / Math.PI;
        setTurnGhost({ id: hd.id, angleDeg: Math.round(deg) });
      }
      return;
    }
    if (shapeDrag.current) {
      if (shapeGhost?.col !== col || shapeGhost?.row !== row) setShapeGhost({ id: shapeDrag.current.id, col, row });
      return;
    }
    if (measuringRef.current) {
      setMeasure((m) => (m ? { ...m, ec: col, er: row } : m));
    } else if (tokenDrag.current) {
      const d = tokenDrag.current;
      const at = dragTopLeft(col, row, d.dc, d.dr, d.size, cols, rows);
      if (ghost?.col !== at.col || ghost?.row !== at.row) {
        setGhost({ id: d.id, col: at.col, row: at.row });
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
    if (lightPenRef.current) {
      onCommitLightPen?.(lightPenRef.current.points.slice());
      onEndLightPen?.();
      lightPenRef.current = null;
      return;
    }
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
    if (shapeTurn.current) {
      const sh = (shapes ?? []).find((x) => x.id === shapeTurn.current!.id);
      if (sh && turnGhost && turnGhost.angleDeg !== (sh.angleDeg ?? 0)) onRotateShape?.(sh.id, turnGhost.angleDeg);
      shapeTurn.current = null;
      setTurnGhost(null);
      return;
    }
    if (shapeDrag.current) {
      const sh = (shapes ?? []).find((x) => x.id === shapeDrag.current!.id);
      if (sh && shapeGhost && 'col' in sh.anchor && (sh.anchor.col !== shapeGhost.col || sh.anchor.row !== shapeGhost.row)) {
        onMoveShape?.(sh.id, shapeGhost.col, shapeGhost.row);
      }
      shapeDrag.current = null;
      setShapeGhost(null);
      return;
    }
    // A finished measurement stays on the board for everyone (replacing my previous one).
    if (measuringRef.current && measure && (measure.sc !== measure.ec || measure.sr !== measure.er)) {
      onCommitMeasure?.(measure);
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
        // Defense in depth: re-check the turn gate here too, in case combat's turn changed
        // mid-drag (grab was allowed, but it's no longer this token's turn by drop time).
        if (canLand && (!mayMoveToken || mayMoveToken(mover.id))) onMoveToken(mover.id, ghost.col, ghost.row);
      }
    }
    if (drag?.party) onReleaseParty(drag.id); // release the soft-lock however the drag ended
    tokenDrag.current = null;
    fogPaint.current = null;
    measuringRef.current = false;
    if (panRef.current) rememberView();
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
      onClearMeasures?.();
      return;
    }
    // A placed shape (cone/line/square/circle) you're allowed to move/rotate deletes with a
    // right-click, at the same reach as its own move/rotate handles — no need to reopen the
    // shape tool to clean one up. Same two hit-tests handleDown already uses to grab a shape
    // (its handle center, then its grid-anchored center cell), so "right-click it" works
    // wherever "drag it" already does. 2026-10-06 playtest.
    if (onDeleteShape) {
      const w = screenToWorld(camera.current, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      const reach = 12 / camera.current.zoom;
      const near = (x: number, y: number) => Math.hypot(w.x - x, w.y - y) <= reach;
      const handleHit = shapeHandles().find((hd) => near(hd.cx, hd.cy));
      if (handleHit) {
        e.preventDefault();
        onDeleteShape(handleHit.id);
        return;
      }
      const { col, row } = eventCell(e);
      const cellHit = (shapes ?? []).find(
        (sh) => 'col' in sh.anchor && sh.anchor.col === col && sh.anchor.row === row && (role === 'gm' || sh.ownerUid === uid),
      );
      if (cellHit) {
        e.preventDefault();
        onDeleteShape(cellHit.id);
        return;
      }
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
    tool === 'measure' || tool === 'fog' || tool === 'shape' || tool === 'ping' || tool === 'lightpen'
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
