import { useState } from 'react';
import type { GameMember } from '@epoch/shared-types';
import { Button } from '../../components/ui/Button';
import { useSession } from '../../data/realtime';
import s from '../board/drawers/drawers.module.css';
import v from './Voice.module.css';
import {
  gmSetMuted,
  joinVoice,
  leaveVoice,
  setEchoMode,
  setLocallyMuted,
  setMicMuted,
  setPttKey,
  setVoiceMode,
  useVoice,
} from './voiceStore';

/** "Backquote" → "`", "KeyV" → "V", "F13" → "F13". */
export function keyLabel(code: string): string {
  if (code === 'Backquote') return '`';
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  return code;
}

export function VoicePanel({
  uid,
  members,
}: {
  uid: string;
  members: Record<string, GameMember>;
}) {
  const voice = useVoice();
  const session = useSession();
  const [pickingKey, setPickingKey] = useState(false);
  const isGm = session.role === 'gm';
  const live = session.role !== 'idle';
  const online = new Set(session.players.map((p) => p.playerId));

  const people = Object.entries(members).sort(([, a], [, b]) =>
    a.role === b.role ? a.displayName.localeCompare(b.displayName) : a.role === 'gm' ? -1 : 1,
  );

  return (
    <div>
      <div className={s.section}>
        <span className={s.label}>Voice</span>
        {!live && <p className={s.hint}>Voice works during a live session. Host or join the game first.</p>}
        {live && !voice.joined && (
          <>
            <Button onClick={() => void joinVoice(uid)} disabled={voice.joining} full>
              {voice.joining ? 'Starting microphone…' : 'Join voice'}
            </Button>
            <p className={s.hint}>
              Voice goes straight to the GM's computer over the game's own encrypted connection — no
              outside server.
            </p>
          </>
        )}
        {voice.joined && (
          <>
            <div className={s.row}>
              <Button
                variant={voice.micMuted || voice.mutedByGm ? 'danger' : 'secondary'}
                onClick={() => setMicMuted(!voice.micMuted)}
                disabled={voice.mutedByGm}
                aria-pressed={voice.micMuted}
              >
                {voice.mutedByGm ? 'Muted by GM' : voice.micMuted ? 'Unmute' : 'Mute'}
              </Button>
              <Button variant="ghost" onClick={leaveVoice}>
                Leave voice
              </Button>
            </div>
            {voice.mutedByGm && <p className={s.hint}>The GM has muted you. They can unmute you.</p>}
          </>
        )}
        {voice.error && (
          <p className={s.error} role="alert">
            {voice.error}
          </p>
        )}
      </div>

      <div className={s.section}>
        <span className={s.label}>People</span>
        <ul className={v.people}>
          {people.map(([id, m]) => {
            const speaking = voice.speaking.includes(id);
            const isMe = id === uid;
            const gmMuted = voice.gmMuted.includes(id);
            const localMuted = voice.locallyMuted.includes(id);
            return (
              <li key={id} className={v.person}>
                <span
                  className={`${v.dot} ${speaking ? v.dotSpeaking : ''}`}
                  aria-label={speaking ? 'speaking' : undefined}
                />
                <span className={v.who}>
                  <span className={v.name}>{m.displayName}</span>
                  <span className={v.meta}>
                    {m.role === 'gm' ? 'GM' : 'Player'}
                    {isMe ? ' · you' : ''}
                    {isGm && !isMe && m.role !== 'gm' ? (online.has(id) ? ' · online' : ' · offline') : ''}
                  </span>
                </span>
                {!isMe && voice.joined && (
                  <button
                    type="button"
                    className={`${v.small} ${localMuted ? v.smallOn : ''}`}
                    onClick={() => setLocallyMuted(id, !localMuted)}
                    title="Silence them on this computer only"
                    aria-pressed={localMuted}
                  >
                    {localMuted ? 'Silenced' : 'Silence'}
                  </button>
                )}
                {isGm && !isMe && m.role !== 'gm' && (
                  <button
                    type="button"
                    className={`${v.small} ${gmMuted ? v.smallDanger : ''}`}
                    onClick={() => gmSetMuted(id, !gmMuted)}
                    title="Mute them for everyone"
                    aria-pressed={gmMuted}
                  >
                    {gmMuted ? 'Unmute' : 'Mute'}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={s.section}>
        <span className={s.label}>How you talk</span>
        <div className={s.row}>
          <Button
            size="sm"
            variant={voice.mode === 'open' ? 'primary' : 'secondary'}
            onClick={() => setVoiceMode('open')}
            aria-pressed={voice.mode === 'open'}
          >
            Open mic
          </Button>
          <Button
            size="sm"
            variant={voice.mode === 'ptt' ? 'primary' : 'secondary'}
            onClick={() => setVoiceMode('ptt')}
            aria-pressed={voice.mode === 'ptt'}
          >
            Push to talk
          </Button>
        </div>
        {voice.mode === 'open' ? (
          <p className={s.hint}>Sends when you're talking; quiet moments aren't sent.</p>
        ) : (
          <div className={s.toggleRow}>
            <span>
              Hold <kbd className={v.kbd}>{keyLabel(voice.pttKey)}</kbd> to talk
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPickingKey(true)}
              onKeyDown={(e) => {
                if (!pickingKey) return;
                e.preventDefault();
                if (e.code !== 'Escape') setPttKey(e.code);
                setPickingKey(false);
              }}
              onBlur={() => setPickingKey(false)}
            >
              {pickingKey ? 'Press a key…' : 'Change key'}
            </Button>
          </div>
        )}
      </div>

      <div className={s.section}>
        <span className={s.label}>Speakers</span>
        <label className={s.toggleRow}>
          <span>Echo protection</span>
          <input
            type="checkbox"
            checked={voice.echoMode === 'loopback'}
            onChange={(e) => setEchoMode(e.target.checked ? 'loopback' : 'direct')}
          />
        </label>
        <p className={s.hint}>
          Keeps your speakers from being picked up by your mic. Leave it on unless voice sounds
          wrong. {voice.joined ? 'Changes apply next time you join voice.' : ''}
        </p>
      </div>
    </div>
  );
}
