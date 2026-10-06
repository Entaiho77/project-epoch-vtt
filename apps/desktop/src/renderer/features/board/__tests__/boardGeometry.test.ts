import { describe, it, expect } from 'vitest';
import type { Token } from '@epoch/shared-types';
import {
  blocksMovement,
  canLandOn,
  cellCenter,
  cellToPixel,
  clampCell,
  cycleSelection,
  firstFreeCell,
  takenSquares,
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

describe('placing new tokens on free squares', () => {
  const tok = (id: string, col: number, row: number, size?: number) =>
    ({ id, mapId: 'm', kind: 'creature', name: id, col, row, ...(size ? { size } : {}) }) as never;

  it('counts every square a big token covers, and only on that map', () => {
    const occ = takenSquares([tok('ogre', 2, 2, 2), { ...(tok('elsewhere', 0, 0) as object), mapId: 'x' } as never], 'm');
    expect([...occ].sort()).toEqual(['2,2', '2,3', '3,2', '3,3']);
  });

  it("doesn't drop a token on any square of a Large creature", () => {
    const occ = takenSquares([tok('ogre', 2, 2, 2)], 'm');
    const cell = firstFreeCell(occ, 3, 3, 8, 8);
    expect(occ.has(`${cell.col},${cell.row}`)).toBe(false);
  });

  it('a new Large token needs a whole 2×2 block that is empty and on the board', () => {
    const occ = takenSquares([tok('a', 1, 1)], 'm');
    const cell = firstFreeCell(occ, 0, 0, 4, 4, 2);
    for (let dc = 0; dc < 2; dc++) for (let dr = 0; dr < 2; dr++) {
      expect(occ.has(`${cell.col + dc},${cell.row + dr}`)).toBe(false);
    }
    expect(cell.col + 2).toBeLessThanOrEqual(4);
    expect(cell.row + 2).toBeLessThanOrEqual(4);
  });

  it('player tokens line up from the top-left, skipping taken squares', () => {
    const occ = takenSquares([tok('wolf', 0, 0), tok('p1', 1, 0)], 'm');
    const cell = firstFreeCell(occ, 0, 0, 10, 10);
    expect(occ.has(`${cell.col},${cell.row}`)).toBe(false);
    expect(Math.max(cell.col, cell.row)).toBe(1); // the next ring out
  });
});

import { dragTopLeft, edgeAllowance, footprintCenter, shapeAnchorCenter, tokensInShape } from '../boardGeometry';

describe('big tokens (footprint center, grip, edge reach)', () => {
  it('centers a 2×2 on the grid intersection in its middle, a 1×1 on its square', () => {
    expect(footprintCenter(3, 3, 2, 50)).toEqual({ x: 200, y: 200 });
    expect(footprintCenter(3, 3, 1, 50)).toEqual({ x: 175, y: 175 });
    expect(footprintCenter(3, 3, undefined, 50)).toEqual({ x: 175, y: 175 });
  });
  it('keeps the grabbed square under the cursor and the token on the board', () => {
    // Grabbed a 2×2 by its bottom-right square, pointer now over (6,6) → top-left (5,5).
    expect(dragTopLeft(6, 6, 1, 1, 2, 20, 20)).toEqual({ col: 5, row: 5 });
    // Pushed past the edge → stays fully on the board.
    expect(dragTopLeft(0, 0, 1, 1, 2, 20, 20)).toEqual({ col: 0, row: 0 });
    expect(dragTopLeft(19, 19, 0, 0, 2, 20, 20)).toEqual({ col: 18, row: 18 });
    expect(dragTopLeft(4, 7, 0, 0, 1, 20, 20)).toEqual({ col: 4, row: 7 });
  });
  it('measures shapes on big creatures from their edge; one-square tokens unchanged', () => {
    expect(edgeAllowance('circle', 1, 50)).toBe(0);
    expect(edgeAllowance('circle', 2, 50)).toBe(25);
    expect(edgeAllowance('square', 3, 50)).toBe(100);
    expect(edgeAllowance('cone', 2, 50)).toBe(25);
  });
});

describe('tokensInShape (playtest #8/#9: AoE catches everyone inside)', () => {
  const gridSize = 50; // px/square
  const ftPerSquare = 5; // 1 square = 5 ft, so 1 ft = 10px — easy round numbers below
  const tok = (over: Partial<Token>): Token => ({
    id: 't1', mapId: 'm1', kind: 'creature', name: 't1', col: 0, row: 0, ...over,
  });

  it('a grid-anchored circle catches tokens within its radius, not past it', () => {
    const anchor = shapeAnchorCenter({ col: 2, row: 2 }, [], gridSize)!; // center (125,125)
    const inside = tok({ id: 'a', col: 2, row: 2 }); // same square — distance 0
    const edge = tok({ id: 'b', col: 2, row: 3 }); // one square down — distance 50px = 25ft
    const outside = tok({ id: 'c', col: 2, row: 6 }); // four squares down — 200px = 100ft
    const hits = tokensInShape({ kind: 'circle', sizeFt: 15 }, anchor, [inside, edge, outside], gridSize, ftPerSquare);
    expect(hits.map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('a cone only catches what is in front of it, within its spread', () => {
    const anchor = shapeAnchorCenter({ col: 0, row: 2 }, [], gridSize)!;
    const inFront = tok({ id: 'front', col: 2, row: 2 }); // straight ahead (angle 0 = east)
    const behind = tok({ id: 'behind', col: -2, row: 2 });
    const hits = tokensInShape({ kind: 'cone', sizeFt: 15, angleDeg: 0 }, anchor, [inFront, behind], gridSize, ftPerSquare);
    expect(hits.map((t) => t.id)).toEqual(['front']);
  });

  it('the shared party token is never a valid AoE target', () => {
    const anchor = shapeAnchorCenter({ col: 2, row: 2 }, [], gridSize)!;
    const party = tok({ id: 'party', kind: 'party', col: 2, row: 2 });
    expect(tokensInShape({ kind: 'circle', sizeFt: 25 }, anchor, [party], gridSize, ftPerSquare)).toEqual([]);
  });

  it('shapeAnchorCenter resolves a token-anchored shape to that token\'s footprint center', () => {
    const caster = tok({ id: 'caster', col: 4, row: 4 });
    expect(shapeAnchorCenter({ tokenId: 'caster' }, [caster], gridSize)).toEqual(footprintCenter(4, 4, undefined, gridSize));
    expect(shapeAnchorCenter({ tokenId: 'missing' }, [caster], gridSize)).toBeNull();
  });
});
