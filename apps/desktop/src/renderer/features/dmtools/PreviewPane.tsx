import { useState } from 'react';
import type { ParsedCreature, ParsedEntry } from '../../data/pasteParser';
import s from './dmtools.module.css';

/** One scalar field, shown as text with a small Edit toggle that swaps it for an input. */
function EditableField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className={s.previewField}>
      <span className={s.previewFieldLabel}>{label}</span>
      {editing ? (
        <input
          className={s.previewInput}
          autoFocus
          defaultValue={value}
          placeholder={placeholder}
          onBlur={(e) => { onChange(e.target.value); setEditing(false); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            if (e.key === 'Escape') setEditing(false);
          }}
        />
      ) : (
        <button type="button" className={s.previewValue} onClick={() => setEditing(true)}>
          {value || <span className={s.previewEmpty}>{placeholder ?? 'not found — click to fill in'}</span>}
        </button>
      )}
    </div>
  );
}

function EntryEditor({
  entries,
  onChange,
  emptyHint,
}: {
  entries: ParsedEntry[];
  onChange: (entries: ParsedEntry[]) => void;
  emptyHint: string;
}) {
  function update(i: number, patch: Partial<ParsedEntry>) {
    const next = entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e));
    onChange(next);
  }
  function remove(i: number) {
    onChange(entries.filter((_, idx) => idx !== i));
  }
  return (
    <div className={s.entryList}>
      {entries.length === 0 && <p className={s.previewEmpty}>{emptyHint}</p>}
      {entries.map((e, i) => (
        <div key={i} className={s.entryCard}>
          <div className={s.entryHeadRow}>
            <input
              className={s.entryNameInput}
              value={e.name}
              onChange={(ev) => update(i, { name: ev.target.value })}
            />
            <button type="button" className={s.removeBtn} onClick={() => remove(i)}>Remove</button>
          </div>
          <textarea
            className={s.entryDescInput}
            value={e.description}
            onChange={(ev) => update(i, { description: ev.target.value })}
            rows={2}
          />
          <div className={s.entryMechRow}>
            {(['toHit', 'range', 'damage', 'dc'] as const).map((field) => (
              <input
                key={field}
                className={s.entryMechInput}
                placeholder={field === 'toHit' ? 'To Hit' : field === 'dc' ? 'DC' : field[0].toUpperCase() + field.slice(1)}
                value={e[field] ?? ''}
                onChange={(ev) => update(i, { [field]: ev.target.value || undefined })}
              />
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        className={s.addEntryBtn}
        onClick={() => onChange([...entries, { name: 'New entry', description: '' }])}
      >
        + Add
      </button>
    </div>
  );
}

/**
 * The right-hand side of the split screen (Matthew, voice, 2026-10-09): a live preview of the
 * parsed creature, editable field by field — click Edit, type the correction, done. Nothing here
 * is read-only; every field the parser got wrong or missed can be fixed before saving.
 */
export function PreviewPane({
  creature,
  warnings,
  onChange,
}: {
  creature: ParsedCreature;
  warnings: string[];
  onChange: (next: ParsedCreature) => void;
}) {
  const patch = (p: Partial<ParsedCreature>) => onChange({ ...creature, ...p });
  const patchAbility = (key: keyof ParsedCreature['abilities'], v: string) =>
    patch({ abilities: { ...creature.abilities, [key]: v === '' ? null : Number(v) || 0 } });

  return (
    <div className={s.previewPane}>
      {warnings.length > 0 && (
        <div className={s.warningsBox}>
          <strong>Check these before saving:</strong>
          <ul>{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}

      <EditableField label="Name" value={creature.name} onChange={(v) => patch({ name: v })} />
      <EditableField label="Type" value={creature.type ?? ''} onChange={(v) => patch({ type: v })} placeholder="e.g. Medium humanoid, neutral evil" />

      <div className={s.previewRow}>
        <EditableField label="AC" value={creature.ac != null ? String(creature.ac) : ''} onChange={(v) => patch({ ac: v === '' ? null : Number(v) })} />
        <EditableField label="Initiative" value={creature.initiative != null ? String(creature.initiative) : ''} onChange={(v) => patch({ initiative: v === '' ? null : Number(v) })} placeholder="optional" />
        <EditableField label="HP" value={creature.hp != null ? String(creature.hp) : ''} onChange={(v) => patch({ hp: v === '' ? null : Number(v) })} />
        <EditableField label="HP Dice" value={creature.hpDice ?? ''} onChange={(v) => patch({ hpDice: v || null })} placeholder="e.g. 6d8 + 18" />
        <EditableField label="Speed" value={creature.speed ?? ''} onChange={(v) => patch({ speed: v || null })} placeholder="e.g. 30 ft." />
        <EditableField label="CR" value={creature.cr != null ? String(creature.cr) : ''} onChange={(v) => patch({ cr: v === '' ? null : Number(v) })} />
      </div>

      <div className={s.previewRow}>
        {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((k) => (
          <EditableField
            key={k}
            label={k.toUpperCase()}
            value={creature.abilities[k] != null ? String(creature.abilities[k]) : ''}
            onChange={(v) => patchAbility(k, v)}
          />
        ))}
      </div>

      <EditableField label="Skills" value={creature.skills.join(', ')} onChange={(v) => patch({ skills: v.split(',').map((s) => s.trim()).filter(Boolean) })} placeholder="e.g. Arcana +6, Religion +3" />
      <EditableField label="Senses" value={creature.senses ?? ''} onChange={(v) => patch({ senses: v || null })} placeholder="e.g. Darkvision 90 ft.; Passive Perception 17" />
      <EditableField label="Languages" value={creature.languages ?? ''} onChange={(v) => patch({ languages: v || null })} />

      <div className={s.previewField}>
        <span className={s.previewFieldLabel}>Lore</span>
        <textarea
          className={s.loreTextarea}
          value={creature.lore ?? ''}
          onChange={(e) => patch({ lore: e.target.value || null })}
          placeholder="Flavor text — highlight it on the left as “Lore”, or type it here directly."
          rows={3}
        />
      </div>

      <section className={s.previewSection}>
        <h4>Traits</h4>
        <EntryEditor entries={creature.traits} onChange={(v) => patch({ traits: v })} emptyHint="No traits found." />
      </section>
      <section className={s.previewSection}>
        <h4>Actions</h4>
        <EntryEditor entries={creature.actions} onChange={(v) => patch({ actions: v })} emptyHint="No actions found." />
      </section>
      <section className={s.previewSection}>
        <h4>Reactions</h4>
        <EntryEditor entries={creature.reactions} onChange={(v) => patch({ reactions: v })} emptyHint="No reactions found." />
      </section>
      <section className={s.previewSection}>
        <h4>Legendary Actions</h4>
        <EntryEditor entries={creature.legendaryActions} onChange={(v) => patch({ legendaryActions: v })} emptyHint="No legendary actions found." />
      </section>
    </div>
  );
}
