/**
 * Firebase data model. Three top-level collections: `users`, `games`, `characters`
 * (Design Doc §2, Build Brief §1.2). Role lives on game MEMBERSHIP, not on the user —
 * the same person can GM one game and play another.
 *
 * Realtime Database favors maps over arrays, so members/tokens/etc. are keyed objects.
 */

export type Role = 'gm' | 'player';

// --- Shared data-model types (relocated here so this module has no back-dependency on the
// Firebase-coupled data/ files; rollLog.ts and homebrew.ts re-export these for their callers). ---

/** One entry in the table-wide roll log (games/{gameId}/rollLog/{pushId}). */
export interface RollEntry {
  id: string;
  text: string;
  at: number;
  /** Roller's uid + display name (attribution prefix in the shared log). */
  byUid: string;
  by: string;
  /** The dice behind this entry, in order (sides + face). Present = rolled by the app. */
  dice?: { s: number; f: number }[];
  /** Set when a player's dice came from the GM's computer and were checked there. */
  rngId?: string;
  /** Added by the GM's computer: earlier rolls this player made but never showed. */
  skipped?: number;
  /** Damage this roll deals to the roller's current target (auto-applied by the GM's computer). */
  hit?: { tokenId: string; amount: number };
  /**
   * Damage pending on the target's saving throw (5e save-based spells) — not auto-applied; the
   * GM resolves it by hand once the target rolls at the table (fail/success), which clears this
   * field. Same trust tier as AoE damage / Give loot / Set HP.
   */
  pendingSave?: {
    tokenId: string;
    dc: number;
    ability: string;
    successType: 'half' | 'none';
    amount: number;
    damageType?: string;
  };
  /** Added by the GM's computer once the damage is applied: "Goblin takes 9 — down!". */
  applied?: string;
}

/** How per-level HP is granted on level-up (campaign rule). */
export type StartingHp = 'max' | 'average' | 'rolled';

export type EquipmentCategory = 'weapon' | 'armor' | 'tool' | 'other';
export type WeaponRange = 'melee' | 'ranged';
export type ArmorType = 'light' | 'medium' | 'heavy' | 'shield';

/** DM-authored equipment, stored at users/$uid/library/equipment/$id. Weapon/armor fields are
 *  present only for those categories; Phase B2 turns them into mechanical effects. */
export interface HomebrewEquipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  weight?: number;
  value?: string;
  // --- weapon ---
  damageDice?: string;
  damageType?: string;
  weaponRange?: WeaponRange;
  /** finesse | versatile | thrown | ranged | two-handed | light | heavy | loading. */
  properties?: string[];
  versatileDamageDice?: string;
  // --- armor ---
  armorType?: ArmorType;
  baseAc?: number;
  stealthDisadvantage?: boolean;
}

/** A looted item on a character (characters/$id/inventory/$itemId) — a full snapshot of the
 *  equipment at loot time (so it survives edits/deletes of the source), plus an equipped flag. */
export interface InventoryItem extends Omit<HomebrewEquipment, 'id'> {
  /** Inventory-record id (distinct from the source equipment id). */
  id: string;
  /** Source homebrew-equipment id it was looted from (reference only; data is snapshotted). */
  equipmentId: string;
  equipped: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL?: string | null;
  createdAt: number;
}

export interface GameMember {
  role: Role;
  /** Denormalized for display on the board/lobby without an extra user lookup. */
  displayName: string;
  joinedAt: number;
}

/**
 * A game. System identity is captured at creation and READ-ONLY thereafter.
 * Board state (maps/tokens/fog/initiative/chat) is added in Phases D–E; the fields are
 * declared optional here so the one sync mechanism covers all of it later.
 */
export interface Game {
  id: string;
  name: string;
  systemId: string;
  systemName: string;
  systemGlyph: string;
  systemColor: string;
  inviteCode: string;
  createdBy: string;
  /** The GM (owner) uid. Set at creation (= createdBy); the board and builder use it to read the
   *  GM's account-wide library (users/$gmUid/library) for homebrew content during a session. */
  gmUid?: string;
  createdAt: number;
  members: Record<string, GameMember>;

