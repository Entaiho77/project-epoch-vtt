/**
 * The parts of voice chat that are plain logic (no browser audio APIs), so they can
 * be unit-tested. voiceEngine.ts wires them to the microphone, the Opus codec and
 * the speakers.
 */

export const SAMPLE_RATE = 48_000;
/** One Opus frame = 20 ms. */
export const FRAME_SAMPLES = 960;

// --- Mixer -----------------------------------------------------------------------

/**
 * Mixes everyone's voice into one output, with a small per-speaker buffer to
 * smooth out network jitter.
 *
 * Runs inside an AudioWorklet (voiceEngine.ts turns this class into worklet source
 * with toString), so it must stay self-contained: no imports, no outside names.
 *
 * Per speaker: wait until `startMs` of audio is queued, then play. If the queue
 * runs dry (they stopped talking, or packets were late) go quiet and wait to
 * refill. If it grows past `maxMs` (we fell behind), drop the oldest audio so
 * the delay doesn't creep up.
 */
export class VoiceMixer {
  // `declare` (no emitted field code): build tools may otherwise add helper calls
  // that wouldn't exist inside the worklet.
  declare sampleRate: number;
  declare startSamples: number;
  declare maxSamples: number;
  declare forgetSamples: number;
  declare streams: Map<
    string,
    { chunks: Float32Array[]; offset: number; buffered: number; playing: boolean; idle: number }
  >;
  declare gains: Map<string, number>;

  constructor(sampleRate: number, startMs = 60, maxMs = 250) {
    this.sampleRate = sampleRate;
    this.startSamples = Math.round((startMs / 1000) * sampleRate);
    this.maxSamples = Math.round((maxMs / 1000) * sampleRate);
    this.forgetSamples = sampleRate * 30; // drop state for someone silent 30 s
    this.streams = new Map();
    this.gains = new Map();
  }

  push(id: string, samples: Float32Array): void {
    let s = this.streams.get(id);
    if (!s) {
      s = { chunks: [], offset: 0, buffered: 0, playing: false, idle: 0 };
      this.streams.set(id, s);
    }
    s.chunks.push(samples);
    s.buffered += samples.length;
    s.idle = 0;
    while (s.buffered > this.maxSamples && s.chunks.length > 1) {
      const first = s.chunks.shift() as Float32Array;
      s.buffered -= first.length - s.offset;
      s.offset = 0;
    }
  }

  /** Volume per speaker: 0 = muted locally, 1 = normal, up to 2. */
  setGain(id: string, gain: number): void {
    if (gain === 1) this.gains.delete(id);
    else this.gains.set(id, Math.max(0, Math.min(2, gain)));
  }

  render(out: Float32Array): void {
    out.fill(0);
    for (const [id, s] of this.streams) {
      if (!s.playing) {
        if (s.buffered >= this.startSamples) {
          s.playing = true;
        } else {
          s.idle += out.length;
          if (s.idle > this.forgetSamples && s.buffered === 0) this.streams.delete(id);
          continue;
        }
      }
      const gain = this.gains.has(id) ? (this.gains.get(id) as number) : 1;
      let i = 0;
      while (i < out.length && s.chunks.length) {
        const c = s.chunks[0];
        const n = Math.min(out.length - i, c.length - s.offset);
        for (let k = 0; k < n; k++) out[i + k] += c[s.offset + k] * gain;
        i += n;
        s.offset += n;
        s.buffered -= n;
        if (s.offset >= c.length) {
          s.chunks.shift();
          s.offset = 0;
        }
      }
      if (i < out.length) s.playing = false; // ran dry: refill before playing again
    }
    for (let i = 0; i < out.length; i++) {
      if (out[i] > 1) out[i] = 1;
      else if (out[i] < -1) out[i] = -1;
    }
  }
}

// --- Talking detection -----------------------------------------------------------

export function rms(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  return samples.length ? Math.sqrt(sum / samples.length) : 0;
}

/**
 * "Is this person talking?" for open-mic mode. Loud-enough frames count as talking;
 * it stays on for `hangMs` after the last one so word endings and short pauses
 * aren't clipped. The threshold is a level (RMS, 0–1) after the browser's noise
 * suppression and gain control.
 */
export class VoiceActivity {
  threshold: number;
  private hangFrames: number;
  private left = 0;

  constructor(threshold = 0.012, hangMs = 400, frameMs = 20) {
    this.threshold = threshold;
    this.hangFrames = Math.ceil(hangMs / frameMs);
  }

  /** Feed one frame's level; returns whether to send this frame. */
  update(level: number): boolean {
    if (level >= this.threshold) this.left = this.hangFrames;
    else if (this.left > 0) this.left -= 1;
    return this.left > 0;
  }

  reset(): void {
    this.left = 0;
  }
}

// --- Packet order ----------------------------------------------------------------

/**
 * Sequence numbers are 16-bit and wrap. A frame that arrives after a newer one
 * from the same speaker is dropped (playing it late would sound worse than the
 * gap). After a long silence anything is accepted, since the speaker's counter
 * may have moved on.
 */
export class SeqTracker {
  private last = new Map<string, { seq: number; at: number }>();

  accept(id: string, seq: number, now: number, resetAfterMs = 2_000): boolean {
    const prev = this.last.get(id);
    if (prev && now - prev.at < resetAfterMs) {
      const ahead = (seq - prev.seq) & 0xffff;
      if (ahead === 0 || ahead >= 0x8000) return false; // duplicate or older
    }
    this.last.set(id, { seq, at: now });
    return true;
  }

  forget(id: string): void {
    this.last.delete(id);
  }
}

// --- base64 for Opus frames ------------------------------------------------------

export function bytesToBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

export function base64ToBytes(b64: string): Uint8Array {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

// --- Frame assembly --------------------------------------------------------------

/**
 * The microphone arrives in small blocks (128 samples from the AudioWorklet);
 * Opus wants 20 ms frames. Collects blocks and hands out whole frames.
 */
export class FrameAssembler {
  private buf = new Float32Array(FRAME_SAMPLES);
  private filled = 0;

  push(block: Float32Array, onFrame: (frame: Float32Array) => void): void {
    let i = 0;
    while (i < block.length) {
      const n = Math.min(block.length - i, FRAME_SAMPLES - this.filled);
      this.buf.set(block.subarray(i, i + n), this.filled);
      this.filled += n;
      i += n;
      if (this.filled === FRAME_SAMPLES) {
        onFrame(this.buf);
        this.buf = new Float32Array(FRAME_SAMPLES);
        this.filled = 0;
      }
    }
  }
}
