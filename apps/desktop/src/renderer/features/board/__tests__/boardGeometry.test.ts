import { describe, it, expect } from 'vitest';
import type { Token } from '@solryn/shared-types';
import {
  blocksMovement,
  canLandOn,
  cellCenter,
  cellToPixel,
  clampCell,
  cycleSelection,
  firstFreeCell,
  footprintAt,
  gridDimensions,
  gridDistanceSquares,
  occupiedCells,
  pixelToCell,
  sizeToSquares,
  tokenAtCell,
  tokensAtCell,
} from '../boardGeometry';

describe('pixelToCell', () => {
  it.each([
    [0, 0, { col: 0, row: 0 }],
    [63, 63, { col: 0, row: 0 }],
    [64, 0, { col: 1, row: 0 }],
    [130, 200, { col: 2, row: 3 }],
  ])('(%i,%i) → cell', (x, y, expected) => {
    expect(pixelToCell(x, y, 64)).toEqual(expected);
  });
});

describe('cellToPixel / cellCenter', () => {
  it('maps a cell to its top-left and center', () => {
    expect(cellToPixel(2, 3, 64)).toEqual({ x: 128, y: 192 });
    expect(cellCenter(0, 0, 64)).toEqual({ x: 32, y: 32 });
  });
});

describe('gridDimensions', () => {
  it('covers the image, rounding up', () => {
    expect(gridDimensions(100, 100, 64)).toEqual({ cols: 2, rows: 2 });
    expect(gridDimensions(128, 64, 64)).toEqual({ cols: 2, rows: 1 });
  });
});

describe('sizeToSquares', () => {
  it.each([
    ['Tiny', 1],
    ['Small', 1],
    ['Medium', 1],
    ['Large', 2],
    ['Huge', 3],
    ['Gargantuan', 4],
  ])('%s → %i squares per side', (size, squares) => {
    expect(sizeToSquares(size)).toBe(squares);
  });

  it('is case-insensitive and defaults unknown/missing to 1', () => {
    expect(sizeToSquares('huge')).toBe(3);
    expect(sizeToSquares('GARGANTUAN')).toBe(4);
    expect(sizeToSquares(undefined)).toBe(1);
    expect(sizeToSquares('Colossal')).toBe(1);
  });
});

describe('tokenAtCell', () => {
  const tokens = [
    { id: 'a', col: 1, row: 1 },
    { id: 'b', col: 1, row: 1 },
    { id: 'c', col: 2, row: 0 },
  ] as Token[];

  it('returns the topmost token in a cell', () => {
    expect(tokenAtCell(tokens, 1, 1)?.id).toBe('b');
    expect(tokenAtCell(tokens, 2, 0)?.id).toBe('c');
    expect(tokenAtCell(tokens, 5, 5)).toBeUndefined();
  });

  it('hits a multi-square token anywhere in its footprint', () => {
    const big = [{ id: 'giant', col: 3, row: 3, size: 2 }] as Token[];
    for (const [c, r] of [[3, 3], [4, 3], [3, 4], [4, 4]]) {
      expect(tokenAtCell(big, c, r)?.id).toBe('giant');
    }
    expect(tokenAtCell(big, 5, 5)).toBeUndefined(); // just outside the 2×2
  });
});

describe('tokensAtCell', () => {
  const tokens = [
    { id: 'a', col: 1, row: 1 },
    { id: 'b', col: 1, row: 1 },
    { id: 'c', col: 2, row: 0 },
  ] as Token[];

  it('returns every token in a cell, bottom → top', () => {
    expect(tokensAtCell(tokens, 1, 1).map((t) => t.id)).toEqual(['a', 'b']);
    expect(tokensAtCell(tokens, 2, 0).map((t) => t.id)).toEqual(['c']);
    expect(tokensAtCell(tokens, 5, 5)).toEqual([]);
  });

  it('includes a size-2 token for every cell of its 2×2 footprint', () => {
    const big = [{ id: 'giant', col: 3, row: 3, size: 2 }] as Token[];
    expect(tokensAtCell(big, 3, 3).map((t) => t.id)).toEqual(['giant']);
    expect(tokensAtCell(big, 4, 4).map((t) => t.id)).toEqual(['giant']);
    expect(tokensAtCell(big, 4, 3).map((t) => t.id)).toEqual(['giant']);
    expect(tokensAtCell(big, 2, 2)).toEqual([]); // outside the footprint
  });
});

describe('cycleSelection (click-cycling through a stack)', () => {
  const stack = [
    { id: 'a', col: 1, row: 1 },
    { id: 'b', col: 1, row: 1 },
    { id: 'c', col: 1, row: 1 },
  ] as Token[]; // a bottom, c top

  it('first click (nothing selected here) picks the topmost', () => {
    expect(cycleSelection(stack, undefined)?.id).toBe('c');
    expect(cycleSelection(stack, 'z')?.id).toBe('c'); // selection not in this stack
  });

  it('repeat clicks step down and wrap back to the top', () => {
    expect(cycleSelection(stack, 'c')?.id).toBe('b');
    expect(cycleSelection(stack, 'b')?.id).toBe('a');
    expect(cycleSelection(stack, 'a')?.id).toBe('c'); // wrap
  });

  it('returns undefined for an empty cell', () => {
    expect(cycleSelection([], 'a')).toBeUndefined();
  });
});

