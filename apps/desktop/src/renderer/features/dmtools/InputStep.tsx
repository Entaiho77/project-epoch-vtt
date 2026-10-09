import { useRef, useState } from 'react';
import { extractText } from '../../data/pasteParserInput';
import { Button } from '../../components/ui/Button';
import s from './dmtools.module.css';

/**
 * Step 1 + review: paste text or upload a file (image/PDF/docx — whatever might conceivably
 * hold a stat block), extract its text the fastest way available, then let the DM read it over
 * and fix anything before it ever reaches highlighting ("otherwise they're highlighting bad
 * data" — Matthew, voice, 2026-10-09).
 */
export function InputStep({
  onDone,
}: {
  onDone: (text: string) => void;
}) {
  const [pasted, setPasted] = useState('');
  const [reviewText, setReviewText] = useState<string | null>(null);
  const [ocrNote, setOcrNote] = useState<string | null>(null);
  const [extractWarnings, setExtractWarnings] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setBusy(file.name.toLowerCase().match(/\.(png|jpe?g|gif|bmp|webp|tiff?|pdf)$/) ? 'Reading the file — OCR on an image or scanned PDF can take a little while…' : 'Reading the file…');
    try {
      const result = await extractText(file);
      setReviewText(result.text);
      setExtractWarnings(result.warnings);
      setOcrNote(result.viaOcr ? 'This came from OCR — please read it closely for misread characters before continuing.' : null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  function startReviewFromPaste() {
    if (!pasted.trim()) return;
    setReviewText(pasted);
    setExtractWarnings([]);
    setOcrNote(null);
  }

  if (reviewText != null) {
    return (
      <div className={s.step}>
        <h3 className={s.stepTitle}>Review the text</h3>
        <p className={s.stepHint}>Fix anything that looks wrong — this is what gets highlighted next.</p>
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
      <textarea
        className={s.pasteTextarea}
        placeholder="Paste the stat block text here…"
        value={pasted}
        onChange={(e) => setPasted(e.target.value)}
        rows={10}
      />
      <div className={s.stepActions}>
        <Button onClick={startReviewFromPaste} disabled={!pasted.trim()}>Review pasted text</Button>
        <span className={s.orDivider}>or</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf,.docx,.doc,.txt,.md"
          className={s.hiddenFileInput}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); e.target.value = ''; }}
        />
        <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={busy != null}>
          Upload a file…
        </Button>
      </div>
      {busy && <p className={s.stepHint}>{busy}</p>}
      {error && <div className={s.errorBox}>{error}</div>}
    </div>
  );
}
