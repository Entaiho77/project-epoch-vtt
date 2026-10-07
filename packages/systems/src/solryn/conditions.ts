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
  // Exhaustion & Fatigue (rulebook §1.4): 3 levels, cumulative — level 2 carries level 1's
  // effect too, same convention as the 5e exhaustion ladder below. Level 3 IS mechanized death
  // (Matthew, 2026-10-07: "Level 3 exhaustion is death in Solryn") — `effects.fatal` marks the
  // token defeated + permaDead the instant it's set, and nothing (HP healing, Revive) undoes it.
  {
    id: 'exhaustion_1',
    name: 'Exhaustion 1',
    color: '#d4a017',
    group: 'exhaustion',
    level: 1,
    description: 'Disadvantage on all ability checks.',
    effects: { disadvantageAbilityChecks: true },
  },
  {
    id: 'exhaustion_2',
    name: 'Exhaustion 2',
    color: '#d4a017',
    group: 'exhaustion',
    level: 2,
    description: 'Movement speed halved (plus level 1).',
    effects: { disadvantageAbilityChecks: true, speedHalved: true },
  },
  {
    id: 'exhaustion_3',
    name: 'Exhaustion 3',
    color: '#8b1a1a',
    group: 'exhaustion',
    level: 3,
    description: 'Death. Permanent. No resurrection. (Plus levels 1–2.)',
    effects: { disadvantageAbilityChecks: true, speedHalved: true, fatal: true },
  },
];
