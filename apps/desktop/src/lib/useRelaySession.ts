import { useCallback, useEffect, useRef, useState } from 'react';
import type { ServerMessage } from '@solryn/protocol';
import type { RelayStatus } from '../types/global';

export type Role = 'idle' | 'gm' | 'player';

export interface Peer {
  playerId: string;
  displayName: string;
}

export interface ChatEntry {
  from: string;
  text: string;
}

interface Intent {
  kind: 'host' | 'join';
  displayName: string;
  roomCode?: string;
  playerId: string;
}

export interface RelaySession {
  role: Role;
  status: RelayStatus | 'idle';
  roomCode: string | null;
  selfId: string | null;
  players: Peer[];
  chat: ChatEntry[];
  error: string | null;
  host: (url: string, displayName: string) => void;
  join: (url: string, roomCode: string, displayName: string) => void;
  sendChat: (text: string) => void;
  leave: () => void;
}

const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

/** A game-message payload we send/receive over the relay's opaque `data` channel. */
interface ChatPayload {
  kind: 'chat';
  text: string;
}

export function useRelaySession(): RelaySession {
  const [role, setRole] = useState<Role>('idle');
  const [status, setStatus] = useState<RelayStatus | 'idle'>('idle');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [selfId, setSelfId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Peer[]>([]);
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const intentRef = useRef<Intent | null>(null);

  useEffect(() => {
    window.relay.onStatus((s) => {
      setStatus(s);
      if (s === 'open' && intentRef.current) {
        const intent = intentRef.current;
        if (intent.kind === 'host') {
          void window.relay.send({
            type: 'host',
            payload: { gmId: intent.playerId, displayName: intent.displayName },
          });
        } else {
          void window.relay.send({
            type: 'join',
            payload: {
              roomCode: intent.roomCode ?? '',
              playerId: intent.playerId,
              displayName: intent.displayName,
            },
          });
        }
      }
    });

    window.relay.onMessage((msg: ServerMessage) => {
      switch (msg.type) {
        case 'hosted':
          setRoomCode(msg.payload.roomCode);
          setError(null);
          break;
        case 'player-joined':
          setPlayers((prev) =>
            prev.some((p) => p.playerId === msg.payload.playerId)
              ? prev
              : [...prev, { playerId: msg.payload.playerId, displayName: msg.payload.displayName }],
          );
          break;
        case 'player-left':
          setPlayers((prev) => prev.filter((p) => p.playerId !== msg.payload.playerId));
          break;
        case 'gm-disconnected':
          setError('The GM disconnected — the room has closed.');
          setRole('idle');
          break;
        case 'game-message': {
          const data = msg.payload.data as ChatPayload | undefined;
          if (data && data.kind === 'chat') {
            setChat((prev) => [...prev, { from: msg.payload.from, text: data.text }]);
          }
          break;
        }
        case 'error':
          setError(msg.payload.message);
          break;
        case 'pong':
          break;
      }
    });

    return () => window.relay.removeAllListeners();
  }, []);

  const host = useCallback((url: string, displayName: string) => {
    const id = newId();
    intentRef.current = { kind: 'host', displayName, playerId: id };
    setRole('gm');
    setSelfId(id);
    setError(null);
    void window.relay.connect(url);
  }, []);

  const join = useCallback((url: string, code: string, displayName: string) => {
    const id = newId();
    const normalized = code.trim().toUpperCase();
    intentRef.current = { kind: 'join', displayName, roomCode: normalized, playerId: id };
    setRole('player');
    setSelfId(id);
    setRoomCode(normalized);
    setError(null);
    void window.relay.connect(url);
  }, []);

  const sendChat = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const payload: ChatPayload = { kind: 'chat', text: trimmed };
    void window.relay.send({ type: 'game-message', payload: { data: payload } });
    // Echo locally; the relay routes to the other side but not back to the sender.
    setChat((prev) => [...prev, { from: 'you', text: trimmed }]);
  }, []);

  const leave = useCallback(() => {
    intentRef.current = null;
    void window.relay.disconnect();
    setRole('idle');
    setStatus('idle');
    setRoomCode(null);
    setSelfId(null);
    setPlayers([]);
    setChat([]);
    setError(null);
  }, []);

  return {
    role,
    status,
    roomCode,
    selfId,
    players,
    chat,
    error,
    host,
    join,
    sendChat,
    leave,
  };
}
