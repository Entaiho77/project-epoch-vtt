import { describe, it, expect } from 'vitest';
import {
  homebrewBackgroundToBackground,
  homebrewClassToClassDefinition,
  homebrewFeatToFeat,
  homebrewRaceToAncestry,
  withHomebrewOptions,
  type HomebrewBackground,
  type HomebrewClass,
  type HomebrewFeat,
  type HomebrewPlayerOptions,
  type HomebrewRace,
} from '../homebrew';
import { dnd5eSystem } from '@solryn/systems/dnd5e/index';
import { effectiveScores, pcDerived } from '@solryn/systems/dnd5e/character';
import { spellSlots } from '@solryn/engine';
import type { Character } from '@solryn/shared-types';

const race: HomebrewRace = {
  id: 'stoneborn',
  name: 'Stoneborn',
  description: 'Living granite.',
  size: 'Medium',
  speed: 25,
  abilityBonuses: { str: 2, con: 1 },
  darkvision: 60,
  traits: { t0: { name: 'Stone Skin', description: '+1 AC while unarmored.' } },
};

const klass: HomebrewClass = {
  id: 'warden',
  name: 'Warden',
  description: 'Nature guardian.',
  hitDie: 10,
  primaryAbility: 'STR',
  savingThrows: ['CON', 'WIS'],
  armorProficiencies: ['light', 'medium', 'shields', 'none'],
  weaponProficiencies: 'Simple weapons',
  skillChoiceCount: 2,
  skillChoiceList: ['athletics', 'perception'],
  spellcasting: { ability: 'WIS', casterType: 'full' },
  unarmoredDefense: { formula: 'DEX+CON' },
  subclassLevel: 3,
  startingEquipment: 'A spear and a shield',
  features: {
    a: { level: 1, name: 'Nature Bond', description: 'Commune with the wild.' },
    b: { level: 3, name: 'Guardian Form', description: 'Assume a beastly shape.' },
  },
};

const feat: HomebrewFeat = {
  id: 'ironhide',
  name: 'Ironhide',
  description: 'Your skin toughens.',
  prerequisiteAbility: 'CON',
  prerequisiteScore: 13,
  abilityBonus: { con: 1 },
  displayOnly: false,
};

const background: HomebrewBackground = {
  id: 'wanderer',
  name: 'Wanderer',
  description: 'A life on the road.',
  skillProficiencies: ['survival', 'stealth'],
  toolLanguageProficiencies: "Cartographer's tools",
  featureName: 'Trail Sense',
  featureDescription: 'You always know true north.',
};

const options: HomebrewPlayerOptions = {
  races: { [race.id]: race },
  classes: { [klass.id]: klass },
  feats: { [feat.id]: feat },
  backgrounds: { [background.id]: background },
};

describe('homebrew race → Ancestry', () => {
  const a = homebrewRaceToAncestry(race);
  it('normalizes ability bonuses to fixed StatBonus with uppercase ids', () => {
    expect(a.bonuses).toEqual([
      { kind: 'fixed', stat: 'STR', amount: 2 },
      { kind: 'fixed', stat: 'CON', amount: 1 },
    ]);
  });
  it('carries size/speed and surfaces darkvision + traits as strings', () => {
    expect(a.size).toBe('Medium');
    expect(a.speed).toBe(25);
    expect(a.traits).toEqual(['Darkvision 60 ft.', 'Stone Skin: +1 AC while unarmored.']);
  });
  it('bakes into effective scores exactly like an SRD race', () => {
    const scores = effectiveScores({ STR: 15, DEX: 12, CON: 13, INT: 10, WIS: 10, CHA: 8 }, a);
    expect(scores.STR).toBe(17);
    expect(scores.CON).toBe(14);
  });
});

describe('homebrew class → ClassDefinition', () => {
  const c = homebrewClassToClassDefinition(klass);
  it('has a full 1–20 table with correct proficiency bonus + ASI levels', () => {
    expect(c.levels).toHaveLength(20);
    expect(c.levels.find((l) => l.level === 1)!.proficiencyBonus).toBe(2);
    expect(c.levels.find((l) => l.level === 5)!.proficiencyBonus).toBe(3);
    expect(c.levels.find((l) => l.level === 17)!.proficiencyBonus).toBe(6);
    expect(c.levels.filter((l) => l.abilityScoreImprovement).map((l) => l.level)).toEqual([4, 8, 12, 16, 19]);
  });
  it('maps hit die, uppercased saves, and drops the "none" armor sentinel', () => {
    expect(c.hitDie).toBe('d10');
    expect(c.savingThrows).toEqual(['CON', 'WIS']);
    expect(c.proficiencies.armor).toEqual(['light', 'medium', 'shields']);
  });
  it('groups features by level (cumulative through the table)', () => {
    expect(c.levels.find((l) => l.level === 1)!.features).toEqual(['Nature Bond']);
    expect(c.levels.find((l) => l.level === 3)!.features).toEqual(['Guardian Form']);
  });
  it('uses the full-caster slot table keyed by the class ability', () => {
    expect(c.spellcasting).toEqual({ ability: 'WIS', type: 'prepared' });
    expect(spellSlots(c, 1)).toEqual({ 1: 2 });
    expect(spellSlots(c, 5)).toEqual({ 1: 4, 2: 3, 3: 2 });
  });
  it('maps the unarmored-defense formula to its ability', () => {
    expect(c.unarmoredDefense).toEqual({ ability: 'CON' });
    expect(homebrewClassToClassDefinition({ ...klass, unarmoredDefense: { formula: 'DEX+WIS' } }).unarmoredDefense).toEqual({ ability: 'WIS' });
  });
  it('does not wire a subclass (homebrew subclasses are out of scope)', () => {
    expect(c.subclassLevel).toBeUndefined();
    expect(c.subclasses).toBeUndefined();
  });
});

