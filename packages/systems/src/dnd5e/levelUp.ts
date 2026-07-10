import type { SystemDefinition } from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import type { StartingHp } from '@solryn/shared-types';
import { classLevel, rollDice, type Rng } from '@solryn/engine';
import { pcDerived } from './character';

const dieSize = (hitDie: string): number => parseInt(hitDie.replace(/^d/i, ''), 10);

/**
 * HP gained for a level, by the campaign's starting-HP method (default average). A level always
 * gains at least 1 HP before the CON mod (5e floor).
 *   - max     : hit-die max + CON mod
 *   - average : ⌊hitDie/2⌋ + 1 + CON mod (the standard "take the average")
 *   - rolled  : 1dHit + CON mod (rng injectable for tests)
 */
export function hpGainForLevel(
  hitDie: string,
  conMod: number,
  method: StartingHp = 'average',
  rng?: Rng,
): number {
  const size = dieSize(hitDie);
  const base =
    method === 'max' ? size : method === 'rolled' ? rollDice(`1d${size}`, rng).total : Math.floor(size / 2) + 1;
  return base + conMod;
}

/** Wizards add two spells to their spellbook each level; other prepared casters add none. */
export const WIZARD_SPELLS_PER_LEVEL = 2;

export interface CounterChange {
  name: string;
  from?: number | string;
  to: number | string;
}

/** Everything the level-up flow needs to describe and validate the step from L→L+1. */
export interface LevelUpSummary {
  applicable: boolean; // false for non-class (Solryn) characters
  atMax: boolean; // already level 20 → cannot grant
  fromLevel: number;
  toLevel: number;
  className: string;
  /** Features gained AT the new level (the level row's own features). */
  newFeatures: string[];
  hpGain: number;
  isAsi: boolean;
  /** This level unlocks the subclass (data not built yet → informational note). */
  subclassPending: boolean;
  counterChanges: CounterChange[];
  newMaxSlots: Record<number, number>;
  // Spell gains (deltas), for casters.
  model?: 'known' | 'prepared' | 'spellbook';
  spellAbility?: string;
  cantripsGain: number;
  /** New leveled spells to choose (known casters), or 2 for a Wizard's spellbook. */
  spellsGain: number;
  newPreparedCount?: number;
}

function slotsRecord(row: { spellSlots?: number[] } | undefined): Record<number, number> {
  const out: Record<number, number> = {};
  (row?.spellSlots ?? []).forEach((n, i) => {
    if (n > 0) out[i + 1] = n;
  });
  return out;
}

/** Describe the level-up from the character's current level to the next. `startingHp` (a campaign
 *  rule) selects the HP-gain method; it defaults to average when the rules aren't supplied. */
export function levelUpSummary(
  system: SystemDefinition,
  character: Character,
  startingHp: StartingHp = 'average',
): LevelUpSummary {
  const cls = system.classes?.find((c) => c.id === character.definition.classId);
  const fromLevel = character.play.level;
  if (!cls) {
    return {
      applicable: false, atMax: false, fromLevel, toLevel: fromLevel, className: '',
      newFeatures: [], hpGain: 0, isAsi: false, subclassPending: false, counterChanges: [],
      newMaxSlots: {}, cantripsGain: 0, spellsGain: 0,
    };
  }
  const atMax = fromLevel >= 20;
  const toLevel = Math.min(20, fromLevel + 1);
  const d = pcDerived(system, character);
  const nextRow = classLevel(cls, toLevel);
  const prevRow = classLevel(cls, fromLevel);

  const counterChanges: CounterChange[] = [];
  const keys = new Set([...Object.keys(prevRow.counters ?? {}), ...Object.keys(nextRow.counters ?? {})]);
  for (const k of keys) {
    const from = prevRow.counters?.[k];
    const to = nextRow.counters?.[k];
    if (to !== undefined && to !== from) counterChanges.push({ name: k, from, to });
  }

  const sc = cls.spellcasting;
  const cantripsGain = Math.max(0, (nextRow.cantripsKnown ?? 0) - (prevRow.cantripsKnown ?? 0));
  let spellsGain = 0;
  let newPreparedCount: number | undefined;
  if (sc?.type === 'known') {
    spellsGain = Math.max(0, (nextRow.spellsKnown ?? 0) - (prevRow.spellsKnown ?? 0));
  } else if (sc?.type === 'spellbook') {
    spellsGain = WIZARD_SPELLS_PER_LEVEL;
  } else if (sc?.type === 'prepared') {
    newPreparedCount = Math.max(1, (d.mods[sc.ability] ?? 0) + toLevel);
  }

  return {
    applicable: true,
    atMax,
    fromLevel,
    toLevel,
    className: cls.name,
    newFeatures: nextRow.features ?? [],
    hpGain: hpGainForLevel(cls.hitDie, d.mods.CON ?? 0, startingHp),
    isAsi: !!nextRow.abilityScoreImprovement,
    subclassPending: cls.subclassLevel === toLevel,
    counterChanges,
    newMaxSlots: slotsRecord(nextRow),
    ...(sc ? { model: sc.type, spellAbility: sc.ability } : {}),
    cantripsGain,
    spellsGain,
    ...(newPreparedCount !== undefined ? { newPreparedCount } : {}),
  };
}

