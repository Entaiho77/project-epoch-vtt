import { useEffect, useRef, useState } from 'react';
import type { GameMember } from '@epoch/shared-types';
import v from './Voice.module.css';
import { VoicePanel } from './VoicePanel';
import { VoiceStatus } from './VoiceStatus';
import { useVoice } from './voiceStore';
import { useVoicePresence } from './voicePresence';
import icoVoice from '../../assets/icons/icon-voice.png';
import icoVoiceMuted from '../../assets/icons/icon-voice-muted.png';
import icoVoiceSpeaking from '../../assets/icons/icon-voice-speaking.png';

/**
 * Voice in the game's top bar, so it's there on every game screen (choosing a
 * character, the builder, the board). The button opens the voice panel; while in
 * voice, a small pill stays on screen for mute and push-to-talk.
 */
export function VoiceButton({
  uid,
  members,
  gameId,
  role,
}: {
  uid: string;
  members: Record<string, GameMember>;
  gameId: string;
  role: 'gm' | 'player';
}) {
  const voice = useVoice();
  // Who's in the call (with join/leave chimes for everyone in it).
  const inVoice = useVoicePresence(gameId, uid, role);
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (anchor.current && !anchor.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const muted = voice.micMuted || voice.mutedByGm;
  const talking = voice.joined && voice.speaking.includes(uid);
  const cls = [
    v.trigger,
    voice.joined ? (muted ? v.triggerMuted : v.triggerOn) : '',
    talking ? v.triggerTalking : '',
  ].join(' ');
  const icon = voice.joined && muted ? icoVoiceMuted : talking ? icoVoiceSpeaking : icoVoice;

  return (
    <div className={v.anchor} ref={anchor}>
      <button
        type="button"
        className={cls}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        title="Voice"
        aria-label={`Voice${inVoice.size > 0 ? `, ${inVoice.size} in call` : ''}`}
      >
        <img className={v.triggerIcon} src={icon} alt="" aria-hidden="true" />
        {inVoice.size > 0 && <span className={v.count}>{inVoice.size}</span>}
      </button>
      {open && (
        <div className={v.panel} role="dialog" aria-label="Voice">
          <VoicePanel uid={uid} members={members} inVoice={inVoice} />
        </div>
      )}
      <VoiceStatus uid={uid} />
    </div>
  );
}