  // --- Board state (Phase D) ---
  activeMapId?: string;
  maps?: Record<string, MapDef>;
  tokens?: Record<string, Token>;
  /** AoE/measurement shape overlays, keyed by id (object map — never an array). */
  shapes?: Record<string, BoardShape>;
  /** Measuring lines left on the board, one per person (keyed by uid). */
  measures?: Record<string, SharedMeasure>;
  /** Board pointers (2026-10-07): ephemeral "look over here" pings, one per person (keyed by uid). */
  pings?: Record<string, SharedPing>;
  /** Board pointers (2026-10-07): light-pen trails, one per person (keyed by uid). */
  lightPen?: Record<string, SharedLightPenStroke>;

  // --- Combat & social (Phase E) ---
  initiative?: InitiativeState;
  chat?: Record<string, unknown>;
  /** Table-wide roll log, keyed by id (object map — never an array). */
  rollLog?: Record<string, RollEntry>;
  /** Party level the GM has granted up to; a character can level while below it. */
  levelGrant?: number;
  /** 5e: level a newly-built character starts at. When >1, the sheet chains the level-up flow up
   *  to this level right after creation (new player joining mid-campaign, replacement PC). */
  startingLevel?: number;
  /** Backlog item 1 (loot generator): the GM-triggered, scene-wide loot search currently in
   *  progress (or its resolved result, until the GM clears it). */
  lootSearch?: LootSearchState;
}

/** One entry in the initiative order. */
export interface Combatant {
  id: string;
  name: string;
  kind: 'character' | 'creature';
  initiative: number;
  /** Tiebreaker within equal initiative (characters already beat creatures). */
  tieBreak: number;
  tokenId?: string;
  ownerUserId?: string;
  characterId?: string;
  /** A player's initiative d20, rolled with the GM's numbers so the GM can check it. */
  roll?: { rngId: string; dice: { s: number; f: number }[] };
}

export interface InitiativeState {
  active: boolean;
  /**
   * 'rolling' = combat just started; everyone rolls in and no turn has begun until the GM
   * clicks Begin. 'running' (or absent, for older saves) = turns are being taken.
   */
  phase?: 'rolling' | 'running';
  /** GM switch: attacks are allowed off-turn (reactions, readied actions). Default off. */
  allowOffTurn?: boolean;
  round: number;
  turnIndex: number;
  order: Combatant[];
}

/** D&D-flavored rarity band for a generated magic item — used only by the loot generator
 *  (backlog item 1); nothing else in the schema has a rarity concept. */
export type LootRarity = 'common' | 'uncommon' | 'rare' | 'veryRare' | 'legendary' | 'artifact';

/**
 * One item in a generated loot pool. Shaped like `HomebrewEquipment` (so it can be handed
 * straight to `equipmentToInventoryItem`/`giveInventoryItem`, same as a library item) plus the
 * loot-generator's own reveal-text split: `description` is the full, mechanical writeup (always
 * visible to the GM); `revealDescription`, when set, is what the player actually sees instead —
 * a short, non-mechanical blurb for a magic/cursed item, so the roll doesn't hand them the
 * item's stat line up front. A mundane item has no `revealDescription` — `description` alone is
 * already fine for a player to read.
 */
export interface GeneratedLootItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  revealDescription?: string;
  rarity?: LootRarity;
  value?: string;
  // Weapon/armor mechanics carry straight through to the inventory item, same as any
  // HomebrewEquipment, when the generator rolls a mundane weapon or armor piece.
  damageDice?: string;
  damageType?: string;
  weaponRange?: WeaponRange;
  properties?: string[];
  armorType?: ArmorType;
  baseAc?: number;
}

/** A living, opted-in player's Investigation roll during a loot search. */
export interface LootRoller {
  characterId: string;
  name: string;
  roll: number;
}

