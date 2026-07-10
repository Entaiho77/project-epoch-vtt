import type {
  Ancestry,
  ClassDefinition,
  FeatDefinition,
  RacialBreath,
  Subrace,
  SystemDefinition,
} from '@solryn/shared-types';
import type { Character } from '@solryn/shared-types';
import {
  armorClass,
  attackBonus,
  classLevel,
  computeModifier,
  cumulativeFeatures,
  maxHitPoints,
  proficiencyBonus,
  saveModifier,
  spellSlots,
} from '@solryn/engine';

/** The six 5e abilities, in display order (matches the 5e coreStats ids). */
export const ABILITY_IDS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;
export type AbilityId = (typeof ABILITY_IDS)[number];

/** The standard array, highest → lowest. */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

/** 5e AC from a worn armor's type + base value (shields are added separately, +2):
 *  light = base + DEX, medium = base + min(DEX, 2), heavy = base flat. */
function armorAcFromType(armorType: string, baseAc: number, dexMod: number): number {
  if (armorType === 'heavy') return baseAc;
  if (armorType === 'medium') return baseAc + Math.min(dexMod, 2);
  return baseAc + dexMod; // light (no cap)
}

const signed = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
/** Damage notation with an ability modifier folded in (no "+0"). */
const diceWithMod = (dice: string, mod: number) => (mod === 0 ? dice : `${dice}${signed(mod)}`);

/**
 * Assigned scores + racial ability bonuses (the live effective scores). Applies the base race's
 * and the subrace's fixed bonuses, plus any player-chosen flexible bonuses (Half-Elf's +1 to two
 * abilities), passed as a stat→amount map.
 */
export function effectiveScores(
  assigned: Record<string, number>,
  ancestry?: Ancestry,
  subrace?: Subrace,
  choices?: Record<string, number>,
): Record<string, number> {
  const out: Record<string, number> = { ...assigned };
  for (const b of [...(ancestry?.bonuses ?? []), ...(subrace?.bonuses ?? [])]) {
    if (b.kind === 'fixed') out[b.stat] = (out[b.stat] ?? 0) + b.amount;
  }
  for (const [stat, amount] of Object.entries(choices ?? {})) {
    out[stat] = (out[stat] ?? 0) + amount;
  }
  return out;
}

/** Dragonborn breath dice by character level (SRD: 2d6 → 5d6 at 6/11/16). */
function breathDice(level: number): string {
  return level >= 16 ? '5d6' : level >= 11 ? '4d6' : level >= 6 ? '3d6' : '2d6';
}

export interface PcDerived {
  cls?: ClassDefinition;
  /** Base class feature names gained up to the character's level (cumulative). */
  classFeatures: string[];
  scores: Record<string, number>;
  mods: Record<string, number>;
  proficiencyBonus: number;
  ac: number;
  maxHp: number;
  saves: { id: AbilityId; mod: number; proficient: boolean }[];
  skills: { id: string; name: string; ability?: string; mod: number }[];
  attacks: { name: string; dice: string; damageType: string; attackBonus: number }[];
  /** Rogue Sneak Attack dice at the character's level (e.g. "1d6"), if the class has it. */
  sneakAttackDice?: string;
  // --- Feats (5e) ---
  feats: FeatDefinition[];
  /** Active feat resources (Lucky, Healer) with their current/max. */
  featResources: { id: string; name: string; max: number; current: number }[];
  /** A power-attack toggle (Great Weapon Master / Sharpshooter): −toHit / +damage on weapons. */
  powerAttack?: { toHit: number; damage: number };
  // --- Subclass (5e) ---
  subclassName?: string;
  /** Subclass feature names gained up to the character's level. */
  subclassFeatures: string[];
  /** Natural-die crit threshold for weapon attacks (20 default; Champion 19 at L3, 18 at L15). */
  critThreshold: number;
  // --- Background (5e) ---
  backgroundName?: string;
  backgroundFeature?: { name: string; description: string };
  // --- Race (5e) ---
  raceName?: string;
  subraceName?: string;
  speed: number;
  /** Mechanical race/subrace trait strings for the sheet. */
  raceTraits: string[];
  /** Damage resistances (Dwarf poison, Dragonborn/Tiefling elemental). */
  resistances: string[];
  /** Dragonborn breath weapon, resolved for this level (dice + save DC). */
  breath?: RacialBreath & { dice: string; dc: number };
  /** Halfling Lucky — drives a manual reroll toggle on the sheet. */
  lucky: boolean;
  /** Spellcasting block — present only for caster classes; absent for martials. */
  spell?: {
    ability: string;
    model: 'known' | 'prepared' | 'spellbook';
    /** Max slots by slot level (1–9) at this level; current lives on play.spellSlots. */
    maxSlots: Record<number, number>;
    cantripsKnown: number;
    /** Spells known at this level (known casters); 0 for prepared/spellbook. */
    spellsKnown: number;
    /** Spells preparable per day (prepared/spellbook): ability mod + level, min 1. */
    preparedCount: number;
    /** Spell save DC = 8 + proficiency + ability mod. */
    saveDc: number;
    /** Spell attack bonus = proficiency + ability mod. */
    attackBonus: number;
  };
}

