import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameEvent, ServerMessage } from '@solryn/protocol';
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

type EventListener = (event: GameEvent, from: string) => void;
type PeerListener = (peer: Peer) => void;

export interface RelaySession {
  role: Role;
  status: RelayStatus | 'idle';
  roomCode: string | null;
  selfId: string | null;
  /** The campaign this GM session is bound to (set when hosting from a campaign). */
  campaignId: string | null;
  players: Peer[];
  chat: ChatEntry[];
  error: string | null;
  host: (url: string, displayName: string, campaignId?: string) => void;
  join: (url: string, roomCode: string, displayName: string) => void;
  sendChat: (text: string) => void;
  /** Broadcast a map/token/fog event to the other side of the room. */
  sendEvent: (event: GameEvent) => void;
  /** Subscribe to incoming game events; returns an unsubscribe fn. */
  subscribeEvents: (cb: EventListener) => () => void;
  /** Subscribe to players joining (GM uses this to send a fresh snapshot). */
  subscribePlayerJoined: (cb: PeerListener) => () => void;
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
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Peer[]>([]);
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const intentRef = useRef<Intent | null>(null);
  const eventListeners = useRef<Set<EventListener>>(new Set());
  const peerListeners = useRef<Set<PeerListener>>(new Set());

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
        case 'player-joined': {
          const peer: Peer = {
            playerId: msg.payload.playerId,
            displayName: msg.payload.displayName,
          };
          setPlayers((prev) =>
            prev.some((p) => p.playerId === peer.playerId) ? prev : [...prev, peer],
          );
          peerListeners.current.forEach((cb) => cb(peer));
          break;
        }
        case 'player-left':
          setPlayers((prev) => prev.filter((p) => p.playerId !== msg.payload.playerId));
          break;
        case 'gm-disconnected':
          setError('The GM disconnected — the room has closed.');
          setRole('idle');
          break;
        case 'game-message': {
          const data = msg.payload.data as (ChatPayload | GameEvent) | undefined;
          if (!data) break;
          if (data.kind === 'chat') {
            setChat((prev) => [...prev, { from: msg.payload.from, text: data.text }]);
          } else {
            eventListeners.current.forEach((cb) => cb(data, msg.payload.from));
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

  const host = useCallback((url: string, displayName: string, boundCampaignId?: string) => {
    const id = newId();
    intentRef.current = { kind: 'host', displayName, playerId: id };
    setRole('gm');
    setSelfId(id);
    setCampaignId(boundCampaignId ?? null);
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

  const sendEvent = useCallback((event: GameEvent) => {
    void window.relay.send({ type: 'game-message', payload: { data: event } });
  }, []);

  const subscribeEvents = useCallback((cb: EventListener) => {
    eventListeners.current.add(cb);
    return () => {
      eventListeners.current.delete(cb);
    };
  }, []);

  const subscribePlayerJoined = useCallback((cb: PeerListener) => {
    peerListeners.current.add(cb);
    return () => {
      peerListeners.current.delete(cb);
    };
  }, []);

  const leave = useCallback(() => {
    intentRef.current = null;
    void window.relay.disconnect();
    setRole('idle');
    setStatus('idle');
    setRoomCode(null);
    setSelfId(null);
    setCampaignId(null);
    setPlayers([]);
    setChat([]);
    setError(null);
  }, []);

  return {
    role,
    status,
    roomCode,
    selfId,
    campaignId,
    players,
    chat,
    error,
    host,
    join,
    sendChat,
    sendEvent,
    subscribeEvents,
    subscribePlayerJoined,
    leave,
  };
}