/**
 * Backlog item 1 (loot generator), settled Oct 9, 2026: the GM triggers a scene-wide loot
 * search after a fight; each living, non-downed player can opt in and roll Investigation.
 * Resolution is automatic (no GM "resolve" click) — the GM's own client watches `lastRollAt`
 * and resolves a short grace period after the last roll comes in, same as this file's other
 * ephemeral shared-session state (initiative, pings). `resolved` is filled in once that happens
 * and stays there until the GM starts a new search or clears this one.
 */
export interface LootSearchState {
  active: boolean;
  /** Defeated tokens this search covers — context only (what the pool was generated from). */
  tokenIds: string[];
  pool: { items: GeneratedLootItem[]; gold: number };
  /** Keyed by characterId. */
  rollers: Record<string, LootRoller>;
  /** ms epoch of the most recent roll — the auto-resolve grace-timer anchor. */
  lastRollAt?: number;
  resolved?: {
    /** Gold per roller, already floored. */
    goldEach: number;
    /** Odd gp left over after the even floor-split, owed to the top roller. */
    goldRemainder?: number;
    /** itemId -> characterId, highest-roll-first pick order (looping back to the top roller if
     *  there are more items than rollers). Empty when `splitEvenly` is set — every item is left
     *  in the shared pool for the GM to hand out manually via the existing Give Loot flow. */
    assignments: Record<string, string>;
    splitEvenly?: boolean;
    /** Items (and gold, via a synthetic 'gold' key) already paid out, so a GM re-render or a
     *  second click can't double-give. */
    claimed?: Record<string, true>;
  };
}

/** A board map. The image is placed at the top-left and never stretched; a fixed grid
 * overlays at `gridSize` px. Real-world scale (from the map type) is metadata for a
 * future distance readout. */
export interface MapDef {
  id: string;
  name: string;
  /** Map-type id from system data (sets the real-world scale). */
  typeId: string;
  /** Image as a data URL (MVP; Firebase Storage is the production path). */
  imageUrl: string;
  width: number;
  height: number;
  /** Pixels per grid square. */
  gridSize: number;
  gridVisible: boolean;
  /** The square in the middle of the GM's screen (updated as they pan) — new player tokens appear here. */
  gmView?: { col: number; row: number };
  /** For the "custom" map type: GM-defined square scale. */
  customSquare?: { value: number; unit: string };
  /** Fogged squares, keyed "col,row". */
  fog?: Record<string, true>;
  /** Ambient scene audio (2026-10-07 MVP backlog): one looping track per map, GM-controlled.
   *  No playlist, no crossfade, no separate SFX layer — swapping scenes means the GM swaps
   *  this. Absent → no track loaded for this map. */
  ambientAudio?: MapAmbientAudio;
}

/** One ambient audio track attached to a map. `track` is the same storage contract as
 *  `MapDef.imageUrl` (an `epoch-asset:` reference in the desktop app, or a data URL) —
 *  resolve it with `imageSrc()`, which is generic over any stored asset, not actually
 *  image-specific. `playing` is shared: everyone hears the same track start/stop together.
 *  Each listener's own volume is a local-only preference, never stored here. */
export interface MapAmbientAudio {
  track: string;
  /** Original filename, so the GM can tell what's loaded without re-opening the file picker. */
  name: string;
  playing: boolean;
}

export type TokenKind = 'character' | 'creature' | 'trap' | 'party';

export type ShapeKind = 'circle' | 'cone' | 'line' | 'square';

/**
 * An AoE/measurement template overlaid on a map. Persisted (object-keyed map, never an
 * array) so all players see it and it survives reload. Anchored to a grid cell OR a token
 * (read live so it follows the token). `sizeFt` is radius (circle), length (cone/line), or
 * side (square); `angleDeg` aims cone/line (0 = east). `hidden` shapes show only to the GM.
 */
export interface BoardShape {
  id: string;
  mapId: string;
  kind: ShapeKind;
  ownerUid: string;
  /** Outline/fill tint (per placer). */
  color?: string;
  sizeFt: number;
  /** Grid point OR token binding — an object either way, never a tuple. */
  anchor: { col: number; row: number } | { tokenId: string };
  /** Cone/line direction in degrees (0 = east); omitted for circle/square. */
  angleDeg?: number;
  /** GM-only when true; default shown to the whole table. */
  hidden?: boolean;
  createdAt: number;
}

