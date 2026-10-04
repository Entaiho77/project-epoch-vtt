import type { SystemDefinition } from '@solryn/shared-types';
import { coreStats, derivedStats, modifierRule } from './attributes';
import { ancestries } from './ancestries';
import { skillCategories, skills } from './skills';
import { spells } from './spells';
import { equipment } from './equipment';
import { mapTypes, qualityScale } from './world';
import { bestiary, statBlockShapes } from './bestiary';
import { rulesReference, conditions } from './reference';
import { conditions as tokenConditions } from './conditions';
import { modes, creation } from './modes';

/**
 * SOLRYN — the first system preset and the engine's proving ground.
 *
 * This object is the entire definition of Solryn-the-game; every screen reads it.
 * Nothing about Solryn is hardcoded into components or the engine — if it were, the
 * system-agnostic goal would be broken. Solryn selects: auto-hit-vs-DR combat, an Arcana
 * point-pool casting model, classless dice-roll progression, and tiered+training skills.
 */
export const solrynSystem: SystemDefinition = {
  id: 'solryn',
  name: 'Solryn',
  glyph: '✶',
  color: '#5dcaa5',
  version: '1.2.0',
  tagline: 'Auto-hit combat · Luck & Arcana · classless growth.',

  modes,

  coreStats,
  modifierRule,
  derivedStats,

  ancestries,
  skillCategories,
  skills,
  spells,

  equipment,
  mapTypes,
  qualityScale,

  statBlockShapes,
  bestiary,

  rulesReference,
  conditions,
  tokenConditions,

  creation,
};
