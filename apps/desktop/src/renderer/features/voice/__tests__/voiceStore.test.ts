import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// A controllable stand-in for the live session.
const session = vi.hoisted(() => ({
  role: 'player' as 'idle' | 'gm' | 'player',
  listeners: new Set<() => void>(),
  mutedHandler: null as ((m: boolean) => void) | null,
}));
vi.mock('../../../data/realtime', () => ({
  getSession: () => ({ role: session.role }),
  onSessionChange: (cb: () => void) => {
    session.listeners.add(cb);
    return () => session.listeners.delete(cb);
  },
  setVoiceMutedHandler: (fn: (m: boolean) => void) => {
    session.mutedHandler = fn;
  },
}));

import type { VoiceEngineOptions } from '../voiceEngine';
import {
  getVoice,
  gmSetMuted,
  joinVoice,
  leaveVoice,
  resetVoiceForTests,
  setLocallyMuted,
  setMicMuted,
  setPushToTalkDown,
  setVoiceEngineFactory,
  setVoiceMode,
} from '../voiceStore';

class FakeEngine {
  opts: VoiceEngineOptions;
  muted = false;
  pushToTalk = false;
  pttDown = false;
  started = false;
  stopped = false;
  received: Array<[string, number, string]> = [];
  volumes: Record<string, number> = {};
  failWith: string | null = null;
  constructor(opts: VoiceEngineOptions) {
    this.opts = opts;
  }
  async start(): Promise<void> {
    if (this.failWith) throw new Error(this.failWith);
    this.started = true;
  }
  stop(): void {
    this.stopped = true;
  }
  receive(from: string, seq: number, data: string): void {
    this.received.push([from, seq, data]);
    this.opts.onHeard(from);
  }
  setVolume(id: string, gain: number): void {
    this.volumes[id] = gain;
  }
}

let engines: FakeEngine[] = [];
let voiceListener: ((p: { from: string; seq: number; data: string }) => void) | null = null;
const relay = {
  sendVoice: vi.fn(),
  muteVoice: vi.fn(async () => {}),
  onVoice: vi.fn((cb: typeof voiceListener) => {
    voiceListener = cb;
    return () => {
      voiceListener = null;
    };
  }),
};
const last = () => engines[engines.length - 1];

beforeEach(() => {
  session.role = 'player';
  engines = [];
  setVoiceEngineFactory((opts) => {
    const e = new FakeEngine(opts);
    engines.push(e);
    return e as never;
  });
  (window as unknown as { relay: typeof relay }).relay = relay;
  vi.clearAllMocks();
});

afterEach(() => {
  resetVoiceForTests();
  vi.useRealTimers();
});

describe('voice state', () => {
  it('needs a live session', async () => {
    session.role = 'idle';
    await joinVoice('me');
    expect(getVoice().joined).toBe(false);
    expect(getVoice().error).toMatch(/session/);
    expect(engines).toHaveLength(0);
  });

  it('joins, passes incoming voice to the engine, and sends its own', async () => {
    await joinVoice('me');
    expect(getVoice().joined).toBe(true);
    voiceListener!({ from: 'thomas', seq: 3, data: 'AAA=' });
    expect(last().received).toEqual([['thomas', 3, 'AAA=']]);
    last().opts.send(7, 'BBB=');
    expect(relay.sendVoice).toHaveBeenCalledWith(7, 'BBB=');
  });

  it("shows who's speaking, including yourself, and clears it after a pause", async () => {
    vi.useFakeTimers();
    await joinVoice('me');
    voiceListener!({ from: 'thomas', seq: 1, data: 'AAA=' });
    last().opts.onTransmitting(true);
    expect(getVoice().speaking).toEqual(['me', 'thomas']);
    last().opts.onTransmitting(false);
    vi.advanceTimersByTime(500);
    expect(getVoice().speaking).toEqual([]);
  });

  it('reports a microphone problem and stays out of voice', async () => {
    setVoiceEngineFactory((opts) => {
      const e = new FakeEngine(opts);
      e.failWith = 'Microphone access was blocked.';
      engines.push(e);
      return e as never;
    });
    await joinVoice('me');
    expect(getVoice().joined).toBe(false);
    expect(getVoice().error).toMatch(/blocked/);
    expect(last().stopped).toBe(true);
  });

  it('mute, push-to-talk and leaving reach the engine', async () => {
    await joinVoice('me');
    setMicMuted(true);
    expect(last().muted).toBe(true);
    setMicMuted(false);
    expect(last().muted).toBe(false);
    setVoiceMode('ptt');
    expect(last().pushToTalk).toBe(true);
    setPushToTalkDown(true);
    expect(last().pttDown).toBe(true);
    leaveVoice();
    expect(last().stopped).toBe(true);
    expect(getVoice().joined).toBe(false);
  });

  it("the GM's mute can't be undone by the player", async () => {
    await joinVoice('me');
    session.mutedHandler!(true);
    expect(getVoice().mutedByGm).toBe(true);
    expect(last().muted).toBe(true);
    setMicMuted(false);
    expect(last().muted).toBe(true);
    session.mutedHandler!(false);
    expect(last().muted).toBe(false);
  });

  it('GM mute goes to the helper; players cannot use it', async () => {
    gmSetMuted('thomas', true);
    expect(relay.muteVoice).not.toHaveBeenCalled();
    session.role = 'gm';
    gmSetMuted('thomas', true);
    expect(relay.muteVoice).toHaveBeenCalledWith('thomas', true);
    expect(getVoice().gmMuted).toEqual(['thomas']);
    gmSetMuted('thomas', false);
    expect(getVoice().gmMuted).toEqual([]);
  });

  it('local mute silences one person on this computer only', async () => {
    await joinVoice('me');
    setLocallyMuted('angie', true);
    expect(last().volumes.angie).toBe(0);
    expect(relay.muteVoice).not.toHaveBeenCalled();
    setLocallyMuted('angie', false);
    expect(last().volumes.angie).toBe(1);
  });

  it('leaves voice when the session ends', async () => {
    await joinVoice('me');
    session.role = 'idle';
    session.listeners.forEach((l) => l());
    expect(last().stopped).toBe(true);
    expect(getVoice().joined).toBe(false);
  });
});
