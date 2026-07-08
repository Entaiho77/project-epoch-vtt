import type { Ancestry } from '@solryn/shared-types';

/**
 * The nine Solryn races — canonical v1.2. Flexible-bonus races (Human, Dwarf, Elf)
 * expand inline at creation so the player assigns the choice before it applies.
 */
export const ancestries: Ancestry[] = [
  {
    id: 'human',
    name: 'Human',
    bonusSummary: '+1 to any two stats',
    bonuses: [{ kind: 'choice', amount: 1, count: 2, distinct: true }],
    advantages: ['Learn trades faster — downtime training reduced by 1 week.'],
    weaknesses: ['Vulnerable to disease.'],
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    bonusSummary: '+2 Strength, +1 to any stat',
    bonuses: [
      { kind: 'fixed', stat: 'STR', amount: 2 },
      { kind: 'choice', amount: 1, count: 1 },
    ],
    advantages: [
      'Stone Sight.',
      'Magic Resistance: advantage on saves versus magic.',
      'Crafting Bonus: −2 to crafting DCs.',
    ],
    weaknesses: ['Cannot be healed magically — magic is inert on them.'],
  },
  {
    id: 'elf',
    name: 'Elf',
    bonusSummary: '+1 Nimbleness, +1 Wisdom or Arcana',
    bonuses: [
      { kind: 'fixed', stat: 'NIM', amount: 1 },
      { kind: 'choice', amount: 1, count: 1, from: ['WIS', 'ARC'] },
    ],
    advantages: [
      '3 bonus non-damaging spells at start (a caster regardless of Arcana).',
      'Nature-Smithing: grow items from plants; −2 to crafting DCs.',
    ],
    weaknesses: ['Vulnerable to poison.'],
  },
  {
    id: 'gnome',
    name: 'Gnome',
    bonusSummary: '+1 Nimbleness, +1 Wisdom',
    bonuses: [
      { kind: 'fixed', stat: 'NIM', amount: 1 },
      { kind: 'fixed', stat: 'WIS', amount: 1 },
    ],
    advantages: ['Master of Toolcraft.', 'Immune to spatial disorientation.'],
    weaknesses: ['Can only carry 25% of body weight.'],
  },
  {
    id: 'drakari',
    name: 'Drakari',
    bonusSummary: '+2 Arcana, +1 Strength',
    bonuses: [
      { kind: 'fixed', stat: 'ARC', amount: 2 },
      { kind: 'fixed', stat: 'STR', amount: 1 },
    ],
    advantages: [
      'Breath weapon once per day (choose its damage type).',
      'Resistance to the chosen damage type.',
    ],
    weaknesses: ['Disadvantage on divine Charisma checks.'],
  },
  {
    id: 'umbrin',
    name: 'Umbrin',
    bonusSummary: '+2 Nimbleness, +1 Wisdom',
    bonuses: [
      { kind: 'fixed', stat: 'NIM', amount: 2 },
      { kind: 'fixed', stat: 'WIS', amount: 1 },
    ],
    advantages: ['Shadow movement.', 'Darksight.'],
    weaknesses: ['Disadvantage on checks in bright light.'],
  },
  {
    id: 'marai',
    name: 'Marai',
    bonusSummary: '+2 Endurance, +1 Intelligence',
    bonuses: [
      { kind: 'fixed', stat: 'END', amount: 2 },
      { kind: 'fixed', stat: 'INT', amount: 1 },
    ],
    advantages: [
      'Breathe and swim underwater.',
      'Echo pulse: detect hidden creatures within 60 ft.',
    ],
    weaknesses: ['Must submerge every 48 hours or suffer fatigue.'],
  },
  {
    id: 'ashborn',
    name: 'Ashborn',
    bonusSummary: '+2 Strength, +1 Arcana',
    bonuses: [
      { kind: 'fixed', stat: 'STR', amount: 2 },
      { kind: 'fixed', stat: 'ARC', amount: 1 },
    ],
    advantages: ['Auto-stabilize at 0 HP once per day.', '+1 fire damage with melee.'],
    weaknesses: ['Vulnerable to cold.'],
  },
  {
    id: 'etherials',
    name: 'Etherials',
    bonusSummary: '+2 Arcana, +1 Intelligence',
    bonuses: [
      { kind: 'fixed', stat: 'ARC', amount: 2 },
      { kind: 'fixed', stat: 'INT', amount: 1 },
    ],
    advantages: [
      'Teleport 10 ft as a reaction once per rest.',
      'Advantage on saves versus mental effects.',
    ],
    weaknesses: ['Vulnerable to radiant.'],
  },
];
