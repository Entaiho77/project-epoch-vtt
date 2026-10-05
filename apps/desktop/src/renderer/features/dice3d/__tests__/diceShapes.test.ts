import { describe, expect, it } from 'vitest';
import { Vector3 } from 'three';
import { diePlan, dieShape, drawnSides, faceTowardViewer, landingQuaternion } from '../diceShapes';

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

  it('a d100 is a pair of d10s: tens (00–90) and units (0–9)', () => {
    const [tens, units] = diePlan(100, 37);
    expect([tens.draw, units.draw]).toEqual([10, 10]);
    expect(tens.label(tens.land)).toBe('30');
    expect(units.label(units.land)).toBe('7');
    const hundred = diePlan(100, 100);
    expect(hundred.map((d) => d.label(d.land))).toEqual(['00', '0']);
    const ten = diePlan(100, 10);
    expect(ten.map((d) => d.label(d.land))).toEqual(['10', '0']);
  });

  it('a d3 shows 1–3 (a d6 marked twice) and lands on the result', () => {
    const [d] = diePlan(3, 2);
    expect(d.draw).toBe(6);
    expect([1, 2, 3, 4, 5, 6].map(d.label)).toEqual(['1', '2', '3', '1', '2', '3']);
    expect(d.label(d.land)).toBe('2');
  });

  it('an unusual die shows its real number on the face that lands up', () => {
    const [d7] = diePlan(7, 7);
    expect(d7.draw).toBe(8);
    expect(d7.label(d7.land)).toBe('7');
    const [d30] = diePlan(30, 27);
    expect(d30.draw).toBe(20);
    expect(d30.label(d30.land)).toBe('27');
    expect(drawnSides(20)).toBe(20);
  });
});
