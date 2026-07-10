import { describe, it, expect } from 'vitest';
import type { Character } from '@solryn/shared-types';
import { dnd5eSystem } from '../index';
import { spellSlots } from '@solryn/engine';
import { effectiveScores, pcDerived, pcTokenStats } from '../character';

// A standard-array Human Fighter: STR15 DEX13 CON14 INT10 WIS12 CHA8 (+1 all from Human).
const ASSIGNED = { STR: 15, DEX: 13, CON: 14, INT: 10, WIS: 12, CHA: 8 };

function humanFighter(): Character {
  const human = dnd5eSystem.ancestries.find((a) => a.id === 'human');
  const scores = effectiveScores(ASSIGNED, human);
  return {
    id: 'pc',
    gameId: 'g',
    ownerUserId: 'u',
    systemId: 'dnd5e',
    name: 'Aria',
    buildComplete: true,
    definition: { ancestryId: 'human', classId: 'fighter', coreScores: scores, chosenSkillIds: ['athletics'], knownSpellIds: [] },
    play: { level: 1, reputation: 'Unaligned', pools: { hp: { current: 12 } }, skills: {}, equippedWeaponIds: ['longsword'], equippedArmorId: 'chain-mail' },
  };
}

describe('5e Human Fighter (level 1) derivation', () => {
  it('Human applies +1 to all six abilities', () => {
    const scores = effectiveScores(ASSIGNED, dnd5eSystem.ancestries[0]);
    expect(scores).toEqual({ STR: 16, DEX: 14, CON: 15, INT: 11, WIS: 13, CHA: 9 });
  });

  const d = pcDerived(dnd5eSystem, humanFighter());

  it('ability modifiers', () => {
    expect(d.mods).toMatchObject({ STR: 3, DEX: 2, CON: 2, INT: 0, WIS: 1, CHA: -1 });
  });

  it('AC 16 from chain mail (heavy, no Dex)', () => {
    expect(d.ac).toBe(16);
  });

  it('HP 12 at level 1 (d10 max + CON +2)', () => {
    expect(d.maxHp).toBe(12);
  });

  it('proficiency bonus +2', () => {
    expect(d.proficiencyBonus).toBe(2);
  });

  it('saves: STR/CON proficient (+prof), others bare ability mod', () => {
    const byId = Object.fromEntries(d.saves.map((s) => [s.id, s]));
    expect(byId.STR).toMatchObject({ mod: 5, proficient: true }); // 3 + 2
    expect(byId.CON).toMatchObject({ mod: 4, proficient: true }); // 2 + 2
    expect(byId.DEX).toMatchObject({ mod: 2, proficient: false }); // bare
  });

  it('Longsword attack: STR mod + proficiency to hit, +STR damage', () => {
    const ls = d.attacks.find((a) => a.name === 'Longsword');
    expect(ls).toMatchObject({ attackBonus: 5, dice: '1d8+3', damageType: 'Slashing' });
  });

  it('chosen skill: ability mod + proficiency (Athletics = STR)', () => {
    const ath = d.skills.find((s) => s.id === 'athletics');
    expect(ath?.mod).toBe(5); // STR 3 + prof 2
  });
});

function pc(classId: string, scores: Record<string, number>, weaponIds: string[], armorId?: string): Character {
  return {
    id: 'pc', gameId: 'g', ownerUserId: 'u', systemId: 'dnd5e', name: 'X', buildComplete: true,
    definition: { ancestryId: 'human', classId, coreScores: scores, chosenSkillIds: [], knownSpellIds: [] },
    play: { level: 1, reputation: 'Unaligned', pools: {}, skills: {}, equippedWeaponIds: weaponIds, ...(armorId ? { equippedArmorId: armorId } : {}) },
  };
}

