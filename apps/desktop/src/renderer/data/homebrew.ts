import type {
  Ancestry,
  BackgroundDefinition,
  BestiaryEntry,
  ClassDefinition,
  ClassLevel,
  FeatDefinition,
  StatBonus,
  SystemDefinition,
} from '@epoch/shared-types';
import type { CritFormula } from '@epoch/engine';
import type {
  ArmorType,
  EquipmentCategory,
  HomebrewEquipment,
  InventoryItem,
  StartingHp,
  WeaponRange,
} from '@epoch/shared-types';
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
  /** d20 to-hit bonus. 5e only — left unset for a Solryn monster, which auto-hits vs. DR
   *  instead of rolling to hit. */
  toHit?: number;
  /** Damage dice term (parseDice-compatible), e.g. "2d6+4". */
  damageDice: string;
  damageType: string;
  /** e.g. "melee weapon" or "reach 5 ft." or "ranged 80/320 ft." */
  range?: string;
  /** Second damage line on the same attack, e.g. a weapon hit that also deals fire damage. */
  damageDice2?: string;
  damageType2?: string;
}

export type HomebrewAbility = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

/** Which game system a homebrew monster is built for. Unset on every monster saved before
 *  this field existed, which the rest of the codebase treats as 'dnd5e' (see
 *  homebrewToBestiaryEntry's dispatch) — purely additive, no migration needed. */
export type HomebrewSystem = 'dnd5e' | 'solryn';

/**
 * Solryn's seven core stats plus the handful of Solryn-only derived numbers a hand-built
 * stat block needs (packages/systems/src/solryn/attributes.ts has the real roll-up formulas
 * for a player character; a monster stat block just states the finished numbers, the same way
 * a 5e monster states a final AC/HP instead of deriving them). Only meaningful when
 * HomebrewMonster.system === 'solryn' — a 5e monster leaves this entirely unset.
 */
export interface HomebrewSolrynStats {
  str?: number;
  nim?: number;
  end?: number;
  wis?: number;
  int?: number;
  arc?: number;
  lck?: number;
  /** Threat Rating — Solryn's CR equivalent. */
  tr?: number;
  /** Damage Reduction. */
  dr?: number;
  /** Arcana Points. */
  ap?: number;
  /** Luck Points. */
  luckPoints?: number;
  /** Primary damage dice, e.g. "1d8+2" — used when the monster has no structured `attacks`
   *  rows, matching the simple HP/DR/Speed/Damage shape Solryn creatures have always used. */
  damage?: string;
}

/** A named text feature (trait / action / bonus action / reaction / legendary / lair / regional /
 *  mythic action). `description` always carries the full stat-block prose; the fields below are
 *  additive structured data pulled out of that prose so the engine and stat card can use the
 *  numbers (DC, recharge, uses, legendary-action cost, …) instead of them being locked in text.
 *  All optional and additive — a feature with none of them set behaves exactly as before. */
export interface HomebrewFeature {
  name: string;
  description: string;
  /** e.g. "+5 to hit" or "reach 5 ft." for range — free text, shown alongside the description. */
  toHit?: string;
  range?: string;
  /** e.g. "5 (1d4 + 3) piercing damage". */
  damage?: string;
  /** A second damage line on the same action, e.g. "plus 10 (3d6) fire damage". */
  damage2?: string;
  /** Healing dealt by this feature (e.g. to the creature itself), e.g. "equal to the damage dealt". */
  healing?: string;
  /** Legacy free-text save description, e.g. "DC 12 Wisdom" — kept for anything already saved
   *  this way. New entries should use saveAbility/saveDc/saveEffect instead, which convert
   *  into a structured CreatureSave the stat card already knows how to use. */
  dc?: string;
  /** Ability the target saves with, e.g. "con". */
  saveAbility?: HomebrewAbility;
  /** Save DC number. */
  saveDc?: number;
  /** What a successful save does. */
  saveEffect?: 'half' | 'none';
  /** Recharge value, e.g. "5-6" (Recharge 5-6) or "6" (Recharge 6). */
  recharge?: string;
  /** Limited-use tag, e.g. "3/Day" or "1/Turn". */
  uses?: string;
  /** Action-point cost for a legendary action (most cost 1; some cost 2 or 3). */
  cost?: number;
}

