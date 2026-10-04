import type { BestiaryEntry, StatBlockShape } from '@solryn/shared-types';
import { generatedBestiary } from './bestiary.generated';

/**
 * Stat-block shapes drive the add-creature form's fields by category. Solryn creatures
 * carry HP/DR/Speed/Damage + an optional initiative modifier (decision #2: default 0 is
 * book-accurate; the field lets a GM give fast creatures an edge). Traps carry
 * detection/disarm DCs, trigger, and effect.
 */
export const statBlockShapes: StatBlockShape[] = [
  {
    id: 'creature',
    label: 'Creature',
    fields: [
      { id: 'hp', label: 'HP', type: 'number' },
      { id: 'dr', label: 'DR', type: 'number' },
      { id: 'speed', label: 'Speed', type: 'text' },
      { id: 'damage', label: 'Damage', type: 'dice' },
      { id: 'initiativeMod', label: 'Init mod', type: 'number', hint: 'default 0' },
    ],
  },
  {
    id: 'trap',
    label: 'Trap',
    fields: [
      { id: 'detectionDC', label: 'Detection DC', type: 'number', hint: 'DC to spot' },
      { id: 'trigger', label: 'Trigger', type: 'text' },
      { id: 'effect', label: 'Effect / Damage', type: 'text' },
      { id: 'disarmDC', label: 'Disarm DC', type: 'number', hint: 'ties to Trap Making / Sleight of Hand' },
    ],
  },
];

/**
 * The full Solryn bestiary. Every entry — the 10 canonical v1.2 starters and the
 * SRD/Eribor conversions — flows through one generator path: data/bestiary-source.json
 * is the source of truth, and scripts/genBestiary.ts flattens it into
 * bestiary.generated.ts (run `npm run gen:bestiary`). Edit creatures there, not here.
 */
export const bestiary: BestiaryEntry[] = generatedBestiary;
