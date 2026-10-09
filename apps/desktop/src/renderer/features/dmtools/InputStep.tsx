import { useRef, useState } from 'react';
import { extractText, stitchParts } from '../../data/pasteParserInput';
import { Button } from '../../components/ui/Button';
import s from './dmtools.module.css';

const PART_COUNT_OPTIONS = [1, 2, 3, 4, 5];

/**
 * Step 1 + review: paste text or upload a file (image/PDF/docx — whatever might conceivably
 * hold a stat block), extract its text the fastest way available, then let the DM read it over
 * and fix anything before it ever reaches highlighting ("otherwise they're highlighting bad
 * data" — Matthew, voice, 2026-10-09).
 *
 * A long stat block sometimes doesn't fit in one screenshot — D&D Beyond's page doesn't scroll
 * in the snipping tool, so the DM ends up with two or more separate captures of the same
 * creature (Matthew, voice, 2026-10-09). Telling the step up front how many parts to expect
 * means it can stitch them into one block (merging any overlapping lines) instead of treating
 * each part as its own creature — and the stitched result still goes through the same
 * review/edit step as a single-part paste, so a bad seam is just as fixable as any other typo.
 */
export function InputStep({
  onDone,
}: {
  onDone: (text: string) => void;
}) {
  const [partsCount, setPartsCount] = useState(1);
  const [parts, setParts] = useState<string[]>([]);
  const [pasted, setPasted] = useState('');
  const [reviewText, setReviewText] = useState<string | null>(null);
  const [ocrNote, setOcrNote] = useState<string | null>(null);
  const [extractWarnings, setExtractWarnings] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isMultiPart = partsCount > 1;
  const partNumber = parts.length + 1;

  function addPart(text: string, warnings: string[], viaOcr: boolean) {
    if (viaOcr) setOcrNote('This came from OCR — please read it closely for misread characters before continuing.');
    if (warnings.length) setExtractWarnings((w) => [...w, ...warnings]);
    const nextParts = [...parts, text];
    if (nextParts.length >= partsCount) {
      setReviewText(stitchParts(nextParts));
      setParts([]);
    } else {
      setParts(nextParts);
      setPasted('');
    }
  }

  function changePartsCount(n: number) {
    setPartsCount(n);
    setParts([]);
    setPasted('');
  }

  async function handleFile(file: File) {
    setError(null);
    setBusy(file.name.toLowerCase().match(/\.(png|jpe?g|gif|bmp|webp|tiff?|pdf)$/) ? 'Reading the file — OCR on an image or scanned PDF can take a little while…' : 'Reading the file…');
    try {
      const result = await extractText(file);
      addPart(result.text, result.warnings, result.viaOcr);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  function addPastedPart() {
    if (!pasted.trim()) return;
    addPart(pasted, [], false);
  }

  /** A screenshot copied straight from the Snipping Tool (Win+Shift+S) lands on the clipboard
   *  as image data, not text — a plain textarea paste silently does nothing with it. Catch that
   *  case here and route it through the same OCR path as an uploaded image file, instead of
   *  requiring the DM to save the screenshot to a file first just to upload it. */
  function handleTextareaPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) void handleFile(file);
        return;
      }
    }
    // No image on the clipboard — let the browser's normal text paste happen.
  }

  if (reviewText != null) {
    return (
      <div className={s.step}>
        <h3 className={s.stepTitle}>Review the text</h3>
        <p className={s.stepHint}>
          {isMultiPart
            ? "Fix anything that looks wrong — including the seam where the parts were stitched together — this is what gets highlighted next."
            : 'Fix anything that looks wrong — this is what gets highlighted next.'}
        </p>
        {ocrNote && <div className={s.noteBox}>{ocrNote}</div>}
        {extractWarnings.map((w, i) => <div key={i} className={s.noteBox}>{w}</div>)}
        <textarea
          className={s.reviewTextarea}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={18}
        />
        <div className={s.stepActions}>
          <Button variant="secondary" onClick={() => setReviewText(null)}>Back</Button>
          <Button onClick={() => onDone(reviewText)} disabled={!reviewText.trim()}>Continue to highlighting</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.step}>
      <h3 className={s.stepTitle}>Paste a stat block, or upload a file</h3>

      <label className={s.stepHint}>
        Split across more than one screenshot or paste?{' '}
        <select
          className={s.partsCountSelect}
          value={partsCount}
          onChange={(e) => changePartsCount(Number(e.target.value))}
        >
          {PART_COUNT_OPTIONS.map((n) => (
            <option key={n} value={n}>{n === 1 ? '1 (no split)' : `${n} parts`}</option>
          ))}
        </select>
      </label>
      {isMultiPart && (
        <p className={s.stepHint}>
          If D&D Beyond's page wouldn't scroll in the snipping tool, paste or upload each part in
          order — it's fine if they overlap by a line or two, that gets merged automatically.
        </p>
      )}
      {isMultiPart && (
        <p className={s.stepHint}>
          <strong>Part {partNumber} of {partsCount}</strong>
          {parts.length > 0 && ` — ${parts.length} part(s) added so far.`}
        </p>
      )}

      <textarea
        className={s.pasteTextarea}
        placeholder={isMultiPart ? `Paste part ${partNumber} of ${partsCount} here… (text, or Ctrl+V a screenshot)` : 'Paste the stat block text here… (text, or Ctrl+V a screenshot)'}
        value={pasted}
        onChange={(e) => setPasted(e.target.value)}
        onPaste={handleTextareaPaste}
        rows={10}
      />
      <div className={s.stepActions}>
        <Button onClick={addPastedPart} disabled={!pasted.trim()}>
          {isMultiPart ? `Add part ${partNumber} of ${partsCount}` : 'Review pasted text'}
        </Button>
        <span className={s.orDivider}>or</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf,.docx,.doc,.txt,.md"
          className={s.hiddenFileInput}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); e.target.value = ''; }}
        />
        <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={busy != null}>
          {isMultiPart ? `Upload part ${partNumber} of ${partsCount}…` : 'Upload a file…'}
        </Button>
      </div>
      {busy && <p className={s.stepHint}>{busy}</p>}
      {error && <div className={s.errorBox}>{error}</div>}
    </div>
  );
}
