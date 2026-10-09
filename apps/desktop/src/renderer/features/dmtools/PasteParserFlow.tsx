import { useMemo, useState } from 'react';
import { parseStatBlock, type Highlight, type ParsedCreature } from '../../data/pasteParser';
import { parsedCreatureToHomebrewMonster } from '../../data/pasteParserAdapter';
import { saveHomebrewMonster } from '../../data/homebrew';
import { Button } from '../../components/ui/Button';
import { InputStep } from './InputStep';
import { HighlightEditor } from './HighlightEditor';
import { PreviewPane } from './PreviewPane';
import s from './dmtools.module.css';

type Step = 'input' | 'highlight' | 'success';

/**
 * The paste-parser tool end to end: input/review -> highlight -> split-screen preview -> confirm
 * -> save to the library -> success message with a link into the bestiary (Matthew, voice,
 * 2026-10-09).
 */
export function PasteParserFlow({
  uid,
  onSaved,
}: {
  uid: string;
  onSaved: (name: string) => void;
}) {
  const [step, setStep] = useState<Step>('input');
  const [text, setText] = useState('');
  const [marks, setMarks] = useState<Highlight[]>([]);
  const [override, setOverride] = useState<ParsedCreature | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);

  const parsed = useMemo(() => parseStatBlock(text, marks), [text, marks]);
  // Edits made directly in the preview pane stick even as the DM keeps adjusting highlights,
  // as long as they're still looking at the same base text — a new text (re-pasting/re-uploading)
  // starts the override fresh.
  const creature = override ?? parsed.creature;

  function startOver() {
    setStep('input');
    setText('');
    setMarks([]);
    setOverride(null);
    setSaveError(null);
  }

  async function confirmSave() {
    if (!creature) return;
    setSaving(true);
    setSaveError(null);
    try {
      const monster = parsedCreatureToHomebrewMonster(creature);
      await saveHomebrewMonster(uid, monster);
      setSavedName(monster.name);
      setStep('success');
      onSaved(monster.name);
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (step === 'input') {
    return (
      <InputStep
        onDone={(reviewedText) => {
          setText(reviewedText);
          setMarks([]);
          setOverride(null);
          setStep('highlight');
        }}
      />
    );
  }

  if (step === 'success') {
    return (
      <div className={s.step}>
        <div className={s.successBox}>
          <strong>Saved “{savedName}” to the library.</strong>
          <p>Find it in the bestiary on the right to double-check it.</p>
        </div>
        <div className={s.stepActions}>
          <Button onClick={startOver}>Parse another stat block</Button>
        </div>
      </div>
    );
  }

  // 'highlight' — the split screen: highlighter on the left, live preview on the right.
  return (
    <div className={s.splitScreen}>
      <div className={s.splitLeft}>
        <h3 className={s.stepTitle}>Highlight the mechanical pieces</h3>
        <p className={s.stepHint}>Mark lore as Lore. Mark to-hit, range, damage, and DC where they appear in an action or reaction.</p>
        <HighlightEditor text={text} marks={marks} onMarksChange={(next) => { setMarks(next); setOverride(null); }} />
        <div className={s.stepActions}>
          <Button variant="secondary" onClick={() => setStep('input')}>Back to text</Button>
        </div>
      </div>
      <div className={s.splitRight}>
        {creature ? (
          <>
            <PreviewPane creature={creature} warnings={parsed.warnings} onChange={setOverride} />
            {saveError && <div className={s.errorBox}>{saveError}</div>}
            <div className={s.stepActions}>
              <Button onClick={() => void confirmSave()} disabled={saving}>
                {saving ? 'Saving…' : 'Confirm & save to library'}
              </Button>
            </div>
          </>
        ) : (
          <p className={s.stepHint}>Nothing to preview yet.</p>
        )}
      </div>
    </div>
  );
}
