import { useReducer, useState } from 'react';
import type { SystemDefinition } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import {
  buildStepPlan,
  canAdvanceStep,
  createInitialDraft,
  createReducer,
  finalizeCharacter,
} from './builderModel';
import type { StepFrameNav } from './StepFrame';
import { RollStatsStep } from './steps/RollStatsStep';
import { ChooseRaceStep } from './steps/ChooseRaceStep';
import { NameStep } from './steps/NameStep';
import { DerivedGroupStep } from './steps/DerivedGroupStep';
import { SkillsStep } from './steps/SkillsStep';
import { SpellsStep } from './steps/SpellsStep';
import { GearStep } from './steps/GearStep';
import { WelcomeStep } from './steps/WelcomeStep';

interface CharacterBuilderProps {
  system: SystemDefinition;
  gameId: string;
  ownerUserId: string;
  onFinish: (character: Omit<Character, 'id'>) => Promise<void>;
}

// Stable reducer instances per system (createReducer closes over system).
const reducerCache = new WeakMap<
  SystemDefinition,
  ReturnType<typeof createReducer>
>();
function reducerFor(system: SystemDefinition) {
  let r = reducerCache.get(system);
  if (!r) {
    r = createReducer(system);
    reducerCache.set(system, r);
  }
  return r;
}

export function CharacterBuilder({
  system,
  gameId,
  ownerUserId,
  onFinish,
}: CharacterBuilderProps) {
  const [draft, dispatch] = useReducer(
    reducerFor(system),
    undefined,
    createInitialDraft,
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [skillsSubIndex, setSkillsSubIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const plan = buildStepPlan(system, draft);
  const idx = Math.min(stepIndex, plan.length - 1);
  const step = plan[idx];

  const categories = system.skillCategories;
  const isSkills = step.kind === 'skills';
  const lastSub = categories.length - 1;
  const isLastStep = idx === plan.length - 1;

  const canNext = canAdvanceStep(system, draft, step, skillsSubIndex);

  async function finish() {
    setFinishing(true);
    setError('');
    try {
      await onFinish(finalizeCharacter(system, draft, { gameId, ownerUserId }));
    } catch (e) {
      setError((e as Error).message);
      setFinishing(false);
    }
  }

  function goNext() {
    if (!canNext || finishing) return;
    if (isSkills && skillsSubIndex < lastSub) {
      setSkillsSubIndex(skillsSubIndex + 1);
      return;
    }
    if (isLastStep) {
      void finish();
      return;
    }
    const next = idx + 1;
    setStepIndex(next);
    if (plan[next]?.kind === 'skills') setSkillsSubIndex(0);
  }

  // Back is available from step 3 on (never back into the sealed stat roll), or
  // between skill sub-pages.
  const canBack = (isSkills && skillsSubIndex > 0) || idx >= 2;
  function goBack() {
    if (isSkills && skillsSubIndex > 0) {
      setSkillsSubIndex(skillsSubIndex - 1);
      return;
    }
    if (idx < 2) return;
    const prev = idx - 1;
    setStepIndex(prev);
    if (plan[prev]?.kind === 'skills') setSkillsSubIndex(lastSub);
  }

  let nextLabel: string;
  if (finishing) nextLabel = 'Creating…';
  else if (isSkills && skillsSubIndex < lastSub)
    nextLabel = `Next: ${categories[skillsSubIndex + 1].name}`;
  else if (isLastStep) nextLabel = 'Finish character';
  else nextLabel = `Next: ${plan[idx + 1].title}`;

  const nav: StepFrameNav = {
    stepNumber: idx + 1,
    totalSteps: plan.length,
    title: step.title,
    instruction: step.instruction,
    onNext: goNext,
    nextLabel,
    nextDisabled: !canNext || finishing,
    onBack: canBack ? goBack : undefined,
  };

  const common = { system, draft, dispatch, nav } as const;

  // A one-time orientation splash before the numbered flow (not counted as a step).
  if (!started) {
    return (
      <WelcomeStep system={system} draft={draft} onBegin={() => setStarted(true)} />
    );
  }

  return (
    <>
      {step.kind === 'roll' && <RollStatsStep {...common} />}
      {step.kind === 'ancestry' && <ChooseRaceStep {...common} />}
      {step.kind === 'name' && <NameStep {...common} />}
      {step.kind === 'info' && (
        <DerivedGroupStep {...common} cards={step.cards!} />
      )}
      {step.kind === 'skills' && (
        <SkillsStep {...common} subIndex={skillsSubIndex} />
      )}
      {step.kind === 'spells' && <SpellsStep {...common} />}
      {step.kind === 'gear' && <GearStep {...common} />}
      {error && <p style={{ textAlign: 'center', color: 'var(--accent-red)' }}>{error}</p>}
    </>
  );
}
