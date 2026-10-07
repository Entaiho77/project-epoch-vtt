import { useEffect, useRef } from 'react';
import { useAmbientVolume } from './ambientVolume';

/**
 * Owns the actual <audio> element for the active map's ambient track (2026-10-07 MVP backlog).
 * Mounted once at the board level — not inside the Ambient Audio drawer — so playback keeps
 * going while that drawer is closed; closing a side panel shouldn't silence the scene.
 */
export function AmbientAudioPlayer({
  track,
  playing,
}: {
  /** Resolved src (already run through `imageSrc()`), or undefined when no track is loaded. */
  track?: string;
  playing: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volume = useAmbientVolume();

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !track) return;
    if (playing) {
      // Autoplay can be blocked by the browser until the user has interacted with the page —
      // harmless to swallow here; the GM pressing Play again (or anyone interacting with the
      // board first) is what actually starts it in that case.
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [playing, track]);

  if (!track) return null;
  return <audio ref={audioRef} src={track} loop style={{ display: 'none' }} />;
}
