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
  /**
   * True when the face numbers are carved directly into the geometry (the bevel/recess/chisel
   * pipeline below) rather than drawn as a flat decal on top. diceScene.ts skips building the
   * per-face label plane and the crisp edge-line overlay for these — the geometry already
   * carries both a real rounded bevel and the engraved numerals.
   */
  carvedNumerals?: boolean;
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

/**
 * A stable (u, v) tangent frame for a face with the given outward normal — any seed vector not
 * parallel to the normal gives one. Shared by the planar UV projection below and by label
 * placement (diceScene.ts), so a face's texture orientation and its printed number agree on
 * which way is "up" instead of each picking an arbitrary twist around the normal.
 */
export function faceBasis(normal: Vector3): { u: Vector3; v: Vector3 } {
  const seed = Math.abs(normal.y) < 0.99 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0);
  const u = new Vector3().crossVectors(seed, normal).normalize();
  const v = new Vector3().crossVectors(normal, u).normalize();
  return { u, v };
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

// ---------------------------------------------------------------------------------------------
// Carved-bevel geometry for the d20 — a real rounded bevel, a dished face recess, and numerals
// engraved straight into the stone, instead of a sharp-edged shape with a flat decal on top.
// Ported 1:1 from the dice-realism sandbox (an Artifact used to dial in the look live before
// touching this file) — see that tool's math for the full derivation/debugging history.
// ---------------------------------------------------------------------------------------------

