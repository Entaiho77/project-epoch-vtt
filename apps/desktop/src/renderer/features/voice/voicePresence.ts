import { useEffect, useRef, useState } from 'react';
import { subscribe, useSession, writeValue } from '../../data/realtime';
import { playChime } from './chime';
import { useVoice } from './voiceStore';

/**
 * Who's in the voice call. Each person marks themselves at games/{id}/voice/{uid} while they're
 * in voice; the GM's computer clears anyone who drops out of the session. Everyone in the call
 * hears a chime when someone joins or leaves.
 */

/** Who joined and who left between two snapshots of the call. */
export function voiceChanges(before: ReadonlySet<string>, after: ReadonlySet<string>): { joined: string[]; left: string[] } {
  return {
    joined: [...after].filter((id) => !before.has(id)),
    left: [...before].filter((id) => !after.has(id)),
  };
}

export function useVoicePresence(gameId: string, uid: string, role: 'gm' | 'player'): Set<string> {
  const voice = useVoice();
  const session = useSession();
  const live = session.role !== 'idle' && session.gameId === gameId;
  const [inVoice, setInVoice] = useState<Set<string>>(new Set());
  const prev = useRef<Set<string> | null>(null);
  const joinedRef = useRef(voice.joined);
  joinedRef.current = voice.joined;

  // Mark myself in or out of the call.
  useEffect(() => {
    if (!live) return;
    void writeValue(`games/${gameId}/voice/${uid}`, voice.joined ? true : null);
  }, [live, gameId, uid, voice.joined]);

  // Leaving the game screen (e.g. back to the lobby) takes me out of the call.
  const liveRef = useRef(live);
  liveRef.current = live;
  useEffect(
    () => () => {
      if (liveRef.current) void writeValue(`games/${gameId}/voice/${uid}`, null);
    },
    [gameId, uid],
  );

  // Follow the call; chime on changes (only for people in the call, and not for myself).
  useEffect(() => {
    if (!live) {
      setInVoice(new Set());
      prev.current = null;
      return;
    }
    return subscribe<Record<string, true>>(`games/${gameId}/voice`, (v) => {
      const now = new Set(Object.keys(v ?? {}));
      if (prev.current && joinedRef.current) {
        const { joined, left } = voiceChanges(prev.current, now);
        if (joined.some((id) => id !== uid)) playChime('join');
        else if (left.some((id) => id !== uid)) playChime('leave');
      }
      prev.current = now;
      setInVoice(now);
    });
  }, [live, gameId, uid]);

  // GM: anyone no longer connected is no longer in the call.
  const onlineKey = session.players.map((p) => p.playerId).sort().join(',');
  useEffect(() => {
    if (!live || role !== 'gm') return;
    const online = new Set(onlineKey ? onlineKey.split(',') : []);
    for (const id of inVoice) {
      if (id !== uid && !online.has(id)) void writeValue(`games/${gameId}/voice/${id}`, null);
    }
  }, [live, role, onlineKey, inVoice, gameId, uid]);

  return inVoice;
}
