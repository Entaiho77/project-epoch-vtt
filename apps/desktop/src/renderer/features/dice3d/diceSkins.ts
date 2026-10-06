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
  },
};

export const DEFAULT_DICE_SKIN = 'stone-moss';
