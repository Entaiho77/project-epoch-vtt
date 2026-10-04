import { describe, expect, it } from 'vitest';
import {
  FRAME_SAMPLES,
  FrameAssembler,
  SeqTracker,
  VoiceActivity,
  VoiceMixer,
  base64ToBytes,
  bytesToBase64,
  rms,
} from '../voiceCore';

const SR = 48_000;
const block = () => new Float32Array(128);
const tone = (n: number, v: number) => new Float32Array(n).fill(v);

function renderBlocks(m: VoiceMixer, count: number): Float32Array[] {
  const outs: Float32Array[] = [];
  for (let i = 0; i < count; i++) {
    const out = block();
    m.render(out);
    outs.push(out);
  }
  return outs;
}

describe('VoiceMixer', () => {
  it('waits for a little buffered audio before playing a speaker', () => {
    const m = new VoiceMixer(SR, 60);
    m.push('a', tone(FRAME_SAMPLES, 0.5)); // 20 ms: not enough yet
    expect(renderBlocks(m, 1)[0].every((x) => x === 0)).toBe(true);
    m.push('a', tone(FRAME_SAMPLES, 0.5));
    m.push('a', tone(FRAME_SAMPLES, 0.5)); // 60 ms queued
    const out = renderBlocks(m, 1)[0];
    expect(out.every((x) => Math.abs(x - 0.5) < 1e-6)).toBe(true);
  });

  it('plays the samples in order across chunk boundaries', () => {
    const m = new VoiceMixer(SR, 0);
    const a = new Float32Array(100).map((_, i) => i / 1000);
    const b = new Float32Array(100).map((_, i) => (100 + i) / 1000);
    m.push('a', a);
    m.push('a', b);
    const out = block();
    m.render(out);
    for (let i = 0; i < 128; i++) expect(out[i]).toBeCloseTo(i / 1000, 6);
  });

  it('mixes two speakers and keeps the result in range', () => {
    const m = new VoiceMixer(SR, 0);
    m.push('a', tone(256, 0.3));
    m.push('b', tone(256, 0.4));
    expect(renderBlocks(m, 1)[0][0]).toBeCloseTo(0.7, 6);
    const loud = new VoiceMixer(SR, 0);
    loud.push('a', tone(256, 0.9));
    loud.push('b', tone(256, 0.9));
    expect(renderBlocks(loud, 1)[0][0]).toBe(1);
  });

  it('goes quiet when a speaker runs dry, then refills before playing again', () => {
    const m = new VoiceMixer(SR, 60);
    for (let i = 0; i < 3; i++) m.push('a', tone(FRAME_SAMPLES, 0.2));
    const outs = renderBlocks(m, 25); // 3200 samples > 2880 queued
    expect(outs[0][0]).toBeCloseTo(0.2);
    expect(outs[24].every((x) => x === 0)).toBe(true);
    m.push('a', tone(FRAME_SAMPLES, 0.2)); // 20 ms is not enough to restart
    expect(renderBlocks(m, 1)[0].every((x) => x === 0)).toBe(true);
  });

  it('drops the oldest audio when it falls too far behind', () => {
    const m = new VoiceMixer(SR, 0, 100); // keep at most 100 ms (4800 samples)
    for (let i = 0; i < 20; i++) m.push('a', tone(FRAME_SAMPLES, i / 100));
    const s = m.streams.get('a')!;
    expect(s.buffered).toBeLessThanOrEqual(4800);
    // The newest audio survived.
    expect(s.chunks[s.chunks.length - 1][0]).toBeCloseTo(0.19);
  });

  it('applies a per-speaker volume (0 = muted on this computer)', () => {
    const m = new VoiceMixer(SR, 0);
    m.setGain('a', 0);
    m.push('a', tone(256, 0.5));
    m.push('b', tone(256, 0.25));
    expect(renderBlocks(m, 1)[0][0]).toBeCloseTo(0.25);
  });
});

describe('VoiceActivity', () => {
  it('turns on with speech and holds briefly after it stops', () => {
    const v = new VoiceActivity(0.01, 100, 20); // hold 5 frames
    expect(v.update(0.001)).toBe(false);
    expect(v.update(0.05)).toBe(true);
    const after = [1, 2, 3, 4, 5, 6].map(() => v.update(0.001));
    expect(after).toEqual([true, true, true, true, false, false]);
  });
});

describe('SeqTracker', () => {
  it('drops duplicates and late frames, accepts wrap-around', () => {
    const t = new SeqTracker();
    expect(t.accept('a', 10, 0)).toBe(true);
    expect(t.accept('a', 10, 1)).toBe(false);
    expect(t.accept('a', 9, 2)).toBe(false);
    expect(t.accept('a', 12, 3)).toBe(true);
    expect(t.accept('a', 0xffff, 4)).toBe(false); // that's "older" than 12
    const w = new SeqTracker();
    w.accept('b', 0xfffe, 0);
    expect(w.accept('b', 0xffff, 1)).toBe(true);
    expect(w.accept('b', 0, 2)).toBe(true);
    expect(w.accept('b', 1, 3)).toBe(true);
  });

  it('accepts anything after a long silence', () => {
    const t = new SeqTracker();
    t.accept('a', 500, 0);
    expect(t.accept('a', 3, 100)).toBe(false);
    expect(t.accept('a', 3, 5_000)).toBe(true);
  });
});

describe('helpers', () => {
  it('base64 round-trips bytes', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 255, 128]);
    expect(Array.from(base64ToBytes(bytesToBase64(bytes)))).toEqual(Array.from(bytes));
  });

  it('rms of a constant signal is its level', () => {
    expect(rms(tone(100, 0.5))).toBeCloseTo(0.5);
    expect(rms(new Float32Array(0))).toBe(0);
  });

  it('assembles 128-sample blocks into 20 ms frames without losing samples', () => {
    const a = new FrameAssembler();
    const frames: Float32Array[] = [];
    let n = 0;
    for (let b = 0; b < 30; b++) {
      const blk = new Float32Array(128).map(() => n++);
      a.push(blk, (f) => frames.push(f.slice()));
    }
    expect(frames).toHaveLength(Math.floor((30 * 128) / FRAME_SAMPLES));
    expect(frames[0][0]).toBe(0);
    expect(frames[1][0]).toBe(FRAME_SAMPLES);
    expect(frames[3][FRAME_SAMPLES - 1]).toBe(4 * FRAME_SAMPLES - 1);
  });

  it('the mixer survives being turned into worklet source', () => {
    // voiceEngine builds the worklet from VoiceMixer.toString(); make sure that
    // stands on its own.
    const Rebuilt = new Function(`return (${VoiceMixer.toString()})`)() as typeof VoiceMixer;
    const m = new Rebuilt(SR, 0);
    m.push('a', tone(128, 0.1));
    const out = block();
    m.render(out);
    expect(out[0]).toBeCloseTo(0.1);
  });
});
