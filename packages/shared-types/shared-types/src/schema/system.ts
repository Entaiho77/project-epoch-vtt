/**
 * SYSTEM-DEFINITION SCHEMA — the heart of the product.
 *
 * A "system" is data the app reads. Solryn is the first filled-in copy. Every screen
 * (sheet, builder, board, rules reference) reads "the current system's data" instead of
 * hardcoding any one game's rules. Getting this shape right matters more than any
 * screen's polish: the schema is the product, Solryn is the test that proves it.
 *
 * Design rule while extending this: prefer expressing a thing as PARAMETERS (data) read
 * by a generic engine path. Only reach for a new mechanical MODE (see modes.ts) when a
 * thing genuinely needs new engine logic. Never encode "Solryn is the only possibility".
 */

import type { Expr } from './expr';
import type { SystemModes } from './modes';

/** Semantic colors from the visual language (§6); used to tag data for the UI. */
export type SemanticColor = 'teal' | 'amber' | 'purple' | 'red' | 'neutral';

// --- Core stats -------------------------------------------------------------

export interface CoreStat {
  /** Stable id used in formulas and character data (e.g. "STR"). */
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  /** Dice expression rolled for this stat at creation (e.g. "2d4"). */
  roll: string;
}

/**
 * How a raw score maps to a modifier. A MODE-like choice expressed as parameters so the
 * engine stays generic.
 * - `linear-step` — Solryn: "every N points = +M from 0, optional cap" → floor(score/N)·M.
 * - `ability-modifier` — D&D 5e: floor((score − baseline) / pointsPerStep), baseline 10, step 2.
 */
export type ModifierRule =
  | {
      type: 'linear-step';
      /** Points per +1 step (Solryn: 3). */
      pointsPerStep: number;
      /** Bonus granted per step (Solryn: 1). */
      bonusPerStep: number;
      /** Optional cap on the modifier; null = no cap (Solryn). */
      cap: number | null;
    }
  | {
      type: 'ability-modifier';
      /** Score that yields a +0 modifier (5e: 10). */
      baseline: number;
      /** Points above/below baseline per ±1 (5e: 2). */
      pointsPerStep: number;
    };

// --- Derived stats ----------------------------------------------------------

/**
 * A value computed from core stats (+ sometimes equipment) via a formula tree.
 * "Show, don't ask": the builder displays the number + its equation breakdown.
 */
export interface DerivedStat {
  id: string;
  name: string;
  abbreviation?: string;
  /** Teaching "why": shown inline in the builder / rules reference. */
  description: string;
  compute:
    | { type: 'value'; expr: Expr }
    /** A per-use roll (e.g. Initiative = d20 + Nim mod); we store/display the modifier. */
    | { type: 'roll'; die: string; modifier: Expr };
  /** Pulls from gear, so it shows partial in the builder until step 13 (DR, Speed). */
  dependsOnEquipment?: boolean;
  /** Refreshed during the level-up ceremony (most derived values). */
  recalcOnLevelUp?: boolean;
  /** Doubles as a current/max resource tracker on the sheet (HP, Arcana, Luck). */
  resourcePool?: boolean;
  color?: SemanticColor;
  /** Optional unit shown after the number (e.g. "ft", "lbs"). */
  unit?: string;
}

// --- Ancestry (Solryn calls these "races") ----------------------------------

/** A stat bonus that may be fixed or a player choice (flexible-bonus ancestries). */
export type StatBonus =
  | { kind: 'fixed'; stat: string; amount: number }
  | {
      kind: 'choice';
      /** Amount applied to each chosen stat. */
      amount: number;
      /** How many stats the player picks. */
      count: number;
      /** Restrict choices to these stat ids; omit = any stat. */
      from?: string[];
      /** Chosen stats must be distinct (default true). */
      distinct?: boolean;
    };

/** A rollable racial breath weapon (Dragonborn). Dice scale by level; DC = 8 + CON + prof. */
export interface RacialBreath {
  /** Damage type, e.g. "Fire" / "Cold" / "Acid" (set by draconic ancestry). */
  damageType: string;
  /** Area shape — cone (15 ft) or line (30 ft). */
  shape: 'cone' | 'line';
  /** Area size in feet. */
  size: number;
}

/** A subrace option (5e). Carries its own ability bonuses, traits, and grants on top of the
 *  base race. Solryn ancestries never use these. */
