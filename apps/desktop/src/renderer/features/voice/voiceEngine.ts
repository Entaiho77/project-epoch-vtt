import {
  FRAME_SAMPLES,
  FrameAssembler,
  SAMPLE_RATE,
  SeqTracker,
  VoiceActivity,
  VoiceMixer,
  base64ToBytes,
  bytesToBase64,
  rms,
} from './voiceCore';

/**
 * Voice chat in the browser engine: microphone → Opus → the peer-to-peer helper,
 * and helper → Opus → a mixer → speakers.
 *
 *   mic ─ getUserMedia (echo cancel, noise suppression, auto gain)
 *       ─ capture worklet (128-sample blocks) ─ 20 ms frames ─ talking? ─ Opus ─ send
 *   receive ─ in order? ─ Opus decoder (one per speaker) ─ mixer worklet (jitter buffer)
 *       ─ speakers
 *
 * Echo: the browser's echo canceller only "hears" audio played through WebRTC.
 * Audio played straight from Web Audio can leak from speakers back into the mic,
 * so by default the mixed voice goes through a WebRTC connection to ourselves
 * (inside this computer, nothing leaves it) and is played from there.
 * `echoMode: 'direct'` skips that, for comparison or if it misbehaves.
 */

export type EchoMode = 'loopback' | 'direct';

export interface VoiceEngineOptions {
  send(seq: number, data: string): void;
  /** Whether our own frames are currently going out (talking). */
  onTransmitting(on: boolean): void;
  /** A frame from someone arrived (for "who's speaking"). */
  onHeard(id: string): void;
  onError(message: string): void;
}

export interface StartOptions {
  echoMode: EchoMode;
  deviceId?: string;
}

const CAPTURE_WORKLET = `
class EpochCapture extends AudioWorkletProcessor {
  process (inputs) {
    const ch = inputs[0] && inputs[0][0]
    if (ch) this.port.postMessage(ch.slice(0))
    return true
  }
}
registerProcessor('epoch-capture', EpochCapture)
`;

const mixerWorklet = (): string => `
const Mixer = (${VoiceMixer.toString()})
class EpochMixer extends AudioWorkletProcessor {
  constructor () {
    super()
    this.m = new Mixer(sampleRate)
    this.port.onmessage = (e) => {
      const d = e.data
      if (d.t === 'push') this.m.push(d.id, d.samples)
      else if (d.t === 'gain') this.m.setGain(d.id, d.gain)
    }
  }
  process (_inputs, outputs) {
    const out = outputs[0]
    this.m.render(out[0])
    for (let c = 1; c < out.length; c++) out[c].set(out[0])
    return true
  }
}
registerProcessor('epoch-mixer', EpochMixer)
`;

const moduleUrl = (src: string): string =>
  URL.createObjectURL(new Blob([src], { type: 'application/javascript' }));

export class VoiceEngine {
  private opts: VoiceEngineOptions;
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private encoder: AudioEncoder | null = null;
  private mixer: AudioWorkletNode | null = null;
  private loopback: { a: RTCPeerConnection; b: RTCPeerConnection; audio: HTMLAudioElement } | null = null;
  private decoders = new Map<string, { decoder: AudioDecoder; ts: number }>();
  private seqs = new SeqTracker();
  private assembler = new FrameAssembler();
  private vad = new VoiceActivity();
  /** For each frame handed to the encoder (in order): send it or not. */
  private decisions: boolean[] = [];
  private seq = 0;
  private ts = 0;
  private transmitting = false;
  private stopped = false;

  /** Mic muted by the user, or by the GM. */
  muted = false;
  /** Push-to-talk: only send while the key is held. */
  pushToTalk = false;
  pttDown = false;
  /** Last mic level (0–1), for a meter. */
  level = 0;
  echoMode: EchoMode = 'loopback';
  /** Counters for troubleshooting ("is anything getting through?"). */
  stats = { sent: 0, heard: 0, decoded: 0 };
  private analyser: AnalyserNode | null = null;

