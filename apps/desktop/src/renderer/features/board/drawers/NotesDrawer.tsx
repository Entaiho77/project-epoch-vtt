import { useState } from 'react';
import { addNote, deleteNote, useNotes } from '../../../data/notes';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

export function NotesDrawer({ uid, gameId }: { uid: string; gameId: string }) {
  const notes = useNotes(uid, gameId);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function add() {
    if (!title.trim() && !body.trim()) return;
    void addNote(uid, gameId, { title: title.trim() || 'Note', body: body.trim() });
    setTitle('');
    setBody('');
  }

  return (
    <div>
      <div className={s.section}>
        <span className={s.label}>New note · private to you</span>
        <input
          className={s.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={s.input}
          placeholder="Clues, NPCs, reminders…"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ resize: 'vertical' }}
        />
        <Button onClick={add} full disabled={!title.trim() && !body.trim()}>
          Add note
        </Button>
      </div>

      <div className={s.section}>
        {notes.length === 0 ? (
          <p className={s.hint}>🔒 Your notes are private — no one else can see them.</p>
        ) : (
          <div className={s.list}>
            {notes.map((n) => (
              <div key={n.id} className={s.preview}>
                <div className={s.toggleRow}>
                  <span className={s.itemName}>{n.title}</span>
                  <button
                    className={s.place}
                    style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
                    onClick={() => void deleteNote(uid, gameId, n.id)}
                    aria-label={`Delete ${n.title}`}
                  >
                    ×
                  </button>
                </div>
                {n.body && <p className={s.hint} style={{ whiteSpace: 'pre-wrap' }}>{n.body}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