describe('martial distinctions', () => {
  it('Barbarian Unarmored Defense: AC 10 + DEX + CON with no armor', () => {
    // DEX 14 (+2), CON 15 (+2) → 10 + 2 + 2 = 14; greataxe (STR) attack
    const d = pcDerived(dnd5eSystem, pc('barbarian', { STR: 16, DEX: 14, CON: 15, INT: 10, WIS: 12, CHA: 10 }, ['greataxe']));
    expect(d.ac).toBe(14);
    expect(d.maxHp).toBe(14); // d12 + CON 2
    expect(d.attacks[0]).toMatchObject({ name: 'Greataxe', dice: '1d12+3', attackBonus: 5 });
  });

  it('Monk Unarmored Defense uses WIS', () => {
    const d = pcDerived(dnd5eSystem, pc('monk', { STR: 12, DEX: 16, CON: 12, INT: 10, WIS: 14, CHA: 10 }, ['quarterstaff']));
    expect(d.ac).toBe(10 + 3 + 2); // DEX +3, WIS +2 = 15
  });

  it('Rogue finesse: rapier uses DEX when higher, and exposes Sneak Attack dice', () => {
    // STR 10 (0), DEX 16 (+3) → finesse picks DEX; leather AC 11 + DEX 3 = 14
    const d = pcDerived(dnd5eSystem, pc('rogue', { STR: 10, DEX: 16, CON: 12, INT: 13, WIS: 10, CHA: 10 }, ['rapier', 'shortbow'], 'leather-armor'));
    expect(d.ac).toBe(14);
    const rapier = d.attacks.find((a) => a.name === 'Rapier');
    expect(rapier).toMatchObject({ dice: '1d8+3', attackBonus: 5 }); // DEX +3 + prof 2
    expect(d.sneakAttackDice).toBe('1d6');
  });

  it('Fighter regression: armored AC 16 and STR longsword unchanged', () => {
    const d = pcDerived(dnd5eSystem, pc('fighter', { STR: 16, DEX: 14, CON: 15, INT: 11, WIS: 13, CHA: 9 }, ['longsword'], 'chain-mail'));
    expect(d.ac).toBe(16);
    expect(d.attacks[0]).toMatchObject({ name: 'Longsword', dice: '1d8+3', attackBonus: 5 });
  });
});

// A level-1 Fighter of a given race; coreScores are the effective scores (as locked at build).
function raceChar(
  ancestryId: string,
  coreScores: Record<string, number>,
  extra: { subraceId?: string; ancestryChoices?: Record<string, number>; chosenSkillIds?: string[] } = {},
  level = 1,
): Character {
  return {
    id: 'pc', gameId: 'g', ownerUserId: 'u', systemId: 'dnd5e', name: 'X', buildComplete: true,
    definition: { ancestryId, classId: 'fighter', coreScores, chosenSkillIds: [], knownSpellIds: [], ...extra },
    play: { level, reputation: 'Unaligned', pools: {}, skills: {}, equippedWeaponIds: ['longsword'], equippedArmorId: 'chain-mail' },
  };
}
const BASE = { STR: 14, DEX: 12, CON: 13, INT: 10, WIS: 11, CHA: 8 };
const race = (id: string) => dnd5eSystem.ancestries.find((a) => a.id === id);

describe('5e races', () => {
  it('Dwarf: +2 CON and poison resistance; Hill Dwarf adds +1 WIS', () => {
    const scores = effectiveScores(BASE, race('dwarf'), race('dwarf')?.subraces?.[0]);
    expect(scores.CON).toBe(15); // 13 + 2
    expect(scores.WIS).toBe(12); // 11 + 1 (Hill Dwarf)
    const d = pcDerived(dnd5eSystem, raceChar('dwarf', scores, { subraceId: 'hill-dwarf' }));
    expect(d.resistances).toContain('Poison');
    expect(d.raceName).toBe('Dwarf');
    expect(d.subraceName).toBe('Hill Dwarf');
  });

  it('Elf: Keen Senses grants Perception proficiency automatically', () => {
    const scores = effectiveScores(BASE, race('elf'));
    const d = pcDerived(dnd5eSystem, raceChar('elf', scores)); // no chosen skills
    const perception = d.skills.find((sk) => sk.id === 'perception');
    expect(perception).toBeDefined();
    expect(perception?.mod).toBe(computeWis(scores) + d.proficiencyBonus);
  });

  it('Half-Elf: +2 CHA fixed and +1 to two chosen abilities', () => {
    const scores = effectiveScores(BASE, race('half-elf'), undefined, { STR: 1, DEX: 1 });
    expect(scores.CHA).toBe(10); // 8 + 2 fixed
    expect(scores.STR).toBe(15); // 14 + 1 chosen
    expect(scores.DEX).toBe(13); // 12 + 1 chosen
    expect(scores.CON).toBe(13); // unchanged
  });

  it('Half-Elf: two chosen skills become proficient', () => {
    const scores = effectiveScores(BASE, race('half-elf'), undefined, { STR: 1, CON: 1 });
    const d = pcDerived(dnd5eSystem, raceChar('half-elf', scores, { chosenSkillIds: ['persuasion', 'insight'] }));
    expect(d.skills.map((sk) => sk.id).sort()).toEqual(['insight', 'persuasion']);
  });

  it('Dragonborn: breath weapon damage type, area, and DC = 8 + CON + prof', () => {
    // Red draconic ancestry → Fire, 15 ft cone. CON 13 (+1), prof +2 → DC 11.
    const scores = effectiveScores(BASE, race('dragonborn')); // +2 STR, +1 CHA (CON unchanged 13)
    const d = pcDerived(dnd5eSystem, raceChar('dragonborn', scores, { subraceId: 'red' }));
    expect(d.breath).toMatchObject({ damageType: 'Fire', shape: 'cone', size: 15, dice: '2d6', dc: 11 });
    expect(d.resistances).toContain('Fire');
  });

  it('Dragonborn breath dice scale with level (4d6 at 11th)', () => {
    const scores = effectiveScores(BASE, race('dragonborn'));
    const d = pcDerived(dnd5eSystem, raceChar('dragonborn', scores, { subraceId: 'blue' }, 11));
    expect(d.breath?.dice).toBe('4d6');
    expect(d.breath).toMatchObject({ damageType: 'Lightning', shape: 'line', size: 30 });
  });
});

