import { describe, it, expect } from 'vitest';
import { stitchParts } from '../pasteParserInput';

// stitchParts is the only pure (DOM-free) piece of pasteParserInput.ts — everything else
// (OCR, pdf.js, mammoth) needs a browser environment and isn't unit-tested here.
describe('stitchParts', () => {
  it('returns the single part unchanged when there is only one', () => {
    expect(stitchParts(['Test Cultist\nArmor Class 14'])).toBe('Test Cultist\nArmor Class 14');
  });

  it('merges two parts on an overlapping tail/head line', () => {
    const a = 'Test Cultist\nMedium humanoid\nArmor Class 14\nHit Points 45';
    const b = 'Armor Class 14\nHit Points 45\nSpeed 30 ft.\nSTR DEX CON';
    expect(stitchParts([a, b])).toBe(
      'Test Cultist\nMedium humanoid\nArmor Class 14\nHit Points 45\nSpeed 30 ft.\nSTR DEX CON',
    );
  });

  it('matches overlap case- and whitespace-insensitively (OCR noise)', () => {
    const a = 'Test Cultist\narmor class   14';
    const b = 'Armor Class 14\nHit Points 45';
    expect(stitchParts([a, b])).toBe('Test Cultist\narmor class   14\nHit Points 45');
  });

  it('prefers the longest matching overlap, not just a one-line match', () => {
    const a = 'Line A\nLine B\nLine C';
    const b = 'Line B\nLine C\nLine D';
    // A naive single-line match could glue on "Line B" at the wrong spot; the 2-line overlap
    // ("Line B\nLine C") is the correct, longer seam.
    expect(stitchParts([a, b])).toBe('Line A\nLine B\nLine C\nLine D');
  });

  it('just joins the parts when no overlap is found, leaving the seam for the DM to review', () => {
    const a = 'Test Cultist\nArmor Class 14';
    const b = 'Legendary Actions\nThe cultist can take 3 legendary actions.';
    expect(stitchParts([a, b])).toBe(
      'Test Cultist\nArmor Class 14\nLegendary Actions\nThe cultist can take 3 legendary actions.',
    );
  });

  it('chains three or more parts in order', () => {
    const a = 'Part One\nShared A\nShared B';
    const b = 'Shared A\nShared B\nPart Two\nShared C';
    const c = 'Shared C\nPart Three';
    expect(stitchParts([a, b, c])).toBe('Part One\nShared A\nShared B\nPart Two\nShared C\nPart Three');
  });

  it('ignores blank parts', () => {
    expect(stitchParts(['Test Cultist', '', '   '])).toBe('Test Cultist');
  });
});
