import type { MapType, QualityScale } from '@solryn/shared-types';

/** Map types set the grid scale at upload (no manual grid alignment). */
export const mapTypes: MapType[] = [
  // World / Area / City are travel-scale: the party shares one token, no per-character tokens.
  { id: 'world', name: 'World map', perSquare: { value: 20, unit: 'mi' }, partyScale: true, note: '≈ a day’s travel on foot.' },
  { id: 'area', name: 'Area map', perSquare: { value: 5, unit: 'mi' }, partyScale: true },
  { id: 'city', name: 'City map', perSquare: { value: 0.25, unit: 'mi' }, partyScale: true },
  // Battle is tactical: individual character/creature tokens, grid collision, etc.
  { id: 'battle', name: 'Battle map', perSquare: { value: 5, unit: 'ft' } },
  { id: 'custom', name: 'Custom', perSquare: { value: 1, unit: 'unit' }, custom: true, note: 'GM defines what one square equals.' },
];

/**
 * The universal harvest/crafting quality scale. d100 + governing-skill bonus → tier.
 * The middle (Common/Uncommon) is fat; Ruined and Legendary are rare tails. Over 100
 * caps at Legendary. The tier vocabulary matches the crafting rarity scale, plus
 * "Ruined" as a genuine failure floor.
 */
export const qualityScale: QualityScale = {
  tiers: [
    { id: 'ruined', label: 'Ruined', min: 1, max: 8, color: 'red', isFailure: true },
    { id: 'common', label: 'Common', min: 9, max: 40, color: 'neutral' },
    { id: 'uncommon', label: 'Uncommon', min: 41, max: 68, color: 'teal' },
    { id: 'rare', label: 'Rare', min: 69, max: 86, color: 'purple' },
    { id: 'very-rare', label: 'Very Rare', min: 87, max: 96, color: 'amber' },
    { id: 'legendary', label: 'Legendary', min: 97, max: 100, color: 'amber' },
  ],
  roll: { die: 'd100', addGoverningSkillBonus: true, capAtTop: true },
  assist: { enabled: true, diceWhenAssisted: 2 },
};