export interface Subrace {
  id: string;
  name: string;
  description?: string;
  /** Additional ability bonuses (stacked onto the base race's). */
  bonuses?: StatBonus[];
  /** Extra mechanical trait strings shown on the sheet. */
  traits?: string[];
  /** Extra granted proficiency ids (skill/tool/weapon). */
  grantedProficiencies?: string[];
  /** Extra damage resistances. */
  resistances?: string[];
  /** A breath weapon granted by this option (Dragonborn draconic ancestry). */
  breath?: RacialBreath;
}

export interface Ancestry {
  id: string;
  name: string;
  lifespan?: string;
  /** Plain-language summary of the bonus line (for the card). */
  bonusSummary: string;
  /** Machine-readable bonuses applied to the live stat preview. */
  bonuses: StatBonus[];
  /** Recorded at creation, mechanized in play (not at creation). */
  advantages: string[];
  weaknesses: string[];
  /** Narrative flavor for the race-detail panel. Optional and rendered only when present —
   * the canonical v1.2 ruleset doesn't enumerate it yet; fill it in later and the side
   * panel lights up automatically (no code change needed). */
  flavor?: string;
  /** Author flag: representative content pending the canonical ruleset. */
  provisional?: boolean;

  // --- Class-and-level race fields (5e). Optional; Solryn ancestries omit them. ---
  /** Base walking speed in feet (5e race trait). */
  speed?: number;
  /** Size category, e.g. "Medium" / "Small". */
  size?: string;
  /** Mechanical race traits as display strings (Darkvision, resistances, etc.). */
  traits?: string[];
  /** Proficiencies granted by the race (weapon/skill/tool ids). */
  grantedProficiencies?: string[];
  /** Machine-readable damage resistances (surfaced distinctly on the sheet, not just text). */
  resistances?: string[];
  /** A rollable breath weapon on the base race (Dragonborn; usually set via subrace/color). */
  breath?: RacialBreath;
  /** Race grants a choice of skill proficiencies chosen at build (Half-Elf: choose 2). */
  raceSkillChoices?: { choose: number; from: 'any' | string[] };
  /** Halfling Lucky — surfaced as a manual reroll toggle/note on the sheet. */
  lucky?: boolean;
  /** Subraces / ancestry-color choices (Dwarf, Elf, Halfling, Gnome, Dragonborn). */
  subraces?: Subrace[];
}

// --- Skills -----------------------------------------------------------------

export interface SkillCategory {
  id: string;
  name: string;
  /** How many to choose at character creation (Solryn: base 3, weapon 3, crafting 1). */
  chooseAtCreation: number;
}

export interface Skill {
  id: string;
  name: string;
  categoryId: string;
  /** Hover tooltip text (build-time teaching). Optional — canonical blurbs pending. */
  description?: string;
  /** Concrete in-play example (hover). Optional — canonical blurbs pending. */
  exampleUse?: string;
  /** Optional governing core-stat id. */
  attribute?: string;
  /** Not chosen at creation (e.g. Action Economy skills, level 2+). */
  creationExcluded?: boolean;
  /**
   * Tasks this skill gates (harvest/crafting). Solryn rule: no skill = no roll.
   * e.g. "skinning", "foraging". Used by the universal harvest mechanic.
   */
  gates?: string[];
}

// --- Spells -----------------------------------------------------------------

export type SpellType = 'offensive' | 'utility';

export interface Spell {
  id: string;
  name: string;
  type: SpellType;
  /** Short blurb shown in context. Optional — canonical spell text pending. */
  synopsis?: string;
  /** Damage dice, or null for non-damage/utility spells. */
  damageDice: string | null;
  /** Damage type for offensive spells (fire, cold, necrotic, …). */
  damageType?: string;
  /** Resource cost in the casting pool (Solryn: Arcana points; base 0). */
  cost: number;
  range: string;
  duration: string;
  provisional?: boolean;
}

/** 5e spell damage scaling: base dice keyed by slot level (leveled spells) or by the caster's
 *  character level (cantrips). Exactly one map is present on a damage spell. */
export interface SpellScaling {
  /** e.g. { "3": "8d6", "4": "9d6", … } — dice when cast with a slot of that level. */
  bySlotLevel?: Record<string, string>;
  /** e.g. { "1": "1d10", "5": "2d10", … } — cantrip dice at that character level. */
  byCharacterLevel?: Record<string, string>;
}

