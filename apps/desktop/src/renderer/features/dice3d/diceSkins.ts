// Dice skins: each is a small set of tileable PBR maps applied to the existing low-poly dice
// geometry (diceShapes.ts) — same shapes, same roll mechanics, different material only.
// Adding a new skin later is just: drop three new PNGs in assets/dice-skins/<id>/ and add an
// entry below. Nothing else about the dice (geometry, UVs, roll animation) changes.

import stoneMossAlbedo from '../../assets/dice-skins/stone-moss/albedo.jpg';
import stoneMossNormal from '../../assets/dice-skins/stone-moss/normal.png';
import stoneMossRoughness from '../../assets/dice-skins/stone-moss/roughness.jpg';

export interface DiceSkin {
  id: string;
  /** Base color map. */
  albedo: string;
  /** Tangent-space normal map (bump detail — carved numbers, cracks, chips). */
  normal: string;
  /** Grayscale roughness map (white = matte/rough, black = shiny/smooth). */
  roughness: string;
  /** Baseline metalness scalar (0 = fully non-metal, e.g. stone; higher for a metal skin). */
  metalness: number;
  /** Texture repeats per face, tuned per skin so the grain reads at the right scale. */
  repeat: number;
  /**
   * Whether the die body blends in the caller's accent color on top of the texture. A
   * realistic material skin (stone, metal) should show its own true colors — tinting it
   * washes the whole thing toward one hue and flattens the contrast the texture provides.
   */
  tintable: boolean;
  /**
   * Color of the thin seam line traced along every edge of the die, the way real cut
   * facets have a visible crease between faces. For stone this should be a carved GROOVE
   * (dark shadow, maybe mossy) the way the reference art shows — not a bright polished
   * trim, which reads as a jeweled/metal die instead of ancient weathered stone.
   */
  edgeColor: number;
  /** Edge line opacity (0-1) — kept a little short of fully solid so it reads as a soft
   * shaded crease rather than a hard graphic outline. */
  edgeOpacity: number;
  /**
   * How much to darken the body uniformly (0 = texture's own color, 1 = black), independent
   * of the tint-with-accent-color blend above. Tuned live in the dice-realism sandbox so the
   * stone reads a bit deeper/weathered instead of washed out under the scene lighting.
   */
  baseDarken: number;
}

export const DICE_SKINS: Record<string, DiceSkin> = {
  'stone-moss': {
    id: 'stone-moss',
    albedo: stoneMossAlbedo,
    normal: stoneMossNormal,
    roughness: stoneMossRoughness,
    metalness: 0.03,
    repeat: 1,
    tintable: false,
    edgeColor: 0x1c1a10, // dark mossy-shadow groove, sampled from the texture's own cracks
    edgeOpacity: 0.85,
    baseDarken: 0.26,
  },
};

export const DEFAULT_DICE_SKIN = 'stone-moss';
