import { useEffect, useState } from 'react';
import { newKey, subscribe, writeValue } from './realtime';
import { firebaseConfigured } from '../firebase/app';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  /** 'public' or a recipient uid (a private whisper). */
  audience: string;
  recipientName?: string;
  text: string;
  ts: number;
}

export async function sendMessage(
  gameId: string,
  msg: Omit<ChatMessage, 'id' | 'ts'>,
): Promise<void> {
  const id = newKey(`games/${gameId}/chat`);
  await writeValue(`games/${gameId}/chat/${id}`, { ...msg, id, ts: Date.now() });
}

export function useChat(gameId: string | null): ChatMessage[] {
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  useEffect(() => {
    if (!gameId || !firebaseConfigured) {
      setMsgs([]);
      return;
    }
    return subscribe<Record<string, ChatMessage>>(`games/${gameId}/chat`, (v) =>
      setMsgs(v ? Object.values(v).sort((a, b) => a.ts - b.ts) : []),
    );
  }, [gameId]);
  return msgs;
}

/**
 * Render-time visibility (client-side filtering, §4.12). A whisper is visible only to its
 * sender and recipient — so the GM does NOT see player↔player whispers. (True secrecy
 * needs server-side rules, which the design defers.)
 */
export function canSeeMessage(msg: ChatMessage, uid: string): boolean {
  return msg.audience === 'public' || msg.senderId === uid || msg.audience === uid;
}
