/**
 * Relay wire protocol — a VERBATIM MIRROR of packages/protocol/src/index.ts.
 *
 * The relay is built as a standalone container (its Dockerfile copies only apps/relay), so it
 * cannot import the shared @solryn/protocol package at build time. Keep this file in sync with
 * packages/protocol when the protocol changes.
 */

// --- Client → Relay ---------------------------------------------------------

export interface HostMessage {
  type: 'host';
  payload: { gmId: string; displayName: string };
}

export interface JoinMessage {
  type: 'join';
  payload: { roomCode: string; playerId: string; displayName: string };
}

export interface GameMessageOut {
  type: 'game-message';
  payload: { data: unknown };
}

export interface PingMessage {
  type: 'ping';
}

export type ClientMessage = HostMessage | JoinMessage | GameMessageOut | PingMessage;

// --- Relay → Client ---------------------------------------------------------

export interface HostedMessage {
  type: 'hosted';
  payload: { roomCode: string };
}

export interface PlayerJoinedMessage {
  type: 'player-joined';
  payload: { playerId: string; displayName: string };
}

export interface PlayerLeftMessage {
  type: 'player-left';
  payload: { playerId: string };
}

export interface GmDisconnectedMessage {
  type: 'gm-disconnected';
}

export interface GameMessageIn {
  type: 'game-message';
  payload: { from: string; data: unknown };
}

export interface ErrorMessage {
  type: 'error';
  payload: { message: string };
}

export interface PongMessage {
  type: 'pong';
}

export type ServerMessage =
  | HostedMessage
  | PlayerJoinedMessage
  | PlayerLeftMessage
  | GmDisconnectedMessage
  | GameMessageIn
  | ErrorMessage
  | PongMessage;

export type AnyMessage = ClientMessage | ServerMessage;
