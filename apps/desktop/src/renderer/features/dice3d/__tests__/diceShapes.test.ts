import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { dieShape, drawnSides, faceTowardViewer, landingQuaternion, shownValue } from '../diceShapes';

describe('3D dice shapes', () => {
  it('every die has one flat face per side, numbered 1..N', () => {
    for (const n of [4, 6, 8, 10, 12, 20]) {
      const s = dieShape(n);
      expect(s.faces).toHaveLength(n);
      expect(s.faces.map((f) => f.value).sort((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i + 1));
    }
  });

  it('opposite faces of the d6 add up to 7', () => {
    const s = dieShape(6);
    for (const f of s.faces) {
      const opp = s.faces.find((x) => x.normal.dot(f.normal) < -0.999)!;
      expect(f.value + opp.value).toBe(7);
    }
  });

  it('every die lands showing exactly the rolled number, whatever the twist', () => {
    for (const n of [4, 6, 8, 10, 12, 20]) {
      const s = dieShape(n);
      for (let v = 1; v <= n; v++) {
        const q = landingQuaternion(s, v, v * 0.7);
        expect(faceTowardViewer(s, q)).toBe(v);
        const up = s.faces.find((f) => f.value === v)!.normal.clone().applyQuaternion(q);
        expect(up.dot(new Vector3(0, 0, 1))).toBeGreaterThan(0.999);
      }
    }
  });

  it('odd dice are drawn as the nearest real die and still show their number', () => {
    expect(drawnSides(100)).toBe(10);
    expect(shownValue(100, 37)).toBe(7);
    expect(shownValue(100, 40)).toBe(10);
    expect(drawnSides(3)).toBe(4);
    expect(shownValue(3, 2)).toBe(2);
    expect(drawnSides(2)).toBe(4);
  });
});
