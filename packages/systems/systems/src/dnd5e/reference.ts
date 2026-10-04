import type { ConditionEntry, RulesCard } from '@solryn/shared-types';

/**
 * D&D 5e rules reference — the commonly table-looked-up rules, drawn entirely from the SRD 5.1
 * (CC-BY-4.0). No PHB-only material. Text is deliberately terse (reference cards, not full rules).
 * Surfaced automatically in the board's Rules drawer via SystemDefinition.rulesReference /
 * .conditions, exactly like Solryn's reference.ts.
 */
export const rulesReference: RulesCard[] = [
  // --- Actions ---
  {
    id: 'actions-in-combat',
    category: 'Actions',
    name: 'Actions in Combat',
    description: 'On your turn you take one action (plus move and possibly a bonus action + reaction).',
    details:
      'Attack (one attack, or more with Extra Attack) · Cast a Spell · Dash (extra movement equal to your speed) · Disengage (your movement doesn’t provoke opportunity attacks) · Dodge (attackers have disadvantage, you get advantage on Dex saves) · Help (give an ally advantage on a check or attack) · Hide (make a Stealth check) · Ready (prepare an action to a chosen trigger) · Search · Use an Object.',
  },
  {
    id: 'bonus-actions',
    category: 'Actions',
    name: 'Bonus Actions',
    description: 'An extra action allowed only when a feature, spell, or ability specifically grants one.',
    details: 'You can take at most one bonus action per turn, and only when something says you can.',
  },
  {
    id: 'reactions',
    category: 'Actions',
    name: 'Reactions',
    description: 'An instant response to a trigger, taken once per round.',
    details: 'You regain your reaction at the start of your turn. The opportunity attack is the most common; readied actions and some spells also use it.',
  },
  {
    id: 'opportunity-attacks',
    category: 'Actions',
    name: 'Opportunity Attacks',
    description: 'When a hostile creature you can see leaves your reach, use your reaction to make one melee attack against it.',
    details: 'Taking the Disengage action, or being moved without spending your own movement (e.g. pushed), doesn’t provoke.',
  },

  // --- Combat ---
  {
    id: 'grappling',
    category: 'Combat',
    name: 'Grappling',
    description: 'A special melee attack (part of the Attack action) to seize a creature no more than one size larger.',
    details: 'Contest your Strength (Athletics) vs the target’s Athletics or Acrobatics (its choice). On success the target is Grappled (speed 0). It repeats the contest to escape. Moving a grappled creature halves your speed unless it’s much smaller.',
  },
  {
    id: 'shoving',
    category: 'Combat',
    name: 'Shoving',
    description: 'A special melee attack (part of the Attack action) to push a creature no more than one size larger.',
    details: 'Contest your Strength (Athletics) vs the target’s Athletics or Acrobatics. On success, push it 5 feet away or knock it Prone.',
  },
  {
    id: 'cover',
    category: 'Combat',
    name: 'Cover',
    description: 'Obstacles between attacker and target grant a bonus to AC and Dexterity saving throws.',
    details: 'Half cover: +2 AC and Dex saves. Three-quarters cover: +5. Total cover: can’t be targeted directly. Only the most protective degree applies.',
  },
  {
    id: 'flanking',
    category: 'Combat',
    name: 'Flanking (optional rule)',
    description: 'When you and an ally are on opposite sides of an enemy, melee attacks against it have advantage.',
    details: 'Both attackers must be within reach and on directly opposite sides. This is an optional rule — off unless the table uses it.',
  },
  {
    id: 'advantage-disadvantage',
    category: 'Combat',
    name: 'Advantage & Disadvantage',
    description: 'Roll two d20s and take the higher (advantage) or lower (disadvantage).',
    details: 'They don’t stack — you never roll more than two d20s. If you have both advantage and disadvantage, they cancel and you roll a single d20.',
  },

  // --- Character ---
  {
    id: 'proficiency-bonus',
    category: 'Character',
    name: 'Proficiency Bonus by Level',
    description: 'Added to attack rolls, saves, and checks you’re proficient in. Scales with character level.',
    details: 'Levels 1–4: +2 · 5–8: +3 · 9–12: +4 · 13–16: +5 · 17–20: +6.',
  },
  {
    id: 'passive-perception',
    category: 'Character',
    name: 'Passive Perception',
    description: 'Used to notice hidden threats without a roll.',
    details: 'Passive Perception = 10 + your Wisdom (Perception) modifier (+5 if you’d have advantage, −5 if disadvantage).',
  },
  {
    id: 'resting',
    category: 'Character',
    name: 'Resting',
    description: 'Short and long rests recover hit points and abilities.',
    details: 'Short rest (at least 1 hour): spend Hit Dice, rolling each + your Constitution modifier, to regain HP. Long rest (at least 8 hours): regain all lost HP and up to half your total Hit Dice; you can benefit from only one long rest per 24 hours.',
  },
  {
    id: 'death-saving-throws',
    category: 'Character',
    name: 'Death Saving Throws',
    description: 'At the start of your turn while at 0 HP, roll a d20 (no modifiers).',
    details: '10 or higher = a success; 9 or lower = a failure. Three successes: you become stable. Three failures: you die. A natural 20 restores 1 HP. A natural 1 counts as two failures. Taking damage at 0 HP causes one failure (two on a critical hit). Regaining any HP or stabilizing resets the tally.',
  },
  {
    id: 'healing',
    category: 'Character',
    name: 'Healing',
    description: 'Restores hit points up to (never above) a creature’s maximum.',
    details: 'A creature at 0 HP that regains any HP becomes conscious. Stabilizing (a DC 10 Wisdom (Medicine) check or a healer’s kit) stops death saves without restoring HP.',
  },
  {
    id: 'exhaustion-rule',
    category: 'Character',
    name: 'Exhaustion',
    description: 'Tracked in six cumulative levels; effects stack downward as it rises.',
    details: '1: disadvantage on ability checks · 2: speed halved · 3: disadvantage on attack rolls and saving throws · 4: hit point maximum halved · 5: speed 0 · 6: death. A long rest (with food and drink) removes one level.',
  },

  // --- Spellcasting ---
  {
    id: 'spell-save-dc',
    category: 'Spellcasting',
    name: 'Spell Save DC',
    description: 'The DC a target must beat when your spell calls for a saving throw.',
    details: 'Spell save DC = 8 + your proficiency bonus + your spellcasting ability modifier.',
  },
  {
    id: 'spell-attack-bonus',
    category: 'Spellcasting',
    name: 'Spell Attack Bonus',
    description: 'Added to the d20 when a spell requires an attack roll.',
    details: 'Spell attack modifier = your proficiency bonus + your spellcasting ability modifier.',
  },
  {
    id: 'spell-components',
    category: 'Spellcasting',
    name: 'Components (V / S / M)',
    description: 'The verbal, somatic, and material requirements to cast a spell.',
    details: 'Verbal: a spoken incantation. Somatic: a gesture with a free hand. Material: the listed items — a component pouch or spellcasting focus can substitute for any with no listed cost; components consumed or with a cost must be provided.',
  },
  {
    id: 'ritual-casting',
    category: 'Spellcasting',
    name: 'Ritual Casting',
    description: 'A spell with the ritual tag can be cast without expending a spell slot.',
    details: 'Casting as a ritual takes 10 minutes longer than normal and requires the Ritual Casting feature. The caster must have the spell prepared or known (a wizard can ritual-cast from the spellbook).',
  },
  {
    id: 'concentration',
    category: 'Spellcasting',
    name: 'Concentration',
    description: 'Some spells persist only while you concentrate; you can concentrate on just one spell at a time.',
    details: 'Concentration ends if you cast another concentration spell, are incapacitated or killed, or fail a Constitution saving throw when you take damage (DC 10 or half the damage taken, whichever is higher).',
  },
];

