import { WebSocketServer, WebSocket } from 'ws';
import type { ClientMessage, ServerMessage } from './protocol';
import { Room } from './room';
import { generateRoomCode } from './codegen';

export interface RelayOptions {
  /** Port to bind; 0 picks a free ephemeral port (used in tests). Defaults to PORT env or 3001. */
  port?: number;
  /** Max simultaneous rooms (abuse guard). Defaults to MAX_ROOMS env or 50. */
  maxRooms?: number;
}

export interface Relay {
  wss: WebSocketServer;
  rooms: Map<string, Room>;
  /** The actually-bound port (resolved from an ephemeral 0). */
  port: number;
  close: () => Promise<void>;
}

/** Per-connection state, attached out-of-band so we never mutate the ws object's own shape. */
interface SocketState {
  role?: 'gm' | 'player';
  roomCode?: string;
  id?: string;
}

const send = (ws: WebSocket, msg: ServerMessage): void => {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
};

const errorMsg = (message: string): ServerMessage => ({ type: 'error', payload: { message } });

/**
 * Start the WebSocket relay. Rooms live only in memory; nothing is persisted. Returns a handle
 * (with the bound port + a close()) so tests can spin one up on an ephemeral port and tear it down.
 */
export function startRelay(opts: RelayOptions = {}): Promise<Relay> {
  const maxRooms = opts.maxRooms ?? Number(process.env.MAX_ROOMS ?? 50);
  const port = opts.port ?? Number(process.env.PORT ?? 3001);

  const rooms = new Map<string, Room>();
  const state = new WeakMap<WebSocket, SocketState>();

  return new Promise((resolve) => {
    const wss = new WebSocketServer({ port }, () => {
      const addr = wss.address();
      const boundPort = typeof addr === 'object' && addr ? addr.port : port;
      console.log(`[relay] listening on :${boundPort} (max ${maxRooms} rooms)`);
      resolve({
        wss,
        rooms,
        port: boundPort,
        close: () => new Promise<void>((res) => wss.close(() => res())),
      });
    });

    wss.on('connection', (ws) => {
      state.set(ws, {});
      console.log('[relay] connection opened');
      ws.on('message', (raw) => handleMessage(ws, raw.toString()));
      ws.on('close', () => handleClose(ws));
      // Swallow socket-level errors so one bad peer can't crash the relay.
      ws.on('error', (err) => console.log(`[relay] socket error: ${err.message}`));
    });

    function handleMessage(ws: WebSocket, raw: string): void {
      let msg: ClientMessage;
      try {
        msg = JSON.parse(raw) as ClientMessage;
      } catch {
        return send(ws, errorMsg('Malformed message (invalid JSON).'));
      }
      const st = state.get(ws);
      if (!st) return;

      switch (msg?.type) {
        case 'host':
          return handleHost(ws, st, msg.payload);
        case 'join':
          return handleJoin(ws, st, msg.payload);
        case 'game-message':
          return handleGameMessage(ws, st, msg.payload);
        case 'ping':
          return send(ws, { type: 'pong' });
        default:
          return send(ws, errorMsg(`Unknown message type: ${String((msg as { type?: unknown })?.type)}`));
      }
    }

    function handleHost(ws: WebSocket, st: SocketState, payload: { gmId: string; displayName: string }): void {
      if (st.role) return send(ws, errorMsg('This connection is already in a room.'));
      if (rooms.size >= maxRooms) return send(ws, errorMsg(`Room limit reached (${maxRooms}). Try again later.`));

      const code = generateRoomCode((c) => !rooms.has(c));
      rooms.set(code, new Room(code, ws, payload.gmId, payload.displayName));
      st.role = 'gm';
      st.roomCode = code;
      st.id = payload.gmId;
      console.log(`[relay] room ${code} hosted by ${payload.displayName} (${payload.gmId}) — ${rooms.size} room(s) active`);
      send(ws, { type: 'hosted', payload: { roomCode: code } });
    }

    function handleJoin(
      ws: WebSocket,
      st: SocketState,
      payload: { roomCode: string; playerId: string; displayName: string },
    ): void {
      if (st.role) return send(ws, errorMsg('This connection is already in a room.'));
      const code = payload.roomCode?.toUpperCase();
      const room = code ? rooms.get(code) : undefined;
      if (!room) return send(ws, errorMsg(`No room with code "${payload.roomCode}".`));

      room.addPlayer(payload.playerId, ws, payload.displayName);
      st.role = 'player';
      st.roomCode = room.code;
      st.id = payload.playerId;
      console.log(`[relay] ${payload.displayName} (${payload.playerId}) joined room ${room.code} — ${room.playerCount} player(s)`);
      // The GM is the source of truth for the roster, so notify them of the new player.
      send(room.gm, { type: 'player-joined', payload: { playerId: payload.playerId, displayName: payload.displayName } });
    }

    function handleGameMessage(ws: WebSocket, st: SocketState, payload: { data: unknown }): void {
      if (!st.role || !st.roomCode || !st.id) return send(ws, errorMsg('Join or host a room first.'));
      const room = rooms.get(st.roomCode);
      if (!room) return send(ws, errorMsg('Room no longer exists.'));

      const routed: ServerMessage = { type: 'game-message', payload: { from: st.id, data: payload.data } };
      if (st.role === 'gm') {
        // GM → broadcast to every player.
        for (const playerWs of room.playerSockets()) send(playerWs, routed);
      } else {
        // Player → forward to the GM only.
        send(room.gm, routed);
      }
    }

    function handleClose(ws: WebSocket): void {
      const st = state.get(ws);
      if (!st?.roomCode) return;
      const room = rooms.get(st.roomCode);
      if (!room) return;

      if (st.role === 'gm') {
        // GM left → tell every player and tear the room down (in-memory cleanup).
        console.log(`[relay] GM disconnected — tearing down room ${room.code}`);
        for (const playerWs of room.playerSockets()) send(playerWs, { type: 'gm-disconnected' });
        rooms.delete(room.code);
      } else if (st.role === 'player' && st.id) {
        room.removePlayer(st.id);
        console.log(`[relay] player ${st.id} left room ${room.code} — ${room.playerCount} player(s)`);
        send(room.gm, { type: 'player-left', payload: { playerId: st.id } });
      }
    }
  });
}

// Auto-start when run directly (`node dist/server.js`); stays inert when imported by tests.
if (typeof require !== 'undefined' && require.main === module) {
  void startRelay();
}
