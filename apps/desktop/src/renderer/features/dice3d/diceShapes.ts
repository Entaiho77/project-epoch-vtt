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

/** Real polyhedral dice we can draw. */
export const DRAWN_SIDES = [4, 6, 8, 10, 12, 20] as const;

/**
 * One die to put on screen for a rolled die: which real die to draw, which of its faces lands
 * up, and what each face says. Most dice print 1..N; a d3 is a d6 marked 1–3 twice, a d2 a
 * d6 marked 1–2, a d100 is a pair of d10s (tens 00–90 + units 0–9), and an unusual die (d7,
 * d30…) is drawn as the nearest real die with the rolled number on the face that lands up.
 */
export interface PlannedDie {
  /** The real die to draw (4, 6, 8, 10, 12 or 20). */
  draw: number;
  /** Which face (1..draw) lands up. */
  land: number;
  /** Text printed on each face (1..draw). */
  label: (face: number) => string;
  /** Tint variant: the d100's tens die is drawn darker so the pair reads as one roll. */
  variant?: 'tens';
}

const plain = () => (face: number) => String(face);

export function diePlan(sides: number, face: number): PlannedDie[] {
  const f = Math.max(1, Math.round(face));
  if ((DRAWN_SIDES as readonly number[]).includes(sides)) {
    return [{ draw: sides, land: Math.min(f, sides), label: plain() }];
  }
  if (sides === 100) {
    // 1..100 → tens digit 0–9 ("00"–"90") + units 0–9; 100 is "00" + "0".
    const units = f % 10;
    const tens = Math.floor((f % 100) / 10);
    const faceFor = (digit: number) => (digit === 0 ? 10 : digit);
    return [
      { draw: 10, land: faceFor(tens), label: (v) => `${(v % 10) * 10}`.padStart(2, '0'), variant: 'tens' },
      { draw: 10, land: faceFor(units), label: (v) => String(v % 10) },
    ];
  }
  if (sides === 3 || sides === 2) {
    // A d6 numbered 1..sides repeating; land on the first face showing the result.
    return [{ draw: 6, land: Math.min(f, sides), label: (v) => String(((v - 1) % sides) + 1) }];
  }
  // Anything else: the smallest real die with enough faces (d20 beyond that), the rolled number
  // printed on the face that lands up.
  const draw = DRAWN_SIDES.find((n) => n >= sides) ?? 20;
  const land = Math.min(f, draw);
  return [{ draw, land, label: (v) => (v === land ? String(f) : String(v)) }];
}

/** Which die to draw for an N-sided roll (first die of its plan). */
export function drawnSides(sides: number): number {
  return diePlan(sides, 1)[0].draw;
}

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
  const n = (DRAWN_SIDES as readonly number[]).includes(sides) ? sides : drawnSides(sides);
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
