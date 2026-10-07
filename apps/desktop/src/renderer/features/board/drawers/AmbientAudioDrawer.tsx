import { useState, type ChangeEvent } from 'react';
import type { MapDef, Role } from '@epoch/shared-types';
import { prepareAmbientTrack } from '../../../data/audio';
import { setAmbientPlaying, setMapAmbientAudio } from '../../../data/board';
import { setAmbientVolume, useAmbientVolume } from '../ambientVolume';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

/**
 * Ambient scene audio (2026-10-07 MVP backlog): one looping track per map, GM-controlled; no
 * playlist, no crossfade, no separate SFX layer. The GM loads a file and plays/pauses it for
 * the whole table; each person's own volume (below) is local-only and never affects anyone
 * else. Actual playback lives in <AmbientAudioPlayer>, mounted at the board level so it keeps
 * going while this drawer is closed.
 */
export function AmbientAudioDrawer({
  gameId,
  activeMap,
  role,
}: {
  gameId: string;
  activeMap?: MapDef;
  role: Role;
}) {
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const volume = useAmbientVolume();
  const audio = activeMap?.ambientAudio;

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !activeMap) return;
    setError('');
    setUploading(true);
    try {
      const track = await prepareAmbientTrack(file);
      await setMapAmbientAudio(gameId, activeMap.id, { track, name: file.name });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {!activeMap ? (
        <p className={s.hint}>No active map.</p>
      ) : role === 'gm' ? (
        <div className={s.section}>
          <span className={s.label}>This scene's track</span>
          <input type="file" accept="audio/*" onChange={onFile} className={s.input} />
          {uploading && <p className={s.hint}>Loading…</p>}
          {error && <p className={s.error}>{error}</p>}
          {audio && (
            <>
              <p className={s.preview}>{audio.name}</p>
              <div className={s.row}>
                <Button size="sm" onClick={() => void setAmbientPlaying(gameId, activeMap.id, !audio.playing)}>
                  {audio.playing ? 'Pause' : 'Play'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => void setMapAmbientAudio(gameId, activeMap.id, null)}>
                  Remove
                </Button>
              </div>
            </>
          )}
          <p className={s.hint}>
            One looping track per scene — load a new file to swap it when the scene changes.
            Play/Pause is shared: the whole table hears it start and stop together.
          </p>
        </div>
      ) : (
        <div className={s.section}>
          <p className={s.hint}>
            {audio
              ? `Now playing: ${audio.name}${audio.playing ? '' : ' (paused by the GM)'}`
              : 'No ambient audio for this scene.'}
          </p>
        </div>
      )}

      <div className={s.section}>
        <label className={s.toggleRow}>
          <span>Your volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setAmbientVolume(Number(e.target.value))}
            style={{ flex: 1, marginLeft: 12 }}
          />
        </label>
        <p className={s.hint}>Only affects what you hear — everyone sets their own.</p>
      </div>
    </div>
  );
}
