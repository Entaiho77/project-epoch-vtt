import { useSyncExternalStore } from 'react';
import { getSession, onSessionChange, setVoiceMutedHandler } from '../../data/realtime';
import { VoiceEngine, type EchoMode, type VoiceEngineOptions } from './voiceEngine';

/**
 * Voice chat state for the screens: join/leave, mute, push-to-talk, who's speaking,
 * and (GM) who's muted. One voice session at a time, tied to the live game session:
 * it ends when the session ends.
 */

export type VoiceMode = 'open' | 'ptt';

export interface VoiceState {
  joined: boolean;
  joining: boolean;
  /** Muted by this person. */
  micMuted: boolean;
  /** Muted by the GM (can't unmute themselves). */
  mutedByGm: boolean;
  mode: VoiceMode;
  /** KeyboardEvent.code held for push-to-talk. */
  pttKey: string;
  echoMode: EchoMode;
  /** User ids speaking right now (including this person's own id). */
  speaking: string[];
  /** GM: players they've muted. */
  gmMuted: string[];
  /** This computer only: people silenced locally. */
  locallyMuted: string[];
  error: string | null;
}

type EngineLike = Pick<
  VoiceEngine,
  'start' | 'stop' | 'receive' | 'setVolume' | 'muted' | 'pushToTalk' | 'pttDown'
> &
  Partial<Pick<VoiceEngine, 'stats' | 'level' | 'echoMode' | 'outputLevel'>>;

let createEngine: (opts: VoiceEngineOptions) => EngineLike = (opts) => new VoiceEngine(opts);

/** Tests: swap the audio engine for a fake. */
export function setVoiceEngineFactory(fn: typeof createEngine): void {
  createEngine = fn;
}

const PREFS_KEY = 'epoch.voice.prefs';
const SPEAKING_HOLD_MS = 350;

function loadPrefs(): Pick<VoiceState, 'mode' | 'pttKey' | 'echoMode'> {
  const defaults = { mode: 'open' as VoiceMode, pttKey: 'Backquote', echoMode: 'loopback' as EchoMode };
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}');
    return {
      mode: saved.mode === 'ptt' ? 'ptt' : 'open',
      pttKey: typeof saved.pttKey === 'string' && saved.pttKey ? saved.pttKey : defaults.pttKey,
      echoMode: saved.echoMode === 'direct' ? 'direct' : 'loopback',
    };
  } catch {
    return defaults;
  }
}

function savePrefs(): void {
  try {
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({ mode: state.mode, pttKey: state.pttKey, echoMode: state.echoMode }),
    );
  } catch {
    // Preferences are a convenience; ignore storage problems.
  }
}

let state: VoiceState = {
  joined: false,
  joining: false,
  micMuted: false,
  mutedByGm: false,
  speaking: [],
  gmMuted: [],
  locallyMuted: [],
  error: null,
  ...loadPrefs(),
};

