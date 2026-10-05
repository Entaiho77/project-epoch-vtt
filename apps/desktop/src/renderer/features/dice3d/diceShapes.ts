import {
  BoxGeometry,
  BufferGeometry,
  DodecahedronGeometry,
  Float32BufferAttribute,
  IcosahedronGeometry,
  OctahedronGeometry,
  Quaternion,
  TetrahedronGeometry,
  Vector3,
} from 'three';

/**
 * Die shapes for the 3D dice, and the maths that makes a die land showing a chosen number.
 * No rendering here (unit-tested): the result shown always comes from the real, checked roll —
 * the animation only turns that face toward the viewer.
 */

export interface DieFace {
  /** Outward unit normal of the face (die's own space). */
  normal: Vector3;
  /** Middle of the face (die's own space). */
  center: Vector3;
  /** The number printed on this face. */
  value: number;
}

export interface DieShape {
  sides: number;
  geometry: BufferGeometry;
  faces: DieFace[];
  /** Roughly how big the number label on each face should be (die units). */
  labelSize: number;
}

/** Dice we draw. Anything else (d3, d2, d100's tens) is shown as the nearest real die. */
export const DRAWN_SIDES = [4, 6, 8, 10, 12, 20] as const;

/** Which die to draw for an N-sided roll. */
export function drawnSides(sides: number): number {
  if ((DRAWN_SIDES as readonly number[]).includes(sides)) return sides;
  if (sides === 100) return 10;
  if (sides <= 4) return 4;
  if (sides <= 6) return 6;
  return 20;
}

/**
 * Pentagonal trapezohedron (a d10): two apexes and a zig-zag ring of 10 points, with the apex
 * height worked out so every kite face is perfectly flat.
 */
function d10Geometry(): BufferGeometry {
  const a = 0.105; // ring zig-zag
  const ring = Array.from({ length: 10 }, (_, i) => {
    const t = (i * Math.PI) / 5;
    return new Vector3(Math.cos(t), Math.sin(t), i % 2 === 0 ? a : -a);
  });
  // Apex on the z-axis lying in the plane of ring points 0,1,2 (keeps each kite flat).
  const n = new Vector3().subVectors(ring[1], ring[0]).cross(new Vector3().subVectors(ring[2], ring[0]));
  const h = n.dot(ring[0]) / n.z;
  const top = new Vector3(0, 0, Math.abs(h));
  const bottom = new Vector3(0, 0, -Math.abs(h));
  const tris: Vector3[] = [];
  const quad = (p: Vector3, q: Vector3, r: Vector3, s: Vector3) => tris.push(p, q, r, p, r, s);
  for (let k = 0; k < 5; k++) {
    const i = 2 * k;
    quad(top, ring[i], ring[(i + 1) % 10], ring[(i + 2) % 10]);
    quad(bottom, ring[(i + 3) % 10], ring[(i + 2) % 10], ring[(i + 1) % 10]);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(tris.flatMap((v) => [v.x, v.y, v.z]), 3));
  g.computeVertexNormals();
  return g;
}

function baseGeometry(sides: number): BufferGeometry {
  switch (sides) {
    case 4:
      return new TetrahedronGeometry(1.15);
    case 6:
      return new BoxGeometry(1.25, 1.25, 1.25).toNonIndexed();
    case 8:
      return new OctahedronGeometry(1.05);
    case 10:
      return d10Geometry();
    case 12:
      return new DodecahedronGeometry(1);
    default:
      return new IcosahedronGeometry(1);
  }
}

/** Group a geometry's triangles into flat faces (by normal), with each face's middle. */
export function facesOf(geometry: BufferGeometry): { normal: Vector3; center: Vector3 }[] {
  const pos = geometry.getAttribute('position');
  const groups: { normal: Vector3; points: Vector3[] }[] = [];
  const a = new Vector3();
  const b = new Vector3();
  const c = new Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    const normal = new Vector3().subVectors(b, a).cross(new Vector3().subVectors(c, a)).normalize();
    // Make sure it points outward (dice are centred on the origin).
    const mid = new Vector3().add(a).add(b).add(c).divideScalar(3);
    if (normal.dot(mid) < 0) normal.negate();
    let g = groups.find((x) => x.normal.dot(normal) > 0.999);
    if (!g) {
      g = { normal, points: [] };
      groups.push(g);
    }
    for (const v of [a, b, c]) if (!g.points.some((p) => p.distanceToSquared(v) < 1e-8)) g.points.push(v.clone());
  }
  return groups.map((g) => ({
    normal: g.normal,
    center: g.points.reduce((s, p) => s.add(p), new Vector3()).divideScalar(g.points.length),
  }));
}

const cache = new Map<number, DieShape>();

/** The shape of an N-sided die with its numbered faces (cached). */
export function dieShape(sides: number): DieShape {
  const n = drawnSides(sides);
  const hit = cache.get(n);
  if (hit) return hit;
  const geometry = baseGeometry(n);
  const raw = facesOf(geometry);
  // Number the faces. A d6 gets the real layout (opposite faces add up to 7).
  let faces: DieFace[];
  if (n === 6) {
    const used = new Set<number>();
    faces = [];
    let next = 1;
    for (const f of raw) {
      const opp = faces.find((x) => x.normal.dot(f.normal) < -0.999);
      let value: number;
      if (opp) value = 7 - opp.value;
      else {
        while (used.has(next) || used.has(7 - next)) next++;
        value = next;
      }
      used.add(value);
      faces.push({ ...f, value });
    }
  } else {
    faces = raw.map((f, i) => ({ ...f, value: i + 1 }));
  }
  const labelSize = n === 4 ? 0.66 : n === 6 ? 0.8 : n === 20 ? 0.5 : n === 12 ? 0.62 : 0.58;
  const shape: DieShape = { sides: n, geometry, faces, labelSize };
  cache.set(n, shape);
  return shape;
}

/** The number to show on the drawn die for a rolled face (d100: the units/tens die shows 0–9 as 1–10). */
export function shownValue(sides: number, face: number): number {
  const n = drawnSides(sides);
  if (sides === 100) return ((face - 1) % 10) + 1;
  if (face > n) return ((face - 1) % n) + 1;
  return Math.max(1, face);
}

const UP = new Vector3(0, 0, 1);

/**
 * The orientation that turns the face showing `value` straight toward the viewer (+Z), spun
 * by `twist` radians around the view axis so dice don't all land square.
 */
export function landingQuaternion(shape: DieShape, value: number, twist = 0): Quaternion {
  const face = shape.faces.find((f) => f.value === value) ?? shape.faces[0];
  const align = new Quaternion().setFromUnitVectors(face.normal.clone().normalize(), UP);
  const spin = new Quaternion().setFromAxisAngle(UP, twist);
  return spin.multiply(align);
}

/** Which face points most toward the viewer for an orientation (used to check a landing). */
export function faceTowardViewer(shape: DieShape, q: Quaternion): number {
  let best = shape.faces[0];
  let bestDot = -Infinity;
  for (const f of shape.faces) {
    const d = f.normal.clone().applyQuaternion(q).dot(UP);
    if (d > bestDot) {
      bestDot = d;
      best = f;
    }
  }
  return best.value;
}
