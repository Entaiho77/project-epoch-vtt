import type { ClientMessage, ServerMessage } from '@solryn/protocol';

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

declare global {
  interface Window {
    relay: RelayBridge;
    app: AppBridge;
  }
}
