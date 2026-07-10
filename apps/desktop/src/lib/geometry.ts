/**
 * Pure coordinate math for the map canvas. Kept free of React/Canvas so the
 * conversions can be unit-tested headlessly — this is the highest-risk area for
 * subtle bugs (pan/zoom transforms, hit-testing) and the code that most benefits
 * from tests.
 *
 * Three coordinate spaces:
 *   - screen: pixels within the canvas element (mouse events)
 *   - world:  pixels in the map image's own space (what we draw, after pan/zoom)
 *   - cell:   integer grid coordinates (col,row), gridSize world-pixels each
 *
 * The canvas is rendered with `setTransform(zoom, 0, 0, zoom, panX, panY)`, so
 * screen = world * zoom + pan.
 */

export interface Viewport {
  panX: number;
  panY: number;
  zoom: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Cell {
  col: number;
  row: number;
}

export const MIN_ZOOM = 0.15;
export const MAX_ZOOM = 6;

export function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

/** Screen pixel → world pixel. */
export function screenToWorld(sx: number, sy: number, vp: Viewport): Point {
  return { x: (sx - vp.panX) / vp.zoom, y: (sy - vp.panY) / vp.zoom };
}

/** World pixel → screen pixel. */
export function worldToScreen(wx: number, wy: number, vp: Viewport): Point {
  return { x: wx * vp.zoom + vp.panX, y: wy * vp.zoom + vp.panY };
}

/** World pixel → grid cell (floored). */
export function worldToCell(wx: number, wy: number, gridSize: number): Cell {
  return { col: Math.floor(wx / gridSize), row: Math.floor(wy / gridSize) };
}

/** Screen pixel → grid cell. */
export function screenToCell(sx: number, sy: number, vp: Viewport, gridSize: number): Cell {
  const w = screenToWorld(sx, sy, vp);
  return worldToCell(w.x, w.y, gridSize);
}

export function cellKey(col: number, row: number): string {
  return `${col},${row}`;
}

export function parseCellKey(key: string): Cell {
  const [col, row] = key.split(',').map(Number);
  return { col, row };
}

/**
 * Zoom by `factor` while keeping the world point under (sx, sy) fixed on screen.
 * Returns a new viewport.
 */
export function zoomAt(vp: Viewport, sx: number, sy: number, factor: number): Viewport {
  const before = screenToWorld(sx, sy, vp);
  const zoom = clampZoom(vp.zoom * factor);
  return {
    zoom,
    panX: sx - before.x * zoom,
    panY: sy - before.y * zoom,
  };
}

/**
 * Hit-test a token given a world-space point. A token occupies a `size`×`size`
 * block of cells with its top-left at (token.x, token.y) in cell units; the
 * circle is inscribed in that block. Returns true if the point is inside.
 */
export function pointInToken(
  world: Point,
  token: { x: number; y: number; size: number },
  gridSize: number,
): boolean {
  const half = (token.size * gridSize) / 2;
  const cx = token.x * gridSize + half;
  const cy = token.y * gridSize + half;
  const dx = world.x - cx;
  const dy = world.y - cy;
  return dx * dx + dy * dy <= half * half;
}
