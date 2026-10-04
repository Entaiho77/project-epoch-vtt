// The 5e spell list: the full SRD conversion (all 319 spells, levels 0–9), generated from
// data/srd-spells-5e.json into spells.generated.ts. Independent of Solryn's spells.
// Regenerate with: npm run gen:spells5e
import type { Dnd5eSpell } from '@solryn/shared-types';
export { generatedSpells as spells } from './spells.generated';

/** The spells on a given class's spell list (by class id, e.g. 'wizard'). What G2's builder
 *  and G3's sheet filter with — a spell belongs to a class when its `classes` list includes it. */
export function getSpellsForClass(classId: string, spells: Dnd5eSpell[]): Dnd5eSpell[] {
  return spells.filter((sp) => sp.classes.includes(classId));
}