/**
 * Everything a 5e PC sheet needs, derived from the class + scores + equipment via the Phase A
 * progression module. The combat numbers (attackBonus / ac) are exactly what the
 * attackRollVsAc resolver consumes — no parallel PC combat path.
 */
export function pcDerived(system: SystemDefinition, character: Character): PcDerived {
  const rule = system.modifierRule;
  const cls = system.classes?.find((c) => c.id === character.definition.classId);
  const ancestry = system.ancestries.find((a) => a.id === character.definition.ancestryId);
  const subrace = ancestry?.subraces?.find((sr) => sr.id === character.definition.subraceId);
  const background = system.backgrounds?.find((b) => b.id === character.definition.backgroundId);
  const subclass = system.subclasses?.find(
    (sub) => sub.id === character.play.subclassId && sub.classId === character.definition.classId,
  );
  const level = character.play.level;

  // Feats (taken at level-up) add ability bonuses on top of the locked core scores. Half-feats
  // with a fixed stat apply directly; flexible +1s apply the player's stored choice.
  const ownedFeats = (character.play.featIds ?? [])
    .map((id) => system.feats?.find((f) => f.id === id))
    .filter((f): f is FeatDefinition => !!f);
  const scores: Record<string, number> = { ...character.definition.coreScores };
  for (const f of ownedFeats) {
    for (const b of f.effects?.abilityBonus ?? []) scores[b.ability] = (scores[b.ability] ?? 10) + b.amount;
    const choice = f.effects?.abilityChoice;
    const chosen = character.play.featChoices?.[f.id];
    if (choice && chosen && choice.from.includes(chosen)) scores[chosen] = (scores[chosen] ?? 10) + choice.amount;
  }

  const mods: Record<string, number> = {};
  for (const id of ABILITY_IDS) mods[id] = computeModifier(scores[id] ?? 10, rule);

  const pb = cls ? proficiencyBonus(cls, level) : 2;

  // Equipped inventory (Phase B2): looted armor sets the AC base, a shield adds +2, weapons add
  // to the attack list. Everything is derived here from the raw `equipped` flag — nothing stored.
  const equippedItems = Object.values(character.inventory ?? {}).filter((it) => it.equipped);
  const invArmor = equippedItems.find((it) => it.category === 'armor' && it.armorType !== 'shield');
  const invShield = equippedItems.some((it) => it.category === 'armor' && it.armorType === 'shield');

  const armor = system.equipment.armor.find((a) => a.id === character.play.equippedArmorId);
  const featAcBonus = ownedFeats.reduce((sum, f) => sum + (f.effects?.acBonus ?? 0), 0);
  // Base AC priority: equipped inventory armor > built-in worn armor > Unarmored Defense
  // (Barbarian/Monk) > plain 10 + DEX. A shield (+2) and any flat feat AC bonus stack on top.
  const baseAc =
    invArmor?.baseAc != null
      ? armorAcFromType(invArmor.armorType ?? 'light', invArmor.baseAc, mods.DEX)
      : armor?.baseAc != null
        ? armorClass(mods.DEX, { baseAc: armor.baseAc, maxDexBonus: armor.maxDexBonus })
        : cls?.unarmoredDefense
          ? 10 + mods.DEX + (mods[cls.unarmoredDefense.ability] ?? 0)
          : armorClass(mods.DEX);
  const ac = baseAc + (invShield ? 2 : 0) + featAcBonus;

  // Tough (+2 HP/level) and other per-level feat HP fold into the max.
  const featHpPerLevel = ownedFeats.reduce((sum, f) => sum + (f.effects?.hpPerLevel ?? 0), 0);
  const maxHp = (cls ? maxHitPoints(cls, level, mods.CON) : 0) + featHpPerLevel * level;

  const saves = ABILITY_IDS.map((id) => ({
    id,
    proficient: !!cls?.savingThrows.includes(id),
    mod: cls ? saveModifier(cls, id, mods[id], pb) : mods[id],
  }));

  // Proficient skills: the player's chosen skills plus any the race grants outright (e.g. Elf
  // Perception, Half-Orc Intimidation — the skill-typed entries in grantedProficiencies).
  const grantedProficiencies = [
    ...(ancestry?.grantedProficiencies ?? []),
    ...(subrace?.grantedProficiencies ?? []),
  ];
  const racialSkillIds = grantedProficiencies.filter((pid) =>
    system.skills.some((s) => s.id === pid),
  );
  // Background skills are always proficient too; the Set dedupes an overlap with a class/race
  // pick so a skill is only counted once (proficiency applied once).
  const proficientSkillIds = [
    ...new Set([
      ...character.definition.chosenSkillIds,
      ...racialSkillIds,
      ...(background?.skillProficiencies ?? []),
    ]),
  ];
  const skills = proficientSkillIds.map((sid) => {
    const sk = system.skills.find((s) => s.id === sid);
    const aMod = sk?.attribute ? (mods[sk.attribute] ?? 0) : 0;
    return { id: sid, name: sk?.name ?? sid, ability: sk?.attribute, mod: aMod + pb };
  });

  const builtinAttacks = character.play.equippedWeaponIds
    .map((wid) => system.equipment.weapons.find((w) => w.id === wid))
    .filter((w): w is NonNullable<typeof w> => !!w)
    .map((w) => {
      // Finesse → best of STR/DEX; pure ranged → DEX; melee → STR.
      const aMod = w.finesse ? Math.max(mods.STR, mods.DEX) : w.range ? mods.DEX : mods.STR;
      return {
        name: w.name,
        dice: diceWithMod(w.damageDice, aMod),
        damageType: w.damageType ?? '',
        attackBonus: attackBonus(aMod, pb), // proficient with class weapons
      };
    });

  // Equipped inventory weapons (Phase B2) join the attack list exactly like class weapons. Phase B2
  // assumes proficiency with all equipped weapons (pb applies). A versatile weapon shows its
  // two-handed dice only when nothing else occupies the off-hand (no other weapon and no shield).
  const equippedWeapons = equippedItems.filter((it) => it.category === 'weapon');
  const inventoryAttacks = equippedWeapons.map((w) => {
    const isFinesse = !!w.properties?.includes('finesse');
    const isRanged = w.weaponRange === 'ranged';
    // STR for non-finesse melee; DEX for ranged; finesse uses the better of STR/DEX.
    const aMod = isFinesse ? Math.max(mods.STR, mods.DEX) : isRanged ? mods.DEX : mods.STR;
    const offHandOccupied = equippedItems.some(
      (it) => it.id !== w.id && (it.category === 'weapon' || (it.category === 'armor' && it.armorType === 'shield')),
    );
    const twoHandedVersatile = !!w.properties?.includes('versatile') && !!w.versatileDamageDice && !offHandOccupied;
    const dice = twoHandedVersatile ? w.versatileDamageDice! : (w.damageDice ?? '');
    return {
      name: w.name,
      dice: diceWithMod(dice, aMod),
      damageType: w.damageType ?? '',
      attackBonus: attackBonus(aMod, pb),
    };
  });
  const attacks = [...builtinAttacks, ...inventoryAttacks];

  // Rogue Sneak Attack dice at this level (from the class table counters; SRD key snake_case).
  const sneakAttackDice = cls?.levels.find((l) => l.level === level)?.counters?.sneak_attack;

  // Spellcasting (caster classes only). Save DC / attack use the class's casting ability.
  const sc = cls?.spellcasting;
  const spell =
    sc && cls
      ? {
          ability: sc.ability,
          model: sc.type,
          maxSlots: spellSlots(cls, level),
          cantripsKnown: classLevel(cls, level).cantripsKnown ?? 0,
          spellsKnown: classLevel(cls, level).spellsKnown ?? 0,
          preparedCount: Math.max(1, (mods[sc.ability] ?? 0) + level),
          saveDc: 8 + pb + (mods[sc.ability] ?? 0),
          attackBonus: pb + (mods[sc.ability] ?? 0),
        }
      : undefined;

  // Subclass features gained up to this level, and the crit threshold they imply. Champion's
  // Improved Critical (L3) crits on 19–20; Superior Critical (L15) crits on 18–20.
  const subclassFeatures = subclass ? subclass.levels.filter((l) => l.level <= level).flatMap((l) => l.features) : [];
  const critThreshold = subclassFeatures.includes('Superior Critical')
    ? 18
    : subclassFeatures.includes('Improved Critical')
      ? 19
      : 20;

  const raceTraits = [...(ancestry?.traits ?? []), ...(subrace?.traits ?? [])];
  const resistances = [
    ...(ancestry?.resistances ?? []),
    ...(subrace?.resistances ?? []),
    ...ownedFeats.flatMap((f) => f.effects?.resistances ?? []),
  ];
  const featSpeedBonus = ownedFeats.reduce((sum, f) => sum + (f.effects?.speedBonus ?? 0), 0);
  // Active feat resources (Lucky, Healer) with their current count (default full).
  const featResources = ownedFeats
    .map((f) => f.effects?.resource)
    .filter((r): r is NonNullable<typeof r> => !!r)
    .map((r) => ({ ...r, current: character.play.featResources?.[r.id] ?? r.max }));
  // Power-attack toggle from Great Weapon Master / Sharpshooter (both −5 / +10).
  const powerAttack = ownedFeats.find((f) => f.effects?.powerAttack)?.effects?.powerAttack;
  // Breath weapon (subrace/draconic color wins). DC = 8 + CON mod + proficiency (SRD).
  const breathBase = subrace?.breath ?? ancestry?.breath;
  const breath = breathBase
    ? { ...breathBase, dice: breathDice(level), dc: 8 + mods.CON + pb }
    : undefined;

  // Base class features gained up to this level (SRD + homebrew classes alike).
  const classFeatures = cls ? cumulativeFeatures(cls, level) : [];

  return {
    cls,
    classFeatures,
    scores,
    mods,
    proficiencyBonus: pb,
    ac,
    maxHp,
    saves,
    skills,
    attacks,
    ...(typeof sneakAttackDice === 'string' ? { sneakAttackDice } : {}),
    feats: ownedFeats,
    featResources,
    ...(powerAttack ? { powerAttack } : {}),
    ...(subclass ? { subclassName: subclass.name } : {}),
    subclassFeatures,
    critThreshold,
    ...(background ? { backgroundName: background.name } : {}),
    ...(background?.feature ? { backgroundFeature: background.feature } : {}),
    ...(ancestry ? { raceName: ancestry.name } : {}),
    ...(subrace ? { subraceName: subrace.name } : {}),
    speed: (ancestry?.speed ?? 30) + featSpeedBonus,
    raceTraits,
    resistances,
    ...(breath ? { breath } : {}),
    lucky: !!ancestry?.lucky,
    ...(spell ? { spell } : {}),
  };
}

/**
 * The combat numbers to stamp onto a 5e PC's token so other users (the GM) can target it —
 * its AC (read when a monster attacks the PC) and max HP. Uses the same derivation as the sheet.
 */
export function pcTokenStats(system: SystemDefinition, character: Character): { ac: number; maxHp: number } {
  const d = pcDerived(system, character);
  return { ac: d.ac, maxHp: d.maxHp };
}
