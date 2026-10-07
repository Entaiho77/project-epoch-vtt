import { useRef, useState, type ChangeEvent } from 'react';
import type { BestiaryEntry } from '@epoch/shared-types';
import { prepareTokenImage } from '../../../data/images';
import { setCreatureArt } from '../../../data/creatures';
import { matchCreatureFile } from './bulkArtMatch';
import { Button } from '../../../components/ui/Button';
import s from './drawers.module.css';

interface Row {
  key: string;
  file: File;
  /** Chosen creature id, or '' while unmatched (GM picks one from the dropdown). */
  matchId: string;
  /** Whether this row will actually be saved when "Save all" is pressed. Defaults off for a
   *  creature that already has art, so a bulk import doesn't silently overwrite curated work. */
  apply: boolean;
}

/**
 * Bulk creature token art (2026-10-04 backlog item): pick a batch of images (or a whole
 * folder), match each to a creature by name across the bestiary and the GM's homebrew
 * monsters, review the matches (fix a wrong/missing one from a dropdown), then save them all
 * in one go. GM only — art is shared across all of this GM's games (same `setCreatureArt` the
 * single-upload flow in MonsterStatCard already uses).
 */
export function BulkCreatureArtDrawer({
  uid,
  pool,
  creatureArt,
}: {
  /** The GM's own uid (art is stored per-GM — see creatures.ts) */
  uid: string;
  /** Homebrew + bestiary creatures to match against, homebrew first (so a homebrew monster
   *  that shadows an SRD name by id wins). */
  pool: BestiaryEntry[];
  /** creatureId → current art URL, so a match can be flagged "already has art". */
  creatureArt: Record<string, string>;
}) {
  const filesRef = useRef<HTMLInputElement | null>(null);
  const folderRef = useRef<HTMLInputElement | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(0);

  const byName = [...pool].sort((a, b) => a.name.localeCompare(b.name));
  const candidates = byName.map((e) => ({ id: e.id, name: e.name }));

  function addFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'));
    e.target.value = '';
    if (!files.length) return;
    setErrors([]);
    setDone(0);
    const next: Row[] = files.map((file, i) => {
      const matchId = matchCreatureFile(file.name, candidates) ?? '';
      return {
        key: `${file.name}:${file.size}:${i}`,
        file,
        matchId,
        apply: !!matchId && !creatureArt[matchId],
      };
    });
    setRows(next);
  }

  function setRow(key: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  async function saveAll() {
    const toApply = rows.filter((r) => r.apply && r.matchId);
    if (!toApply.length) return;
    setSaving(true);
    setErrors([]);
    setDone(0);
    const failed: string[] = [];
    for (const row of toApply) {
      try {
        const url = await prepareTokenImage(uid, row.file);
        await setCreatureArt(uid, row.matchId, url);
      } catch (err) {
        failed.push(`${row.file.name}: ${err instanceof Error ? err.message : 'failed'}`);
      }
      setDone((d) => d + 1);
    }
    setErrors(failed);
    setSaving(false);
    // Drop the rows that saved cleanly; keep failed ones so the GM can see and retry.
    setRows((rs) => rs.filter((r) => !toApply.includes(r) || failed.some((f) => f.startsWith(r.file.name))));
  }

  const matchedCount = rows.filter((r) => r.matchId).length;
  const applyCount = rows.filter((r) => r.apply && r.matchId).length;

  return (
    <div>
      <div className={s.section}>
        <span className={s.label}>Add token art</span>
        <p className={s.hint}>
          Pick images named after creatures (e.g. "dire-wolf.png" → Dire Wolf) — bestiary and
          your own homebrew monsters both match.
        </p>
        <div className={s.row}>
          <input ref={filesRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={addFiles} />
          <input
            ref={folderRef}
            type="file"
            accept="image/*"
            multiple
            // @ts-expect-error -- webkitdirectory isn't in React's input typings but every
            // Chromium-based browser (this app's target) supports it for folder picking.
            webkitdirectory=""
            style={{ display: 'none' }}
            onChange={addFiles}
          />
          <Button size="sm" variant="ghost" onClick={() => filesRef.current?.click()}>
            Choose files…
          </Button>
          <Button size="sm" variant="ghost" onClick={() => folderRef.current?.click()}>
            Choose folder…
          </Button>
        </div>
      </div>

      {rows.length > 0 && (
        <div className={s.section}>
          <span className={s.label}>
            Review ({matchedCount}/{rows.length} matched, {applyCount} will save)
          </span>
          <div className={s.list}>
            {rows.map((row) => {
              const alreadyHasArt = !!row.matchId && !!creatureArt[row.matchId];
              return (
                <div key={row.key} className={s.item} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                  <div className={s.itemMain} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={row.apply}
                      disabled={!row.matchId}
                      onChange={(e) => setRow(row.key, { apply: e.target.checked })}
                    />
                    <span className={s.itemName} style={{ flex: 1 }}>{row.file.name}</span>
                  </div>
                  <select
                    className={s.select}
                    value={row.matchId}
                    onChange={(e) => setRow(row.key, { matchId: e.target.value, apply: !!e.target.value })}
                  >
                    <option value="">— unmatched, pick a creature —</option>
                    {byName.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  {alreadyHasArt && (
                    <span className={s.itemMeta}>Already has art — checked to replace it.</span>
                  )}
                </div>
              );
            })}
          </div>
          <Button size="sm" onClick={saveAll} disabled={saving || !applyCount} full>
            {saving ? `Saving ${done}/${applyCount}…` : `Save ${applyCount} match${applyCount === 1 ? '' : 'es'}`}
          </Button>
          {errors.map((e) => (
            <p key={e} className={s.error}>{e}</p>
          ))}
        </div>
      )}
    </div>
  );
}
