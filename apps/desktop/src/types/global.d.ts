import type { ClientMessage, ServerMessage } from '@solryn/protocol';
import type { DbApi } from '../shared/persistence';

export type RelayStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface RelayBridge {
  connect(url: string): Promise<void>;
  disconnect(): Promise<void>;
  send(msg: ClientMessage): Promise<void>;
  onMessage(cb: (msg: ServerMessage) => void): void;
  onStatus(cb: (status: RelayStatus) => void): void;
  removeAllListeners(): void;
}

export interface AppBridge {
  getVersion(): Promise<string>;
}

export interface MapsBridge {
  import(): Promise<string | null>;
  read(filename: string): Promise<string | null>;
}

declare global {
  interface Window {
    relay: RelayBridge;
    app: AppBridge;
    db: DbApi;
    maps: MapsBridge;
  }
}