describe('firstFreeCell (creature placement)', () => {
  it('keeps the start cell when it is free', () => {
    expect(firstFreeCell(new Set(), 2, 2, 5, 5)).toEqual({ col: 2, row: 2 });
  });

  it('finds the nearest free cell when the start is taken', () => {
    const occupied = new Set(['2,2']);
    const cell = firstFreeCell(occupied, 2, 2, 5, 5);
    expect(occupied.has(`${cell.col},${cell.row}`)).toBe(false);
    expect(gridDistanceSquares(2, 2, cell.col, cell.row)).toBe(1); // adjacent ring
  });

  it('searches outward past a full inner ring', () => {
    // centre + all 8 neighbours occupied → must land two rings out.
    const occupied = new Set<string>();
    for (let c = 1; c <= 3; c++) for (let r = 1; r <= 3; r++) occupied.add(`${c},${r}`);
    const cell = firstFreeCell(occupied, 2, 2, 7, 7);
    expect(occupied.has(`${cell.col},${cell.row}`)).toBe(false);
    expect(gridDistanceSquares(2, 2, cell.col, cell.row)).toBe(2);
  });

  it('falls back to the start cell when the whole board is full', () => {
    const occupied = new Set<string>();
    for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) occupied.add(`${c},${r}`);
    expect(firstFreeCell(occupied, 1, 1, 3, 3)).toEqual({ col: 1, row: 1 });
  });
});

describe('movement collision (soft block — pass through, can\'t land)', () => {
  const tokens = [
    { id: 'hero', kind: 'character', col: 1, row: 1 },
    { id: 'orc', kind: 'creature', col: 3, row: 3 },
    { id: 'trap', kind: 'trap', col: 5, row: 5 },
    { id: 'giant', kind: 'creature', col: 7, row: 7, size: 2 }, // covers 7,7 7,8 8,7 8,8
  ] as Token[];

  it('footprintAt covers a token\'s squares (default 1, larger when sized)', () => {
    expect(footprintAt(2, 2)).toEqual([{ col: 2, row: 2 }]);
    expect(footprintAt(7, 7, 2)).toEqual([
      { col: 7, row: 7 },
      { col: 7, row: 8 },
      { col: 8, row: 7 },
      { col: 8, row: 8 },
    ]);
  });

  it('only creatures and characters block; traps and scenery do not', () => {
    expect(blocksMovement('character')).toBe(true);
    expect(blocksMovement('creature')).toBe(true);
    expect(blocksMovement('trap')).toBe(false);
  });

  it('occupiedCells gathers blockers, skips the mover and non-blockers', () => {
    const occ = occupiedCells(tokens, 'hero');
    expect(occ.has('3,3')).toBe(true); // the orc blocks
    expect(occ.has('1,1')).toBe(false); // mover excludes itself
    expect(occ.has('5,5')).toBe(false); // trap never blocks
    // giant fills its whole 2×2 footprint
    expect(occ.has('7,7') && occ.has('8,8') && occ.has('7,8') && occ.has('8,7')).toBe(true);
  });

  it('blocks landing on an occupied cell but allows a free one', () => {
    const occ = occupiedCells(tokens, 'hero');
    const hero = tokens[0];
    expect(canLandOn(hero, 3, 3, occ)).toBe(false); // onto the orc — blocked
    expect(canLandOn(hero, 2, 2, occ)).toBe(true); // empty — fine
    expect(canLandOn(hero, 5, 5, occ)).toBe(true); // onto a trap — allowed (walk onto it)
  });

  it('a multi-square mover is blocked if any of its footprint overlaps a blocker', () => {
    const occ = occupiedCells(tokens, 'big'); // 'big' isn't in the list → nothing excluded
    const big = { id: 'big', kind: 'creature', size: 2 } as Token;
    expect(canLandOn(big, 2, 2, occ)).toBe(false); // its 2,2..3,3 footprint hits the orc at 3,3
    expect(canLandOn(big, 4, 0, occ)).toBe(true); // 4,0..5,1 is a clear 2×2 region
  });
});

describe('gridDistanceSquares (Chebyshev — for the measure tool)', () => {
  it.each([
    [0, 0, 3, 2, 3],
    [1, 1, 1, 5, 4],
    [0, 0, 0, 0, 0],
    [2, 2, 5, 8, 6],
  ])('(%i,%i)→(%i,%i) = %i squares', (sc, sr, ec, er, expected) => {
    expect(gridDistanceSquares(sc, sr, ec, er)).toBe(expected);
  });
});

describe('clampCell', () => {
  it('keeps a cell within bounds', () => {
    expect(clampCell(-1, 5, 4, 4)).toEqual({ col: 0, row: 3 });
    expect(clampCell(2, 2, 4, 4)).toEqual({ col: 2, row: 2 });
  });
});