/**
 * A 5e spell. Extends the engine Spell so the full SRD list can populate
 * SystemDefinition.spells with no change to Solryn (whose own Spell data is untouched). The
 * inherited fields carry sensible 5e values — `type` derived from whether it deals damage,
 * `damageDice` the base-level dice, `cost` 0 (5e uses slots, tracked later in G3). Everything
 * below is the additive 5e data that the casting UI (G2), sheet (G3), and upcasting (G4) read.
 */
export interface Dnd5eSpell extends Spell {
  /** 0 = cantrip, 1–9 = spell level. */
  level: number;
  school: string;
  castingTime: string;
  /** Verbal / Somatic / Material component flags. */
  components: { v: boolean; s: boolean; m: boolean };
  /** Material component text, when the spell has one. */
  material?: string;
  concentration: boolean;
  ritual: boolean;
  /** Class ids whose spell list includes this spell (e.g. ['wizard', 'sorcerer']). */
  classes: string[];
  /** Full rules text (joined paragraphs). */
  description: string;
  /** Higher-level / upcasting text; absent for spells that don't scale. */
  higherLevel?: string;
  /** Saving-throw ability the target rolls (e.g. 'DEX'); absent = no save. */
  save?: string;
  /** Outcome on a successful save ('half' | 'none' | …). */
  saveSuccess?: string;
  /** Attack-roll type for attack-roll spells; absent = no attack roll. */
  attackType?: 'ranged' | 'melee';
  /** Base-damage scaling table; absent for non-damage spells. */
  scaling?: SpellScaling;
}

// --- Equipment --------------------------------------------------------------

export type ArmorWeight = 'light' | 'medium' | 'heavy';

export interface ArmorItem {
  id: string;
  name: string;
  weight: ArmorWeight;
  /** Damage reduction contributed (feeds the DR formula's equipment term). */
  dr: number;
  /** Speed reduction in feet (feeds the Speed formula; medium −5, heavy −10). */
  speedPenalty: number;
  /** Price in gp. */
  cost?: number;
  provisional?: boolean;
  // --- Class-and-level AC (5e). Optional; Solryn armor uses dr instead. ---
  /** Base Armor Class (5e): e.g. chain mail 16, leather 11. */
  baseAc?: number;
  /** Max Dex bonus added to AC (5e): heavy = 0, medium = 2, light/unset = uncapped. */
  maxDexBonus?: number | null;
}

export interface ShieldItem {
  id: string;
  name: string;
  /** Bonus DR when equipped. (Shield equip slot is a follow-up; data captured now.) */
  dr: number;
  cost?: number;
  note?: string;
}

export interface WeaponItem {
  id: string;
  name: string;
  /** Weapon-skill category id this weapon belongs to (filters the gear step). */
  weaponSkillId: string;
  damageDice: string;
  /** Physical damage type: P (piercing) / S (slashing) / B (bludgeoning). */
  damageType?: string;
  range?: string;
  twoHanded?: boolean;
  cost?: number;
  provisional?: boolean;
  /** 5e finesse weapon: may use DEX instead of STR for attack & damage. */
  finesse?: boolean;
}

export interface StartingKitItem {
  name: string;
  quantity?: number;
}

export interface EquipmentDefinition {
  armor: ArmorItem[];
  weapons: WeaponItem[];
  shields?: ShieldItem[];
  /** Auto-granted at creation (backpack, rope, rations, 3 healing potions…). */
  startingKit: StartingKitItem[];
}

// --- Maps -------------------------------------------------------------------

export interface MapType {
  id: string;
  name: string;
  /** Real-world distance one grid square represents. */
  perSquare: { value: number; unit: string };
  /** GM defines the scale at upload (the "Custom" type). */
  custom?: boolean;
  /**
   * Party-scale (travel) map: the party moves as a group on one shared "party token" that
   * any player can drag, and individual character tokens are hidden. Tactical maps (battle)
   * leave this unset and place per-character tokens as usual.
   */
  partyScale?: boolean;
  note?: string;
}

// --- Harvest / crafting quality ---------------------------------------------

export interface QualityTier {
  id: string;
  label: string;
  /** Inclusive d100 band (after skill bonus). */
  min: number;
  max: number;
  color?: SemanticColor;
  /** Genuine failure floor (Ruined), distinct from the crafting rarity scale. */
  isFailure?: boolean;
}

export interface QualityScale {
  /** Ordered worst → best. */
  tiers: QualityTier[];
  roll: {
    die: string; // "d100"
    addGoverningSkillBonus: boolean; // Solryn: always (skill gates the attempt)
    capAtTop: boolean; // over max caps at the top tier (Legendary)
  };
  /** Assist: a second helper with the skill → roll N dice, take highest. */
  assist: { enabled: boolean; diceWhenAssisted: number };
}

