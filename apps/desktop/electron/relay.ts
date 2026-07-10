import { WebSocket } from 'ws';

/**
 * Main-process WebSocket client to the relay server (apps/relay). On connect it
 * introduces itself with a `host` or `join` message (per @solryn/protocol); every
 * server frame is decoded and handed to `onMessage`, which main.ts forwards to
 * the renderer as a `relay:message` IPC event. Auto-reconnects a few times with
 * the same identity so a blip doesn't kill the session.
 */

export interface RelayIdentity {
  mode: 'host' | 'join';
  uid: string;
  displayName: string;
  /** Required when mode = 'join'. */
  roomCode?: string;
}

export type RelayEvent =
  | { type: 'status'; status: 'connecting' | 'open' | 'closed' | 'error' }
  | { type: 'message'; message: unknown };

export class RelayConnection {
  private ws: WebSocket | null = null;
  private attempts = 0;
  private closedByUser = false;
  private timer: NodeJS.Timeout | null = null;

  private static readonly MAX_RECONNECT = 3;
  private static readonly RECONNECT_DELAY_MS = 1500;

  constructor(
    private readonly url: string,
    private readonly identity: RelayIdentity,
    private readonly emit: (event: RelayEvent) => void,
  ) {}

  connect(): void {
    this.closedByUser = false;
    this.emit({ type: 'status', status: 'connecting' });

    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.on('open', () => {
      this.attempts = 0;
      if (this.identity.mode === 'host') {
        ws.send(
          JSON.stringify({
            type: 'host',
            payload: { gmId: this.identity.uid, displayName: this.identity.displayName },
          }),
        );
      } else {
        ws.send(
          JSON.stringify({
            type: 'join',
            payload: {
              roomCode: this.identity.roomCode ?? '',
              playerId: this.identity.uid,
              displayName: this.identity.displayName,
            },
          }),
        );
      }
      this.emit({ type: 'status', status: 'open' });
    });

    ws.on('message', (data) => {
      try {
        this.emit({ type: 'message', message: JSON.parse(data.toString()) });
      } catch {
        // The relay only sends JSON; ignore anything malformed.
      }
    });

    ws.on('error', () => this.emit({ type: 'status', status: 'error' }));

    ws.on('close', () => {
      this.emit({ type: 'status', status: 'closed' });
      if (!this.closedByUser && this.attempts < RelayConnection.MAX_RECONNECT) {
        this.attempts += 1;
        this.timer = setTimeout(() => this.connect(), RelayConnection.RECONNECT_DELAY_MS);
      }
    });
  }

  send(message: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect(): void {
    this.closedByUser = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.ws?.close();
    this.ws = null;
  }
}
