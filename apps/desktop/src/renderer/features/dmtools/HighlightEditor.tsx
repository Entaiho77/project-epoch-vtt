import { useMemo, useRef, useState } from 'react';
import type { Highlight, HighlightKind } from '../../data/pasteParser';
import { getSelectionOffsets } from './textOffsets';
import s from './dmtools.module.css';

const KINDS: { kind: HighlightKind; label: string; hint: string }[] = [
  { kind: 'lore', label: 'Lore', hint: 'Flavor text — pulled out of the stat block entirely.' },
  { kind: 'toHit', label: 'To Hit', hint: 'e.g. "+5 to hit"' },
  { kind: 'range', label: 'Range', hint: 'e.g. "reach 5 ft." or "range 30/120 ft."' },
  { kind: 'damage', label: 'Damage', hint: 'e.g. "5 (1d4 + 3) piercing damage"' },
  { kind: 'dc', label: 'DC', hint: 'e.g. "DC 12 Wisdom"' },
];

const KIND_CLASS: Record<HighlightKind, string> = {
  lore: s.hiLore,
  toHit: s.hiToHit,
  range: s.hiRange,
  damage: s.hiDamage,
  dc: s.hiDc,
};

interface Segment { text: string; start: number; mark: Highlight | null }

function buildSegments(text: string, marks: Highlight[]): Segment[] {
  const sorted = [...marks].sort((a, b) => a.start - b.start);
  const segments: Segment[] = [];
  let pos = 0;
  for (const m of sorted) {
    if (m.start < pos) continue; // overlapping mark — first one wins, keeps rendering simple.
    if (m.start > pos) segments.push({ text: text.slice(pos, m.start), start: pos, mark: null });
    segments.push({ text: text.slice(m.start, m.end), start: m.start, mark: m });
    pos = m.end;
  }
  if (pos < text.length) segments.push({ text: text.slice(pos), start: pos, mark: null });
  return segments;
}

/**
 * The toolbar + click-drag highlighter (Matthew, voice, 2026-10-09): arm a color, drag across
 * text to mark it, marks stay visibly colored, switch colors and keep going — all the pieces in
 * one view instead of jumping back and forth. Clicking an existing highlight opens a small panel
 * to re-tag it or remove it, without disturbing any other highlight.
 */
export function HighlightEditor({
  text,
  marks,
  onMarksChange,
}: {
  text: string;
  marks: Highlight[];
  onMarksChange: (marks: Highlight[]) => void;
}) {
  const [armed, setArmed] = useState<HighlightKind>('lore');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const segments = useMemo(() => buildSegments(text, marks), [text, marks]);

  function handleMouseUp() {
    const container = containerRef.current;
    if (!container) return;
    const offsets = getSelectionOffsets(container);
    window.getSelection()?.removeAllRanges();
    if (!offsets || offsets.end === offsets.start) return;
    // Trim whitespace at the edges of the drag so marks don't pick up a stray leading/trailing space.
    const picked = text.slice(offsets.start, offsets.end);
    const leading = picked.match(/^\s*/)?.[0].length ?? 0;
    const trailing = picked.match(/\s*$/)?.[0].length ?? 0;
    const start = offsets.start + leading;
    const end = offsets.end - trailing;
    if (end <= start) return;
    // New marks can overlap an old one; buildSegments resolves ties by keeping the first (earlier
    // in sort order isn't quite "newest wins"), so drop anything the new mark would collide with.
    const withoutOverlaps = marks.filter((m) => end <= m.start || start >= m.end);
    onMarksChange([...withoutOverlaps, { start, end, kind: armed }]);
  }

  function retag(idx: number, kind: HighlightKind) {
    const next = [...marks];
    next[idx] = { ...next[idx], kind };
    onMarksChange(next);
    setEditingIdx(null);
  }

  function removeMark(idx: number) {
    onMarksChange(marks.filter((_, i) => i !== idx));
    setEditingIdx(null);
  }

  return (
    <div className={s.highlightEditor}>
      <div className={s.toolbar} role="toolbar" aria-label="Highlight type">
        {KINDS.map(({ kind, label, hint }) => (
          <button
            key={kind}
            type="button"
            className={[s.toolbarBtn, KIND_CLASS[kind], armed === kind ? s.toolbarBtnActive : ''].join(' ')}
            onClick={() => { setArmed(kind); setEditingIdx(null); }}
            title={hint}
          >
            {label}
          </button>
        ))}
        <span className={s.toolbarHint}>Drag across text to mark it as “{KINDS.find((k) => k.kind === armed)?.label}”.</span>
      </div>

      <div
        ref={containerRef}
        className={s.highlightText}
        onMouseUp={handleMouseUp}
      >
        {segments.map((seg, i) => {
          if (!seg.mark) return <span key={i}>{seg.text}</span>;
          const markIdx = marks.indexOf(seg.mark);
          return (
            <span
              key={i}
              className={[s.highlightSpan, KIND_CLASS[seg.mark.kind]].join(' ')}
              onClick={(e) => { e.stopPropagation(); setEditingIdx(markIdx); }}
              title="Click to re-tag or remove this highlight"
            >
              {seg.text}
            </span>
          );
        })}
      </div>

      {editingIdx != null && marks[editingIdx] && (
        <div className={s.editPopover}>
          <span className={s.editPopoverLabel}>
            “{text.slice(marks[editingIdx].start, marks[editingIdx].end).slice(0, 40)}”
          </span>
          <div className={s.editPopoverRow}>
            {KINDS.map(({ kind, label }) => (
              <button
                key={kind}
                type="button"
                className={[s.toolbarBtn, KIND_CLASS[kind], marks[editingIdx].kind === kind ? s.toolbarBtnActive : ''].join(' ')}
                onClick={() => retag(editingIdx, kind)}
              >
                {label}
              </button>
            ))}
            <button type="button" className={s.removeBtn} onClick={() => removeMark(editingIdx)}>
              Remove highlight
            </button>
            <button type="button" className={s.closeBtn} onClick={() => setEditingIdx(null)}>
              Done
            </button>
          </div>
          <p className={s.editPopoverHint}>
            To change which text is covered, remove this highlight and drag over the right text again — your other highlights stay put.
          </p>
        </div>
      )}
    </div>
  );
}