function v3key(v: Vector3): string {
  return `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;
}

/** Quadratic Bezier point at t, between p0 and p2, pulled toward control point p1. */
function quadBezier(p0: Vector3, p1: Vector3, p2: Vector3, t: number): Vector3 {
  const u = 1 - t;
  return new Vector3(
    u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z,
  );
}

interface ChamferResult {
  tris: [Vector3, Vector3, Vector3][];
  insetFaces: [Vector3, Vector3, Vector3][];
}

/**
 * Insets each face's 3 corners toward its own centroid by `amount`, then bridges the gap
 * between adjacent faces with a bevel strip. At `roundness` 0 that strip is a single flat
 * facet (a plain chamfer); above that, it's a multi-segment ruled surface between two Bezier
 * arcs that bulge out toward the die's real (un-inset) edge, giving a true rounded fillet.
 */
function chamferFaces(faces: Vector3[][], amount: number, roundness: number): ChamferResult {
  const vertUses = new Map<string, [number, number][]>();
  faces.forEach((f, fi) =>
    f.forEach((v, ci) => {
      const k = v3key(v);
      if (!vertUses.has(k)) vertUses.set(k, []);
      vertUses.get(k)!.push([fi, ci]);
    }),
  );
  const insetFaces: [Vector3, Vector3, Vector3][] = faces.map((f) => {
    const c = f[0].clone().add(f[1]).add(f[2]).divideScalar(3);
    return [f[0].clone().lerp(c, amount), f[1].clone().lerp(c, amount), f[2].clone().lerp(c, amount)];
  });
  const tris: [Vector3, Vector3, Vector3][] = [];
  const done = new Set<string>();
  const segs = roundness > 0.001 && amount > 0.001 ? 6 : 1;
  faces.forEach((f, fi) => {
    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3;
      const v0 = f[i];
      const v1 = f[j];
      const k0 = v3key(v0);
      const k1 = v3key(v1);
      const uses0 = vertUses.get(k0)!;
      let neighborFace = -1;
      for (const [ofi] of uses0) {
        if (ofi === fi) continue;
        const usesV1 = vertUses.get(k1)!;
        if (usesV1.some(([p]) => p === ofi)) {
          neighborFace = ofi;
          break;
        }
      }
      if (neighborFace === -1) continue;
      const dk = `${[fi, neighborFace].sort().join('-')}|${[k0, k1].sort().join('|')}`;
      if (done.has(dk)) continue;
      done.add(dk);
      const nf = faces[neighborFace];
      const ci0 = nf.findIndex((v) => v3key(v) === k0);
      const ci1 = nf.findIndex((v) => v3key(v) === k1);
      const t0 = insetFaces[fi][i];
      const t1 = insetFaces[fi][j];
      const o0 = insetFaces[neighborFace][ci0];
      const o1 = insetFaces[neighborFace][ci1];

      if (segs === 1) {
        tris.push([t0, t1, o1]);
        tris.push([t0, o1, o0]);
        continue;
      }

      const ctrlNear = t0.clone().add(o0).multiplyScalar(0.5).lerp(v0, roundness);
      const ctrlFar = t1.clone().add(o1).multiplyScalar(0.5).lerp(v1, roundness);
      let prevNear = t0;
      let prevFar = t1;
      for (let s = 1; s <= segs; s++) {
        const tt = s / segs;
        const curNear = s === segs ? o0 : quadBezier(t0, ctrlNear, o0, tt);
        const curFar = s === segs ? o1 : quadBezier(t1, ctrlFar, o1, tt);
        tris.push([prevNear, prevFar, curFar]);
        tris.push([prevNear, curFar, curNear]);
        prevNear = curNear;
        prevFar = curFar;
      }
    }
  });
  return { tris, insetFaces };
}

/**
 * Fan-fills the pentagon-shaped gap where several edges meet at one original vertex (an
 * icosahedron vertex has 5) — beveling the edges alone leaves that point stranded with an open
 * hole, right where it's most visible.
 */
function vertexCaps(faces: Vector3[][], insetFaces: [Vector3, Vector3, Vector3][]): [Vector3, Vector3, Vector3][] {
  const vertMap = new Map<string, { point: Vector3; normal: Vector3 }[]>();
  faces.forEach((f, fi) => {
    const n = new Vector3().subVectors(f[1], f[0]).cross(new Vector3().subVectors(f[2], f[0])).normalize();
    const mid = f[0].clone().add(f[1]).add(f[2]).divideScalar(3);
    if (n.dot(mid) < 0) n.negate();
    f.forEach((v, ci) => {
      const k = v3key(v);
      if (!vertMap.has(k)) vertMap.set(k, []);
      vertMap.get(k)!.push({ point: insetFaces[fi][ci], normal: n });
    });
  });
  const caps: [Vector3, Vector3, Vector3][] = [];
  vertMap.forEach((items) => {
    if (items.length < 3) return;
    const avgN = new Vector3();
    items.forEach((it) => avgN.add(it.normal));
    avgN.normalize();
    const basis = faceBasis(avgN);
    const sorted = items
      .slice()
      .sort((p, q) => Math.atan2(p.point.dot(basis.v), p.point.dot(basis.u)) - Math.atan2(q.point.dot(basis.v), q.point.dot(basis.u)));
    const centroid = new Vector3();
    sorted.forEach((it) => centroid.add(it.point));
    centroid.divideScalar(sorted.length);
    for (let i = 0; i < sorted.length; i++) {
      caps.push([centroid, sorted[i].point, sorted[(i + 1) % sorted.length].point]);
    }
  });
  return caps;
}

type Bary = [number, number, number];

/**
 * Subdivides a triangle's barycentric weights (not its points) `levels` times. Level 6 (not a
 * lower number) matters: the recess/engrave math below keys off "closeness to center," and a
 * coarser grid's sample points land only on a few discrete values — too coarse to ever fall
 * inside a narrow plateau band, which silently makes the whole effect a no-op. Verified
 * numerically while building the sandbox, not just by eye.
 */
function subdivideBary(levels: number): Bary[][] {
  let tris: Bary[][] = [
    [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  ];
  const mid = (p: Bary, q: Bary): Bary => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
  for (let lvl = 0; lvl < levels; lvl++) {
    const next: Bary[][] = [];
    tris.forEach((t) => {
      const [a, b, c] = t;
      const ab = mid(a, b);
      const bc = mid(b, c);
      const ca = mid(c, a);
      next.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]);
    });
    tris = next;
  }
  return tris;
}

interface DigitCanvas {
  canvas: HTMLCanvasElement;
  data: ImageData;
}

/**
 * Half-width (world units) of the square the glyph canvas is mapped onto when engraving a
 * numeral into a cap. BIGGER = the glyph's fixed canvas footprint is stretched across more of
 * the face = reads bigger on the die (easy to get backwards — the canvas's own ink doesn't
 * change, only how much face area that ink gets spread over). 0.4 makes numbers read about 2x
 * the size they did at the original 0.2 (Matthew's call, 2026-10-06) — if a number starts
 * bleeding past its face's flat plateau into the recessed ring, widen recessPlateauSize to give
 * it more flat room, rather than shrinking this back down.
 *
 * This is an ABSOLUTE world-unit size, so it only reads as "the same size" across dice whose
 * faces are themselves close to the same physical size. The d20's 20 triangular faces are much
 * smaller than, say, the d4/d8's triangular faces (same base circumradius, way more faces to
 * fit), so the same absolute half-width covered a much bigger fraction of the d20's tiny face —
 * numbers read "massively bigger" there specifically (2026-10-06 playtest). Fixed by scaling the
 * d20's own half-width by its face's actual inradius via GLYPH_WIDTH_FRACTION below, instead of
 * using this absolute constant directly, for that one shape. The generalized polyhedron path
 * (d4/d6/d8/d10/d12) keeps using this constant as-is — those all read correctly sized already.
 */
const GLYPH_HALF_WIDTH = 0.4;

/**
 * Used only by the d20 (buildCarvedIcosahedron) to turn its face's own inradius into a glyph
 * half-width that's proportional to that face's actual size, rather than a flat world-unit
 * constant — see GLYPH_HALF_WIDTH's comment for why the d20 needs this and the others don't.
 * Chosen to land the d20's numeral size in the same range the other carved dice already read at
 * (their effective fraction, GLYPH_HALF_WIDTH / their own face inradius, spans roughly 0.64–0.93).
 */
const GLYPH_WIDTH_FRACTION = 0.8;

const digitCanvasCache = new Map<number, DigitCanvas>();

/** A small canvas with just the glyph for `n` drawn on it (dark ink, transparent elsewhere) —
 * its alpha channel doubles as an "is this pixel ink" mask for carving the glyph into stone. */
function digitCanvasFor(n: number): DigitCanvas {
  const hit = digitCanvasCache.get(n);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  let data: ImageData;
  if (ctx) {
    ctx.fillStyle = '#15130c';
    ctx.font = 'bold 78px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(n), 64, 70);
    data = ctx.getImageData(0, 0, c.width, c.height);
  } else {
    // No real 2D canvas backend (e.g. a unit-test environment without a canvas polyfill, and
    // no ImageData global either) — degrade to "no ink anywhere" instead of crashing; the
    // geometry/numbering logic the tests check doesn't depend on the engraving being visible.
    data = { data: new Uint8ClampedArray(c.width * c.height * 4), width: c.width, height: c.height } as ImageData;
  }
  const entry: DigitCanvas = { canvas: c, data };
  digitCanvasCache.set(n, entry);
  return entry;
}

/** Glyph alpha (0-1) at (u, v) in [0,1] — outside that range is "off the glyph's local plane,"
 * i.e. 0, not wrapped around like a tiling texture would be. */
function glyphAlphaAt(dc: DigitCanvas, u: number, v: number): number {
  if (u < 0 || u > 1 || v < 0 || v > 1) return 0;
  const w = dc.canvas.width;
  const h = dc.canvas.height;
  const x = Math.min(w - 1, Math.max(0, Math.floor(u * (w - 1))));
  const y = Math.min(h - 1, Math.max(0, Math.floor((1 - v) * (h - 1))));
  return dc.data.data[(y * w + x) * 4 + 3] / 255;
}

interface HeightMap {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

let heightMap: HeightMap | null = null;
let heightMapRequested = false;

/**
 * Kicks off loading the skin's own albedo image so its pixel luminance can drive a real
 * geometric surface bump on the d20's carved caps — not just a flat decal color. Idempotent
 * (safe to call every roll); diceScene.ts calls this once it knows which skin is active. The
 * image decodes asynchronously, so the first d20 ever rolled before it finishes just renders
 * without the extra bump — once loaded, the d20's cached shape is invalidated so every roll
 * after that picks it up.
 */
export function preloadCarvedSurfaceDetail(albedoUrl: string): void {
  if (heightMapRequested || typeof document === 'undefined') return;
  heightMapRequested = true;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    heightMap = { data: imgData.data, width: c.width, height: c.height };
    cache.delete(20);
  };
  img.src = albedoUrl;
}

/** Tiling luminance sample (0-1) of the loaded height map at (u, v) — wraps like a repeated
 * texture would, matching how the albedo map itself tiles across the die. */
function sampleHeight(u: number, v: number): number {
  if (!heightMap) return 0.55; // neutral (no bump either way) until the real map is loaded
  const { data, width, height } = heightMap;
  const uu = ((u % 1) + 1) % 1;
  const vv = ((v % 1) + 1) % 1;
  const x = Math.min(width - 1, Math.floor(uu * (width - 1)));
  const y = Math.min(height - 1, Math.floor((1 - vv) * (height - 1)));
  const idx = (y * width + x) * 4;
  return (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;
}

export interface CarvedIcosahedronOptions {
  /** How far each face's corners inset toward its centroid before the bevel strip bridges the gap. */
  bevel: number;
  /** 0 = flat chamfer facet, 1 = fully rounded fillet bulging out to the real edge. */
  bevelRoundness: number;
  /** How far the real stone texture's own light/dark pixels push the surface in/out. */
  dispStrength: number;
  /** How deep the dish cut into the middle of each face goes. */
  faceRecess: number;
  /** Radius (in "closeness to center," 0-1) of the flat pad the recess leaves under the number. */
  recessPlateauSize: number;
  /** How deep the numeral itself is cut, on top of the recess. */
  engraveDepth: number;
}

/**
 * Settings tuned live in the dice-realism sandbox and confirmed by Matthew on the d20; reused
 * as-is for every other die shape per his request — same bevel/recess/engrave numbers
 * everywhere rather than re-tuning per shape.
 */
export const CARVE_SETTINGS: CarvedIcosahedronOptions = {
  bevel: 0.12,
  bevelRoundness: 0.7,
  dispStrength: 0.008,
  faceRecess: 0.022,
  recessPlateauSize: 0.57,
  engraveDepth: 0.014,
};

/**
 * Builds a d20 with a real rounded bevel, a dished face recess (protected under each number by
 * a flat plateau), and numerals engraved straight into the stone — plus the per-face normal/
 * center/value data needed for numbering and roll orientation, numbered in the same order a
 * plain `IcosahedronGeometry` would be (so re-numbering logic elsewhere doesn't need to change).
 */
function buildCarvedIcosahedron(opts: CarvedIcosahedronOptions): { geometry: BufferGeometry; faces: DieFace[] } {
  const base = new IcosahedronGeometry(1, 0).toNonIndexed();
  const pos = base.getAttribute('position');
  const rawFaces: Vector3[][] = [];
  for (let i = 0; i < pos.count; i += 3) {
    rawFaces.push([
      new Vector3().fromBufferAttribute(pos, i),
      new Vector3().fromBufferAttribute(pos, i + 1),
      new Vector3().fromBufferAttribute(pos, i + 2),
    ]);
  }

  const chamfered = chamferFaces(rawFaces, opts.bevel, opts.bevelRoundness);
  const positions: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];

  // Edge strips + vertex-corner fans: flat, generic per-normal UV bucketing. These are
  // untouched by the recess/engrave below, which only ever displaces a face's own interior cap.
  const buckets: { normal: Vector3; basis: { u: Vector3; v: Vector3 } }[] = [];
  const findBucket = (n: Vector3) => buckets.find((b) => b.normal.dot(n) > 0.999) ?? null;
  const flatTris: [Vector3, Vector3, Vector3][] = [...chamfered.tris, ...vertexCaps(rawFaces, chamfered.insetFaces)];
  flatTris.forEach(([a, b, c]) => {
    const n = new Vector3().subVectors(b, a).cross(new Vector3().subVectors(c, a));
    if (n.lengthSq() < 1e-10) return; // degenerate (zero-bevel edge strips) — skip
    n.normalize();
    const mid = a.clone().add(b).add(c).divideScalar(3);
    if (n.dot(mid) < 0) n.negate();
    let bucket = findBucket(n);
    if (!bucket) {
      bucket = { normal: n, basis: faceBasis(n) };
      buckets.push(bucket);
    }
    // Without this, the bevel strip is just more stone-colored surface with no line marking
    // where one face ends and the next begins — other (uncarved) dice get that definition from
    // a separate dark seam overlay, which a carved shape skips since the real bevel is supposed
    // to read as the edge on its own. In practice the bevel's own shading wasn't enough: it
    // blended smoothly into each face instead of reading as a cut line, which is a big part of
    // why the whole die looked soft/uniform ("clay") rather than faceted. Darkening the strip
    // itself bakes in the same shadowed-groove look the flat dice get from their edge overlay.
    const STRIP_SHADE = 0.45;
    [a, b, c].forEach((p) => {
      positions.push(p.x, p.y, p.z);
      uvs.push(p.dot(bucket!.basis.u), p.dot(bucket!.basis.v));
      colors.push(STRIP_SHADE, STRIP_SHADE, STRIP_SHADE);
    });
  });

  // Face caps: the recess dish and the chiseled numeral both live here.
  const baryTris = subdivideBary(6);
  const faces: DieFace[] = [];
  chamfered.insetFaces.forEach((capTri, idx) => {
    const [a0, b0, c0] = capTri;
    const n = new Vector3().subVectors(b0, a0).cross(new Vector3().subVectors(c0, a0)).normalize();
    const centroid = a0.clone().add(b0).add(c0).divideScalar(3);
    if (n.dot(centroid) < 0) n.negate();
    const basis = faceBasis(n);
    const value = idx + 1;
    faces.push({ normal: n.clone(), center: centroid.clone(), value });

    // The glyph's own frame, anchored to this triangle's own shape (not a generic world-up
    // reference): the bottom of the number sits flush along one edge (rawFace[0]->rawFace[1])
    // and the top points at the opposite corner — the standard way a real d20 is numbered.
    // Confirmed against the reference art in the realism sandbox.
    const rawFace = rawFaces[idx];
    const edgeDir = rawFace[1].clone().sub(rawFace[0]).normalize();
    const up = new Vector3().crossVectors(n, edgeDir).normalize();
    const apexMid = rawFace[0].clone().add(rawFace[1]).multiplyScalar(0.5);
    if (up.dot(rawFace[2].clone().sub(apexMid)) < 0) up.negate();
    const textCentroid = rawFace[0].clone().add(rawFace[1]).add(rawFace[2]).divideScalar(3);
    const dc = digitCanvasFor(value);
    // This face's own "radius" (centroid to nearest edge) — the d20's faces are much smaller
    // than the other carved dice's, so the glyph window has to shrink to match (see
    // GLYPH_WIDTH_FRACTION's comment).
    const textInradius = Math.min(
      edgeDistance(textCentroid, rawFace[0], rawFace[1]),
      edgeDistance(textCentroid, rawFace[1], rawFace[2]),
      edgeDistance(textCentroid, rawFace[2], rawFace[0]),
    );
    const glyphHalfWidth = GLYPH_WIDTH_FRACTION * textInradius;

    baryTris.forEach((triW) => {
      triW.forEach((w) => {
        const p = a0.clone().multiplyScalar(w[0]).add(b0.clone().multiplyScalar(w[1])).add(c0.clone().multiplyScalar(w[2]));
        const u = p.dot(basis.u);
        const v = p.dot(basis.v);
        // The smallest barycentric weight is proportional to true distance from the NEAREST
        // edge — zero along the whole rim, not just the 3 corners — so the dish's rim sits
        // flush with the bevel strip all the way around instead of leaving a step.
        const centerness = 3 * Math.min(w[0], w[1], w[2]);
        let ring = 0;
        if (opts.faceRecess > 0 && centerness < opts.recessPlateauSize) {
          const r = centerness / opts.recessPlateauSize;
          ring = Math.sin(Math.PI * r); // 0 at the rim, 0 again at the plateau boundary, peak between
        }
        if (opts.faceRecess > 0) p.addScaledVector(n, -opts.faceRecess * ring);
        if (opts.dispStrength > 0) {
          const h = sampleHeight(u, v);
          p.addScaledVector(n, (h - 0.55) * opts.dispStrength);
        }

        // Map this point into the glyph's local square and read its alpha mask — ink where
        // alpha > 0 — to cut the numeral straight into the (already recessed) cap.
        const rel = p.clone().sub(textCentroid);
        const lu = (rel.dot(edgeDir) / glyphHalfWidth) * 0.5 + 0.5;
        const lv = (rel.dot(up) / glyphHalfWidth) * 0.5 + 0.5;
        const glyphAlpha = glyphAlphaAt(dc, lu, lv);
        if (glyphAlpha > 0) p.addScaledVector(n, -opts.engraveDepth * glyphAlpha);

        positions.push(p.x, p.y, p.z);
        uvs.push(u, v);
        const shade = 1 - glyphAlpha * 0.96; // darken toward near-black exactly where the glyph's ink is
        colors.push(shade, shade, shade);
      });
    });
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return { geometry, faces };
}

// ---------------------------------------------------------------------------------------------
// The same carving pipeline, generalized from "every face is a triangle" (the d20 above) to any
// convex polyhedron whose faces are N-sided — squares (d6), kites (d10), pentagons (d12) — plus
// the triangular d4/d8, which fall out of the same code as the N=3 case. Kept as a separate path
// from buildCarvedIcosahedron rather than rewriting it in terms of this one, so the already-
// confirmed d20 can't regress from a refactor made in service of the other five shapes.
// ---------------------------------------------------------------------------------------------

interface PolyFace {
  /** Boundary corners in order (CCW viewed from outside) — 3 for a triangle, 4 for a square or
   * kite, 5 for a pentagon. */
  corners: Vector3[];
  normal: Vector3;
}

/**
 * Reconstructs each real N-gon face from a triangulated (and possibly fan- or strip-split)
 * base geometry: groups the raw triangles by shared normal, then traces their outer boundary —
 * the edges that appear in only one triangle of the group are the polygon's real sides; an edge
 * appearing in two (a diagonal some triangulation added) is interior and gets dropped.
 */
function polyFacesOf(geometry: BufferGeometry): PolyFace[] {
  const pos = geometry.getAttribute('position');
  const tris: [Vector3, Vector3, Vector3][] = [];
  for (let i = 0; i < pos.count; i += 3) {
    tris.push([
      new Vector3().fromBufferAttribute(pos, i),
      new Vector3().fromBufferAttribute(pos, i + 1),
      new Vector3().fromBufferAttribute(pos, i + 2),
    ]);
  }
  const groups: { normal: Vector3; tris: [Vector3, Vector3, Vector3][] }[] = [];
  tris.forEach((t) => {
    const n = new Vector3().subVectors(t[1], t[0]).cross(new Vector3().subVectors(t[2], t[0])).normalize();
    const mid = t[0].clone().add(t[1]).add(t[2]).divideScalar(3);
    if (n.dot(mid) < 0) n.negate();
    let g = groups.find((x) => x.normal.dot(n) > 0.999);
    if (!g) {
      g = { normal: n, tris: [] };
      groups.push(g);
    }
    g.tris.push(t);
  });
  return groups.map((g) => ({ normal: g.normal, corners: orderBoundary(g.tris) }));
}

function orderBoundary(tris: [Vector3, Vector3, Vector3][]): Vector3[] {
  const edgeSeen = new Map<string, { a: Vector3; b: Vector3; count: number }>();
  const addEdge = (a: Vector3, b: Vector3) => {
    const uk = [v3key(a), v3key(b)].sort().join('|');
    const rec = edgeSeen.get(uk);
    if (rec) rec.count++;
    else edgeSeen.set(uk, { a, b, count: 1 });
  };
  tris.forEach((t) => {
    addEdge(t[0], t[1]);
    addEdge(t[1], t[2]);
    addEdge(t[2], t[0]);
  });
  const boundary: { a: Vector3; b: Vector3 }[] = [];
  const byStart = new Map<string, { a: Vector3; b: Vector3 }>();
  edgeSeen.forEach((rec) => {
    if (rec.count === 1) {
      boundary.push(rec);
      byStart.set(v3key(rec.a), rec);
    }
  });
  const loop: Vector3[] = [boundary[0].a];
  let cur = boundary[0];
  for (let i = 0; i < boundary.length - 1; i++) {
    const next = byStart.get(v3key(cur.b));
    if (!next) break;
    loop.push(cur.b);
    cur = next;
  }
  return loop;
}

/** Perpendicular distance from p to the infinite line through a and b. Valid as an in-plane
 * edge distance here because p and the edge are always coplanar (same polygon face). */
function edgeDistance(p: Vector3, a: Vector3, b: Vector3): number {
  const d = b.clone().sub(a).normalize();
  return p.clone().sub(a).cross(d).length();
}

/** Generalizes the d20's "3 * min(barycentric weight)" trick — distance from the nearest edge,
 * 0 on the rim and 1 at the face's own center — to an N-gon via real geometric edge distance,
 * normalized by the face's inradius (its centroid's own distance to its nearest edge). Works
 * for a triangle too, just computed a different way, which is why the d20 doesn't need this. */
function ngonCenterness(p: Vector3, corners: Vector3[], inradius: number): number {
  if (inradius <= 0) return 0;
  let minDist = Infinity;
  const n = corners.length;
  for (let i = 0; i < n; i++) {
    const dist = edgeDistance(p, corners[i], corners[(i + 1) % n]);
    if (dist < minDist) minDist = dist;
  }
  return Math.max(0, 1 - minDist / inradius);
}

interface ChamferPolyResult {
  tris: [Vector3, Vector3, Vector3][];
  /** Per face, that face's own inset corners, in the same order as its `corners`. */
  insetFaces: Vector3[][];
}

/** Exactly chamferFaces' algorithm, with "3" replaced by each face's own corner count. */
function chamferPolyFaces(faces: PolyFace[], amount: number, roundness: number): ChamferPolyResult {
  const vertUses = new Map<string, [number, number][]>();
  faces.forEach((f, fi) =>
    f.corners.forEach((v, ci) => {
      const k = v3key(v);
      if (!vertUses.has(k)) vertUses.set(k, []);
      vertUses.get(k)!.push([fi, ci]);
    }),
  );
  const insetFaces: Vector3[][] = faces.map((f) => {
    const centroid = f.corners.reduce((s, p) => s.add(p), new Vector3()).divideScalar(f.corners.length);
    return f.corners.map((c) => c.clone().lerp(centroid, amount));
  });
  const tris: [Vector3, Vector3, Vector3][] = [];
  const done = new Set<string>();
  const segs = roundness > 0.001 && amount > 0.001 ? 6 : 1;
  faces.forEach((f, fi) => {
    const n = f.corners.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const v0 = f.corners[i];
      const v1 = f.corners[j];
      const k0 = v3key(v0);
      const k1 = v3key(v1);
      const uses0 = vertUses.get(k0)!;
      let neighborFace = -1;
      for (const [ofi] of uses0) {
        if (ofi === fi) continue;
        const usesV1 = vertUses.get(k1)!;
        if (usesV1.some(([p]) => p === ofi)) {
          neighborFace = ofi;
          break;
        }
      }
      if (neighborFace === -1) continue;
      const dk = `${[fi, neighborFace].sort().join('-')}|${[k0, k1].sort().join('|')}`;
      if (done.has(dk)) continue;
      done.add(dk);
      const nf = faces[neighborFace];
      const ci0 = nf.corners.findIndex((v) => v3key(v) === k0);
      const ci1 = nf.corners.findIndex((v) => v3key(v) === k1);
      const t0 = insetFaces[fi][i];
      const t1 = insetFaces[fi][j];
      const o0 = insetFaces[neighborFace][ci0];
      const o1 = insetFaces[neighborFace][ci1];

      if (segs === 1) {
        tris.push([t0, t1, o1]);
        tris.push([t0, o1, o0]);
        continue;
      }

      const ctrlNear = t0.clone().add(o0).multiplyScalar(0.5).lerp(v0, roundness);
      const ctrlFar = t1.clone().add(o1).multiplyScalar(0.5).lerp(v1, roundness);
      let prevNear = t0;
      let prevFar = t1;
      for (let s = 1; s <= segs; s++) {
        const tt = s / segs;
        const curNear = s === segs ? o0 : quadBezier(t0, ctrlNear, o0, tt);
        const curFar = s === segs ? o1 : quadBezier(t1, ctrlFar, o1, tt);
        tris.push([prevNear, prevFar, curFar]);
        tris.push([prevNear, curFar, curNear]);
        prevNear = curNear;
        prevFar = curFar;
      }
    }
  });
  return { tris, insetFaces };
}

/** vertexCaps, generalized to take faces with their own precomputed normal (no triangle-only
 * normal recompute) and a variable number of corners per face. */
function vertexCapsGeneric(faces: PolyFace[], insetFaces: Vector3[][]): [Vector3, Vector3, Vector3][] {
  const vertMap = new Map<string, { point: Vector3; normal: Vector3 }[]>();
  faces.forEach((f, fi) => {
    f.corners.forEach((v, ci) => {
      const k = v3key(v);
      if (!vertMap.has(k)) vertMap.set(k, []);
      vertMap.get(k)!.push({ point: insetFaces[fi][ci], normal: f.normal });
    });
  });
  const caps: [Vector3, Vector3, Vector3][] = [];
  vertMap.forEach((items) => {
    if (items.length < 3) return;
    const avgN = new Vector3();
    items.forEach((it) => avgN.add(it.normal));
    avgN.normalize();
    const basis = faceBasis(avgN);
    const sorted = items
      .slice()
      .sort((p, q) => Math.atan2(p.point.dot(basis.v), p.point.dot(basis.u)) - Math.atan2(q.point.dot(basis.v), q.point.dot(basis.u)));
    const centroid = new Vector3();
    sorted.forEach((it) => centroid.add(it.point));
    centroid.divideScalar(sorted.length);
    for (let i = 0; i < sorted.length; i++) {
      caps.push([centroid, sorted[i].point, sorted[(i + 1) % sorted.length].point]);
    }
  });
  return caps;
}

/**
 * Builds a carved die for any convex polyhedron whose faces are (near-)regular N-gons — the
 * d4/d8 (triangles, same math as the d20 but routed generically), d6 (squares), d10 (kites),
 * and d12 (pentagons). `assignValues` supplies the face numbering so shape-specific rules (the
 * d6's "opposite faces sum to 7") still apply; everything else — bevel, recess, bump, chisel,
 * the shadowed bevel seam — is identical to the d20's pipeline.
 */
function buildCarvedPolyhedron(
  baseGeom: BufferGeometry,
  opts: CarvedIcosahedronOptions,
  assignValues: (rawFaces: { normal: Vector3; center: Vector3 }[]) => number[],
): { geometry: BufferGeometry; faces: DieFace[] } {
  const polyFaces = polyFacesOf(baseGeom);
  const rawFaceInfo = polyFaces.map((f) => ({
    normal: f.normal,
    center: f.corners.reduce((s, p) => s.add(p), new Vector3()).divideScalar(f.corners.length),
  }));
  const values = assignValues(rawFaceInfo);

  const chamfered = chamferPolyFaces(polyFaces, opts.bevel, opts.bevelRoundness);
  const positions: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];

  const buckets: { normal: Vector3; basis: { u: Vector3; v: Vector3 } }[] = [];
  const findBucket = (n: Vector3) => buckets.find((b) => b.normal.dot(n) > 0.999) ?? null;
  const flatTris: [Vector3, Vector3, Vector3][] = [...chamfered.tris, ...vertexCapsGeneric(polyFaces, chamfered.insetFaces)];
  const STRIP_SHADE = 0.45; // matches the d20's bevel-seam shading — see buildCarvedIcosahedron
  flatTris.forEach(([a, b, c]) => {
    const n = new Vector3().subVectors(b, a).cross(new Vector3().subVectors(c, a));
    if (n.lengthSq() < 1e-10) return;
    n.normalize();
    const mid = a.clone().add(b).add(c).divideScalar(3);
    if (n.dot(mid) < 0) n.negate();
    let bucket = findBucket(n);
    if (!bucket) {
      bucket = { normal: n, basis: faceBasis(n) };
      buckets.push(bucket);
    }
    [a, b, c].forEach((p) => {
      positions.push(p.x, p.y, p.z);
      uvs.push(p.dot(bucket!.basis.u), p.dot(bucket!.basis.v));
      colors.push(STRIP_SHADE, STRIP_SHADE, STRIP_SHADE);
    });
  });

  // Face caps, fan-triangulated from each face's own centroid into N triangles (one per edge)
  // so a square/kite/pentagon cap can be subdivided the same way a triangle's is. Originally
  // kept one level coarser than the d20's (4 vs 6) to save build time, since most faces fan out
  // into several sub-triangles instead of just one — but the carved numeral's edge is only ever
  // as crisp as the vertex grid it's sampled onto (each vertex gets one glyph-alpha sample, then
  // the GPU linearly interpolates color across the triangle between them), and these dice's
  // faces are themselves bigger in world units than the d20's 20-way-split ones. At level 4 that
  // grid was coarse enough, relative to face size, to blur the numeral into a soft smear instead
  // of a readable digit (2026-10-06 playtest: "fuzzy, not distinct"). Level 6 matches the d20's
  // own sample density and reads crisp again.
  const fanBary = subdivideBary(6);
  const faces: DieFace[] = [];
  chamfered.insetFaces.forEach((capCorners, idx) => {
    const n = polyFaces[idx].normal;
    const centroid = capCorners.reduce((s, p) => s.add(p), new Vector3()).divideScalar(capCorners.length);
    const basis = faceBasis(n);
    const value = values[idx];
    faces.push({ normal: n.clone(), center: centroid.clone(), value });

    // Text frame generalizing the d20's own-edge convention: flush along the face's first edge,
    // "up" pointing from that edge toward the face's own center (for a triangle this is
    // exactly "toward the opposite corner"; for a square/kite/pentagon it's the same idea).
    const rawCorners = polyFaces[idx].corners;
    const edgeDir = rawCorners[1].clone().sub(rawCorners[0]).normalize();
    const up = new Vector3().crossVectors(n, edgeDir).normalize();
    const edgeMid = rawCorners[0].clone().add(rawCorners[1]).multiplyScalar(0.5);
    const rawCentroid = rawCorners.reduce((s, p) => s.add(p), new Vector3()).divideScalar(rawCorners.length);
    if (up.dot(rawCentroid.clone().sub(edgeMid)) < 0) up.negate();
    const dc = digitCanvasFor(value);

    const m = capCorners.length;
    const inradius = Math.min(...capCorners.map((_, i) => edgeDistance(centroid, capCorners[i], capCorners[(i + 1) % m])));

    for (let i = 0; i < m; i++) {
      const cornerA = capCorners[i];
      const cornerB = capCorners[(i + 1) % m];
      fanBary.forEach((triW) => {
        triW.forEach((w) => {
          // w[0] weights the centroid, w[1]/w[2] this fan triangle's two outer (real-edge) corners.
          const p = centroid
            .clone()
            .multiplyScalar(w[0])
            .add(cornerA.clone().multiplyScalar(w[1]))
            .add(cornerB.clone().multiplyScalar(w[2]));
          const u = p.dot(basis.u);
          const v = p.dot(basis.v);
          const centerness = ngonCenterness(p, capCorners, inradius);
          let ring = 0;
          if (opts.faceRecess > 0 && centerness < opts.recessPlateauSize) {
            const r = centerness / opts.recessPlateauSize;
            ring = Math.sin(Math.PI * r);
          }
          if (opts.faceRecess > 0) p.addScaledVector(n, -opts.faceRecess * ring);
          if (opts.dispStrength > 0) {
            const h = sampleHeight(u, v);
            p.addScaledVector(n, (h - 0.55) * opts.dispStrength);
          }

          const rel = p.clone().sub(rawCentroid);
          const lu = (rel.dot(edgeDir) / GLYPH_HALF_WIDTH) * 0.5 + 0.5;
          const lv = (rel.dot(up) / GLYPH_HALF_WIDTH) * 0.5 + 0.5;
          const glyphAlpha = glyphAlphaAt(dc, lu, lv);
          if (glyphAlpha > 0) p.addScaledVector(n, -opts.engraveDepth * glyphAlpha);

          positions.push(p.x, p.y, p.z);
          uvs.push(u, v);
          const shade = 1 - glyphAlpha * 0.96;
          colors.push(shade, shade, shade);
        });
      });
    }
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return { geometry, faces };
}

/** Same "opposite faces sum to 7" rule dieShape() used to apply after facesOf() — reproduced
 * here so the carved d6 numbers the same way the old flat-decal one did. */
function assignD6Values(rawFaces: { normal: Vector3; center: Vector3 }[]): number[] {
  const used = new Set<number>();
  const values: number[] = new Array(rawFaces.length).fill(0);
  const assigned: { normal: Vector3; value: number }[] = [];
  let next = 1;
  rawFaces.forEach((f, idx) => {
    const opp = assigned.find((x) => x.normal.dot(f.normal) < -0.999);
    let value: number;
    if (opp) value = 7 - opp.value;
    else {
      while (used.has(next) || used.has(7 - next)) next++;
      value = next;
    }
    used.add(value);
    assigned.push({ normal: f.normal, value });
    values[idx] = value;
  });
  return values;
}

const cache = new Map<number, DieShape>();

/** The shape of an N-sided die with its numbered faces (cached). */
export function dieShape(sides: number): DieShape {
  const n = (DRAWN_SIDES as readonly number[]).includes(sides) ? sides : drawnSides(sides);
  const hit = cache.get(n);
  if (hit) return hit;

  if (n === 20) {
    const { geometry, faces } = buildCarvedIcosahedron(CARVE_SETTINGS);
    const shape: DieShape = { sides: n, geometry, faces, labelSize: 0.5, carvedNumerals: true };
    cache.set(n, shape);
    return shape;
  }

  // Every other drawn die (d4/d6/d8/d10/d12) gets the same bevel/recess/chisel treatment via
  // the generalized N-gon pipeline, carrying over each shape's own numbering rule.
  const { geometry, faces } = buildCarvedPolyhedron(baseGeometry(n), CARVE_SETTINGS, n === 6 ? assignD6Values : (raw) => raw.map((_, i) => i + 1));
  const shape: DieShape = { sides: n, geometry, faces, labelSize: 0.5, carvedNumerals: true };
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
