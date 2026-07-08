import type { CreationConfig, SystemModes } from '@solryn/shared-types';

/**
 * Solryn's selections from the engine's "menu of modes". These are the choices that make
 * Solryn *a* system rather than *the* system: a future game reuses these mode ids or adds
 * a new variant to the menu.
 */
export const modes: SystemModes = {
  combat: {
    id: 'auto-hit-vs-dr',
    baseSpellDie: '1d4',
  },
  casting: {
    id: 'point-pool',
    poolStatId: 'arcanaPoints',
    perTurnSpend: 'level',
    recoveryNote:
      'Spend up to your level in Arcana Points per turn. A short rest restores half; a long rest restores all. Base spells cost 0 AP — modifications (amplify, multi-target, extend) cost AP.',
  },
  progression: {
    id: 'classless-dice-roll',
    advanceAllStats: true,
    skillPointsPerLevel: 2,
    trainingGated: true,
    levelBands: [
      { id: 'standard', label: 'Standard level', die: '1d4' },
      { id: 'milestone', label: 'Milestone level', die: '2d6', levels: [6, 10, 14, 18], note: 'Big spike.' },
      { id: 'epic', label: 'Epic level', die: '1d8', fromLevel: 20 },
    ],
  },
  skill: {
    id: 'tiered-training',
    tiers: [
      { id: 'novice', label: 'Novice', bonus: 1 },
      { id: 'journeyman', label: 'Journeyman', bonus: 2 },
      { id: 'master', label: 'Master', bonus: 3 },
    ],
    pointsPerTier: 3,
    crossOnNextPoint: true,
    maxPointsPerSkill: 9,
    trainingGated: true,
  },
};

export const creation: CreationConfig = {
  statOrder: ['STR', 'NIM', 'END', 'WIS', 'INT', 'ARC', 'LCK'],
  allowReroll: false,
  allowRearrange: false,
  startingReputation: 'Neutral',
  spellAccess: {
    // Caster if Arcana mod ≥ 1, or Elf. Known = (Arcana mod × 2) + level (+3 Elf).
    modStatId: 'ARC',
    casterThreshold: 1,
    knownPerMod: 2,
    addLevel: true,
    grantedByAncestry: ['elf'],
    ancestryBonus: 3,
  },
  // Solryn: only Light or Medium armor may be chosen at creation (Heavy is play/loot only).
  startingArmorWeights: ['light', 'medium'],
};
