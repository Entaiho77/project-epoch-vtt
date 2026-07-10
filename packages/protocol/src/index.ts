/**
 * @solryn/protocol — the wire protocol between game clients (a GM's Electron app, player
 * clients) and the WebSocket relay server (apps/relay). Pure type definitions, no runtime
 * dependencies, so every target (relay, desktop, mobile) can share one source of truth.
 *
 * NOTE: apps/relay/src/protocol.ts mirrors this file verbatim. The relay is built as a
 * standalone container (its Dockerfile copies only apps/relay), so it can't import this
 * package at build time — keep the two in sync when changing the protocol.
 */

// --- Client → Relay ---------------------------------------------------------

/** A GM opens a new room; the relay replies with `hosted` carrying the room code. */
export interface HostMessage {
  type: 'host';
  payload: { gmId: string; displayName: string };
}

/** A player joins an existing room by code. */
export interface JoinMessage {
  type: 'join';
  payload: { roomCode: string; playerId: string; displayName: string };
}

/** Any game event, opaque to the relay — routed GM↔players. */
export interface GameMessageOut {
  type: 'game-message';
  payload: { data: unknown };
}

/** Heartbeat; the relay answers with `pong`. */
export interface PingMessage {
  type: 'ping';
}

/** Every message a client may send to the relay. */
export type ClientMessage = HostMessage | JoinMessage | GameMessageOut | PingMessage;

// --- Relay → Client ---------------------------------------------------------

/** Sent to the GM once their room exists. */
export interface HostedMessage {
  type: 'hosted';
  payload: { roomCode: string };
}

/** Sent to the GM when a player joins their room. */
export interface PlayerJoinedMessage {
  type: 'player-joined';
  payload: { playerId: string; displayName: string };
}

/** Sent to the GM when a player leaves (disconnect or explicit). */
export interface PlayerLeftMessage {
  type: 'player-left';
  payload: { playerId: string };
}

/** Sent to every player when the GM disconnects and the room is torn down. */
export interface GmDisconnectedMessage {
  type: 'gm-disconnected';
}

/** A routed game event, tagged with the sender's id (gmId or playerId). */
export interface GameMessageIn {
  type: 'game-message';
  payload: { from: string; data: unknown };
}

/** An error reply (unknown room, malformed message, room limit reached, …). */
export interface ErrorMessage {
  type: 'error';
  payload: { message: string };
}

/** Heartbeat reply. */
export interface PongMessage {
  type: 'pong';
}

/** Every message the relay may send to a client. */
export type ServerMessage =
  | HostedMessage
  | PlayerJoinedMessage
  | PlayerLeftMessage
  | GmDisconnectedMessage
  | GameMessageIn
  | ErrorMessage
  | PongMessage;

/** Convenience unions covering both directions. */
export type AnyMessage = ClientMessage | ServerMessage;
