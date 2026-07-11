import WebSocket from 'ws';
// Disable native bufferUtil — compiled for wrong ABI in Electron/Flatpak.
// The pure-JS fallback is fast enough for VTT relay traffic.
process.env['WS_NO_BUFFER_UTIL'] = '1';
import type { ClientMessage, ServerMessage } from '@solryn/protocol';

export type RelayStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface RelayClientHandlers {
  onMessage: (msg: ServerMessage) => void;
  onStatus: (status: RelayStatus) => void;
}

/**
 * Main-process WebSocket connection to the relay server. Auto-reconnects up to
 * MAX_RECONNECT times with a fixed backoff, forwarding decoded server messages
 * and status transitions up to the caller (which relays them to the renderer).
 */
export class RelayClient {
  private ws: WebSocket | null = null;
  private attempts = 0;
  private closedByUser = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  private static readonly MAX_RECONNECT = 3;
  private static readonly RECONNECT_DELAY_MS = 1500;

  constructor(
    private readonly url: string,
    private readonly handlers: RelayClientHandlers,
  ) {}

  connect(): void {
    this.closedByUser = false;
    this.handlers.onStatus('connecting');

    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.on('open', () => {
      this.attempts = 0;
      this.handlers.onStatus('open');
    });

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString()) as ServerMessage;
        this.handlers.onMessage(msg);
      } catch {
        // Ignore malformed frames; the relay only ever sends valid JSON.
      }
    });

    ws.on('error', () => {
      this.handlers.onStatus('error');
    });

    ws.on('close', () => {
      this.handlers.onStatus('closed');
      if (!this.closedByUser && this.attempts < RelayClient.MAX_RECONNECT) {
        this.attempts += 1;
        this.reconnectTimer = setTimeout(() => this.connect(), RelayClient.RECONNECT_DELAY_MS);
      }
    });
  }

  send(msg: ClientMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  disconnect(): void {
    this.closedByUser = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }
}
