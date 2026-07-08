import type { WebSocket } from 'ws';

interface PlayerEntry {
  ws: WebSocket;
  displayName: string;
}

/**
 * A single game room: one GM socket plus zero-or-more player sockets, held in memory only.
 * The Room tracks membership; the server owns (de)serialization and the actual socket sends.
 */
export class Room {
  readonly code: string;
  readonly gm: WebSocket;
  readonly gmId: string;
  readonly gmName: string;
  private readonly playerMap = new Map<string, PlayerEntry>();

  constructor(code: string, gm: WebSocket, gmId: string, gmName: string) {
    this.code = code;
    this.gm = gm;
    this.gmId = gmId;
    this.gmName = gmName;
  }

  addPlayer(playerId: string, ws: WebSocket, displayName: string): void {
    this.playerMap.set(playerId, { ws, displayName });
  }

  removePlayer(playerId: string): void {
    this.playerMap.delete(playerId);
  }

  hasPlayer(playerId: string): boolean {
    return this.playerMap.has(playerId);
  }

  get playerCount(): number {
    return this.playerMap.size;
  }

  /** All player sockets (for broadcasting a GM message / gm-disconnected). */
  playerSockets(): WebSocket[] {
    return [...this.playerMap.values()].map((p) => p.ws);
  }
}
