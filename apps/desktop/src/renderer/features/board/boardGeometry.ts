import type { Token, TokenKind } from '@epoch/shared-types';

/** Pure board geometry: grid-cell ↔ pixel math, snapping, and hit-testing. No I/O. */

export interface Cell {
  col: number;
  row: number;
}

/** Which cell a pixel coordinate falls in (used for snap-to-grid and clicks). */
export function pixelToCell(x: number, y: number, gridSize: number): Cell {
  return { col: Math.floor(x / gridSize), row: Math.floor(y / gridSize) };
}

/** Top-left pixel of a cell. */
export function cellToPixel(
  col: number,
  row: number,
  gridSize: number,
): { x: number; y: number } {
  return { x: col * gridSize, y: row * gridSize };
}

/** Center pixel of a cell (token art is centered here). */
export function cellCenter(
  col: number,
  row: number,
  gridSize: number,
): { x: number; y: number } {
  return { x: (col + 0.5) * gridSize, y: (row + 0.5) * gridSize };
}

/** Grid dimensions covering an image of the given pixel size. */
export function gridDimensions(
  width: number,
  height: number,
  gridSize: number,
): { cols: number; rows: number } {
  return {
    cols: Math.max(1, Math.ceil(width / gridSize)),
    rows: Math.max(1, Math.ceil(height / gridSize)),
  };
}

/** Whether (col,row) falls within a token's footprint (honours multi-square `size`). */
function coversCell(t: Token, col: number, row: number): boolean {
  const n = t.size ?? 1;
  return col >= t.col && col < t.col + n && row >= t.row && row < t.row + n;
}

/** Topmost token occupying a cell (later tokens render on top; multi-square footprints count). */
export function tokenAtCell(
  tokens: Token[],
  col: number,
  row: number,
): Token | undefined {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (coversCell(tokens[i], col, row)) return tokens[i];
  }
  return undefined;
}

/**
 * Every token whose footprint covers a cell, in render order (bottom → top; topmost is last).
 * A `size: 2` token at (3,3) is returned for clicks on (3,3), (3,4), (4,3) and (4,4).
 */
export function tokensAtCell(tokens: Token[], col: number, row: number): Token[] {
  return tokens.filter((t) => coversCell(t, col, row));
}

/**
 * Every token whose footprint overlaps the inclusive cell rectangle
 * [colMin,colMax] × [rowMin,rowMax] — the marquee (drag-box) multi-select's hit test. A
 * multi-square token counts as a hit as soon as any part of its footprint is inside the box,
 * same "any overlap counts" rule `coversCell` uses for a single-cell click.
 */
export function tokensInRect(
  tokens: Token[],
  colMin: number,
  rowMin: number,
  colMax: number,
  rowMax: number,
): Token[] {
  return tokens.filter((t) => {
    const n = t.size ?? 1;
    const tColMax = t.col + n - 1;
    const tRowMax = t.row + n - 1;
    return t.col <= colMax && tColMax >= colMin && t.row <= rowMax && tRowMax >= rowMin;
  });
}

/**
 * Click-cycling through a stack of tokens sharing a cell. The stack is in render order
 * (bottom → top), so the topmost token is the last element. A fresh click (the current
 * selection isn't in this stack) picks the topmost; each repeat click steps one token
 * down and wraps from the bottom back to the top — so every stacked token is reachable
 * by clicking the cell again. Returns undefined for an empty cell.
 */
export function cycleSelection(
  stack: Token[],
  currentId: string | undefined,
): Token | undefined {
  if (stack.length === 0) return undefined;
  const idx = currentId ? stack.findIndex((t) => t.id === currentId) : -1;
  if (idx === -1) return stack[stack.length - 1]; // first click → topmost
  return stack[(idx - 1 + stack.length) % stack.length]; // step down, wrap to top
}

/**
 * Every square covered by any token on one map (multi-square footprints, traps and all),
 * as `"col,row"`. For placing NEW tokens so nothing stacks; dragging uses occupiedCells.
 */
export function takenSquares(tokens: Token[], mapId: string): Set<string> {
  const out = new Set<string>();
  for (const t of tokens) {
    if (t.mapId !== mapId) continue;
    const n = t.size ?? 1;
    for (let dc = 0; dc < n; dc++) for (let dr = 0; dr < n; dr++) out.add(`${t.col + dc},${t.row + dr}`);
  }
  return out;
}