  constructor(opts: VoiceEngineOptions) {
    this.opts = opts;
  }

  async start({ echoMode, deviceId }: StartOptions): Promise<void> {
    if (typeof AudioEncoder === 'undefined' || typeof AudioDecoder === 'undefined') {
      throw new Error('Voice needs a newer system browser engine (WebCodecs with Opus).');
    }
    this.echoMode = echoMode;
    const ctx = new AudioContext({ sampleRate: SAMPLE_RATE, latencyHint: 'interactive' });
    this.ctx = ctx;
    await ctx.audioWorklet.addModule(moduleUrl(CAPTURE_WORKLET));
    await ctx.audioWorklet.addModule(moduleUrl(mixerWorklet()));

    // --- Playback ---
    this.mixer = new AudioWorkletNode(ctx, 'epoch-mixer', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });
    if (echoMode === 'loopback') {
      try {
        await this.startLoopback(ctx, this.mixer);
      } catch {
        this.echoMode = 'direct';
      }
    }
    if (this.echoMode === 'direct') this.mixer.connect(ctx.destination);
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.mixer.connect(this.analyser);

    // --- Microphone ---
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
    } catch (e) {
      const name = (e as DOMException)?.name;
      throw new Error(
        name === 'NotAllowedError'
          ? 'Microphone access was blocked. Allow it for Project Epoch VTT and try again.'
          : name === 'NotFoundError'
            ? 'No microphone found.'
            : `Could not open the microphone (${name || e}).`,
      );
    }
    if (this.stopped) return this.stop();

    this.encoder = new AudioEncoder({
      output: (chunk) => {
        const send = this.decisions.shift();
        if (!send) return;
        const bytes = new Uint8Array(chunk.byteLength);
        chunk.copyTo(bytes);
        this.opts.send(this.seq, bytesToBase64(bytes));
        this.stats.sent += 1;
        this.seq = (this.seq + 1) & 0xffff;
      },
      error: (e) => this.opts.onError(`Voice encoder stopped: ${e.message}`),
    });
    this.encoder.configure({
      codec: 'opus',
      sampleRate: SAMPLE_RATE,
      numberOfChannels: 1,
      bitrate: 24_000,
      // frameDuration is in microseconds; FEC helps the other side hide a lost packet.
      opus: { frameDuration: 20_000, useinbandfec: true, packetlossperc: 10 },
    } as AudioEncoderConfig);

    const source = ctx.createMediaStreamSource(this.stream);
    const capture = new AudioWorkletNode(ctx, 'epoch-capture', { numberOfOutputs: 1 });
    capture.port.onmessage = (e: MessageEvent<Float32Array>) =>
      this.assembler.push(e.data, (frame) => this.onFrame(frame));
    // The capture node must be pulled by the graph to run; route it to silence.
    const sink = ctx.createGain();
    sink.gain.value = 0;
    source.connect(capture).connect(sink).connect(ctx.destination);
    if (ctx.state === 'suspended') await ctx.resume();
  }

  private async startLoopback(ctx: AudioContext, mixer: AudioWorkletNode): Promise<void> {
    const dest = ctx.createMediaStreamDestination();
    mixer.connect(dest);
    const a = new RTCPeerConnection({ iceServers: [] });
    const b = new RTCPeerConnection({ iceServers: [] });
    const audio = new Audio();
    audio.autoplay = true;
    this.loopback = { a, b, audio };
    a.onicecandidate = (e) => e.candidate && void b.addIceCandidate(e.candidate).catch(() => {});
    b.onicecandidate = (e) => e.candidate && void a.addIceCandidate(e.candidate).catch(() => {});
    const playing = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('loopback timeout')), 4_000);
      b.ontrack = (e) => {
        audio.srcObject = e.streams[0] ?? new MediaStream([e.track]);
        audio
          .play()
          .then(() => {
            clearTimeout(timer);
            resolve();
          })
          .catch(reject);
      };
    });
    for (const track of dest.stream.getAudioTracks()) a.addTrack(track, dest.stream);
    const offer = await a.createOffer();
    await a.setLocalDescription(offer);
    await b.setRemoteDescription(offer);
    const answer = await b.createAnswer();
    // Voice quality inside the loop: a higher Opus bitrate than WebRTC's default.
    answer.sdp = answer.sdp?.replace(/(a=fmtp:\d+ [^\r\n]*)/, '$1;maxaveragebitrate=96000');
    await b.setLocalDescription(answer);
    await a.setRemoteDescription(answer);
    try {
      await playing;
    } catch (e) {
      mixer.disconnect();
      this.closeLoopback();
      throw e;
    }
  }

  private closeLoopback(): void {
    if (!this.loopback) return;
    this.loopback.audio.pause();
    this.loopback.audio.srcObject = null;
    this.loopback.a.close();
    this.loopback.b.close();
    this.loopback = null;
  }

  private onFrame(frame: Float32Array): void {
    if (!this.encoder || this.encoder.state !== 'configured') return;
    this.level = rms(frame);
    let send: boolean;
    if (this.muted) {
      send = false;
      this.vad.reset();
    } else if (this.pushToTalk) {
      send = this.pttDown;
    } else {
      send = this.vad.update(this.level);
    }
    if (send !== this.transmitting) {
      this.transmitting = send;
      this.opts.onTransmitting(send);
    }
    // Keep encoding while quiet so the codec stays warmed up; just don't send.
    const data = new AudioData({
      format: 'f32-planar',
      sampleRate: SAMPLE_RATE,
      numberOfFrames: FRAME_SAMPLES,
      numberOfChannels: 1,
      timestamp: this.ts,
      data: frame as Float32Array<ArrayBuffer>,
    });
    this.ts += 20_000;
    this.decisions.push(send);
    this.encoder.encode(data);
    data.close();
  }

  /** A voice frame from the helper. */
  receive(from: string, seq: number, data: string): void {
    if (!this.mixer || this.stopped) return;
    if (!this.seqs.accept(from, seq, performance.now())) return;
    let d = this.decoders.get(from);
    if (!d || d.decoder.state === 'closed') {
      const decoder = new AudioDecoder({
        output: (audio) => {
          const samples = new Float32Array(audio.numberOfFrames);
          audio.copyTo(samples, { planeIndex: 0, format: 'f32-planar' });
          audio.close();
          this.stats.decoded += 1;
          this.mixer?.port.postMessage({ t: 'push', id: from, samples }, [samples.buffer]);
        },
        error: () => this.decoders.delete(from),
      });
      decoder.configure({ codec: 'opus', sampleRate: SAMPLE_RATE, numberOfChannels: 1 });
      d = { decoder, ts: 0 };
      this.decoders.set(from, d);
    }
    let bytes: Uint8Array;
    try {
      bytes = base64ToBytes(data);
    } catch {
      return;
    }
    d.decoder.decode(new EncodedAudioChunk({ type: 'key', timestamp: d.ts, data: bytes }));
    d.ts += 20_000;
    this.stats.heard += 1;
    this.opts.onHeard(from);
  }

  /** How loud the voices being played are right now (0–1). */
  outputLevel(): number {
    if (!this.analyser) return 0;
    const buf = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(buf);
    return rms(buf);
  }

  /** This computer only: 0 = silence them, 1 = normal, up to 2. */
  setVolume(id: string, gain: number): void {
    this.mixer?.port.postMessage({ t: 'gain', id, gain });
  }

  stop(): void {
    this.stopped = true;
    if (this.transmitting) {
      this.transmitting = false;
      this.opts.onTransmitting(false);
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    if (this.encoder && this.encoder.state !== 'closed') this.encoder.close();
    this.encoder = null;
    for (const { decoder } of this.decoders.values()) if (decoder.state !== 'closed') decoder.close();
    this.decoders.clear();
    this.closeLoopback();
    this.mixer = null;
    this.analyser = null;
    void this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}
