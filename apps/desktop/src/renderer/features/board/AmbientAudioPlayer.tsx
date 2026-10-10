import { useEffect, useRef, useState } from 'react';
import { onAssetStored } from '../../data/assetSync';
import { useAmbientVolume } from './ambientVolume';
import styles from './AmbientAudioPlayer.module.css';

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
  // Playtesting bug (2026-10-10): for a player, `.play()` was silently and permanently
  // blocked — not just by autoplay policy, but because the <audio> element's src can point at
  // an `epoch-asset:` file that hasn't finished transferring over the relay yet (see the
  // onAssetStored effect below), and a load failure doesn't retry itself. `blocked` covers
  // both cases with one visible fix: a button click is a genuine user gesture, and re-running
  // tryPlay() on it also re-attempts a load that may have failed for the asset-timing reason.
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function tryPlay() {
    const el = audioRef.current;
    if (!el) return;
    el.play().then(
      () => setBlocked(false),
      () => setBlocked(true),
    );
  }

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !track) return;
    if (playing) {
      tryPlay();
    } else {
      el.pause();
      setBlocked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, track]);

  // The ambient track is itself an `epoch-asset:`-backed file, moved player-to-GM the same way
  // map images are. If it was still mid-transfer when `playing` first turned true, the <audio>
  // element's load already failed and nothing was watching for the file to finish arriving —
  // this is why ambient music stayed silent for players even once the transfer completed.
  // Re-trying on every asset-stored event is cheap (asset arrivals are rare) and avoids having
  // to know this track's own asset name here.
  useEffect(() => {
    return onAssetStored(() => {
      if (playing && track) tryPlay();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, track]);

  if (!track) return null;
  return (
    <>
      <audio ref={audioRef} src={track} loop style={{ display: 'none' }} />
      {blocked && (
        <button type="button" className={styles.enableSound} onClick={tryPlay}>
          🔊 Click to enable ambient sound
        </button>
      )}
    </>
  );
}
