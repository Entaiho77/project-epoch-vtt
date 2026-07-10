import type { SystemDefinition } from '@solryn/shared-types';
import { buildStepPlan, type BuilderDraft } from '../builderModel';
import { Button } from '../../../components/ui/Button';
import s from './steps.module.css';

/**
 * Orientation splash shown once before step 1 — not a numbered step. The "what's ahead"
 * roadmap is derived from the real step plan (system-agnostic), so it stays accurate:
 * consecutive "info" pages collapse into one line, and spells are flagged as conditional
 * since caster-ness isn't known until stats are rolled.
 */
export function WelcomeStep({
  system,
  draft,
  onBegin,
}: {
  system: SystemDefinition;
  draft: BuilderDraft;
  onBegin: () => void;
}) {
  const preview: string[] = [];
  for (const step of buildStepPlan(system, draft)) {
    if (step.kind === 'info') {
      if (preview[preview.length - 1] !== 'Your stats') preview.push('Your stats');
    } else if (step.kind === 'skills') {
      preview.push('Skills');
      if (system.spells.length > 0) preview.push('Spells — if you’re a caster');
    } else {
      preview.push(step.title);
    }
  }

  return (
    <div className={s.welcome}>
      <div>
        <h1 className={s.welcomeTitle}>Create your character</h1>
        <p className={s.welcomeSystem}>{system.name}</p>
      </div>

      <p className={s.welcomeIntro}>
        You’ll build your character one step at a time — rolling stats, choosing a race, and
        outfitting your kit. Every page explains what it’s doing as you go, so there’s nothing
        to memorize up front.
      </p>

      <div>
        <span className={s.welcomeLabel}>What’s ahead</span>
        <ol className={s.welcomeSteps}>
          {preview.map((label, i) => (
            <li key={i} className={s.welcomeStep}>
              {label}
            </li>
          ))}
        </ol>
      </div>

      <p className={s.welcomeHeads}>
        ⚠ Your stat rolls <strong>lock the instant they land</strong> — no rerolls, no
        rearranging. Take your time on the first page.
      </p>

      <div>
        <Button onClick={onBegin}>Begin →</Button>
      </div>
    </div>
  );
}
