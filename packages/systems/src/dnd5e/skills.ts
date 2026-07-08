import type { Skill, SkillCategory } from '@solryn/shared-types';

// 5e skill proficiency is chosen from the class/background (not per-category like Solryn), so
// there is a single nominal category and the count comes from the class's skillChoices.
export const skillCategories: SkillCategory[] = [
  { id: 'skills', name: 'Skills', chooseAtCreation: 0 },
];

const sk = (id: string, name: string, attribute: string): Skill => ({
  id,
  name,
  categoryId: 'skills',
  attribute,
});

/** The 18 standard 5e skills, each tied to its governing ability (matching coreStats ids). */
export const skills: Skill[] = [
  sk('athletics', 'Athletics', 'STR'),
  sk('acrobatics', 'Acrobatics', 'DEX'),
  sk('sleight-of-hand', 'Sleight of Hand', 'DEX'),
  sk('stealth', 'Stealth', 'DEX'),
  sk('arcana', 'Arcana', 'INT'),
  sk('history', 'History', 'INT'),
  sk('investigation', 'Investigation', 'INT'),
  sk('nature', 'Nature', 'INT'),
  sk('religion', 'Religion', 'INT'),
  sk('animal-handling', 'Animal Handling', 'WIS'),
  sk('insight', 'Insight', 'WIS'),
  sk('medicine', 'Medicine', 'WIS'),
  sk('perception', 'Perception', 'WIS'),
  sk('survival', 'Survival', 'WIS'),
  sk('deception', 'Deception', 'CHA'),
  sk('intimidation', 'Intimidation', 'CHA'),
  sk('performance', 'Performance', 'CHA'),
  sk('persuasion', 'Persuasion', 'CHA'),
];
