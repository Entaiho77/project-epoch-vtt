import type { BackgroundDefinition } from '@solryn/shared-types';

// SRD 5.1 backgrounds. The strict SRD 5.1 contains only the *Acolyte* background; the PHB
// backgrounds were removed for commercial (CC-BY-4.0) cleanliness. Keep this list SRD-only.
// Structure: fixed skill proficiencies, tool/language grants, starting equipment, and a narrative
// Feature (text only — no combat mechanic). Skill ids match systems/dnd5e/skills.ts.

export const backgrounds: BackgroundDefinition[] = [
  {
    id: 'acolyte',
    name: 'Acolyte',
    description: 'You have spent your life in service to a temple, learning its rites and doctrines.',
    skillProficiencies: ['insight', 'religion'],
    languages: 2,
    equipment: ['Holy symbol', 'Prayer book or prayer wheel', '5 sticks of incense', 'Vestments', 'Common clothes', '15 gp'],
    feature: {
      name: 'Shelter of the Faithful',
      description: 'You and your companions can expect free healing and care at a temple of your faith, and you can call on priests of your faith for assistance (though you must provide any material components for spells).',
    },
  },
];
