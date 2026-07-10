/// <reference types="vite/client" />

/**
 * The preload bridges (apps/desktop/electron/preload.ts). These are the
 * renderer's only native capabilities: the SQLite path-store and the relay.
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

interface RelayBridge {
  connect(url: string, identity: unknown): Promise<void>;
  disconnect(): Promise<void>;
  send(message: unknown): Promise<void>;
  onMessage(callback: (message: unknown) => void): void;
  onStatus(callback: (status: string) => void): void;
  removeListeners(): void;
}

interface EpochAppBridge {
  getVersion(): Promise<string>;
}

interface Window {
  db: DbBridge;
  relay: RelayBridge;
  epochApp: EpochAppBridge;
}