/** Walking speed is the always-present `speed` field on HomebrewMonster; everything else a
 *  stat block can have goes here, additively. */
export interface HomebrewSpeeds {
  fly?: number;
  swim?: number;
  climb?: number;
  burrow?: number;
  /** Tags the fly speed as "(hover)". */
  hover?: boolean;
}

/** Spellcasting as its own section (not crammed into a trait), so spell lists and the save DC
 *  are real data instead of text. All optional — a non-caster simply omits this entirely. */
export interface HomebrewSpellcasting {
  ability?: HomebrewAbility;
  saveDc?: number;
  attackBonus?: number;
  /** At-will spell names (object-keyed set, per the data convention — never an array). */
  atWill?: Record<string, true>;
  /** Per-day spell names mapped to how many times per day. */
  perDay?: Record<string, number>;
  /** Anything that doesn't fit the lists above (components, caster level, etc.). */
  notes?: string;
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
  /** Initiative bonus, when the stat block states one directly (rare — most 5e blocks don't;
   *  DEX modifier is used for initiative rolls either way). */
  initiative?: number;
  /** Walking speed in feet. */
  speed: number;
  /** Fly/swim/climb/burrow speeds and hover, when the block has any — additive to `speed`. */
  otherSpeeds?: HomebrewSpeeds;
  /** Challenge rating label, e.g. "1/4", "1", "5". */
  cr: string;
  /** Proficiency bonus, when stated directly rather than derived from CR. */
  proficiencyBonus?: number;
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
  /** Free-text qualifier shown after the matching list, e.g. "from nonmagical attacks" — 5e
   *  stat blocks usually qualify the whole resistance/immunity line, not each damage type. */
  damageResistanceNote?: string;
  damageImmunityNote?: string;
  damageVulnerabilityNote?: string;
  /** Proficient saving throws and their bonus, e.g. { con: 6, wis: 9 }. Only proficient saves
   *  are listed (a non-proficient save is just the plain ability modifier). */
  savingThrows?: Partial<Record<HomebrewAbility, number>>;
  /** Skill name -> total bonus, e.g. { Perception: 5, Stealth: 7 }. */
  skills?: Record<string, number>;
  /** Free text, e.g. "truesight 120 ft., passive Perception 13" — senses vary too much in
   *  5e stat blocks to usefully split into fields. */
  senses?: string;
  /** Free text, e.g. "Common, Draconic" or "--" / "None". */
  languages?: string;
  /** Repeatable sections — object-keyed maps (never arrays), per the data convention. */
  attacks: Record<string, HomebrewAttack>;
  traits: Record<string, HomebrewFeature>;
  actions: Record<string, HomebrewFeature>;
  bonusActions?: Record<string, HomebrewFeature>;
  reactions?: Record<string, HomebrewFeature>;
  legendaryActions: Record<string, HomebrewFeature>;
  /** How many legendary actions this creature can take per round (3, for most). Only meaningful
   *  when legendaryActions has entries. */
  legendaryActionCount?: number;
  lairActions?: Record<string, HomebrewFeature>;
  regionalEffects?: Record<string, HomebrewFeature>;
  mythicActions?: Record<string, HomebrewFeature>;
  spellcasting?: HomebrewSpellcasting;
  /** Flavor text (lore), kept separate from the mechanical fields and shown as written —
   *  set by the paste-parser's "lore" highlight, or typed by hand. */
  lore?: string;
  /** Homebrew-equipment ids carried as loot (object-keyed set — never an array). Distributed to
   *  players from a spawned instance's stat card (Phase B1). Equipment ids reference the DM's
   *  account-wide library. */
  loot?: Record<string, true>;
  /** Which system this monster is for — see HomebrewSystem. Unset means 'dnd5e' (every monster
   *  saved before this field existed). */
  system?: HomebrewSystem;
  /** Solryn-only stats — set only when system === 'solryn'; ac/cr/proficiencyBonus/
   *  savingThrows/skills/spellcasting/legendaryActions above are 5e-only and left at their
   *  unused defaults for a Solryn monster. */
  solryn?: HomebrewSolrynStats;
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

// --- Solryn homebrew monsters (backlog item 6: 5e -> Solryn converter) -----
// Unlike 5e, Solryn has no separate homebrew-monster shape — a Solryn creature (SRD or
// homebrew) is just a BestiaryEntry, so a GM's homebrew Solryn creatures are stored as plain
// BestiaryEntry records at users/$uid/library/solrynMonsters/$id, parallel to .../monsters.

/** Create or overwrite a Solryn creature in the DM's library (owner-only per security rules). */
export async function saveHomebrewSolrynMonster(
  uid: string,
  entry: Omit<BestiaryEntry, 'id'> & { id?: string },
): Promise<string> {
  const id = entry.id ?? newKey(`users/${uid}/library/solrynMonsters`);
  await writeValue(`users/${uid}/library/solrynMonsters/${id}`, pruneUndefined({ ...entry, id }));
  return id;
}

export function deleteHomebrewSolrynMonster(uid: string, id: string): Promise<void> {
  return writeValue(`users/${uid}/library/solrynMonsters/${id}`, null);
}

/** Homebrew Solryn creatures as a sorted array (from the library's object map). */
export function solrynHomebrewList(
  monsters: Record<string, BestiaryEntry> | undefined,
): BestiaryEntry[] {
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

/** 5e's proficiency bonus is a lookup table by Challenge Rating, not a formula — this is that
 *  table (Monster Manual / DMG), used as the default shown/stored whenever a monster's own
 *  `proficiencyBonus` isn't set by hand. */
export function proficiencyBonusForCr(cr: string): number {
  const n = crToNumber(cr);
  if (n >= 29) return 9;
  if (n >= 25) return 8;
  if (n >= 21) return 7;
  if (n >= 17) return 6;
  if (n >= 13) return 5;
  if (n >= 9) return 4;
  if (n >= 5) return 3;
  return 2;
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
  // A monster built with the Solryn toggle on (see HomebrewMonsterForm) has none of the 5e-only
  // fields below filled in meaningfully — dispatch to its own converter rather than running the
  // 5e-shaped logic over empty/default values.
  if (hb.system === 'solryn') return homebrewToSolrynBestiaryEntry(hb);

  // Speed: "30 ft., fly 60 ft. (hover), swim 30 ft." — walking speed always first, then any
  // other movement types the monster has, in the order 5e stat blocks list them.
  const speedParts = [`${hb.speed} ft.`];
  const os = hb.otherSpeeds;
  if (os?.fly) speedParts.push(`fly ${os.fly} ft.${os.hover ? ' (hover)' : ''}`);
  if (os?.swim) speedParts.push(`swim ${os.swim} ft.`);
  if (os?.climb) speedParts.push(`climb ${os.climb} ft.`);
  if (os?.burrow) speedParts.push(`burrow ${os.burrow} ft.`);

  const stats: Record<string, number | string> = {
    ac: hb.ac,
    hp: hb.hp,
    speed: speedParts.join(', '),
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
  if (hb.damageResistances?.length) {
    stats.resistances = hb.damageResistances.join(', ') + (hb.damageResistanceNote ? ` (${hb.damageResistanceNote})` : '');
  }
  if (hb.damageImmunities?.length) {
    stats.immunities = hb.damageImmunities.join(', ') + (hb.damageImmunityNote ? ` (${hb.damageImmunityNote})` : '');
  }
  if (hb.damageVulnerabilities?.length) {
    stats.vulnerabilities = hb.damageVulnerabilities.join(', ') + (hb.damageVulnerabilityNote ? ` (${hb.damageVulnerabilityNote})` : '');
  }
  if (hb.conditionImmunities?.length) stats.conditionImmunities = hb.conditionImmunities.join(', ');

  // `initiativeMod` is the key creatureInitiativeMod() (data/combat.ts) actually reads when
  // rolling initiative — write both so a manually-entered initiative bonus is both shown on
  // the stat card AND actually used for the roll (previously only the display copy was set).
  if (hb.initiative != null) { stats.initiative = hb.initiative; stats.initiativeMod = hb.initiative; }
  stats.proficiencyBonus = `+${hb.proficiencyBonus ?? proficiencyBonusForCr(hb.cr)}`;

  if (hb.savingThrows && Object.keys(hb.savingThrows).length) {
    stats.savingThrows = Object.entries(hb.savingThrows)
      .map(([ability, bonus]) => `${ability.toUpperCase()} ${bonus >= 0 ? '+' : ''}${bonus}`)
      .join(', ');
  }
  if (hb.skills && Object.keys(hb.skills).length) {
    stats.skills = Object.entries(hb.skills)
      .map(([skill, bonus]) => `${skill} ${bonus >= 0 ? '+' : ''}${bonus}`)
      .join(', ');
  }
  if (hb.senses) stats.senses = hb.senses;
  if (hb.languages) stats.languages = hb.languages;
  if (hb.legendaryActionCount != null) stats.legendaryActionCount = hb.legendaryActionCount;

  const attacks = Object.values(hb.attacks ?? {}).map((a) => {
    // Range and dual damage (weapon + fire, etc.) have no dedicated AttackEntry fields — the
    // resolver only rolls one diceExpr and AttackEntry carries no range at all — so both are
    // appended as a plain-text note the GM reads, same "data captured, GM runs it" treatment
    // as every other mechanic here.
    const noteParts = [
      a.range && `Range: ${a.range}`,
      a.damageDice2 && `plus ${a.damageDice2}${a.damageType2 ? ` ${a.damageType2}` : ''} damage`,
    ].filter(Boolean);
    return {
      name: a.name,
      diceExpr: a.damageDice,
      damageType: a.damageType,
      attackBonus: a.toHit ?? 0,
      ...(noteParts.length ? { note: noteParts.join('; ') } : {}),
    };
  });

  // Highlighted/typed mechanical tags are appended in parentheses after the prose description,
  // same line, so the stat card shows them without a special case per feature kind.
  const withMech = (f: HomebrewFeature) => {
    const save = f.saveAbility && f.saveDc != null
      ? `DC ${f.saveDc} ${f.saveAbility.toUpperCase()} save${f.saveEffect ? ` (${f.saveEffect} on success)` : ''}`
      : f.dc && `Save: ${f.dc}`;
    const tags = [
      f.toHit && `To Hit: ${f.toHit}`,
      f.range && `Range: ${f.range}`,
      f.damage && `Damage: ${f.damage}`,
      f.damage2 && `Plus: ${f.damage2}`,
      f.healing && `Healing: ${f.healing}`,
      save,
      f.recharge && `Recharge ${f.recharge}`,
      f.uses && `Uses: ${f.uses}`,
      f.cost && f.cost > 1 && `Costs ${f.cost} Actions`,
    ].filter(Boolean);
    return tags.length ? `${f.description} (${tags.join('; ')})` : f.description;
  };

  const abilities = [
    ...Object.values(hb.traits ?? {}).map((t) => `${t.name}: ${withMech(t)}`),
    ...Object.values(hb.actions ?? {}).map((a) => `${a.name}: ${withMech(a)}`),
    ...Object.values(hb.bonusActions ?? {}).map((b) => `${b.name} (Bonus Action): ${withMech(b)}`),
    ...Object.values(hb.reactions ?? {}).map((r) => `${r.name} (Reaction): ${withMech(r)}`),
    ...Object.values(hb.legendaryActions ?? {}).map((l) => `${l.name} (Legendary): ${withMech(l)}`),
    ...Object.values(hb.lairActions ?? {}).map((l) => `${l.name} (Lair Action): ${withMech(l)}`),
    ...Object.values(hb.regionalEffects ?? {}).map((r) => `${r.name} (Regional Effect): ${withMech(r)}`),
    ...Object.values(hb.mythicActions ?? {}).map((m) => `${m.name} (Mythic Action): ${withMech(m)}`),
  ];

  if (hb.spellcasting) {
    const sc = hb.spellcasting;
    const bits = [
      sc.ability && `${sc.ability.toUpperCase()} as spellcasting ability`,
      sc.saveDc != null && `spell save DC ${sc.saveDc}`,
      sc.attackBonus != null && `${sc.attackBonus >= 0 ? '+' : ''}${sc.attackBonus} to hit with spell attacks`,
    ].filter(Boolean).join(', ');
    const atWill = sc.atWill && Object.keys(sc.atWill).length ? `At will: ${Object.keys(sc.atWill).join(', ')}.` : '';
    const perDay = sc.perDay && Object.keys(sc.perDay).length
      ? Object.entries(sc.perDay)
          .map(([spell, times]) => `${spell} (${times}/day)`)
          .join(', ')
      : '';
    const perDayLine = perDay ? `${perDay}.` : '';
    abilities.push(
      `Spellcasting: ${[bits, atWill, perDayLine, sc.notes].filter(Boolean).join(' ')}`,
    );
  }

  // Structured saves (CreatureSave[]) feed the stat card's existing save/DC display and prefill —
  // every trait/action/etc. with saveAbility+saveDc set contributes one entry.
  const allFeatures = [
    ...Object.values(hb.traits ?? {}),
    ...Object.values(hb.actions ?? {}),
    ...Object.values(hb.bonusActions ?? {}),
    ...Object.values(hb.reactions ?? {}),
    ...Object.values(hb.legendaryActions ?? {}),
    ...Object.values(hb.lairActions ?? {}),
    ...Object.values(hb.regionalEffects ?? {}),
    ...Object.values(hb.mythicActions ?? {}),
  ];
  const saves = allFeatures
    .filter((f) => f.saveAbility && f.saveDc != null)
    .map((f) => ({
      name: f.name,
      ability: f.saveAbility as HomebrewAbility,
      dc: f.saveDc as number,
      success: f.saveEffect ?? 'none',
    }));

  return {
    id: hb.id,
    name: hb.name,
    category: 'creature',
    size: hb.size,
    stats,
    ...(attacks.length ? { attacks } : {}),
    ...(abilities.length ? { abilities } : {}),
    ...(saves.length ? { saves } : {}),
    ...(hb.lore ? { lore: hb.lore } : {}),
  };
}

/**
 * Convert a homebrew monster built with the Solryn toggle on into a BestiaryEntry — Solryn's
 * own homebrew-monster storage shape (see saveHomebrewSolrynMonster). Solryn never had a
 * separate rich "HomebrewSolrynMonster" record the way 5e has HomebrewMonster — a Solryn
 * creature, hand-built or converted from 5e, is just a BestiaryEntry — so this is where a
 * monster built on the shared form (name/size/type/speed/traits/actions/bonus actions/
 * reactions/attacks/loot) gets flattened into that shape, the same way homebrewToBestiaryEntry
 * flattens a 5e monster, just without any of 5e's AC/CR/proficiency/saving-throws/skills/
 * spellcasting/legendary-action mechanics, none of which Solryn has.
 */
export function homebrewToSolrynBestiaryEntry(hb: HomebrewMonster): BestiaryEntry {
  const speedParts = [`${hb.speed} ft.`];
  const os = hb.otherSpeeds;
  if (os?.fly) speedParts.push(`fly ${os.fly} ft.${os.hover ? ' (hover)' : ''}`);
  if (os?.swim) speedParts.push(`swim ${os.swim} ft.`);
  if (os?.climb) speedParts.push(`climb ${os.climb} ft.`);
  if (os?.burrow) speedParts.push(`burrow ${os.burrow} ft.`);

  const sr = hb.solryn ?? {};
  // Solryn creatures have always carried one top-level "Damage" stat (see statBlockShapes in
  // packages/systems/src/solryn/bestiary.ts) rather than a required attacks list — fall back to
  // the first structured attack's dice if the DM used the Attacks section instead.
  const primaryDamage = sr.damage?.trim() || Object.values(hb.attacks ?? {})[0]?.damageDice || '1d6';

  const stats: Record<string, number | string> = {
    hp: hb.hp,
    dr: sr.dr ?? 0,
    speed: speedParts.join(', '),
    damage: primaryDamage,
    initiativeMod: hb.initiative ?? 0,
    type: cap(hb.type),
    size: hb.size,
    tr: sr.tr ?? 0,
    crLabel: `TR ${sr.tr ?? 0}`,
    ...(sr.str != null ? { str: sr.str } : {}),
    ...(sr.nim != null ? { nim: sr.nim } : {}),
    ...(sr.end != null ? { end: sr.end } : {}),
    ...(sr.wis != null ? { wis: sr.wis } : {}),
    ...(sr.int != null ? { int: sr.int } : {}),
    ...(sr.arc != null ? { arc: sr.arc } : {}),
    ...(sr.lck != null ? { lck: sr.lck } : {}),
    ...(sr.ap != null ? { ap: sr.ap } : {}),
    ...(sr.luckPoints != null ? { luckPoints: sr.luckPoints } : {}),
  };

  const attacks = Object.values(hb.attacks ?? {}).map((a) => {
    const noteParts = [
      a.range && `Range: ${a.range}`,
      a.damageDice2 && `plus ${a.damageDice2}${a.damageType2 ? ` ${a.damageType2}` : ''} damage`,
    ].filter(Boolean);
    return {
      name: a.name,
      diceExpr: a.damageDice,
      damageType: a.damageType,
      // No attackBonus — Solryn creatures auto-hit vs. the target's DR, never roll to hit.
      ...(noteParts.length ? { note: noteParts.join('; ') } : {}),
    };
  });

  // Solryn has no saving-throw mechanic and no legendary-creature system, so the mechanical
  // tags appended here are the subset that still applies (no save/recharge-vs-legendary-cost).
  const withMech = (f: HomebrewFeature) => {
    const tags = [
      f.range && `Range: ${f.range}`,
      f.damage && `Damage: ${f.damage}`,
      f.damage2 && `Plus: ${f.damage2}`,
      f.healing && `Healing: ${f.healing}`,
      f.recharge && `Recharge ${f.recharge}`,
      f.uses && `Uses: ${f.uses}`,
    ].filter(Boolean);
    return tags.length ? `${f.description} (${tags.join('; ')})` : f.description;
  };

  const abilities = [
    ...Object.values(hb.traits ?? {}).map((t) => `${t.name}: ${withMech(t)}`),
    ...Object.values(hb.actions ?? {}).map((a) => `${a.name}: ${withMech(a)}`),
    ...Object.values(hb.bonusActions ?? {}).map((b) => `${b.name} (Bonus Action): ${withMech(b)}`),
    ...Object.values(hb.reactions ?? {}).map((r) => `${r.name} (Reaction): ${withMech(r)}`),
  ];

  return {
    id: hb.id,
    name: hb.name,
    category: 'creature',
    size: hb.size,
    stats,
    ...(attacks.length ? { attacks } : {}),
    ...(abilities.length ? { abilities } : {}),
    ...(hb.lore ? { lore: hb.lore } : {}),
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
  /** GM's homebrew Solryn creatures (BestiaryEntry shape — see saveHomebrewSolrynMonster). */
  solrynMonsters?: Record<string, BestiaryEntry>;
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
  /** Several copies of the same monster share one initiative roll (5e convention) instead of
   *  each rolling its own. Default off — Matthew wants it as a choice, not a default behavior
   *  change. */
  groupInitiative: boolean;
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
  groupInitiative: false,
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