export interface LevelUpChoices {
  /** ASI: stat id → +delta (either one +2, or two +1s). Empty when the level has no ASI. */
  asi: Record<string, number>;
  /** New cantrips picked (known casters / Wizard). */
  newCantripIds: string[];
  /** New leveled spells picked (known casters) or added to the spellbook (Wizard). */
  newSpellIds: string[];
  /** Subclass chosen at this level (only when summary.subclassPending). */
  subclassId?: string;
  /** Feat taken instead of the ASI at an ASI level (asi should be empty then). */
  featId?: string;
  /** The ability chosen for a feat's flexible +1 (when featId's feat has an abilityChoice). */
  featAbility?: string;
}

export interface LevelUpResult {
  level: number;
  /** New current HP (old current + the HP gain — a full character stays full). */
  hpCurrent: number;
  coreScores: Record<string, number>;
  knownSpellIds: string[];
  spellbookSpellIds?: string[];
  /** Refresh slots to the new maxima (level-up happens on a rest). Absent for non-casters. */
  spellSlots?: Record<number, number>;
  /** Subclass chosen at this level, if any. */
  subclassId?: string;
  /** Full feat list after this level-up (if a feat was taken). */
  featIds?: string[];
  /** Full feat ability-choice map after this level-up. */
  featChoices?: Record<string, string>;
}

/** Fold the player's choices into the concrete values to persist. Pure — no Firebase. */
export function computeLevelUp(
  system: SystemDefinition,
  character: Character,
  summary: LevelUpSummary,
  choices: LevelUpChoices,
): LevelUpResult {
  const d = pcDerived(system, character);
  const curHp = character.play.pools?.hp?.current ?? d.maxHp;

  const coreScores = { ...character.definition.coreScores };
  for (const [stat, delta] of Object.entries(choices.asi)) {
    coreScores[stat] = (coreScores[stat] ?? 10) + delta;
  }

  // A feat taken in place of the ASI: append to featIds and record any ability choice. The feat's
  // ability bonus isn't baked into coreScores — pcDerived applies it from featIds/featChoices.
  const featIds = choices.featId
    ? [...new Set([...(character.play.featIds ?? []), choices.featId])]
    : undefined;
  const featChoices =
    choices.featId && choices.featAbility
      ? { ...(character.play.featChoices ?? {}), [choices.featId]: choices.featAbility }
      : undefined;

  const known = character.definition.knownSpellIds ?? [];
  const book = character.definition.spellbookSpellIds ?? [];
  // Cantrips are always "known"; leveled picks go to the spellbook (Wizard) or the known list.
  const knownSpellIds = [...new Set([...known, ...choices.newCantripIds, ...(summary.model === 'spellbook' ? [] : choices.newSpellIds)])];
  const spellbookSpellIds = summary.model === 'spellbook' ? [...new Set([...book, ...choices.newSpellIds])] : undefined;

  return {
    level: summary.toLevel,
    hpCurrent: curHp + summary.hpGain,
    coreScores,
    knownSpellIds,
    ...(spellbookSpellIds ? { spellbookSpellIds } : {}),
    ...(summary.model ? { spellSlots: summary.newMaxSlots } : {}),
    ...(choices.subclassId ? { subclassId: choices.subclassId } : {}),
    ...(featIds ? { featIds } : {}),
    ...(featChoices ? { featChoices } : {}),
  };
}
