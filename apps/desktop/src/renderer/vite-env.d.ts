/// <reference types="vite/client" />

/**
 * Native bridges installed by native/tauriBridge.ts on top of the Rust commands
 * in src-tauri. These are the renderer's only native capabilities: the SQLite
 * path-store and the relay.
 */
interface DbBridge {
  read(path: string): Promise<unknown>;
  write(path: string, value: unknown): Promise<void>;
  update(path: string, value: Record<string, unknown>): Promise<void>;
  multiUpdate(updates: Record<string, unknown>): Promise<void>;
  delete(path: string): Promise<void>;
  newKey(): Promise<string>;
  subscribe(path: string, id: string): Promise<void>;
  unsubscribe(id: string): Promise<void>;
  onUpdate(callback: (path: string, value: unknown, subId: string) => void): void;
}

/** Live-session transport (peer-to-peer via the Hyperswarm helper). */
interface VoicePacket {
  /** Who is speaking (user id), as stamped by the GM's copy. */
  from: string;
  seq: number;
  /** base64 Opus frame */
  data: string;
}

interface RelayBridge {
  connect(url: string, identity: unknown): Promise<void>;
  /** GM: let a waiting player in, or turn them away. */
  approve(peerKey: string, allow: boolean): Promise<void>;
  /** GM: remove a player; their computer can't rejoin on this code. */
  kick(playerId: string): Promise<void>;
  /** GM: move the hosted game to a new room code; connected players stay. */
  setCode(roomCode: string): Promise<void>;
  disconnect(): Promise<void>;
  send(message: unknown): Promise<void>;
  /** Send one encoded voice frame (base64 Opus). */
  sendVoice(seq: number, data: string): void;
  /** GM: mute or unmute a player's voice for everyone. */
  muteVoice(playerId: string, muted: boolean): Promise<void>;
  /** Voice frames from others; returns a function that stops listening. */
  onVoice(callback: (packet: VoicePacket) => void): () => void;
  onMessage(callback: (message: unknown) => void): void;
  onStatus(callback: (status: string) => void): void;
  removeListeners(): void;
}

interface EpochAssetsBridge {
  /** Save an image file to disk; resolves to a reference like `epoch-asset:<hash>.png`. */
  put(file: File): Promise<string>;
  /** Same as put(), for bytes received from another player. */
  putBytes(bytes: Uint8Array, mime: string): Promise<string>;
  /** Whether an image (`<hash>.png`) is stored on this machine. */
  has(name: string): Promise<boolean>;
  /** Raw bytes of a stored image. */
  get(name: string): Promise<ArrayBuffer>;
  /** URL the webview can load for a stored image name (`<hash>.png`). */
  url(name: string): string;
}

interface EpochAppBridge {
  getVersion(): Promise<string>;
}

interface Window {
  db: DbBridge;
  relay: RelayBridge;
  epochApp: EpochAppBridge;
  /** Only present in the desktop app (absent in tests / plain browser). */
  epochAssets?: EpochAssetsBridge;
}
