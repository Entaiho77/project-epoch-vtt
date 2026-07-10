import type {
  Ancestry,
  BackgroundDefinition,
  BestiaryEntry,
  ClassDefinition,
  ClassLevel,
  FeatDefinition,
  StatBonus,
  SystemDefinition,
} from '@solryn/shared-types';
import type { CritFormula } from '@solryn/engine';
import type {
  ArmorType,
  EquipmentCategory,
  HomebrewEquipment,
  InventoryItem,
  StartingHp,
  WeaponRange,
} from '@solryn/shared-types';
import { newKey, useValue, writeValue } from './realtime';

export type { CritFormula };

/**
 * Per-game homebrew monsters (Phase A). Stored at games/$gameId/homebrew/monsters/$monsterId —
 * part of the Game object, so they sync with the game subscription (no separate listener needed).
 * GM-authored (see the games/$gameId/homebrew write rule); players read them so the monsters can
 * appear on the board and in combat.
 *
 * The shape converts losslessly into a BestiaryEntry (homebrewToBestiaryEntry) so the board,
 * stat card, and combat resolver treat homebrew and SRD monsters identically — no special cases.
 */

export interface HomebrewAttack {
  name: string;
  /** d20 to-hit bonus. */
  toHit: number;
  /** Damage dice term (parseDice-compatible), e.g. "2d6+4". */
  damageDice: string;
  damageType: string;
}

/** A named text feature (trait / action / legendary action). */
export interface HomebrewFeature {
  name: string;
  description: string;
}

export interface HomebrewMonster {
  id: string;
  name: string;
  /** Tiny/Small/Medium/Large/Huge/Gargantuan. */
  size: HomebrewSize;
  /** beast, undead, humanoid, dragon, … (free-form but drawn from a fixed dropdown). */
  type: string;
  alignment: string;
  hp: number;
  ac: number;
  /** Walking speed in feet. */
  speed: number;
  /** Challenge rating label, e.g. "1/4", "1", "5". */
  cr: string;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  damageResistances: string[];
  damageImmunities: string[];
  damageVulnerabilities: string[];
  conditionImmunities: string[];
  /** Repeatable sections — object-keyed maps (never arrays), per the data convention. */
  attacks: Record<string, HomebrewAttack>;
  traits: Record<string, HomebrewFeature>;
  actions: Record<string, HomebrewFeature>;
  legendaryActions: Record<string, HomebrewFeature>;
  /** Homebrew-equipment ids carried as loot (object-keyed set — never an array). Distributed to
   *  players from a spawned instance's stat card (Phase B1). Equipment ids reference the DM's
   *  account-wide library. */
  loot?: Record<string, true>;
}

/** Create or overwrite a monster in the DM's library (owner-only, enforced by the security rules). */
export async function saveHomebrewMonster(
  uid: string,
  monster: Omit<HomebrewMonster, 'id'> & { id?: string },
): Promise<string> {
  const id = monster.id ?? newKey(`users/${uid}/library/monsters`);
  await writeValue(`users/${uid}/library/monsters/${id}`, pruneUndefined({ ...monster, id }));
  return id;
}

/** Delete a library monster. Already-spawned tokens keep their own stats (see the converter). */
export function deleteHomebrewMonster(uid: string, id: string): Promise<void> {
  return writeValue(`users/${uid}/library/monsters/${id}`, null);
}

/** Homebrew monsters for a game as an array (from the game-synced object map). */
export function homebrewList(
  monsters: Record<string, HomebrewMonster> | undefined,
): HomebrewMonster[] {
  return Object.values(monsters ?? {}).sort((a, b) => a.name.localeCompare(b.name));
}

// --- Homebrew equipment (Phase B1) ------------------------------------------
// The equipment/inventory shapes are part of the shared data model (Character.inventory uses
// InventoryItem), so they live in ./types; imported for local use and re-exported for callers.
export type {
  ArmorType,
  EquipmentCategory,
  HomebrewEquipment,
  InventoryItem,
  WeaponRange,
};

/** Drop undefined-valued keys — Firebase set() rejects objects containing undefined. */
function pruneUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