/** A measuring line left on the board for everyone (one per person, at games/{id}/measures/{uid}). */
export interface SharedMeasure {
  ownerUid: string;
  ownerName: string;
  mapId: string;
  sc: number;
  sr: number;
  ec: number;
  er: number;
}

/**
 * A "look over here" ping: a marker that pulses at a map location for everyone, then clears
 * itself a couple seconds later. One per person, at games/{id}/pings/{uid} — a new ping
 * replaces your last one, same discipline as SharedMeasure. `x`/`y` are world (map) pixels,
 * not grid cells — a ping deliberately ignores the grid so it can point at exactly where you
 * clicked, the same way the light-pen trail does.
 */
export interface SharedPing {
  ownerUid: string;
  ownerName: string;
  mapId: string;
  x: number;
  y: number;
  createdAt: number;
}

/**
 * A light-pen stroke: a glowing trail that fades out behind the cursor, like a laser pointer,
 * while you drag. One per person, at games/{id}/lightPen/{uid} — points are in world (map)
 * pixels, not grid cells, so the trail is smooth rather than snapped to squares; `t` is when
 * each point was added, used to fade older points and to self-clear the whole stroke once
 * every point has aged out.
 */
export interface SharedLightPenStroke {
  ownerUid: string;
  ownerName: string;
  mapId: string;
  color: string;
  points: { x: number; y: number; t: number }[];
}

export interface Token {
  id: string;
  mapId: string;
  kind: TokenKind;
  name: string;
  col: number;
  row: number;
  color?: string;
  imageUrl?: string;
  /**
   * Footprint size in squares per side (default 1). Movement collision already honours a
   * larger footprint; rendering sized tokens is a follow-up.
   */
  size?: number;
  /**
   * Original size category ("Tiny" / "Small" / …) for VISUAL scaling only — collision uses `size`.
   * Lets the canvas render Tiny/Small tokens smaller than Medium while all three occupy 1×1.
   */
  sizeCategory?: string;
  /** false = hidden token (GM sees it dimmed; players don't render it). */
  visible?: boolean;
  /** Character tokens: the controlling player + linked character. */
  ownerUserId?: string;
  characterId?: string;
  /** Bestiary entry id this token was placed from — stable card lookup, independent of name. */
  creatureId?: string;
  /** Creature/trap backing stat block (HP/DR/damage, or trap fields). */
  stats?: Record<string, number | string>;
  /** Creature current/max HP (GM-tracked). */
  hp?: { current: number; max: number };
  /** Creature defeated (grayed in place during combat). */
  defeated?: boolean;
  /** Permanently, unrecoverably dead (e.g. Solryn exhaustion level 3: "Death. Permanent. No
   *  resurrection."). Once true, nothing here — HP healing, Revive — undoes it; only a GM
   *  editing it directly could. Always implies `defeated`. */
  permaDead?: boolean;
  /** Trap lifecycle: hidden → revealed → sprung (GM-arbitrated). */
  trapState?: 'hidden' | 'revealed' | 'sprung';
  /** Homebrew loot already distributed from this spawned instance (equipmentId → true), so the
   *  GM can't hand out the same item twice. Per-token (each instance loots independently). */
  lootGiven?: Record<string, true>;
  /** Active status conditions on this token (conditionId → true). Object-keyed map, never an array.
   *  Applied/removed by any member; drives the board indicators and combat effects. */
  conditions?: Record<string, true>;
  /**
   * Party token (kind 'party') soft-lock: the uid currently dragging it and when they
   * grabbed it (ms). While held by someone else (within the staleness window) other
   * clients can't grab it; a crashed drag self-heals once the timestamp goes stale.
   */
  draggedBy?: string;
  draggedAt?: number;
}

/**
 * A character: one per player per game. Split into an immutable DEFINITION (built once,
 * respects the one-way creation gates) and a mutable PLAY-STATE. `buildComplete` flips
 * build→play permanently at "Finish character".
 */
