/**
 * Small interface sounds made on the fly with Web Audio (no sound files): a rising two-note
 * chime when someone joins voice, a softer falling one when they leave, and a light ping for
 * a new chat message. Each can be switched off; the choice is kept on this computer.
 */

export type ChimeKind = 'join' | 'leave' | 'message';

const PREFS_KEY = 'epoch.sounds';

export interface SoundPrefs {
  /** Voice join/leave chimes. */
  voiceChimes: boolean;
  /** A ping for new chat messages and whispers. */
  chatPing: boolean;
}

export function loadSoundPrefs(): SoundPrefs {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}');
    return { voiceChimes: saved.voiceChimes !== false, chatPing: saved.chatPing !== false };
  } catch {
    return { voiceChimes: true, chatPing: true };
  }
}

export function saveSoundPrefs(p: SoundPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    // A convenience only.
  }
}

/** The notes for each sound: [frequency Hz, start s, length s]. */
export const CHIME_NOTES: Record<ChimeKind, [number, number, number][]> = {
  join: [
    [660, 0, 0.12],
    [880, 0.1, 0.18],
  ],
  leave: [
    [660, 0, 0.12],
    [494, 0.1, 0.2],
  ],
  message: [[988, 0, 0.09]],
};
const VOLUME: Record<ChimeKind, number> = { join: 0.12, leave: 0.07, message: 0.06 };

let ctx: AudioContext | null = null;

export function playChime(kind: ChimeKind): void {
  const prefs = loadSoundPrefs();
  if (kind === 'message' ? !prefs.chatPing : !prefs.voiceChimes) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;
    for (const [freq, start, len] of CHIME_NOTES[kind]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(VOLUME[kind], now + start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + len);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + len + 0.02);
    }
  } catch {
    // No audio device or blocked — sounds are optional.
  }
}
