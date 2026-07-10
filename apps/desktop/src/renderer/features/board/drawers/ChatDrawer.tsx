import { useEffect, useRef, useState } from 'react';
import type { GameMember } from '@solryn/shared-types';
import { canSeeMessage, sendMessage, useChat } from '../../../data/chat';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';
import c from './ChatDrawer.module.css';

export function ChatDrawer({
  gameId,
  uid,
  displayName,
  members,
}: {
  gameId: string;
  uid: string;
  displayName: string;
  members: Record<string, GameMember>;
}) {
  const messages = useChat(gameId).filter((m) => canSeeMessage(m, uid));
  const [text, setText] = useState('');
  const [target, setTarget] = useState('public');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const others = Object.entries(members).filter(([id]) => id !== uid);

  function send() {
    const body = text.trim();
    if (!body) return;
    const recipientName =
      target === 'public' ? undefined : members[target]?.displayName;
    void sendMessage(gameId, {
      senderId: uid,
      senderName: displayName,
      audience: target,
      text: body,
      ...(recipientName ? { recipientName } : {}),
    });
    setText('');
  }

  return (
    <div className={c.wrap}>
      <div className={c.composer}>
        <select
          className={s.select}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          aria-label="Send to"
        >
          <option value="public">To: Everyone</option>
          {others.map(([id, m]) => (
            <option key={id} value={id}>
              To: {m.displayName}
              {m.role === 'gm' ? ' (GM)' : ''}
            </option>
          ))}
        </select>
        <div className={s.row}>
          <input
            className={s.input}
            placeholder={target === 'public' ? 'Message everyone…' : 'Whisper…'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <Button size="sm" onClick={send} disabled={!text.trim()}>
            Send
          </Button>
        </div>
      </div>

      <div className={c.messages}>
        {messages.length === 0 && <p className={s.hint}>No messages yet.</p>}
        {messages.map((m) => {
          const whisper = m.audience !== 'public';
          const mine = m.senderId === uid;
          return (
            <div
              key={m.id}
              className={`${c.msg} ${whisper ? c.whisper : ''} ${mine ? c.mine : ''}`}
            >
              <span className={c.meta}>
                {whisper ? (
                  <>
                    <span className={c.eye} aria-hidden="true">
                      ⌀
                    </span>{' '}
                    {mine ? `Whisper to ${m.recipientName}` : `Whisper from ${m.senderName}`}
                  </>
                ) : (
                  m.senderName
                )}
              </span>
              <span className={c.text}>{m.text}</span>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}
