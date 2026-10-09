// The 5e bestiary: the full raw-5e SRD conversion (AC, to-hit attacks, saves, CR), generated
// from data/srd-monsters-5e.json into bestiary.generated.ts, plus the comingled dual-stat
// creatures (Solryn Bestiary volumes — see ../bestiary/comingled.ts) tagged for 5e use.
// Regenerate the SRD half with: npm run gen:bestiary5e
import type { BestiaryEntry } from '@epoch/shared-types';
import { generatedBestiary } from './bestiary.generated';
import { comingledBestiaryFor } from '../bestiary/comingled';

export const bestiary: BestiaryEntry[] = [...generatedBestiary, ...comingledBestiaryFor('dnd5e')];