describe('homebrew feat → FeatDefinition', () => {
  const f = homebrewFeatToFeat(feat);
  it('carries the structured prerequisite and fixed ability bonus', () => {
    expect(f.requires).toEqual({ ability: 'CON', min: 13 });
    expect(f.effects?.abilityBonus).toEqual([{ ability: 'CON', amount: 1 }]);
  });
  it('marks display-only feats', () => {
    expect(homebrewFeatToFeat({ ...feat, displayOnly: true }).displayOnly).toBe(true);
  });
});

describe('homebrew background → BackgroundDefinition', () => {
  const b = homebrewBackgroundToBackground(background);
  it('keeps skill proficiencies and the narrative feature', () => {
    expect(b.skillProficiencies).toEqual(['survival', 'stealth']);
    expect(b.feature).toEqual({ name: 'Trail Sense', description: 'You always know true north.' });
    expect(b.toolProficiencies).toEqual(["Cartographer's tools"]);
  });
});

describe('withHomebrewOptions', () => {
  it('folds homebrew into the system lists alongside SRD content', () => {
    const sys = withHomebrewOptions(dnd5eSystem, options);
    expect(sys.ancestries.some((a) => a.id === 'stoneborn')).toBe(true);
    expect(sys.classes?.some((c) => c.id === 'warden')).toBe(true);
    expect(sys.feats?.some((f) => f.id === 'ironhide')).toBe(true);
    expect(sys.backgrounds?.some((b) => b.id === 'wanderer')).toBe(true);
    // SRD content is preserved.
    expect(sys.feats?.some((f) => f.id === 'grappler')).toBe(true);
    expect(sys.classes!.length).toBe((dnd5eSystem.classes?.length ?? 0) + 1);
  });
  it('returns the system unchanged when there are no options', () => {
    expect(withHomebrewOptions(dnd5eSystem, undefined)).toBe(dnd5eSystem);
    expect(withHomebrewOptions(dnd5eSystem, {})).toBe(dnd5eSystem);
  });
});

describe('pcDerived with homebrew options', () => {
  const sys = withHomebrewOptions(dnd5eSystem, options);
  // Scores already include the race bonus (baked at build via effectiveScores), like SRD races.
  const baked = effectiveScores({ STR: 15, DEX: 14, CON: 13, INT: 10, WIS: 12, CHA: 8 }, homebrewRaceToAncestry(race));
  const character: Character = {
    id: 'pc', gameId: 'g', ownerUserId: 'u', systemId: 'dnd5e', name: 'W', buildComplete: true,
    definition: { ancestryId: 'stoneborn', classId: 'warden', backgroundId: 'wanderer', coreScores: baked, chosenSkillIds: ['athletics'], knownSpellIds: [] },
    play: { level: 5, reputation: 'Unaligned', pools: {}, skills: {}, featIds: ['ironhide'], equippedWeaponIds: [] },
  };
  const d = pcDerived(sys, character);

  it('applies the homebrew class hit die, saves, speed, and cumulative features', () => {
    // d10: L1 10+CON, +avg(6)+CON per level. CON here: baked 13 +1 race +1 feat = 15 (+2).
    expect(d.maxHp).toBe(10 + 2 + 4 * (6 + 2));
    expect(d.saves.find((s) => s.id === 'CON')!.proficient).toBe(true);
    expect(d.saves.find((s) => s.id === 'WIS')!.proficient).toBe(true);
    expect(d.speed).toBe(25);
    expect(d.classFeatures).toEqual(['Nature Bond', 'Guardian Form']); // L1 + L3, at level 5
  });
  it('folds the homebrew feat ability bonus into scores and lists the feat', () => {
    expect(d.scores.CON).toBe(15); // 13 baked + 1 race + 1 feat
    expect(d.feats.some((f) => f.id === 'ironhide')).toBe(true);
  });
  it('applies the homebrew background skill proficiency and race traits', () => {
    expect(d.skills.some((s) => s.id === 'survival')).toBe(true);
    expect(d.raceTraits).toContain('Darkvision 60 ft.');
  });
  it('produces a spellcasting block from the full-caster table keyed to WIS', () => {
    expect(d.spell?.ability).toBe('WIS');
    expect(d.spell?.maxSlots).toEqual(spellSlots(d.cls!, 5));
    expect(d.spell?.saveDc).toBe(8 + d.proficiencyBonus + d.mods.WIS);
  });
});
