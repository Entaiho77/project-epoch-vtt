import {
  CanvasTexture,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  RepeatWrapping,
  Scene,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { diePlan, dieShape, landingQuaternion } from './diceShapes';
import { DICE_SKINS, DEFAULT_DICE_SKIN, type DiceSkin } from './diceSkins';

/**
 * The 3D dice animation: dice tumble in from the side of the board, bounce and settle with the
 * real (already checked) results facing up, stay a moment, then fade. Purely for show — the
 * numbers come from the roll; nothing here decides a result. Loaded only when first used.
 */

export interface DieToShow {
  /** Sides rolled (4, 6, 8, 10, 12, 20, 100…). */
  s: number;
  /** The face that was rolled. */
  f: number;
}

const MAX_DICE = 10;
const ROLL_MS = 1300;
const HOLD_MS = 1100;
const FADE_MS = 400;

const labelCache = new Map<string, CanvasTexture>();
function labelTexture(text: string, sides: number): CanvasTexture {
  const key = `${sides}:${text}`;
  const hit = labelCache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${text.length >= 2 ? 62 : 80}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 64, 68);
  // 6 and 9 get an underline so they can be told apart.
  if ((text === '6' || text === '9') && sides > 6) ctx.fillRect(40, 104, 48, 7);
  const tex = new CanvasTexture(c);
  labelCache.set(key, tex);
  return tex;
}

// Skin textures are loaded once and kept for the app's life (small, reused every roll) —
// only the per-roll materials that reference them get created and disposed each time.
const skinTextureCache = new Map<string, { albedo: Texture; normal: Texture; roughnessMap: Texture }>();
const textureLoader = new TextureLoader();
function getSkinTextures(skin: DiceSkin) {
  const hit = skinTextureCache.get(skin.id);
  if (hit) return hit;
  const load = (url: string) => {
    const tex = textureLoader.load(url);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    if (skin.repeat !== 1) tex.repeat.set(skin.repeat, skin.repeat);
    return tex;
  };
  const result = { albedo: load(skin.albedo), normal: load(skin.normal), roughnessMap: load(skin.roughness) };
  skinTextureCache.set(skin.id, result);
  return result;
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** True when this computer can draw 3D (WebGL). */
export function canShow3d(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Roll the dice across `container` (an element positioned over the board). Resolves when the
 * dice have landed (the result is on screen) — the fade-out continues after.
 */
export function showDice(
  container: HTMLElement,
  dice: DieToShow[],
  color = '#2a9d8f',
  skinId: string = DEFAULT_DICE_SKIN,
): Promise<void> {
  // A d100 is two d10s, so plan first, then cap how many are drawn.
  const list = dice.flatMap((d) => diePlan(d.s, d.f)).slice(0, MAX_DICE);
  if (list.length === 0 || !canShow3d()) return Promise.resolve();

  const w = Math.max(1, container.clientWidth);
  const h = Math.max(1, container.clientHeight);
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return Promise.resolve();
  }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(w, h);
  const canvas = renderer.domElement;
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '18',
    transition: `opacity ${FADE_MS}ms ease`,
  });
  container.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, w / h, 0.1, 100);
  camera.position.set(0, -3.5, 20);
  camera.lookAt(0, 0, 0);
  scene.add(new HemisphereLight(0xffffff, 0x334455, 1.6));
  const sun = new DirectionalLight(0xffffff, 1.8);
  sun.position.set(6, -8, 14);
  scene.add(sun);

  // How far the view reaches at the table (z = 0), to place the dice on screen.
  const halfH = Math.tan((35 * Math.PI) / 360) * 20;
  const halfW = halfH * (w / h);

  // The skin's roughness map carries the real roughness detail (moss duller, bare stone
  // smoother); `color` stays a soft accent tint rather than a full party-color wash, so the
  // stone-and-moss look from the reference art survives instead of being dyed solid teal.
  const skin = DICE_SKINS[skinId] ?? DICE_SKINS[DEFAULT_DICE_SKIN];
  const tex = getSkinTextures(skin);
  const tint = new Color(0xffffff).lerp(new Color(color), 0.18);
  const body = new MeshStandardMaterial({
    color: tint,
    map: tex.albedo,
    normalMap: tex.normal,
    roughnessMap: tex.roughnessMap,
    roughness: 1,
    metalness: skin.metalness,
    flatShading: true,
  });
  const tensBody = new MeshStandardMaterial({
    color: tint.clone().multiplyScalar(0.6),
    map: tex.albedo,
    normalMap: tex.normal,
    roughnessMap: tex.roughnessMap,
    roughness: 1,
    metalness: skin.metalness,
    flatShading: true,
  });
  const perRow = 5;
  const rows = Math.ceil(list.length / perRow);
  const dice3 = list.map((d, i) => {
    const shape = dieShape(d.draw);
    const mesh = new Mesh(shape.geometry, d.variant === 'tens' ? tensBody : body);
    for (const face of shape.faces) {
      const label = new Mesh(
        new PlaneGeometry(shape.labelSize, shape.labelSize),
        new MeshBasicMaterial({ map: labelTexture(d.label(face.value), shape.sides), transparent: true, depthWrite: false }),
      );
      label.position.copy(face.center).addScaledVector(face.normal, 0.012);
      label.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), face.normal);
      mesh.add(label);
    }
    const row = Math.floor(i / perRow);
    const inRow = Math.min(perRow, list.length - row * perRow);
    const col = i % perRow;
    const rest = new Vector3(
      // Right of centre, but pulled in so the whole row stays on screen.
      Math.max(-halfW + 1.6 + ((inRow - 1) / 2) * 2.6, Math.min(halfW * 0.35, halfW - 1.6 - ((inRow - 1) / 2) * 2.6)) +
        (col - (inRow - 1) / 2) * 2.6,
      (row - (rows - 1) / 2) * -2.6 - halfH * 0.15,
      1,
    );
    const start = new Vector3(halfW + 3 + Math.random() * 2, rest.y - 3 - Math.random() * 3, 3);
    const end = landingQuaternion(shape, d.land, (Math.random() - 0.5) * 1.2);
    const axis = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    const spin = 10 + Math.random() * 8;
    mesh.position.copy(start);
    scene.add(mesh);
    return { mesh, start, rest, end, axis, spin, delay: i * 60 };
  });

  const begin = performance.now();
  return new Promise((resolve) => {
    let landed = false;
    const tmp = new Quaternion();
    const frame = (now: number) => {
      const elapsed = now - begin;
      for (const d of dice3) {
        const t = Math.min(1, Math.max(0, (elapsed - d.delay) / ROLL_MS));
        const e = ease(t);
        d.mesh.position.lerpVectors(d.start, d.rest, e);
        // A few bounces that die away.
        d.mesh.position.z = 1 + Math.abs(Math.sin(Math.PI * 3 * t)) * Math.pow(1 - t, 2) * 3;
        tmp.setFromAxisAngle(d.axis, d.spin * (1 - e));
        d.mesh.quaternion.copy(d.end).multiply(tmp);
      }
      renderer.render(scene, camera);
      const allLanded = elapsed >= ROLL_MS + dice3[dice3.length - 1].delay;
      if (allLanded && !landed) {
        landed = true;
        resolve();
        setTimeout(() => {
          canvas.style.opacity = '0';
          setTimeout(() => {
            renderer.dispose();
            body.dispose();
            tensBody.dispose();
            for (const d of dice3) d.mesh.children.forEach((c) => ((c as Mesh).geometry as PlaneGeometry).dispose());
            canvas.remove();
          }, FADE_MS + 50);
        }, HOLD_MS);
        return;
      }
      if (!landed) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}
