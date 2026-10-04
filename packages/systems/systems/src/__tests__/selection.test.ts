import { describe, it, expect } from 'vitest';
import { getSystem, isClassAndLevel } from '../registry';

/**
 * Locks the builder/sheet selection contract: a 5e game must resolve to the class-and-level
 * (5e) components, a Solryn game to the classless ones. GamePage (builder) and BoardScreen
 * (sheet) both branch on isClassAndLevel, so this guards both against a silent regression
 * (e.g. renaming the progression mode id).
 */
describe('builder/sheet system selection', () => {
  it('D&D 5e is a class-and-level system → 5e builder/sheet', () => {
    const dnd = getSystem('dnd5e');
    expect(dnd).toBeDefined();
    expect(dnd!.modes.progression.id).toBe('class-and-level');
    expect(isClassAndLevel(dnd!)).toBe(true);
  });

  it('Solryn is NOT class-and-level → Solryn builder/sheet', () => {
    const solryn = getSystem('solryn');
    expect(solryn).toBeDefined();
    expect(solryn!.modes.progression.id).toBe('classless-dice-roll');
    expect(isClassAndLevel(solryn!)).toBe(false);
  });
});