const listeners = new Set<() => void>();
function set(patch: Partial<VoiceState>): void {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getVoice(): VoiceState {
  return state;
}

export function useVoice(): VoiceState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

// --- Engine lifecycle ---------------------------------------------------------------

let engine: EngineLike | null = null;
let myId: string | null = null;
let stopListening: (() => void) | null = null;
const lastHeard = new Map<string, number>();
let selfTalking = false;
let speakingTimer: ReturnType<typeof setInterval> | null = null;

function refreshSpeaking(): void {
  const now = Date.now();
  const ids: string[] = [];
  for (const [id, at] of lastHeard) {
    if (now - at < SPEAKING_HOLD_MS) ids.push(id);
    else lastHeard.delete(id);
  }
  if (selfTalking && myId) ids.push(myId);
  ids.sort();
  if (ids.join('|') !== state.speaking.join('|')) set({ speaking: ids });
}

function applyMute(): void {
  if (engine) engine.muted = state.micMuted || state.mutedByGm;
}

/** Join voice for the current live session. `uid` is this person's user id. */
export async function joinVoice(uid: string): Promise<void> {
  if (engine || state.joining) return;
  const session = getSession();
  if (session.role === 'idle') {
    set({ error: 'Start or join a live session first.' });
    return;
  }
  myId = uid;
  set({ joining: true, error: null });
  const e = createEngine({
    send: (seq, data) => window.relay?.sendVoice(seq, data),
    onTransmitting: (on) => {
      selfTalking = on;
      refreshSpeaking();
    },
    onHeard: (id) => {
      const fresh = !lastHeard.has(id);
      lastHeard.set(id, Date.now());
      if (fresh) refreshSpeaking();
    },
    onError: (message) => set({ error: message }),
  });
  engine = e;
  applyMute();
  e.pushToTalk = state.mode === 'ptt';
  try {
    await e.start({ echoMode: state.echoMode });
  } catch (err) {
    e.stop();
    if (engine === e) engine = null;
    set({ joining: false, joined: false, error: (err as Error).message || String(err) });
    return;
  }
  if (engine !== e) return; // left while starting
  for (const id of state.locallyMuted) e.setVolume(id, 0);
  stopListening = window.relay?.onVoice((p) => engine?.receive(p.from, p.seq, p.data)) ?? null;
  speakingTimer = setInterval(refreshSpeaking, 100);
  set({ joining: false, joined: true });
}

/** Troubleshooting numbers: frames sent/heard/decoded, mic and speaker levels. */
export function getVoiceStats(): {
  sent: number;
  heard: number;
  decoded: number;
  micLevel: number;
  outputLevel: number;
  echoMode: EchoMode | null;
} | null {
  if (!engine) return null;
  return {
    ...(engine.stats ?? { sent: 0, heard: 0, decoded: 0 }),
    micLevel: engine.level ?? 0,
    outputLevel: engine.outputLevel?.() ?? 0,
    echoMode: engine.echoMode ?? null,
  };
}

export function leaveVoice(): void {
  stopListening?.();
  stopListening = null;
  if (speakingTimer) clearInterval(speakingTimer);
  speakingTimer = null;
  engine?.stop();
  engine = null;
  lastHeard.clear();
  selfTalking = false;
  set({ joined: false, joining: false, speaking: [], mutedByGm: false });
}

export function setMicMuted(muted: boolean): void {
  set({ micMuted: muted });
  applyMute();
}

export function setVoiceMode(mode: VoiceMode): void {
  set({ mode });
  if (engine) {
    engine.pushToTalk = mode === 'ptt';
    engine.pttDown = false;
  }
  savePrefs();
}

export function setPttKey(code: string): void {
  set({ pttKey: code });
  savePrefs();
}

/** Takes effect the next time voice is joined. */
export function setEchoMode(echoMode: EchoMode): void {
  set({ echoMode });
  savePrefs();
}

export function setPushToTalkDown(down: boolean): void {
  if (engine) engine.pttDown = down;
}

/** This computer only: silence (or restore) one person. */
export function setLocallyMuted(id: string, muted: boolean): void {
  const others = state.locallyMuted.filter((x) => x !== id);
  set({ locallyMuted: muted ? [...others, id] : others });
  engine?.setVolume(id, muted ? 0 : 1);
}

/** GM: mute or unmute a player for everyone. */
export function gmSetMuted(playerId: string, muted: boolean): void {
  if (getSession().role !== 'gm') return;
  const others = state.gmMuted.filter((x) => x !== playerId);
  set({ gmMuted: muted ? [...others, playerId] : others });
  void window.relay?.muteVoice(playerId, muted);
}

// --- Following the session -------------------------------------------------------------

setVoiceMutedHandler((muted) => {
  set({ mutedByGm: muted });
  applyMute();
});

let lastRole = getSession().role;
onSessionChange(() => {
  const { role } = getSession();
  if (role === 'idle' && lastRole !== 'idle') {
    if (engine || state.joining) leaveVoice();
    set({ gmMuted: [], mutedByGm: false });
  }
  lastRole = role;
});

/** Tests only: back to a clean state. */
export function resetVoiceForTests(): void {
  leaveVoice();
  state = {
    ...state,
    micMuted: false,
    mutedByGm: false,
    gmMuted: [],
    locallyMuted: [],
    error: null,
    mode: 'open',
    pttKey: 'Backquote',
    echoMode: 'loopback',
  };
}
