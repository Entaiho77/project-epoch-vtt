import { describe, it, expect } from 'vitest';
import { loadView, pan, saveView, screenToWorld, worldToScreen, zoomAt } from '../boardCamera';

describe('boardCamera', () => {
  it('screenToWorld inverts worldToScreen at any zoom/offset', () => {
    const cam = { zoom: 1.5, x: 30, y: -20 };
    const s = worldToScreen(cam, 100, 80);
    const w = screenToWorld(cam, s.x, s.y);
    expect(w.x).toBeCloseTo(100);
    expect(w.y).toBeCloseTo(80);
  });

  it('zoomAt keeps the world point under the cursor fixed (zoom-to-cursor)', () => {
    const cam = { zoom: 1, x: 12, y: -7 };
    const sx = 240;
    const sy = 160;
    const before = screenToWorld(cam, sx, sy);
    const next = zoomAt(cam, sx, sy, 1.12, 0.25, 4);
    const after = screenToWorld(next, sx, sy);
    expect(next.zoom).toBeCloseTo(1.12);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });

  it('zoomAt clamps to [min, max] and no-ops (same ref) when already clamped', () => {
    expect(zoomAt({ zoom: 3.8, x: 0, y: 0 }, 0, 0, 1.12, 0.25, 4).zoom).toBe(4);
    const atMax = { zoom: 4, x: 0, y: 0 };
    expect(zoomAt(atMax, 0, 0, 1.12, 0.25, 4)).toBe(atMax); // no change → same object
    expect(zoomAt({ zoom: 0.26, x: 0, y: 0 }, 0, 0, 1 / 1.12, 0.25, 4).zoom).toBe(0.25);
  });

  it('pan shifts the offset by the drag delta and keeps zoom', () => {
    expect(pan({ zoom: 2, x: 10, y: 5 }, 4, -3)).toEqual({ zoom: 2, x: 14, y: 2 });
  });
});


describe('remembering the view per map', () => {
  it('a map reopens where it was left; other maps are separate', () => {
    saveView('m1', { zoom: 1.5, x: -120.4, y: 40 });
    expect(loadView('m1')).toEqual({ zoom: 1.5, x: -120, y: 40 });
    expect(loadView('m2')).toBeNull();
  });

  it('ignores junk in storage', () => {
    localStorage.setItem('epoch.board.view.bad', '{"zoom":0,"x":1,"y":1}');
    expect(loadView('bad')).toBeNull();
    localStorage.setItem('epoch.board.view.bad2', 'not json');
    expect(loadView('bad2')).toBeNull();
  });
});
