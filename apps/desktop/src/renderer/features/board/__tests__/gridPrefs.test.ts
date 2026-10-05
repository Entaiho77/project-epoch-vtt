import { describe, expect, it } from 'vitest';
import { GRID_DEFAULTS, gridStroke, normalizeGridPrefs } from '../gridPrefs';

describe('per-person grid look', () => {
  it('fills in defaults and keeps values in range', () => {
    expect(normalizeGridPrefs(undefined)).toEqual(GRID_DEFAULTS);
    expect(normalizeGridPrefs({ opacity: 5, width: 9, color: 'black' })).toEqual({ opacity: 1, width: 4, color: 'black' });
    expect(normalizeGridPrefs({ opacity: 0, width: 0.2, color: 'pink' })).toEqual({ opacity: 0.05, width: 1, color: 'white' });
  });
  it('turns into a canvas color', () => {
    expect(gridStroke({ opacity: 0.3, width: 2, color: 'black' })).toBe('rgba(0, 0, 0, 0.3)');
    expect(gridStroke({ opacity: 0.45, width: 2, color: 'white' })).toBe('rgba(255, 255, 255, 0.45)');
  });
});
