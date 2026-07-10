import { StepFrame } from '../StepFrame';
import type { StepProps } from '../stepTypes';
import { TextField } from '../../../components/ui/TextField';
import s from './steps.module.css';

/** Dedicated naming step — an identity choice, separated from the mechanical gear step. */
export function NameStep({ draft, dispatch, nav }: StepProps) {
  const teaching = (
    <>
      <p className={s.teachText}>
        Your name is the one <strong>identity choice</strong> in character creation —
        everything else is stats and gear. Pick something that fits the hero you’re imagining.
      </p>
      <p className={s.teachText}>
        It carries onto your sheet and the board. You can’t change it from the builder once you
        finish, so take a moment with it here.
      </p>
    </>
  );

  return (
    <StepFrame {...nav} teaching={teaching}>
      <div className={s.centerBlock} style={{ width: '100%', maxWidth: 420 }}>
        <TextField
          label="Character name"
          value={draft.name}
          onChange={(e) => dispatch({ type: 'setName', name: e.target.value })}
          placeholder="Name your hero"
        />
      </div>
    </StepFrame>
  );
}