/** Create or overwrite an equipment item in the DM's library (owner-only per the security rules). */
export async function saveHomebrewEquipment(
  uid: string,
  equipment: Omit<HomebrewEquipment, 'id'> & { id?: string },
): Promise<string> {
  const id = equipment.id ?? newKey(`users/${uid}/library/equipment`);
  await writeValue(`users/${uid}/library/equipment/${id}`, pruneUndefined({ ...equipment, id }));
  return id;
}

export function deleteHomebrewEquipment(uid: string, id: string): Promise<void> {
  return writeValue(`users/${uid}/library/equipment/${id}`, null);
}

/** Homebrew equipment as a sorted array (from the library's object map). */
export function equipmentList(
  equipment: Record<string, HomebrewEquipment> | undefined,
): HomebrewEquipment[] {
  return Object.values(equipment ?? {}).sort((a, b) => a.name.localeCompare(b.name));
}

/** Snapshot an equipment item into an inventory record (minus the record id, added on write). */
export function equipmentToInventoryItem(
  equip: HomebrewEquipment,
): Omit<InventoryItem, 'id'> {
  const { id, ...rest } = equip;
  return pruneUndefined({ ...rest, equipmentId: id, equipped: false });
}

/** Numeric CR from a label, so homebrew feeds the XP/encounter math like SRD creatures. */
export function crToNumber(cr: string): number {
  const t = cr.trim();
  if (t.includes('/')) {
    const [n, d] = t.split('/').map(Number);
    return d ? n / d : 0;
  }
  const v = Number(t);
  return Number.isFinite(v) ? v : 0;
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/**
 * Convert a homebrew monster into the exact BestiaryEntry shape the SRD bestiary uses, so the
 * stat card and combat resolver read it with no branching:
 *  - `stats` carries ac/hp/speed/type/cr/abilities scores + resistance/immunity display strings.
 *  - `attacks[]` are the structured, rollable AttackEntry rows (diceExpr + attackBonus).
 *  - `abilities[]` are the traits/actions/legendary features as "Name: text" lines (legendary
 *    tagged "(Legendary)"), matching the SRD convention the stat card already parses.
 */
export function homebrewToBestiaryEntry(hb: HomebrewMonster): BestiaryEntry {
  const stats: Record<string, number | string> = {
    ac: hb.ac,
    hp: hb.hp,
    speed: `${hb.speed} ft.`,
    type: cap(hb.type),
    size: hb.size,
    alignment: hb.alignment,
    cr: crToNumber(hb.cr),
    crLabel: hb.cr,
    str: hb.str,
    dex: hb.dex,
    con: hb.con,
    int: hb.int,
    wis: hb.wis,
    cha: hb.cha,
  };
  // Guard with ?. — Firebase omits empty arrays, so these can read back as undefined.
  if (hb.damageResistances?.length) stats.resistances = hb.damageResistances.join(', ');
  if (hb.damageImmunities?.length) stats.immunities = hb.damageImmunities.join(', ');
  if (hb.damageVulnerabilities?.length) stats.vulnerabilities = hb.damageVulnerabilities.join(', ');
  if (hb.conditionImmunities?.length) stats.conditionImmunities = hb.conditionImmunities.join(', ');

  const attacks = Object.values(hb.attacks ?? {}).map((a) => ({
    name: a.name,
    diceExpr: a.damageDice,
    damageType: a.damageType,
    attackBonus: a.toHit,
  }));

  const abilities = [
    ...Object.values(hb.traits ?? {}).map((t) => `${t.name}: ${t.description}`),
    ...Object.values(hb.actions ?? {}).map((a) => `${a.name}: ${a.description}`),
    ...Object.values(hb.legendaryActions ?? {}).map((l) => `${l.name} (Legendary): ${l.description}`),
  ];

  return {
    id: hb.id,
    name: hb.name,
    category: 'creature',
    size: hb.size,
    stats,
    ...(attacks.length ? { attacks } : {}),
    ...(abilities.length ? { abilities } : {}),
  };
}

// --- Homebrew player options (Phase C) --------------------------------------
//
// GM-authored races, classes, backgrounds, and feats, stored under
// games/$gameId/homebrew/playerOptions/{backgrounds,feats,races,classes}/$id (object-keyed maps,
// never arrays). Each converts losslessly into the corresponding SRD engine shape
// (Ancestry / ClassDefinition / BackgroundDefinition / FeatDefinition), and withHomebrewOptions
// merges them into a shallow-copied SystemDefinition so the builder, level-up, pcDerived, and
// sheet treat homebrew and SRD options identically — one combined list, no special cases.

/** A named text trait/feature (race trait, class feature). */
export interface HomebrewTrait {
  name: string;
  description: string;
}

export interface HomebrewBackground {
  id: string;
  name: string;
  description: string;
  /** Exactly two skill ids from the standard 5e skill list. */
  skillProficiencies: string[];
  /** Free text (tools + languages). */
  toolLanguageProficiencies: string;
  featureName: string;
  featureDescription: string;
}

export interface HomebrewFeat {
  id: string;
  name: string;
  description: string;
  /** Optional ability-score prerequisite (ability id + minimum score). */
  prerequisiteAbility?: string;
  prerequisiteScore?: number;
  requiresSpellcasting?: boolean;
  /** Fixed ability increases folded into scores (e.g. { STR: 1 }). */
  abilityBonus?: Record<string, number>;
  /** True if the feat's effects are narrative only (no mechanical bonus). */
  displayOnly: boolean;
}

export type HomebrewSize = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';

export interface HomebrewRace {
  id: string;
  name: string;
  description: string;
  size: HomebrewSize;
  /** Walking speed in feet. */
  speed: number;
  /** Ability increases keyed by ability id (e.g. { STR: 2, DEX: 1 }). */
  abilityBonuses: Record<string, number>;
  /** Darkvision range in feet (0 / omitted = none). */
  darkvision?: number;
  /** Racial traits, object-keyed map (never an array). */
  traits: Record<string, HomebrewTrait>;
}

export type HitDie = 6 | 8 | 10 | 12;
export type CasterType = 'full' | 'half' | 'third';
export type UnarmoredFormula = 'DEX+CON' | 'DEX+WIS';

/** A class feature at a specific level (object-map entry). */
export interface HomebrewClassFeature {
  level: number;
  name: string;
  description: string;
}

export interface HomebrewClass {
  id: string;
  name: string;
  description: string;
  hitDie: HitDie;
  primaryAbility: string;
  /** Exactly two ability ids. */
  savingThrows: string[];
  /** Any of 'light' | 'medium' | 'heavy' | 'shields' (or empty / 'none'). */
  armorProficiencies: string[];
  weaponProficiencies: string;
  skillChoiceCount: number;
  skillChoiceList: string[];
  spellcasting?: { ability: string; casterType: CasterType };
  unarmoredDefense?: { formula: UnarmoredFormula };
  subclassLevel: number;
  startingEquipment: string;
  /** Level features, object-keyed map (never an array). */
  features: Record<string, HomebrewClassFeature>;
}

/** The four homebrew player-option maps, stored under the DM's library. */
export interface HomebrewPlayerOptions {
  backgrounds?: Record<string, HomebrewBackground>;
  feats?: Record<string, HomebrewFeat>;
  races?: Record<string, HomebrewRace>;
  classes?: Record<string, HomebrewClass>;
}

/**
 * A DM's account-wide library (users/$uid/library) — homebrew available across all their games.
 * Object-keyed maps throughout (never arrays). Owned/written by the DM; a game's members read it
 * live during a session for player options, equipment details, and monster stat blocks.
 */
export interface Library {
  monsters?: Record<string, HomebrewMonster>;
  equipment?: Record<string, HomebrewEquipment>;
  playerOptions?: HomebrewPlayerOptions;
  rules?: Partial<CampaignRules>;
}

/** Live subscription to a DM's library (real-time, like useGame). Pass null to disable. */
export function useLibrary(uid: string | null): { library: Library | null; loading: boolean } {
  const { value, loading } = useValue<Library>(uid ? `users/${uid}/library` : null);
  return { library: value, loading };
}

// --- Campaign rules (Phase D) -----------------------------------------------
//
// DM-configured house/campaign rules, stored at users/$uid/library/rules. Some are mechanized (the
// engine reads them — crit threshold/formula, starting HP, feats toggle); the rest are display-only
// on the board's Rules panel. resolveRules fills defaults so every consumer gets a complete object.

/** StartingHp now lives in ./types (shared data model); re-exported for callers. */
export type { StartingHp };

/** A DM-authored narrative rule (display-only, shown on the Rules panel). */
export interface HouseRule {
  title: string;
  description: string;
}

export interface CampaignRules {
  /** Lowest natural d20 that crits (default 20; e.g. 19 = crit on 19–20). */
  critThreshold: number;
  critFormula: CritFormula;
  /** Custom crit expression over ROLL_DICE / MAX_DICE / MOD (only when critFormula === 'custom'). */
  critFormulaCustom?: string;
  /** Failed death saves needed to die (display-only until death saves are tracked). */
  deathSaveFailures: number;
  startingHp: StartingHp;
  flanking: boolean;
  multiclassing: boolean;
  feats: boolean;
  inspiration: boolean;
  encumbrance: boolean;
  /** House rules, object-keyed map (never an array). */
  houseRules: Record<string, HouseRule>;
}

export const DEFAULT_RULES: CampaignRules = {
  critThreshold: 20,
  critFormula: 'double_dice',
  deathSaveFailures: 3,
  startingHp: 'max',
  flanking: false,
  multiclassing: false,
  feats: true,
  inspiration: true,
  encumbrance: false,
  houseRules: {},
};

/** Fill defaults over a stored (partial) rules record so consumers always get a full object. */
export function resolveRules(stored: Partial<CampaignRules> | null | undefined): CampaignRules {
  return { ...DEFAULT_RULES, ...(stored ?? {}), houseRules: stored?.houseRules ?? {} };
}

/** Overwrite the DM's campaign rules (owner-only). Auto-saved on each change — no Save button. */
export function saveRules(uid: string, rules: CampaignRules): Promise<void> {
  return writeValue(`users/${uid}/library/rules`, pruneUndefined({ ...rules }));
}

/** Live campaign rules for a DM, always resolved to a complete object (defaults filled). */
export function useRules(uid: string | null): { rules: CampaignRules; loading: boolean } {
  const { value, loading } = useValue<Partial<CampaignRules>>(uid ? `users/${uid}/library/rules` : null);
  return { rules: resolveRules(value), loading };
}

type PlayerOptionKind = 'backgrounds' | 'feats' | 'races' | 'classes';

const optionPath = (uid: string, kind: PlayerOptionKind) =>
  `users/${uid}/library/playerOptions/${kind}`;

async function saveOption<T extends { id?: string }>(
  uid: string,
  kind: PlayerOptionKind,
  option: T,
): Promise<string> {
  const id = option.id ?? newKey(optionPath(uid, kind));
  await writeValue(`${optionPath(uid, kind)}/${id}`, pruneUndefined({ ...option, id }));
  return id;
}

const deleteOption = (uid: string, kind: PlayerOptionKind, id: string): Promise<void> =>
  writeValue(`${optionPath(uid, kind)}/${id}`, null);

const sortedList = <T extends { name: string }>(map: Record<string, T> | undefined): T[] =>
  Object.values(map ?? {}).sort((a, b) => a.name.localeCompare(b.name));

// --- CRUD (owner-only, enforced by the security rules) ---

export const saveHomebrewBackground = (uid: string, bg: Omit<HomebrewBackground, 'id'> & { id?: string }) =>
  saveOption(uid, 'backgrounds', bg);
export const deleteHomebrewBackground = (uid: string, id: string) => deleteOption(uid, 'backgrounds', id);
export const backgroundOptionList = (m: Record<string, HomebrewBackground> | undefined) => sortedList(m);

export const saveHomebrewFeat = (uid: string, feat: Omit<HomebrewFeat, 'id'> & { id?: string }) =>
  saveOption(uid, 'feats', feat);
export const deleteHomebrewFeat = (uid: string, id: string) => deleteOption(uid, 'feats', id);
export const featOptionList = (m: Record<string, HomebrewFeat> | undefined) => sortedList(m);

export const saveHomebrewRace = (uid: string, race: Omit<HomebrewRace, 'id'> & { id?: string }) =>
  saveOption(uid, 'races', race);
export const deleteHomebrewRace = (uid: string, id: string) => deleteOption(uid, 'races', id);
export const raceOptionList = (m: Record<string, HomebrewRace> | undefined) => sortedList(m);

export const saveHomebrewClass = (uid: string, cls: Omit<HomebrewClass, 'id'> & { id?: string }) =>
  saveOption(uid, 'classes', cls);
export const deleteHomebrewClass = (uid: string, id: string) => deleteOption(uid, 'classes', id);
export const classOptionList = (m: Record<string, HomebrewClass> | undefined) => sortedList(m);

// --- Converters (homebrew shape → SRD engine shape) ---

const upper = (s: string) => s.toUpperCase();

/** Ability increases (map → StatBonus[]), dropping zero/blank entries and normalizing ids. */
function abilityBonuses(map: Record<string, number> | undefined): StatBonus[] {
  return Object.entries(map ?? {})
    .filter(([, amount]) => Number(amount) !== 0)
    .map(([stat, amount]) => ({ kind: 'fixed', stat: upper(stat), amount: Number(amount) }));
}

export function homebrewRaceToAncestry(hb: HomebrewRace): Ancestry {
  const bonuses = abilityBonuses(hb.abilityBonuses);
  const bonusSummary = bonuses.length
    ? bonuses.map((b) => `+${(b as { amount: number }).amount} ${(b as { stat: string }).stat}`).join(', ')
    : 'No ability bonuses';
  const traits = [
    ...(hb.darkvision ? [`Darkvision ${hb.darkvision} ft.`] : []),
    ...Object.values(hb.traits ?? {}).map((t) => `${t.name}: ${t.description}`),
  ];
  return {
    id: hb.id,
    name: hb.name,
    bonusSummary,
    bonuses,
    advantages: [],
    weaknesses: [],
    ...(hb.description ? { flavor: hb.description } : {}),
    speed: hb.speed,
    size: hb.size,
    traits,
  };
}

export function homebrewFeatToFeat(hb: HomebrewFeat): FeatDefinition {
  const bonus = abilityBonuses(hb.abilityBonus).map((b) => ({
    ability: (b as { stat: string }).stat,
    amount: (b as { amount: number }).amount,
  }));
  const hasScoreReq = !!hb.prerequisiteAbility && hb.prerequisiteScore != null;
  const requires =
    hasScoreReq || hb.requiresSpellcasting
      ? {
          ...(hasScoreReq ? { ability: upper(hb.prerequisiteAbility!), min: hb.prerequisiteScore } : {}),
          ...(hb.requiresSpellcasting ? { needsSpellcasting: true } : {}),
        }
      : undefined;
  const prereqText = [
    hasScoreReq ? `${upper(hb.prerequisiteAbility!)} ${hb.prerequisiteScore}` : '',
    hb.requiresSpellcasting ? 'the ability to cast at least one spell' : '',
  ]
    .filter(Boolean)
    .join(', ');
  return {
    id: hb.id,
    name: hb.name,
    description: hb.description,
    ...(prereqText ? { prerequisite: prereqText } : {}),
    ...(requires ? { requires } : {}),
    ...(bonus.length ? { effects: { abilityBonus: bonus } } : {}),
    ...(hb.displayOnly ? { displayOnly: true } : {}),
  };
}

export function homebrewBackgroundToBackground(hb: HomebrewBackground): BackgroundDefinition {
  return {
    id: hb.id,
    name: hb.name,
    ...(hb.description ? { description: hb.description } : {}),
    skillProficiencies: hb.skillProficiencies ?? [],
    ...(hb.toolLanguageProficiencies ? { toolProficiencies: [hb.toolLanguageProficiencies] } : {}),
    ...(hb.featureName
      ? { feature: { name: hb.featureName, description: hb.featureDescription } }
      : {}),
  };
}

/** Proficiency bonus by character level (5e: +2 at 1–4, +3 at 5–8, … +6 at 17–20). */
const profBonusAt = (level: number) => 2 + Math.floor((level - 1) / 4);
/** Standard ASI/feat levels (SRD): 4, 8, 12, 16, 19. */
const ASI_LEVELS = new Set([4, 8, 12, 16, 19]);

/**
 * Spell-slot progression tables by caster type, indexed [characterLevel - 1] → number[] where
 * index 0 is 1st-level slots. Straight from the SRD full/half/third-caster tables (the same tables
 * the existing spell-slot UI already consumes for SRD classes).
 */
const FULL_CASTER_SLOTS: number[][] = [
  [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
];
const HALF_CASTER_SLOTS: number[][] = [
  [], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2], [4, 3, 3], [4, 3, 3],
  [4, 3, 3, 1], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2], [4, 3, 3, 3, 2],
];
const THIRD_CASTER_SLOTS: number[][] = [
  [], [], [2], [3], [3], [3], [4, 2], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2],
  [4, 3, 2], [4, 3, 3], [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1],
];
const CASTER_SLOTS: Record<CasterType, number[][]> = {
  full: FULL_CASTER_SLOTS,
  half: HALF_CASTER_SLOTS,
  third: THIRD_CASTER_SLOTS,
};

