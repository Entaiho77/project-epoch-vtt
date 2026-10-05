import { describe, expect, it } from 'vitest';
import { voiceChanges } from '../voicePresence';
import { CHIME_NOTES, loadSoundPrefs, saveSoundPrefs } from '../chime';

describe('voice call presence', () => {
  it('spots who joined and who left', () => {
    expect(voiceChanges(new Set(['gm', 'a']), new Set(['gm', 'b']))).toEqual({ joined: ['b'], left: ['a'] });
    expect(voiceChanges(new Set(), new Set())).toEqual({ joined: [], left: [] });
  });
  it('join rises, leave falls; sound settings default on and are remembered', () => {
    expect(CHIME_NOTES.join[1][0]).toBeGreaterThan(CHIME_NOTES.join[0][0]);
    expect(CHIME_NOTES.leave[1][0]).toBeLessThan(CHIME_NOTES.leave[0][0]);
    localStorage.removeItem('epoch.sounds');
    expect(loadSoundPrefs()).toEqual({ voiceChimes: true, chatPing: true });
    saveSoundPrefs({ voiceChimes: false, chatPing: true });
    expect(loadSoundPrefs().voiceChimes).toBe(false);
    localStorage.removeItem('epoch.sounds');
  });
});
