import type { TokenCondition } from '@solryn/shared-types';

/**
 * Solryn token conditions (canonical v1.2, from reference.ts) with mechanized effects. Solryn combat
 * auto-hits, so advantage/disadvantage flags are informational there; the mechanized effect that
 * matters is `ignoreDrAgainst` — Stunned/Paralyzed/Unconscious make attacks ignore DR and auto-crit
 * (ignore DR + double damage), matching the PHB.
 */
export const conditions: TokenCondition[] = [
  {
    id: 'blinded',
    name: 'Blinded',
    color: '#222222',
    description: 'Attacks against the target have advantage; the target’s attacks have disadvantage.',
    effects: { attacksAgainstAdvantage: true, ownAttacksDisadvantage: true },
  },
  {
    id: 'stunned',
    name: 'Stunned',
    color: '#2980b9',
    description: 'Can’t act or move; attacks against it ignore DR and are automatic critical hits.',
    effects: { cantAct: true, ignoreDrAgainst: true, speedZero: true },
  },
  {
    id: 'paralyzed',
    name: 'Paralyzed',
    color: '#3498db',
    description: 'Can’t act or move; attacks against it ignore DR and are automatic critical hits.',
    effects: { cantAct: true, ignoreDrAgainst: true, speedZero: true },
  },
  {
    id: 'frightened',
    name: 'Frightened',
    color: '#8e44ad',
    description: 'Disadvantage on checks and attacks while the source is visible.',
    effects: { ownAttacksDisadvantage: true, disadvantageAbilityChecks: true },
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
    description: 'Disadvantage on attacks; attacks against it have advantage (within 5 ft).',
    effects: { ownAttacksDisadvantage: true, meleeAdvRangedDis: true },
  },
  {
    id: 'grappled',
    name: 'Grappled',
    color: '#a0522d',
    description: 'Speed becomes 0.',
    effects: { speedZero: true },
  },
  {
    id: 'unconscious',
    name: 'Unconscious',
    color: '#1a1a2e',
    description: 'Can’t act or move; attacks against it ignore DR and are automatic critical hits.',
    effects: { cantAct: true, ignoreDrAgainst: true, speedZero: true },
  },
  {
    id: 'charmed',
    name: 'Charmed',
    color: '#9b59b6',
    description: 'Can’t attack the charmer.',
    effects: {},
  },
];