// --- Bestiary (creatures + traps share the "thing with a stat block" idea) --

/** Field descriptor so the add-creature panel adapts its inputs by category. */
export interface StatBlockField {
  id: string;
  label: string;
  type: 'number' | 'text' | 'dice';
  /** Difficulty class field (traps): detection / disarm. */
  hint?: string;
}

export interface StatBlockShape {
  /** Category id (e.g. "creature", "trap"). */
  id: string;
  label: string;
  fields: StatBlockField[];
}

/** A single rollable attack. `diceExpr` is a clean term parseDice accepts (e.g. "1d8+4"). */
export interface AttackEntry {
  name: string;
  diceExpr: string;
  damageType: string;
  /** d20 to-hit bonus for roll-to-hit systems (5e). Omitted for auto-hit (Solryn). */
  attackBonus?: number;
  note?: string;
}

/** A save a creature's ability forces on its targets (5e: breath weapons, etc.). */
export interface CreatureSave {
  /** Matches the abilities[] entry this save belongs to (by leading name). */
  name: string;
  /** Save ability abbreviation, e.g. "DEX". */
  ability: string;
  dc: number;
  /** 'half' = half damage on a successful save; 'none' = no effect on success. */
  success: 'half' | 'none';
}

export interface BestiaryEntry {
  id: string;
  name: string;
  /** Which stat-block shape this entry uses. */
  category: string;
  /** Size category, e.g. "Medium" / "Large" (5e). Drives the token footprint via sizeToSquares. */
  size?: string;
  /** Free-form values keyed by field id (kept generic per the schema philosophy). */
  stats: Record<string, number | string>;
  abilities?: string[];
  /** Save-based abilities' structured DC/ability/success (5e), keyed to abilities by name. */
  saves?: CreatureSave[];
  /** Structured, rollable attacks. The display string lives at stats.damage. */
  attacks?: AttackEntry[];
  /** Harvest/loot pool id (ties into the universal harvest mechanic). */
  lootPoolId?: string;
  provisional?: boolean;
}

// --- Rules reference & conditions -------------------------------------------

export interface RulesCard {
  id: string;
  category: string;
  name: string;
  description: string;
  details?: string;
}

export interface ConditionEntry {
  id: string;
  name: string;
  description: string;
  effects: string[];
  save?: string;
}

/**
 * Mechanized token-condition effects. Boolean flags the combat/roll code reads to apply
 * advantage/disadvantage and special rules. Advantage and disadvantage from all sources cancel to
 * a normal roll (and never stack beyond one), handled by attackAdvantage() in engine/rules.
 */
export interface TokenConditionEffects {
  /** Incoming attacks against a creature with this condition have advantage (Blinded/Restrained/…). */
  attacksAgainstAdvantage?: boolean;
  /** Incoming attacks have disadvantage (Invisible target). */
  attacksAgainstDisadvantage?: boolean;
  /** This creature's own attacks have disadvantage (Blinded/Poisoned/Restrained/Prone/Frightened). */
  ownAttacksDisadvantage?: boolean;
  /** This creature's own attacks have advantage (Invisible attacker). */
  ownAttacksAdvantage?: boolean;
  /** Prone: melee within 5 ft gets advantage; attacks from farther get disadvantage. */
  meleeAdvRangedDis?: boolean;
  /** 5e: a melee hit from within 5 ft is a critical hit (Paralyzed/Unconscious). */
  autoCritMeleeAgainst?: boolean;
  /** Solryn: attacks against this creature ignore DR and are automatic crits (Stunned/Paralyzed/Unconscious). */
  ignoreDrAgainst?: boolean;
  /** Auto-fails Strength and Dexterity saving throws. */
  autoFailStrDexSaves?: boolean;
  /** Disadvantage on ability checks. */
  disadvantageAbilityChecks?: boolean;
  /** Disadvantage on Dexterity saving throws (Restrained). */
  disadvantageDexSaves?: boolean;
  /** Resistance to all damage — incoming damage is halved (Petrified). */
  resistAllDamage?: boolean;
  /** Can't take actions or reactions (Incapacitated family) — attack controls are disabled. */
  cantAct?: boolean;
  /** Speed becomes 0. */
  speedZero?: boolean;
  /** Speed is halved. */
  speedHalved?: boolean;
  /** Hit point maximum is halved (Exhaustion 4). */
  hpMaxHalved?: boolean;
}