function computeWis(scores: Record<string, number>): number {
  return Math.floor((scores.WIS - 10) / 2);
}

const cls = (id: string) => dnd5eSystem.classes!.find((c) => c.id === id)!;
function classChar(classId: string, scores: Record<string, number>, level = 1): Character {
  return {
    id: 'pc', gameId: 'g', ownerUserId: 'u', systemId: 'dnd5e', name: 'X', buildComplete: true,
    definition: { ancestryId: 'human', classId, coreScores: scores, chosenSkillIds: [], knownSpellIds: [] },
    play: { level, reputation: 'Unaligned', pools: {}, skills: {}, equippedWeaponIds: [] },
  };
}

describe('5e spell slots + caster model', () => {
  it('Wizard L1: 2 first-level slots (spellbook model)', () => {
    expect(spellSlots(cls('wizard'), 1)).toEqual({ 1: 2 });
    expect(cls('wizard').spellcasting?.type).toBe('spellbook');
  });

  it('Cleric L3: 4×1st + 2×2nd (prepared model)', () => {
    expect(spellSlots(cls('cleric'), 3)).toEqual({ 1: 4, 2: 2 });
    expect(cls('cleric').spellcasting?.type).toBe('prepared');
  });

  it('Paladin (half-caster): no slots at L1, 2×1st at L2', () => {
    expect(spellSlots(cls('paladin'), 1)).toEqual({});
    expect(spellSlots(cls('paladin'), 2)).toEqual({ 1: 2 });
  });

  it('Fighter (non-caster): empty slots and no spell block on the sheet', () => {
    expect(spellSlots(cls('fighter'), 5)).toEqual({});
    const d = pcDerived(dnd5eSystem, classChar('fighter', { STR: 16, DEX: 14, CON: 15, INT: 10, WIS: 12, CHA: 8 }, 5));
    expect(d.spell).toBeUndefined();
  });

  it('Cleric prepared count = WIS mod + level (min 1); DC = 8 + prof + WIS', () => {
    // Cleric L3, WIS 16 (+3), prof +2 → prepared 3 + 3 = 6, save DC 8 + 2 + 3 = 13.
    const d = pcDerived(dnd5eSystem, classChar('cleric', { STR: 10, DEX: 12, CON: 12, INT: 10, WIS: 16, CHA: 10 }, 3));
    expect(d.spell?.model).toBe('prepared');
    expect(d.spell?.preparedCount).toBe(6);
    expect(d.spell?.saveDc).toBe(13);
    expect(d.spell?.maxSlots).toEqual({ 1: 4, 2: 2 });
  });

  it('Warlock Pact Magic: all slots at a single (rising) level, 1–4 by character level', () => {
    // Single-level record at every level: L1 1×1st, L2 2×1st, L5 2×3rd, L11 3×5th, L17 4×5th.
    expect(spellSlots(cls('warlock'), 1)).toEqual({ 1: 1 });
    expect(spellSlots(cls('warlock'), 2)).toEqual({ 1: 2 });
    expect(spellSlots(cls('warlock'), 5)).toEqual({ 3: 2 });
    expect(spellSlots(cls('warlock'), 11)).toEqual({ 5: 3 });
    expect(spellSlots(cls('warlock'), 17)).toEqual({ 5: 4 });
    // Exactly one slot level at any level (the pact level).
    for (const lvl of [1, 3, 7, 15, 20]) {
      expect(Object.keys(spellSlots(cls('warlock'), lvl))).toHaveLength(1);
    }
  });
});

