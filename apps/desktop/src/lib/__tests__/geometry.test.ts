import { describe, expect, it } from 'vitest';
import {
  cellKey,
  clampZoom,
  parseCellKey,
  pointInToken,
  screenToCell,
  screenToWorld,
  worldToScreen,
  zoomAt,
  type Viewport,
} from '../geometry';

const vp = (panX: number, panY: number, zoom: number): Viewport => ({ panX, panY, zoom });

describe('geometry', () => {
  it('screen↔world round-trips', () => {
    const v = vp(120, -40, 1.5);
    const w = screenToWorld(300, 210, v);
    const s = worldToScreen(w.x, w.y, v);
    expect(s.x).toBeCloseTo(300);
    expect(s.y).toBeCloseTo(210);
  });

  it('identity viewport maps screen to world 1:1', () => {
    const w = screenToWorld(70, 140, vp(0, 0, 1));
    expect(w).toEqual({ x: 70, y: 140 });
  });

  it('maps a screen point to the correct grid cell', () => {
    // gridSize 70, no pan, zoom 1 → pixel 155 is in column 2 (140–210).
    expect(screenToCell(155, 15, vp(0, 0, 1), 70)).toEqual({ col: 2, row: 0 });
  });

  it('accounts for pan and zoom when picking a cell', () => {
    // zoom 2, pan 100 → world x = (sx-100)/2. sx=520 → world 210 → col 3 at gridSize 70.
    expect(screenToCell(520, 100, vp(100, 0, 2), 70).col).toBe(3);
  });

  it('cell key round-trips', () => {
    expect(parseCellKey(cellKey(-3, 5))).toEqual({ col: -3, row: 5 });
  });

  it('clamps zoom to bounds', () => {
    expect(clampZoom(1000)).toBeLessThanOrEqual(6);
    expect(clampZoom(0.0001)).toBeGreaterThanOrEqual(0.15);
  });

  it('zoomAt keeps the anchor point fixed on screen', () => {
    const v = vp(50, 30, 1);
    const zoomed = zoomAt(v, 400, 250, 1.2);
    const w = screenToWorld(400, 250, v);
    const back = worldToScreen(w.x, w.y, zoomed);
    expect(back.x).toBeCloseTo(400);
    expect(back.y).toBeCloseTo(250);
  });

  it('hit-tests a token circle', () => {
    // size-1 token at cell (2,2), gridSize 70 → center world (175,175), radius 35.
    const token = { x: 2, y: 2, size: 1 };
    expect(pointInToken({ x: 175, y: 175 }, token, 70)).toBe(true); // center
    expect(pointInToken({ x: 175, y: 205 }, token, 70)).toBe(true); // 30px from center
    expect(pointInToken({ x: 175, y: 215 }, token, 70)).toBe(false); // 40px, outside r=35
  });

  it('scales the hit circle with token size', () => {
    const large = { x: 0, y: 0, size: 2 }; // center (70,70), radius 70
    expect(pointInToken({ x: 130, y: 70 }, large, 70)).toBe(true); // 60px < 70
    expect(pointInToken({ x: 145, y: 70 }, large, 70)).toBe(false); // 75px > 70
  });
});
