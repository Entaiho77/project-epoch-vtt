import type { Token, TokenKind } from '@solryn/shared-types';

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
 * Nearest unoccupied cell to a start cell, searched in growing Chebyshev rings and
 * clamped to the board. Used when dropping a new creature so several placements don't
 * pile onto one square. Falls back to the start cell if the whole board is full.
 * `occupied` keys are `"col,row"`.
 */
export function firstFreeCell(
  occupied: Set<string>,
  startCol: number,
  startRow: number,
  cols: number,
  rows: number,
): Cell {
  const key = (c: number, r: number) => `${c},${r}`;
  if (!occupied.has(key(startCol, startRow))) return { col: startCol, row: startRow };
  const maxRadius = Math.max(cols, rows);
  for (let radius = 1; radius <= maxRadius; radius++) {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        if (Math.max(Math.abs(dc), Math.abs(dr)) !== radius) continue; // ring perimeter only
        const c = startCol + dc;
        const r = startRow + dr;
        if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
        if (!occupied.has(key(c, r))) return { col: c, row: r };
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
