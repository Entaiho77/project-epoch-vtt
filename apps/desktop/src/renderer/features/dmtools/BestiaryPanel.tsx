import { useMemo, useState } from 'react';
import {
  buildUniversalBestiary,
  filterUniversalBestiary,
  type BestiarySearchField,
  type UniversalBestiaryEntry,
} from '../../data/universalBestiary';
import { equipmentList, type Library } from '../../data/homebrew';
import { HomebrewMonsterForm } from '../board/drawers/HomebrewMonsterForm';
import s from './dmtools.module.css';

const FIELDS: { id: BestiarySearchField; label: string }[] = [
  { id: 'name', label: 'Name' },
  { id: 'type', label: 'Type' },
  { id: 'cr', label: 'CR/TR' },
];

/**
 * The universal bestiary (Matthew, voice, 2026-10-09): every creature the DM has, SRD and
 * homebrew, Solryn and 5e, in one list — search by name/type/CR-TR with toggleable fields,
 * and direct field editing for homebrew entries. SRD/comingled content is view-only.
 */
export function BestiaryPanel({
  uid,
  library,
  highlightName,
}: {
  uid: string;
  library: Library | null;
  /** A just-saved creature's name — scrolled to and briefly highlighted so the DM can confirm
   *  the save landed (the "success message, then let them check the bestiary" flow). */
  highlightName?: string | null;
}) {
  const [query, setQuery] = useState('');
  const [fields, setFields] = useState<Set<BestiarySearchField>>(new Set(['name']));
  const [editing, setEditing] = useState<UniversalBestiaryEntry | null>(null);

  const all = useMemo(() => buildUniversalBestiary(library), [library]);
  const filtered = useMemo(() => filterUniversalBestiary(all, query, fields), [all, query, fields]);
  const equipment = equipmentList(library?.equipment);

  function toggleField(f: BestiarySearchField) {
    setFields((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });
  }

  return (
    <div className={s.bestiaryPanel}>
      <h3 className={s.stepTitle}>Bestiary</h3>
      <input
        className={s.bestiarySearch}
        placeholder="Search…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className={s.bestiaryFieldToggles}>
        {FIELDS.map((f) => (
          <label key={f.id} className={s.fieldToggle}>
            <input type="checkbox" checked={fields.has(f.id)} onChange={() => toggleField(f.id)} />
            {f.label}
          </label>
        ))}
      </div>

      <div className={s.bestiaryList}>
        {filtered.length === 0 && <p className={s.previewEmpty}>No creatures match.</p>}
        {filtered.map((item) => (
          <div
            key={`${item.source}-${item.entry.id}`}
            className={[s.bestiaryRow, item.entry.name === highlightName ? s.bestiaryRowHighlight : ''].join(' ')}
          >
            <div className={s.bestiaryRowMain}>
              <span className={s.bestiaryRowName}>{item.entry.name}</span>
              <span className={s.bestiaryRowMeta}>{item.typeLabel} · CR/TR {item.crLabel}</span>
            </div>
            <span className={[s.sourceTag, item.source.startsWith('homebrew') ? s.sourceTagHomebrew : ''].join(' ')}>
              {item.source === 'homebrew-5e' ? 'Homebrew (5e)'
                : item.source === 'homebrew-solryn' ? 'Homebrew (Solryn)'
                : item.source === 'comingled' ? 'SRD · both systems'
                : 'SRD'}
            </span>
            {item.homebrew && (
              <button className={s.editLink} onClick={() => setEditing(item)}>Edit</button>
            )}
          </div>
        ))}
      </div>

      {editing?.homebrew && (
        <HomebrewMonsterForm
          uid={uid}
          existing={editing.homebrew}
          equipment={equipment}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