export function homebrewClassToClassDefinition(hb: HomebrewClass): ClassDefinition {
  const featuresByLevel = new Map<number, string[]>();
  for (const f of Object.values(hb.features ?? {})) {
    const list = featuresByLevel.get(f.level) ?? [];
    list.push(f.name);
    featuresByLevel.set(f.level, list);
  }
  const slotTable = hb.spellcasting ? CASTER_SLOTS[hb.spellcasting.casterType] : undefined;

  const levels: ClassLevel[] = [];
  for (let lvl = 1; lvl <= 20; lvl++) {
    const row: ClassLevel = {
      level: lvl,
      proficiencyBonus: profBonusAt(lvl),
      features: featuresByLevel.get(lvl) ?? [],
    };
    if (ASI_LEVELS.has(lvl)) row.abilityScoreImprovement = true;
    const slots = slotTable?.[lvl - 1];
    if (slots && slots.length) row.spellSlots = slots;
    levels.push(row);
  }

  // 'none' is a sentinel for "no armor"; keep only real proficiency ids.
  const armor = (hb.armorProficiencies ?? []).filter((a) => a && a !== 'none');
  return {
    id: hb.id,
    name: hb.name,
    ...(hb.description ? { description: hb.description } : {}),
    hitDie: `d${hb.hitDie}`,
    primaryAbilities: [upper(hb.primaryAbility)],
    savingThrows: (hb.savingThrows ?? []).map(upper),
    proficiencies: {
      armor,
      weapons: hb.weaponProficiencies ? [hb.weaponProficiencies] : [],
      tools: [],
    },
    skillChoices: { choose: hb.skillChoiceCount, from: hb.skillChoiceList ?? [] },
    startingEquipment: hb.startingEquipment ? [hb.startingEquipment] : [],
    // Homebrew casters use the 'prepared' model: slots come from the caster table, DC/attack from
    // the class's ability. No curated spell list this phase (cantrips/known omitted → 0), which is
    // why the builder/level-up spell pickers stay empty rather than dead-locking.
    ...(hb.spellcasting ? { spellcasting: { ability: upper(hb.spellcasting.ability), type: 'prepared' as const } } : {}),
    ...(hb.unarmoredDefense
      ? { unarmoredDefense: { ability: hb.unarmoredDefense.formula === 'DEX+WIS' ? 'WIS' : 'CON' } }
      : {}),
    levels,
    // subclassLevel is captured on the homebrew record but intentionally NOT wired into progression:
    // homebrew subclasses are out of scope this phase (the character simply has no subclass).
  };
}

/**
 * Return a shallow-copied SystemDefinition with this game's homebrew player options folded into the
 * ancestries / classes / feats / backgrounds lists, so every downstream consumer (builder,
 * level-up, pcDerived, sheet) sees homebrew alongside SRD in one combined list. Returns the system
 * unchanged when there are no options.
 */
export function withHomebrewOptions(
  system: SystemDefinition,
  playerOptions: HomebrewPlayerOptions | undefined,
): SystemDefinition {
  if (!playerOptions) return system;
  const races = Object.values(playerOptions.races ?? {}).map(homebrewRaceToAncestry);
  const classes = Object.values(playerOptions.classes ?? {}).map(homebrewClassToClassDefinition);
  const feats = Object.values(playerOptions.feats ?? {}).map(homebrewFeatToFeat);
  const backgrounds = Object.values(playerOptions.backgrounds ?? {}).map(homebrewBackgroundToBackground);
  if (!races.length && !classes.length && !feats.length && !backgrounds.length) return system;
  return {
    ...system,
    ancestries: [...system.ancestries, ...races],
    classes: [...(system.classes ?? []), ...classes],
    feats: [...(system.feats ?? []), ...feats],
    backgrounds: [...(system.backgrounds ?? []), ...backgrounds],
  };
}