export interface CharacterSkillState {
  /** Points placed (editable anywhere, e.g. on level-up). */
  investedPoints: number;
  /** Points realized through in-town training (drive the active bonus). */
  realizedPoints: number;
}

export interface CharacterDefinition {
  ancestryId: string;
  /** Chosen subrace / draconic-color id (5e races with subraces). */
  subraceId?: string;
  /** Stat bonuses chosen for flexible-bonus ancestries (stat id → amount). */
  ancestryChoices?: Record<string, number>;
  /** Rolled core scores, locked at creation (one-way gate). */
  coreScores: Record<string, number>;
  chosenSkillIds: string[];
  /** Spells known permanently: known casters' chosen list + every caster's cantrips (5e). */
  knownSpellIds: string[];
  /** Wizard spellbook: leveled spells learned into the book (superset of the day's prepared). */
  spellbookSpellIds?: string[];
  /** Class id (class-and-level systems, 5e). Optional; classless systems (Solryn) omit it. */
  classId?: string;
  /** Background id (5e). Grants fixed skill/tool proficiencies + a narrative feature. */
  backgroundId?: string;
  /** How ability scores were generated (5e), kept for display reference. */
  abilityScoreMethod?: 'standard' | 'pointbuy' | 'roll';
}

export interface CharacterPlayState {
  level: number;
  reputation: string;
  /** Resource pools by derived-stat id (e.g. hp, arcanaPoints, luckPoints). */
  pools: Record<string, { current: number }>;
  /**
   * 5e: HP gained on level-ups beyond the standard average (campaigns using max or rolled HP).
   * Added to the derived max HP; can be negative for low rolls. Kept within what the hit die allows.
   */
  hpExtra?: number;
  /** 5e death saves while at 0 HP (cleared when healed). */
  deathSaves?: { successes: number; failures: number };
  /** 5e hit dice spent on short rests (recovered on a long rest). */
  hitDiceUsed?: number;
  /** 5e spell slots remaining, keyed by slot level (1–9). Max is derived from class+level;
   *  only the current count is stored here (like pools/HP). Expended on cast, recovered on rest. */
  spellSlots?: Record<number, number>;
  /** 5e prepared casters' spells prepared for the day (changes daily). Empty until G3's prep UI. */
  preparedSpellIds?: string[];
  /** 5e concentration: the currently-sustained concentration spell (only one at a time). */
  concentrating?: { spellId: string; spellName: string };
  /** 5e milestone level-up: set true by the GM to grant, cleared when the player applies it. */
  levelUpPending?: boolean;
  /** 5e experience points (cumulative total). GM-awarded; drives the XP-based level-up. */
  xp?: number;
  /** 5e subclass id, chosen at the class's subclass level. */
  subclassId?: string;
  /** 5e feats taken (in place of ASIs at ASI levels). */
  featIds?: string[];
  /** Ability chosen for a feat's flexible +1 (featId → ability id), applied by pcDerived. */
  featChoices?: Record<string, string>;
  /** Feat resource pools remaining (resource id → current), e.g. Lucky luck points. */
  featResources?: Record<string, number>;
  /** Skill points granted (by level-up) but not yet placed. */
  unspentSkillPoints?: number;
  equippedArmorId?: string;
  equippedWeaponIds: string[];
  loadedSpellId?: string;
  /** Per-skill invested/realized points (skill id → state). */
  skills: Record<string, CharacterSkillState>;
}

export interface Character {
  id: string;
  gameId: string;
  ownerUserId: string;
  systemId: string;
  name: string;
  buildComplete: boolean;
  definition: CharacterDefinition;
  play: CharacterPlayState;
  /** Looted equipment (Phase B1), keyed by inventory-record id. */
  inventory?: Record<string, InventoryItem>;
  /** Round token art (Firebase Storage URL or inline data URL). */
  imageUrl?: string;
}

/** Lightweight game summary for the lobby list. */
export interface GameSummary {
  id: string;
  name: string;
  systemName: string;
  systemGlyph: string;
  systemColor: string;
  memberCount: number;
  role: Role;
}
