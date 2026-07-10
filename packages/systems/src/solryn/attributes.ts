import {
  add,
  c,
  clamp,
  equip,
  mod,
  mul,
  score,
  sub,
  type CoreStat,
  type DerivedStat,
  type ModifierRule,
} from '@solryn/shared-types';

/** Solryn's seven core stats, rolled 2d4 each in this order at creation. */
export const coreStats: CoreStat[] = [
  {
    id: 'STR',
    name: 'Strength',
    abbreviation: 'STR',
    description: 'Physical power, melee damage, carrying capacity.',
    roll: '2d4',
  },
  {
    id: 'NIM',
    name: 'Nimbleness',
    abbreviation: 'NIM',
    description: 'Agility, reflexes, ranged attacks, initiative.',
    roll: '2d4',
  },
  {
    id: 'END',
    name: 'Endurance',
    abbreviation: 'END',
    description: 'Stamina, durability, resistance to fatigue.',
    roll: '2d4',
  },
  {
    id: 'WIS',
    name: 'Wisdom',
    abbreviation: 'WIS',
    description: 'Perception, intuition, awareness of surroundings.',
    roll: '2d4',
  },
  {
    id: 'INT',
    name: 'Intelligence',
    abbreviation: 'INT',
    description: 'Reasoning, memory, problem-solving.',
    roll: '2d4',
  },
  {
    id: 'ARC',
    name: 'Arcana',
    abbreviation: 'ARC',
    description: 'Magical aptitude and power.',
    roll: '2d4',
  },
  {
    id: 'LCK',
    name: 'Luck',
    abbreviation: 'LCK',
    description: 'Fortune, critical strikes, rerolls.',
    roll: '2d4',
  },
];

/** "Every 3 points = +1, and the pattern continues with no cap." */
export const modifierRule: ModifierRule = {
  type: 'linear-step',
  pointsPerStep: 3,
  bonusPerStep: 1,
  cap: null,
};

/**
 * Derived values, expressed as formula trees (data, not code).
 * DR and Speed are equipment-fed — they read armor fields and show partial in the
 * builder until starting gear is chosen at step 13.
 */
export const derivedStats: DerivedStat[] = [
  {
    id: 'hp',
    name: 'Hit Points',
    abbreviation: 'HP',
    description:
      'Endurance score + Endurance modifier. Fully recalculated on level-up with the new Endurance.',
    compute: { type: 'value', expr: add(score('END'), mod('END')) },
    recalcOnLevelUp: true,
    resourcePool: true,
    color: 'teal',
  },
  {
    id: 'dr',
    name: 'Damage Reduction',
    abbreviation: 'DR',
    description:
      'Armor DR + Nimbleness modifier + Endurance modifier. The armor piece is filled in when starting gear is chosen.',
    compute: {
      type: 'value',
      expr: add(equip('armor', 'dr'), mod('NIM'), mod('END')),
    },
    dependsOnEquipment: true,
    recalcOnLevelUp: true,
  },
  {
    id: 'speed',
    name: 'Speed',
    description:
      '10 + ((STR mod + END mod) × 5), capped at 50 ft, minus the armor penalty (medium −5, heavy −10).',
    compute: {
      type: 'value',
      expr: sub(
        clamp(add(c(10), mul(add(mod('STR'), mod('END')), c(5))), 0, 50),
        equip('armor', 'speedPenalty'),
      ),
    },
    dependsOnEquipment: true,
    recalcOnLevelUp: true,
    unit: 'ft',
  },
  {
    id: 'initiative',
    name: 'Initiative',
    abbreviation: 'Init',
    description:
      'Rolled fresh each combat: d20 + Nimbleness modifier. The sheet stores the modifier; the roll happens per combat. Players win ties versus monsters.',
    compute: { type: 'roll', die: 'd20', modifier: mod('NIM') },
    recalcOnLevelUp: true,
  },
  {
    id: 'carry',
    name: 'Carrying Capacity',
    description: 'Strength score × 15 lbs.',
    compute: { type: 'value', expr: mul(score('STR'), c(15)) },
    recalcOnLevelUp: true,
    unit: 'lbs',
  },
  {
    id: 'arcanaPoints',
    name: 'Arcana Points',
    abbreviation: 'AP',
    description:
      'Arcana modifier × 2. Spend up to your level per turn; managed manually. A non-caster who rolls Arcana up over levels grows a pool organically.',
    compute: { type: 'value', expr: mul(mod('ARC'), c(2)) },
    recalcOnLevelUp: true,
    resourcePool: true,
    color: 'purple',
  },
  {
    id: 'luckPoints',
    name: 'Luck Points',
    abbreviation: 'LP',
    description: 'Equal to your Luck modifier.',
    compute: { type: 'value', expr: mod('LCK') },
    recalcOnLevelUp: true,
    resourcePool: true,
    color: 'amber',
  },
];