/** A token condition: a colored board indicator plus its mechanized effects. */
export interface TokenCondition {
  id: string;
  name: string;
  /** Hex color for the token's burst indicator. */
  color: string;
  description: string;
  effects: TokenConditionEffects;
  /** Exclusive group id (e.g. 'exhaustion') — only one member active at a time. */
  group?: string;
  /** Ordering within a group (e.g. exhaustion level 1–6). */
  level?: number;
}

// --- Character-creation config ---------------------------------------------

/**
 * Casting access (Solryn v1.2 §5.5): a character is a caster if their casting-stat
 * modifier ≥ `casterThreshold` OR their ancestry grants it (Elf). Known spells =
 * (mod × knownPerMod) + (addLevel ? level : 0) + (granted ? ancestryBonus : 0).
 * A non-granted character below the threshold is NOT a caster (known = 0).
 */
export interface SpellAccessRule {
  modStatId: string;
  casterThreshold: number;
  knownPerMod: number;
  addLevel: boolean;
  grantedByAncestry: string[];
  ancestryBonus: number;
}

export interface CreationConfig {
  /** Stats rolled individually, in this order, locked on roll (anti-fishing). */
  statOrder: string[];
  allowReroll: false;
  allowRearrange: false;
  /** Starting reputation label (Solryn: "Neutral", no alignment system). */
  startingReputation: string;
  spellAccess: SpellAccessRule;
  /** Armor weights a character may CHOOSE at creation; heavier armor stays play/loot only.
   * Unset = every weight is allowed at creation. */
  startingArmorWeights?: ArmorWeight[];
  /** How ability scores are assigned at creation (5e: standard-array / point-buy). */
  abilityScoreMethod?: AbilityScoreMethod;
  /** The standard array values, when abilityScoreMethod === 'standard-array'. */
  standardArray?: number[];
  /** Point-buy budget, when abilityScoreMethod === 'point-buy'. */
  pointBuyBudget?: number;
}

// --- Class-and-level systems (5e) -------------------------------------------
// Parameter shapes for the 'class-and-level' progression mode. Generic to class-based d20
// systems; Solryn (classless) leaves the SystemDefinition.classes/backgrounds slots unset.
// Leveling is TABLE-DRIVEN (lookups per class level), not formula-driven — so no Expr math.

export type AbilityScoreMethod = 'standard-array' | 'point-buy' | 'roll' | 'manual';

/** One row of a class's 1–20 level table. Everything a level grants is a lookup here. */
export interface ClassLevel {
  level: number; // 1..20
  /** Proficiency bonus at this level (5e: +2 … +6). */
  proficiencyBonus: number;
  /** Feature names gained AT this level (cumulative features = union of rows ≤ level). */
  features: string[];
  /** This level grants an Ability Score Improvement / feat choice. */
  abilityScoreImprovement?: boolean;
  /** Caster spell slots indexed by spell level (index 0 = slot level 1 …); omit for non-casters. */
  spellSlots?: number[];
  /** Cantrips known at this level (casters). */
  cantripsKnown?: number;
  /** Spells known at this level (known casters); prepared casters compute from level+mod. */
  spellsKnown?: number;
  /** Class scaling counters by name (e.g. { rages: 3, sneakAttack: "3d6", ki: 5 }). */
  counters?: Record<string, number | string>;
}

/** A class in a class-and-level system. Expressive enough for all 12 SRD classes + casters. */
export interface ClassDefinition {
  id: string;
  name: string;
  description?: string;
  /** Hit die, e.g. "d10". HP = die max + CON at L1, die average + CON per level after. */
  hitDie: string;
  /** Primary ability ids (recommendation / multiclass prereqs). */
  primaryAbilities: string[];
  /** Ability ids this class is proficient in for saving throws (5e: two). */
  savingThrows: string[];
  proficiencies: {
    armor: string[]; // e.g. ['light','medium','heavy','shields']
    weapons: string[]; // e.g. ['simple','martial']
    tools: string[];
  };
  /** Skill proficiencies: choose N from a list (or 'any'). */
  skillChoices: { choose: number; from: string[] | 'any' };
  /** Starting equipment as display strings (structured grants are a later refinement). */
  startingEquipment: string[];
  /** Spellcasting model (casters only); the slots themselves live in the level table.
   *  known = fixed list chosen at build (Sorcerer/Bard/Warlock/Ranger); prepared = access the
   *  full class list, prepare daily (Cleric/Druid/Paladin); spellbook = Wizard (learn into a
   *  book, prepare a subset). */
  spellcasting?: { ability: string; type: 'prepared' | 'known' | 'spellbook'; ritual?: boolean };
  /** Unarmored Defense (Barbarian/Monk): when no armor is worn, AC = 10 + DEX + this ability's mod. */
  unarmoredDefense?: { ability: string };
  /** Thematic starting kit (equipped at creation): weapon ids + optional armor id. */
  starterKit?: { weaponIds: string[]; armorId?: string };
  /** The 1–20 level table. */
  levels: ClassLevel[];
  /** Level the subclass is chosen at, and the (minimal for now) options. */
  subclassLevel?: number;
  subclasses?: { id: string; name: string; description?: string }[];
}