/** The 15 SRD 5.1 conditions (including Exhaustion), surfaced in the Rules drawer's Conditions list. */
export const conditions: ConditionEntry[] = [
  {
    id: 'blinded',
    name: 'Blinded',
    description: 'A blinded creature can’t see.',
    effects: [
      'Automatically fails any ability check that requires sight.',
      'Attack rolls against it have advantage; its own attack rolls have disadvantage.',
    ],
  },
  {
    id: 'charmed',
    name: 'Charmed',
    description: 'A charmed creature is favorably disposed toward the charmer.',
    effects: [
      'Can’t attack the charmer or target it with harmful abilities or magical effects.',
      'The charmer has advantage on ability checks to interact socially with the creature.',
    ],
  },
  {
    id: 'deafened',
    name: 'Deafened',
    description: 'A deafened creature can’t hear.',
    effects: ['Automatically fails any ability check that requires hearing.'],
  },
  {
    id: 'exhaustion',
    name: 'Exhaustion',
    description: 'Measured in six cumulative levels; a creature suffers the effect of its current level and all lower ones.',
    effects: [
      'Level 1: Disadvantage on ability checks.',
      'Level 2: Speed halved.',
      'Level 3: Disadvantage on attack rolls and saving throws.',
      'Level 4: Hit point maximum halved.',
      'Level 5: Speed reduced to 0.',
      'Level 6: Death.',
      'Finishing a long rest (with food and drink) removes one level.',
    ],
  },
  {
    id: 'frightened',
    name: 'Frightened',
    description: 'A frightened creature is gripped by fear of a source.',
    effects: [
      'Disadvantage on ability checks and attack rolls while the source of its fear is in line of sight.',
      'Can’t willingly move closer to the source of its fear.',
    ],
  },
  {
    id: 'grappled',
    name: 'Grappled',
    description: 'A grappled creature is held in place.',
    effects: [
      'Speed becomes 0 and it gains no benefit to speed.',
      'Ends if the grappler is incapacitated, or if the creature is moved out of the grappler’s reach.',
    ],
  },
  {
    id: 'incapacitated',
    name: 'Incapacitated',
    description: 'An incapacitated creature is overwhelmed and unable to act.',
    effects: ['Can’t take actions or reactions.'],
  },
  {
    id: 'invisible',
    name: 'Invisible',
    description: 'An invisible creature can’t be seen without magic or a special sense.',
    effects: [
      'Heavily obscured for hiding; its location can still be given away by noise or tracks.',
      'Attack rolls against it have disadvantage; its own attack rolls have advantage.',
    ],
  },
  {
    id: 'paralyzed',
    name: 'Paralyzed',
    description: 'A paralyzed creature is incapacitated and unable to move or act.',
    effects: [
      'Incapacitated; can’t move or speak.',
      'Automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against it have advantage; any attack that hits from within 5 feet is a critical hit.',
    ],
  },
  {
    id: 'petrified',
    name: 'Petrified',
    description: 'A petrified creature is transformed into a solid inanimate substance.',
    effects: [
      'Incapacitated, can’t move or speak, and is unaware of its surroundings; its weight increases ×10 and it stops aging.',
      'Automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against it have advantage; it has resistance to all damage.',
      'Immune to poison and disease (though existing effects are only suspended).',
    ],
  },
  {
    id: 'poisoned',
    name: 'Poisoned',
    description: 'A poisoned creature is afflicted by a toxin.',
    effects: ['Disadvantage on attack rolls and ability checks.'],
  },
  {
    id: 'prone',
    name: 'Prone',
    description: 'A prone creature is lying on the ground.',
    effects: [
      'Its only movement option is to crawl, unless it stands up (costs half its movement) and ends the condition.',
      'Disadvantage on attack rolls.',
      'Attacks against it have advantage if the attacker is within 5 feet, otherwise disadvantage.',
    ],
  },
  {
    id: 'restrained',
    name: 'Restrained',
    description: 'A restrained creature is bound or held fast.',
    effects: [
      'Speed becomes 0 and it gains no benefit to speed.',
      'Attack rolls against it have advantage; its own attack rolls have disadvantage.',
      'Disadvantage on Dexterity saving throws.',
    ],
  },
  {
    id: 'stunned',
    name: 'Stunned',
    description: 'A stunned creature is dazed and barely able to function.',
    effects: [
      'Incapacitated, can’t move, and can speak only falteringly.',
      'Automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against it have advantage.',
    ],
  },
  {
    id: 'unconscious',
    name: 'Unconscious',
    description: 'An unconscious creature is knocked out or asleep and unaware of its surroundings.',
    effects: [
      'Incapacitated, can’t move or speak.',
      'Drops whatever it’s holding and falls prone.',
      'Automatically fails Strength and Dexterity saving throws.',
      'Attack rolls against it have advantage; any attack that hits from within 5 feet is a critical hit.',
    ],
  },
];
