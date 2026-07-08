import type { SubclassDefinition } from '@solryn/shared-types';

// One SRD 2014 subclass per class (the SRD publishes exactly one each). Features are listed by
// the level they're gained, mirroring ClassLevel.features. Most are display/text on the sheet;
// the only one that touches combat math is Champion's Improved Critical / Superior Critical,
// which pcDerived turns into a crit threshold for attackRollVsAc. Chosen at the class's
// subclassLevel via the level-up flow (or the sheet, for L1/L2 classes).

export const subclasses: SubclassDefinition[] = [
  {
    id: 'berserker',
    name: 'Path of the Berserker',
    classId: 'barbarian',
    description: 'A barbarian who channels rage into an unstoppable frenzy of violence.',
    levels: [
      { level: 3, features: ['Frenzy'] },
      { level: 6, features: ['Mindless Rage'] },
      { level: 10, features: ['Intimidating Presence'] },
      { level: 14, features: ['Retaliation'] },
    ],
  },
  {
    id: 'college-of-lore',
    name: 'College of Lore',
    classId: 'bard',
    description: 'Bards whose knowledge and cutting wit make them masters of many skills.',
    levels: [
      { level: 3, features: ['Bonus Proficiencies', 'Cutting Words'] },
      { level: 6, features: ['Additional Magical Secrets'] },
      { level: 14, features: ['Peerless Skill'] },
    ],
  },
  {
    id: 'life-domain',
    name: 'Life Domain',
    classId: 'cleric',
    description: 'Clerics of the gods of life, healing, and vitality.',
    levels: [
      { level: 1, features: ['Bonus Proficiency', 'Disciple of Life'] },
      { level: 2, features: ['Channel Divinity: Preserve Life'] },
      { level: 6, features: ['Blessed Healer'] },
      { level: 8, features: ['Divine Strike'] },
      { level: 17, features: ['Supreme Healing'] },
    ],
  },
  {
    id: 'circle-of-the-land',
    name: 'Circle of the Land',
    classId: 'druid',
    description: 'Druids whose magic is drawn from a particular kind of land — forest, grassland, desert, and more.',
    levels: [
      { level: 2, features: ['Bonus Cantrip', 'Natural Recovery'] },
      { level: 3, features: ['Circle Spells'] },
      { level: 6, features: ["Land's Stride"] },
      { level: 10, features: ["Nature's Ward"] },
      { level: 14, features: ["Nature's Sanctuary"] },
    ],
  },
  {
    id: 'champion',
    name: 'Champion',
    classId: 'fighter',
    description: 'A fighter who relies on raw physical power honed to deadly perfection.',
    levels: [
      { level: 3, features: ['Improved Critical'] },
      { level: 7, features: ['Remarkable Athlete'] },
      { level: 10, features: ['Additional Fighting Style'] },
      { level: 15, features: ['Superior Critical'] },
      { level: 18, features: ['Survivor'] },
    ],
  },
  {
    id: 'open-hand',
    name: 'Way of the Open Hand',
    classId: 'monk',
    description: 'Monks who master unarmed combat and the flow of ki through the body.',
    levels: [
      { level: 3, features: ['Open Hand Technique'] },
      { level: 6, features: ['Wholeness of Body'] },
      { level: 11, features: ['Tranquility'] },
      { level: 17, features: ['Quivering Palm'] },
    ],
  },
  {
    id: 'oath-of-devotion',
    name: 'Oath of Devotion',
    classId: 'paladin',
    description: 'Paladins bound to the ideals of justice, virtue, and order.',
    levels: [
      { level: 3, features: ['Channel Divinity: Sacred Weapon', 'Channel Divinity: Turn the Unholy'] },
      { level: 7, features: ['Aura of Devotion'] },
      { level: 15, features: ['Purity of Spirit'] },
      { level: 20, features: ['Holy Nimbus'] },
    ],
  },
  {
    id: 'hunter',
    name: 'Hunter',
    classId: 'ranger',
    description: 'Rangers who protect the wilds by hunting the monsters that threaten it.',
    levels: [
      { level: 3, features: ["Hunter's Prey"] },
      { level: 7, features: ['Defensive Tactics'] },
      { level: 11, features: ['Multiattack'] },
      { level: 15, features: ["Superior Hunter's Defense"] },
    ],
  },
  {
    id: 'thief',
    name: 'Thief',
    classId: 'rogue',
    description: 'Rogues who hone the skills of stealth, larceny, and quick hands.',
    levels: [
      { level: 3, features: ['Fast Hands', 'Second-Story Work'] },
      { level: 9, features: ['Supreme Sneak'] },
      { level: 13, features: ['Use Magic Device'] },
      { level: 17, features: ["Thief's Reflexes"] },
    ],
  },
  {
    id: 'draconic-bloodline',
    name: 'Draconic Bloodline',
    classId: 'sorcerer',
    description: 'Sorcerers whose magic springs from draconic blood in their veins.',
    levels: [
      { level: 1, features: ['Dragon Ancestor', 'Draconic Resilience'] },
      { level: 6, features: ['Elemental Affinity'] },
      { level: 14, features: ['Dragon Wings'] },
      { level: 18, features: ['Draconic Presence'] },
    ],
  },
  {
    id: 'the-fiend',
    name: 'The Fiend',
    classId: 'warlock',
    description: 'Warlocks who forge a pact with a powerful fiend of the Lower Planes.',
    levels: [
      { level: 1, features: ["Dark One's Blessing"] },
      { level: 6, features: ["Dark One's Own Luck"] },
      { level: 10, features: ['Fiendish Resilience'] },
      { level: 14, features: ['Hurl Through Hell'] },
    ],
  },
  {
    id: 'school-of-evocation',
    name: 'School of Evocation',
    classId: 'wizard',
    description: 'Wizards who specialize in sculpting raw elemental destruction.',
    levels: [
      { level: 2, features: ['Evocation Savant', 'Sculpt Spells'] },
      { level: 6, features: ['Potent Cantrip'] },
      { level: 10, features: ['Empowered Evocation'] },
      { level: 14, features: ['Overchannel'] },
    ],
  },
];