/** A subclass (5e): granted features at specific levels on top of the parent class. */
export interface SubclassDefinition {
  id: string;
  name: string;
  description?: string;
  /** Parent class id (e.g. 'fighter'). */
  classId: string;
  /** Feature names gained at each level (same shape as ClassLevel.features). */
  levels: { level: number; features: string[] }[];
}

/** Typed passive/active effects a feat applies (the mechanizable subset; text-only feats omit it). */
export interface FeatEffects {
  /** Fixed ability increases (half-feats with a set stat, e.g. Actor +1 CHA). */
  abilityBonus?: { ability: string; amount: number }[];
  /** +N to ONE ability the player chooses from a set (e.g. Resilient, Weapon Master). */
  abilityChoice?: { amount: number; from: string[] };
  /** Bonus max HP per character level (Tough = 2). */
  hpPerLevel?: number;
  /** Flat AC bonus. */
  acBonus?: number;
  /** Walking-speed bonus in feet (Mobile = 10). */
  speedBonus?: number;
  /** Damage resistances granted. */
  resistances?: string[];
  /** Skill/tool/weapon/armor proficiency ids granted outright. */
  grantedProficiencies?: string[];
  /** Power-attack toggle for weapon attacks: −toHit / +damage (Great Weapon Master, Sharpshooter). */
  powerAttack?: { toHit: number; damage: number };
  /** Active resource pool (Lucky = 3 points), tracked on the sheet. */
  resource?: { id: string; name: string; max: number };
}

/** A feat (5e). Passive effects fold into pcDerived; the rest are notes/toggles on the sheet. */
export interface FeatDefinition {
  id: string;
  name: string;
  description: string;
  /** Free-text prerequisite (SRD/PHB). */
  prerequisite?: string;
  /** Structured prerequisite for the eligibility filter. */
  requires?: { ability?: string; min?: number; needsSpellcasting?: boolean };
  effects?: FeatEffects;
  /** Extra mechanical note shown on the sheet for effects not auto-applied. */
  note?: string;
  /** Needs a system we don't model yet (grapple, mounts, wild shape) → text only. */
  displayOnly?: boolean;
}

/** A background in a class-and-level system. Minimal for now. */
export interface BackgroundDefinition {
  id: string;
  name: string;
  description?: string;
  skillProficiencies: string[];
  toolProficiencies?: string[];
  /** Count of free language choices. */
  languages?: number;
  equipment?: string[];
  feature?: { name: string; description: string };
}

// --- The system definition --------------------------------------------------

export interface SystemDefinition {
  /** Stable id stored on games (locked at creation). */
  id: string;
  name: string;
  /** Lobby/header badge. */
  glyph: string;
  color: string;
  version: string;
  tagline?: string;

  modes: SystemModes;

  coreStats: CoreStat[];
  modifierRule: ModifierRule;
  derivedStats: DerivedStat[];

  ancestries: Ancestry[];
  skillCategories: SkillCategory[];
  skills: Skill[];
  spells: Spell[];

  equipment: EquipmentDefinition;
  mapTypes: MapType[];
  qualityScale: QualityScale;

  statBlockShapes: StatBlockShape[];
  bestiary: BestiaryEntry[];

  rulesReference: RulesCard[];
  conditions: ConditionEntry[];
  /** Mechanized token conditions (board indicators + combat effects). Optional; systems without a
   *  condition model omit it. */
  tokenConditions?: TokenCondition[];

  creation: CreationConfig;

  // --- Class-and-level systems (5e). Optional → classless systems (Solryn) omit them. ---
  classes?: ClassDefinition[];
  subclasses?: SubclassDefinition[];
  feats?: FeatDefinition[];
  backgrounds?: BackgroundDefinition[];
}
