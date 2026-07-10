import type { Dispatch } from 'react';
import type { SystemDefinition } from '@solryn/shared-types';
import type { BuilderAction, BuilderDraft } from './builderModel';
import type { StepFrameNav } from './StepFrame';

/** Props every builder step receives. */
export interface StepProps {
  system: SystemDefinition;
  draft: BuilderDraft;
  dispatch: Dispatch<BuilderAction>;
  nav: StepFrameNav;
}
