import { useEffect } from 'react';
import v from './Voice.module.css';
import { keyLabel } from './VoicePanel';
import { setMicMuted, setPushToTalkDown, useVoice } from './voiceStore';
import icoVoice from '../../assets/icons/icon-voice.png';
import icoVoiceMuted from '../../assets/icons/icon-voice-muted.png';
import icoVoiceSpeaking from '../../assets/icons/icon-voice-speaking.png';

/** Typing in a box shouldn't key the mic. */
function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

/**
 * Always on the board while in voice: a small pill showing mic state (click to
 * mute/unmute), plus the push-to-talk key, which must work with the drawer closed.
 */
export function VoiceStatus({ uid }: { uid: string }) {
  const voice = useVoice();
  const ptt = voice.joined && voice.mode === 'ptt';

  useEffect(() => {
    if (!ptt) return;
    const down = (e: KeyboardEvent) => {
      if (e.code !== voice.pttKey || e.repeat || isTyping(e.target)) return;
      e.preventDefault();
      setPushToTalkDown(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === voice.pttKey) setPushToTalkDown(false);
    };
    const blur = () => setPushToTalkDown(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
      setPushToTalkDown(false);
    };
  }, [ptt, voice.pttKey]);

  if (!voice.joined) return null;
  const muted = voice.micMuted || voice.mutedByGm;
  const talking = voice.speaking.includes(uid);
  const others = voice.speaking.filter((id) => id !== uid).length;
  const label = voice.mutedByGm
    ? 'Muted by GM'
    : muted
      ? 'Muted'
      : talking
        ? 'Talking'
        : ptt
          ? `Hold ${keyLabel(voice.pttKey)}`
          : 'Mic on';

  return (
    <button
      type="button"
      className={`${v.pill} ${muted ? v.pillMuted : ''} ${talking ? v.pillTalking : ''}`}
      onClick={() => !voice.mutedByGm && setMicMuted(!voice.micMuted)}
      title={muted ? 'Click to unmute' : 'Click to mute'}
      aria-label={`Voice: ${label}${others ? `, ${others} speaking` : ''}`}
    >
      <img
        className={v.pillIcon}
        src={muted ? icoVoiceMuted : talking ? icoVoiceSpeaking : icoVoice}
        alt=""
        aria-hidden="true"
      />
      {label}
      {others > 0 && <span className={v.pillOthers}>· {others} speaking</span>}
    </button>
  );
}
