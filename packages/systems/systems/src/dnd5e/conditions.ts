import type { TokenCondition } from '@solryn/shared-types';

/**
 * 5e token conditions (SRD 5.1) with mechanized combat effects. Applied to board tokens; the
 * combat code reads the effect flags to grant advantage/disadvantage, auto-crits, etc. Exhaustion
 * is six exclusive levels (exhaustion_1 … exhaustion_6) in the 'exhaustion' group.
 */
export const conditions: TokenCondition[] = [
  {
    id: 'blinded',
    name: 'Blinded',
    color: '#222222',
    description: 'Can’t see; attacks against you have advantage, and your attacks have disadvantage.',
    effects: { attacksAgainstAdvantage: true, ownAttacksDisadvantage: true },
  },
  {
    id: 'charmed',
    name: 'Charmed',
    color: '#9b59b6',
    description: 'Can’t attack the charmer; the charmer has advantage on social checks with you.',
    effects: {},
  },
  {
    id: 'deafened',
    name: 'Deafened',
    color: '#95a5a6',
    description: 'Can’t hear and automatically fails any check requiring hearing.',
    effects: {},
  },
  {
    id: 'frightened',
    name: 'Frightened',
    color: '#8e44ad',
    description: 'Disadvantage on checks and attacks while the source is in sight; can’t move closer to it.',
    effects: { ownAttacksDisadvantage: true, disadvantageAbilityChecks: true },
  },
  {
    id: 'grappled',
    name: 'Grappled',
    color: '#a0522d',
    description: 'Speed becomes 0.',
    effects: { speedZero: true },
  },
  {
    id: 'incapacitated',
    name: 'Incapacitated',
    color: '#e91e63',
    description: 'Can’t take actions or reactions.',
    effects: { cantAct: true },
  },
  {
    id: 'invisible',
    name: 'Invisible',
    color: '#ecf0f1',
    description: 'Attacks against you have disadvantage; your attacks have advantage.',
    effects: { attacksAgainstDisadvantage: true, ownAttacksAdvantage: true },
  },
  {
    id: 'paralyzed',
    name: 'Paralyzed',
    color: '#3498db',
    description: 'Incapacitated, can’t move/speak; auto-fails STR/DEX saves; attacks have advantage; hits within 5 ft auto-crit.',
    effects: { cantAct: true, attacksAgainstAdvantage: true, autoFailStrDexSaves: true, autoCritMeleeAgainst: true, speedZero: true },
  },
  {
    id: 'petrified',
    name: 'Petrified',
    color: '#7f8c8d',
    description: 'Incapacitated, can’t move; resistance to all damage; immune to poison/disease; auto-fails STR/DEX saves; attacks have advantage.',
    effects: { cantAct: true, attacksAgainstAdvantage: true, autoFailStrDexSaves: true, resistAllDamage: true, speedZero: true },
  },
  {
    id: 'poisoned',
    name: 'Poisoned',
    color: '#27ae60',
    description: 'Disadvantage on attack rolls and ability checks.',
    effects: { ownAttacksDisadvantage: true, disadvantageAbilityChecks: true },
  },
  {
    id: 'prone',
    name: 'Prone',
    color: '#e67e22',
    description: 'Disadvantage on your attacks; attacks against you have advantage within 5 ft, disadvantage farther.',
    effects: { ownAttacksDisadvantage: true, meleeAdvRangedDis: true },
  },
  {
    id: 'restrained',
    name: 'Restrained',
    color: '#d35400',
    description: 'Speed 0; attacks against you have advantage; your attacks have disadvantage; disadvantage on DEX saves.',
    effects: { speedZero: true, attacksAgainstAdvantage: true, ownAttacksDisadvantage: true, disadvantageDexSaves: true },
  },
  {
    id: 'stunned',
    name: 'Stunned',
    color: '#2980b9',
    description: 'Incapacitated, can’t move; auto-fails STR/DEX saves; attacks against you have advantage.',
    effects: { cantAct: true, attacksAgainstAdvantage: true, autoFailStrDexSaves: true, speedZero: true },
  },
  {
    id: 'unconscious',
    name: 'Unconscious',
    color: '#1a1a2e',
    description: 'Incapacitated, can’t move/speak, drops items, falls prone; auto-fails STR/DEX saves; attacks have advantage; hits within 5 ft auto-crit.',
    effects: { cantAct: true, attacksAgainstAdvantage: true, autoFailStrDexSaves: true, autoCritMeleeAgainst: true, speedZero: true },
  },
  // Exhaustion — six exclusive, cumulative levels (only one active at a time).
  { id: 'exhaustion_1', name: 'Exhaustion 1', color: '#f39c12', group: 'exhaustion', level: 1, description: 'Disadvantage on ability checks.', effects: { disadvantageAbilityChecks: true } },
  { id: 'exhaustion_2', name: 'Exhaustion 2', color: '#f39c12', group: 'exhaustion', level: 2, description: 'Speed halved (plus level 1).', effects: { disadvantageAbilityChecks: true, speedHalved: true } },
  { id: 'exhaustion_3', name: 'Exhaustion 3', color: '#f39c12', group: 'exhaustion', level: 3, description: 'Disadvantage on attack rolls and saving throws (plus lower levels).', effects: { disadvantageAbilityChecks: true, speedHalved: true, ownAttacksDisadvantage: true } },
  { id: 'exhaustion_4', name: 'Exhaustion 4', color: '#f39c12', group: 'exhaustion', level: 4, description: 'Hit point maximum halved (plus lower levels).', effects: { disadvantageAbilityChecks: true, speedHalved: true, ownAttacksDisadvantage: true, hpMaxHalved: true } },
  { id: 'exhaustion_5', name: 'Exhaustion 5', color: '#f39c12', group: 'exhaustion', level: 5, description: 'Speed reduced to 0 (plus lower levels).', effects: { disadvantageAbilityChecks: true, ownAttacksDisadvantage: true, hpMaxHalved: true, speedZero: true } },
  { id: 'exhaustion_6', name: 'Exhaustion 6', color: '#f39c12', group: 'exhaustion', level: 6, description: 'Death.', effects: { disadvantageAbilityChecks: true, ownAttacksDisadvantage: true, hpMaxHalved: true, speedZero: true } },
];