/**
 * Nearest spot to a start cell where a new token fits on empty squares, searched in
 * growing Chebyshev rings and kept on the board. `size` is the new token's footprint
 * (2 = a 2×2 Large creature). Used for every new token so placements don't pile onto
 * one square. Falls back to the start cell if the whole board is full.
 * `occupied` keys are `"col,row"` (see takenSquares).
 */
export function firstFreeCell(
  occupied: Set<string>,
  startCol: number,
  startRow: number,
  cols: number,
  rows: number,
  size = 1,
): Cell {
  const n = Math.max(1, Math.floor(size));
  const fits = (c: number, r: number): boolean => {
    if (c < 0 || r < 0 || c + n > cols || r + n > rows) return false;
    for (let dc = 0; dc < n; dc++) for (let dr = 0; dr < n; dr++) if (occupied.has(`${c + dc},${r + dr}`)) return false;
    return true;
  };
  if (fits(startCol, startRow)) return { col: startCol, row: startRow };
  const maxRadius = Math.max(cols, rows);
  for (let radius = 1; radius <= maxRadius; radius++) {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        if (Math.max(Math.abs(dc), Math.abs(dr)) !== radius) continue; // ring perimeter only
        if (fits(startCol + dc, startRow + dr)) return { col: startCol + dc, row: startRow + dr };
      }
    }
  }
  return { col: startCol, row: startRow }; // board full — fall back
}

/**
 * Distance between two cells in squares (Chebyshev — diagonal counts as one step, the
 * usual grid-movement count). Multiply by a map type's per-square scale for feet/miles.
 */
export function gridDistanceSquares(
  sc: number,
  sr: number,
  ec: number,
  er: number,
): number {
  return Math.max(Math.abs(ec - sc), Math.abs(er - sr));
}

/**
 * A creature's size category → its footprint in squares per side (5e). Tiny/Small/Medium share a
 * square (1); Large = 2×2, Huge = 3×3, Gargantuan = 4×4. Unknown/missing → 1. Case-insensitive.
 */
export function sizeToSquares(size?: string): number {
  switch (size?.toLowerCase()) {
    case 'tiny':
    case 'small':
    case 'medium':
      return 1;
    case 'large':
      return 2;
    case 'huge':
      return 3;
    case 'gargantuan':
      return 4;
    default:
      return 1;
  }
}

/** Cells a token of `size` squares-per-side (default 1) covers, anchored at its top-left. */
export function footprintAt(col: number, row: number, size = 1): Cell[] {
  const cells: Cell[] = [];
  for (let dc = 0; dc < size; dc++) {
    for (let dr = 0; dr < size; dr++) cells.push({ col: col + dc, row: row + dr });
  }
  return cells;
}

/**
 * Which kinds physically occupy their square and so block another token from landing.
 * Creatures and characters block; traps and scenery don't (you walk onto a trap to trip it).
 */
export function blocksMovement(kind: TokenKind): boolean {
  return kind === 'character' || kind === 'creature';
}

/**
 * Cells ("col,row") occupied by blocking tokens, excluding the one being moved. Multi-square
 * tokens fill their whole footprint. Use with `canLandOn` to soft-block a drop.
 */
export function occupiedCells(tokens: Token[], exceptId: string): Set<string> {
  const out = new Set<string>();
  for (const t of tokens) {
    if (t.id === exceptId || !blocksMovement(t.kind)) continue;
    for (const c of footprintAt(t.col, t.row, t.size ?? 1)) out.add(`${c.col},${c.row}`);
  }
  return out;
}

/**
 * Can `mover` finish a move with its top-left on (col,row)? Only the landing footprint is
 * checked — passing through occupied cells mid-drag is always allowed; just the end cell(s)
 * must be clear. `occupied` comes from `occupiedCells` (already excludes the mover).
 */
export function canLandOn(
  mover: Token,
  col: number,
  row: number,
  occupied: Set<string>,
): boolean {
  return footprintAt(col, row, mover.size ?? 1).every(
    (c) => !occupied.has(`${c.col},${c.row}`),
  );
}

/** Clamp a cell to the board bounds. */
export function clampCell(
  col: number,
  row: number,
  cols: number,
  rows: number,
): Cell {
  return {
    col: Math.max(0, Math.min(col, cols - 1)),
    row: Math.max(0, Math.min(row, rows - 1)),
  };
}

/**
 * Pixel center of a token's whole footprint (a 2×2 Large creature's center is the grid
 * intersection in its middle, not the middle of its top-left square).
 */
export function footprintCenter(
  col: number,
  row: number,
  size: number | undefined,
  gridSize: number,
): { x: number; y: number } {
  const n = Math.max(1, size ?? 1);
  return { x: (col + n / 2) * gridSize, y: (row + n / 2) * gridSize };
}

