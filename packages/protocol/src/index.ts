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

// --- Application game events -------------------------------------------------
// These ride inside a `game-message` payload's opaque `data` field, so the relay
// stays a dumb router (it never inspects them). All map/token/fog state is
// authoritative on the GM's machine; the GM broadcasts these to keep players in
// sync, and sends a full `scene:load` snapshot when a player joins.

/** Scale of a scene's grid — mirrors the Firebase version's two options. */
export type MapScale = 'battle' | 'area';

/** A token as it travels on the wire (grid-space coordinates, in squares). */
export interface TokenWire {
  id: string;
  name: string;
  /** Top-left grid cell the token occupies, in square units (may be fractional while dragging). */
  x: number;
  y: number;
  /** Footprint in squares (1 = medium, 2 = large, …). */
  size: number;
  color: string;
  /** Optional token image as a data URL (portrait), or null. */
  image: string | null;
  /** GM-only token: players never receive hidden tokens. */
  hidden: boolean;
}

/** The active scene as broadcast to players (map image inlined as a data URL). */
export interface SceneWire {
  id: string;
  name: string;
  /** The uploaded map image as a data URL, or null if the scene has no map yet. */
  mapDataUrl: string | null;
  /** Pixels per grid square in the map image's own coordinate space. */
  gridSize: number;
  scale: MapScale;
}

/** Every application event carried over the relay. `kind` discriminates. */
export type GameEvent =
  /** GM announces the active scene + full token/fog snapshot (also sent on player join). */
  | { kind: 'scene:load'; scene: SceneWire; tokens: TokenWire[]; fog: string[] }
  | { kind: 'token:add'; token: TokenWire }
  | { kind: 'token:move'; id: string; x: number; y: number }
  | { kind: 'token:update'; token: TokenWire }
  | { kind: 'token:remove'; id: string }
  /** Full fog cell set (list of "col,row" keys). Authoritative replace. */
  | { kind: 'fog:update'; fog: string[] };
