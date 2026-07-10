import { useEffect, useState } from 'react';
import { newKey, subscribe, writeValue } from './realtime';
import { firebaseConfigured } from '../firebase/app';

/** A player's private scratchpad note, stored under the user (never shared). */
export interface Note {
  id: string;
  title: string;
  body: string;
  ts: number;
}

const path = (uid: string, gameId: string) => `users/${uid}/notes/${gameId}`;

export async function addNote(
  uid: string,
  gameId: string,
  note: { title: string; body: string },
): Promise<void> {
  const id = newKey(path(uid, gameId));
  await writeValue(`${path(uid, gameId)}/${id}`, { ...note, id, ts: Date.now() });
}

export function deleteNote(uid: string, gameId: string, id: string): Promise<void> {
  return writeValue(`${path(uid, gameId)}/${id}`, null);
}

export function useNotes(uid: string | null, gameId: string | null): Note[] {
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    if (!uid || !gameId || !firebaseConfigured) {
      setNotes([]);
      return;
    }
    return subscribe<Record<string, Note>>(path(uid, gameId), (v) =>
      setNotes(v ? Object.values(v).sort((a, b) => b.ts - a.ts) : []),
    );
  }, [uid, gameId]);
  return notes;
}