/**
 * Extra pixels a shape grows by when it's anchored to a creature bigger than one square, so
 * its reach is measured from the creature's EDGE (5e auras/emanations), not its middle.
 * A one-square token adds nothing, so ordinary shapes are unchanged.
 * Circles/cones/lines grow by half the extra width on each side; squares by the full extra width.
 */
export function edgeAllowance(kind: 'circle' | 'square' | 'cone' | 'line', size: number | undefined, gridSize: number): number {
  const extra = Math.max(0, (size ?? 1) - 1) * gridSize;
  return kind === 'square' ? extra : extra / 2;
}

/** Feet → pixels at a map's scale. Mirrors BoardCanvas's own `ftToPx` so shape math stays
 * identical whether it's drawing the outline or testing who's caught inside it. */
export function ftToPx(ft: number, ftPerSquare: number, gridSize: number): number {
  return (ft / (ftPerSquare || 1)) * gridSize;
}

/** The pixel point a shape is drawn from — a token's footprint center if token-anchored,
 * otherwise the grid cell's center. Matches BoardCanvas's own anchor resolution. */
export function shapeAnchorCenter(
  anchor: { col: number; row: number } | { tokenId: string },
  tokens: Token[],
  gridSize: number,
): { x: number; y: number } | null {
  if ('tokenId' in anchor) {
    const t = tokens.find((tk) => tk.id === anchor.tokenId);
    return t ? footprintCenter(t.col, t.row, t.size, gridSize) : null;
  }
  return cellCenter(anchor.col, anchor.row, gridSize);
}

/**
 * Every non-party token whose footprint overlaps a placed AoE shape, tested against the exact
 * circle/square/cone/line math BoardCanvas's `shapePath` already draws (same anchor point, same
 * angle convention — 0 = east), just evaluated as a point-in-shape test instead of a canvas path.
 * A big token counts once its footprint EDGE crosses the line, not just its exact middle (the
 * same `edgeAllowance` idea already used for aura/emanation shapes). 2026-10-06 playtest: "make
 * everyone caught in an area-of-effect shape a valid target, not just one."
 */
export function tokensInShape(
  shape: { kind: 'circle' | 'square' | 'cone' | 'line'; sizeFt: number; angleDeg?: number },
  anchor: { x: number; y: number },
  tokens: Token[],
  gridSize: number,
  ftPerSquare: number,
): Token[] {
  const px = ftToPx(shape.sizeFt, ftPerSquare, gridSize);
  const angle = ((shape.angleDeg ?? 0) * Math.PI) / 180;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  return tokens.filter((t) => {
    if (t.kind === 'party') return false;
    const c = footprintCenter(t.col, t.row, t.size, gridSize);
    const reach = edgeAllowance(shape.kind, t.size, gridSize);
    const rx = c.x - anchor.x;
    const ry = c.y - anchor.y;
    if (shape.kind === 'circle') return Math.hypot(rx, ry) <= px + reach;
    // Local frame: u = along the aim direction, v = perpendicular to it.
    const u = rx * dx + ry * dy;
    const v = -rx * dy + ry * dx;
    if (shape.kind === 'square') {
      const h = px / 2 + reach;
      return Math.abs(u) <= h && Math.abs(v) <= h;
    }
    if (shape.kind === 'line') {
      const hw = gridSize / 2 + reach;
      return u >= -reach && u <= px + reach && Math.abs(v) <= hw;
    }
    // cone: apex at the anchor, half-width grows linearly from 0 to px/2 at the far edge.
    if (u < -reach || u > px + reach) return false;
    const halfWidthAt = px > 0 ? (Math.min(Math.max(u, 0), px) / px) * (px / 2) : 0;
    return Math.abs(v) <= halfWidthAt + reach;
  });
}

/**
 * Where a dragged token's top-left lands when the pointer is over (col,row) and the token was
 * grabbed `grabDc`/`grabDr` squares in from its top-left — so the square you grabbed stays under
 * the cursor instead of the token jumping toward it. Kept fully on the board.
 */
export function dragTopLeft(
  col: number,
  row: number,
  grabDc: number,
  grabDr: number,
  size: number | undefined,
  cols: number,
  rows: number,
): Cell {
  const n = Math.max(1, size ?? 1);
  return {
    col: Math.max(0, Math.min(col - grabDc, cols - n)),
    row: Math.max(0, Math.min(row - grabDr, rows - n)),
  };
}