describe('5e backgrounds (SRD 5.1)', () => {
  it('only the SRD Acolyte background is present', () => {
    expect(dnd5eSystem.backgrounds?.length).toBe(1);
    expect(dnd5eSystem.backgrounds?.[0]?.id).toBe('acolyte');
  });

  it('Acolyte grants Insight + Religion (fixed skills)', () => {
    const acolyte = dnd5eSystem.backgrounds?.find((b) => b.id === 'acolyte');
    expect(acolyte?.skillProficiencies).toEqual(['insight', 'religion']);
    expect(acolyte?.feature?.name).toBe('Shelter of the Faithful');
  });

  it('background skill proficiencies are added to pcDerived, alongside class picks', () => {
    // Fighter with a chosen class skill (athletics) + Acolyte background (insight, religion).
    const c = classChar('fighter', { STR: 16, DEX: 14, CON: 15, INT: 12, WIS: 12, CHA: 8 }, 1);
    c.definition.chosenSkillIds = ['athletics'];
    c.definition.backgroundId = 'acolyte';
    const d = pcDerived(dnd5eSystem, c);
    const ids = d.skills.map((sk) => sk.id).sort();
    expect(ids).toEqual(['athletics', 'insight', 'religion']);
    expect(d.backgroundName).toBe('Acolyte');
    expect(d.backgroundFeature?.name).toBe('Shelter of the Faithful');
  });

  it('a background skill overlapping a class pick is counted once', () => {
    // Cleric picks Religion from its list; Acolyte background also grants Religion.
    const c = classChar('cleric', { STR: 10, DEX: 12, CON: 14, INT: 10, WIS: 16, CHA: 12 }, 1);
    c.definition.chosenSkillIds = ['religion'];
    c.definition.backgroundId = 'acolyte';
    const d = pcDerived(dnd5eSystem, c);
    // religion appears once (insight from Acolyte + religion once).
    expect(d.skills.filter((sk) => sk.id === 'religion')).toHaveLength(1);
    expect(d.skills.map((sk) => sk.id).sort()).toEqual(['insight', 'religion']);
  });
});

describe('class skill choices (SRD 5.2.1)', () => {
  it('Bard: any 3 skills', () => {
    expect(cls('bard').skillChoices).toEqual({ choose: 3, from: 'any' });
  });
  it('Fighter: choose 2, list includes Persuasion', () => {
    expect(cls('fighter').skillChoices.choose).toBe(2);
    expect(cls('fighter').skillChoices.from).toContain('persuasion');
  });
  it('Paladin: choose 2 from the six-skill list', () => {
    expect(cls('paladin').skillChoices).toEqual({
      choose: 2,
      from: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
    });
  });
  it('Ranger: choose 3', () => {
    expect(cls('ranger').skillChoices.choose).toBe(3);
    expect(cls('ranger').skillChoices.from).toEqual(
      ['animal-handling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
    );
  });
  it('Barbarian (unchanged): still choose 2 from its own list', () => {
    expect(cls('barbarian').skillChoices.choose).toBe(2);
    expect(cls('barbarian').skillChoices.from).not.toBe('any');
  });
});

describe('pcTokenStats — AC stamped onto the PC token for click-to-target', () => {
  it('exposes the same AC + max HP as the sheet (Human Fighter in chain mail)', () => {
    const c = humanFighter();
    const d = pcDerived(dnd5eSystem, c);
    expect(pcTokenStats(dnd5eSystem, c)).toEqual({ ac: d.ac, maxHp: d.maxHp });
    expect(pcTokenStats(dnd5eSystem, c).ac).toBe(16); // a GM attacking this PC reads AC 16
  });

  it('tracks Unarmored Defense (Barbarian AC 14, no armor)', () => {
    const barb = pc('barbarian', { STR: 16, DEX: 14, CON: 15, INT: 10, WIS: 12, CHA: 10 }, ['greataxe']);
    expect(pcTokenStats(dnd5eSystem, barb).ac).toBe(14);
  });
});
