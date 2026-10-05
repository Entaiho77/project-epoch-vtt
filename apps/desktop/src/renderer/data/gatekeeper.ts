/**
 * The GM's gatekeeper for live sessions.
 *
 * Every change a player makes travels to the GM's copy of the app first. Before the
 * GM applies it (and passes it on), `checkPlayerOp` decides whether that player is
 * allowed to make it. And whenever the GM sends data out, `projectForPlayer` trims it
 * down to what that particular player is allowed to see.
 *
 * The normal app never tries anything these rules forbid, so for honest players this
 * is invisible. It exists so a modified copy of the app can't edit the GM's game or
 * peek at things the screen would hide.
 *
 * What players may CHANGE
 *  - their own character (not who owns it, or which game it's in), and create one
 *    for this game; the game's "which character is mine" index for themselves
 *  - their own character token: position, conditions, size; create it once
 *  - the shared party token: position and the drag lock
 *  - chat messages and dice-log entries they send (new entries only). Dice results
 *    must be the GM-issued numbers (diceLedger.ts) to count as rolled; a line with
 *    no dice is allowed but isn't shown as a checked roll
 *  - their own character's numbers only within the rules: levels the GM granted
 *    (or XP / a pending level-up allows), stat increases within the level's dice,
 *    HP and other pools no higher than their maximum, no XP of their own making
 *  - shapes they draw (not GM-hidden ones), and removing their own shapes
 *  - initiative: rolling themselves in (with a checked d20), and ending their own turn
 * Everything else (maps, fog, monsters, settings, members, other characters, the
 * GM's library) is GM-only.
 *
 * What players may SEE (this game only — never the GM's other games)
 *  - the game, minus: tokens hidden from them, monster stat blocks (only AC/DR, which
 *    attacks need), GM-hidden shapes, and whispers they're not part of
 *  - their own characters in full; other players' characters as name + art only
 *  - from the GM's library: player options, campaign rules, equipment, creature art
 *    (not monsters, saved creatures' stats, or notes)
 */

import { computeDerived, dieForLevel, parseDice } from '@epoch/engine';
import type { Character, SystemDefinition, Token } from '@epoch/shared-types';
import { getSystem, isClassAndLevel } from '@epoch/systems/registry';
import { pcDerived } from '@epoch/systems/dnd5e/character';
import { levelForXp } from '@epoch/systems/dnd5e/xp';
import type { ProofVerdict } from './diceLedger';
import { withHomebrewOptions } from './homebrew';
import { damageAtZero, type DeathSaves } from '@epoch/systems/dnd5e/deathSaves';
import { hitChanges, hitNote, isDefeated, maxClaimableDamage, mayAttackNow, type Hit } from './damage';
import { initiativeModifier } from './initiativeModifier';

export type SyncWrite = { t: 'write'; path: string; value: unknown };
export type SyncUpdate = { t: 'update'; path: string; partial: Record<string, unknown> };
export type SyncMulti = { t: 'multi'; updates: Record<string, unknown> };
export type WriteOp = SyncWrite | SyncUpdate | SyncMulti;

export interface GateContext {
  /** The game being played in this session. */
  gameId: string;
  /** The GM's uid (owner of the library players may read from). */
  gmUid: string;
  /** Read the GM's current data. */
  read(path: string): Promise<unknown>;
  /** The GM's record of dice numbers handed to players (absent: dice aren't checked). */
  dice?: { verify(uid: string, proof: unknown): ProofVerdict };
}

/** `followUps`: extra changes the GM's copy makes after applying an allowed one. */
export type Verdict = { ok: true; followUps?: Record<string, unknown> } | { ok: false; reason: string };

/** Largest change a player may send in one go (images travel separately). */
export const MAX_PLAYER_OP_BYTES = 256 * 1024;

const norm = (p: string): string => p.replace(/^\/+|\/+$/g, '');
const split = (p: string): string[] => (norm(p) ? norm(p).split('/') : []);
const join = (a: string, b: string): string => (a && b ? `${a}/${b}` : a || b);

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown, max: number): v is string => typeof v === 'string' && v.length <= max;
const isCell = (v: unknown): boolean =>
  typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 100_000;

/** Turn any write op into a flat list of "set this path to this value". */
export function assignmentsOf(op: WriteOp): Array<[string, unknown]> {
  switch (op.t) {
    case 'write':
      return [[norm(op.path), op.value ?? null]];
    case 'update':
      return Object.entries(op.partial ?? {}).map(([k, v]) => [join(norm(op.path), norm(k)), v ?? null]);
    case 'multi':
      return Object.entries(op.updates ?? {}).map(([k, v]) => [norm(k), v ?? null]);
  }
}

/** Every path an op touches (for re-sending the results to players). */
export function touchedPaths(op: WriteOp): string[] {
  return assignmentsOf(op).map(([p]) => p);
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

const deny = (reason: string): Verdict => ({ ok: false, reason });
const OK: Verdict = { ok: true };

/**
 * Reads that see this op's own earlier assignments first. (A new character and the
 * index entry pointing at it arrive in the same op.)
 */
function overlayReader(ctx: GateContext, assignments: Array<[string, unknown]>) {
  return async (path: string): Promise<unknown> => {
    const p = norm(path);
    for (let i = assignments.length - 1; i >= 0; i -= 1) {
      const [ap, av] = assignments[i];
      if (ap === p) return av;
      if (p.startsWith(`${ap}/`)) {
        let node: unknown = av;
        for (const seg of p.slice(ap.length + 1).split('/')) node = isObj(node) ? node[seg] : undefined;
        return node ?? null;
      }
    }
    return ctx.read(p);
  };
}

/** `base` (the value at `prefix`) with this op's assignments under `prefix` applied. */
function withAssignments(base: unknown, prefix: string, assignments: Array<[string, unknown]>): unknown {
  let root: unknown = base === null || base === undefined ? null : JSON.parse(JSON.stringify(base));
  for (const [path, value] of assignments) {
    if (path === prefix) {
      root = value === null ? null : JSON.parse(JSON.stringify(value));
      continue;
    }
    if (!path.startsWith(`${prefix}/`)) continue;
    const segs = path.slice(prefix.length + 1).split('/');
    if (!isObj(root)) root = {};
    let node = root as Obj;
    for (let i = 0; i < segs.length - 1; i++) {
      if (!isObj(node[segs[i]])) node[segs[i]] = {};
      node = node[segs[i]] as Obj;
    }
    const last = segs[segs.length - 1];
    if (value === null) delete node[last];
    else node[last] = JSON.parse(JSON.stringify(value));
  }
  return root;
}

export async function checkPlayerOp(op: WriteOp, uid: string, ctx: GateContext): Promise<Verdict> {
  if (!op || !['write', 'update', 'multi'].includes((op as { t?: string }).t ?? '')) {
    return deny('unknown change');
  }
  let size = 0;
  try {
    size = JSON.stringify(op).length;
  } catch {
    return deny('unreadable change');
  }
  if (size > MAX_PLAYER_OP_BYTES) return deny('change too large');

  const assignments = assignmentsOf(op);
  if (assignments.length === 0 || assignments.length > 200) return deny('bad change size');
  const read = overlayReader(ctx, assignments);
  const followUps: Record<string, unknown> = {};
  const characters = new Set<string>();
  for (const [path, value] of assignments) {
    const seg = split(path);
    if (seg[0] === 'characters' && seg[1]) characters.add(seg[1]);
    const verdict = await checkAssignment(seg, value, uid, ctx, read, assignments);
    if (!verdict.ok) return { ok: false, reason: `${path}: ${verdict.reason}` };
    Object.assign(followUps, verdict.followUps);
  }
  // Characters are judged as a whole: before vs after this change.
  for (const id of characters) {
    const before = await ctx.read(`characters/${id}`);
    const after = withAssignments(before, `characters/${id}`, assignments);
    if (!isObj(after)) continue;
    const verdict = await checkCharacterNumbers(isObj(before) ? before : null, after, ctx);
    if (!verdict.ok) return { ok: false, reason: `characters/${id}: ${verdict.reason}` };
  }
  return Object.keys(followUps).length ? { ok: true, followUps } : OK;
}

async function checkAssignment(
  seg: string[],
  value: unknown,
  uid: string,
  ctx: GateContext,
  read: (p: string) => Promise<unknown>,
  all: Array<[string, unknown]>,
): Promise<Verdict> {
  const [root, a, b, c, ...rest] = seg;

  if (root === 'characters' && a) return checkCharacter(seg, value, uid, ctx);

  if (root === 'gameCharacters') {
    // gameCharacters/{game}/{uid} = characterId
    if (a !== ctx.gameId || b !== uid || seg.length !== 3) return deny('not your character index');
    if (value === null) return OK;
    if (!isStr(value, 64)) return deny('bad character id');
    const ch = await read(`characters/${value}`);
    if (!isObj(ch) || ch.ownerUserId !== uid || ch.gameId !== ctx.gameId) {
      return deny('that character is not yours');
    }
    return OK;
  }

  if (root !== 'games' || a !== ctx.gameId || !b) return deny('GM only');

  switch (b) {
    case 'tokens':
      return c ? checkToken(c, rest, value, uid, ctx) : deny('GM only');
    case 'chat':
      return c && rest.length === 0 ? checkChat(c, value, uid, ctx) : deny('chat is add-only');
    case 'rollLog':
      return c && rest.length === 0 ? checkRoll(c, value, uid, ctx) : deny('the dice log is add-only');
    case 'shapes':
      if (c && rest.length === 1 && rest[0] === 'anchor') return checkShapeMove(c, value, uid, ctx);
      if (c && rest.length === 1 && rest[0] === 'angleDeg') return checkShapeTurn(c, value, uid, ctx);
      return c && rest.length === 0 ? checkShape(c, value, uid, ctx) : deny('GM only');
    case 'initiative':
      return c === undefined ? checkInitiative(value, uid, ctx) : deny('GM only');
    case 'measures':
      // games/{id}/measures/{uid}: your own measuring line (or null to remove it).
      if (c !== uid || rest.length !== 0) return deny('you can only change your own measuring line');
      if (value === null) return OK;
      if (!isObj(value) || value.ownerUid !== uid || !isStr(value.ownerName, 64) || !isStr(value.mapId, 64)) return deny('bad measurement');
      if (!['sc', 'sr', 'ec', 'er'].every((k) => Number.isInteger(value[k]) && (value[k] as number) >= 0 && (value[k] as number) < 10000)) return deny('bad measurement');
      return OK;
    case 'voice':
      // games/{id}/voice/{uid} = true while you're in the voice call; only your own mark.
      if (c !== uid || rest.length !== 0) return deny('you can only mark yourself in voice');
      return value === true || value === null ? OK : deny('bad voice mark');
    default:
      void all;
      return deny('GM only');
  }
}

/** Fields a player can never change on their own character. */
const CHARACTER_FIXED = new Set(['id', 'ownerUserId', 'gameId', 'systemId']);

async function checkCharacter(seg: string[], value: unknown, uid: string, ctx: GateContext): Promise<Verdict> {
  const [, id, field] = seg;
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return deny('bad character id');
  const existing = await ctx.read(`characters/${id}`);

  if (!field) {
    // The whole character: create a new one, or (re)write your own.
    if (value === null) return deny('characters cannot be deleted by players');
    if (!isObj(value)) return deny('bad character');
    if (value.ownerUserId !== uid) return deny('a character must belong to you');
    if (value.gameId !== ctx.gameId) return deny('a character must be for this game');
    if (value.id !== undefined && value.id !== id) return deny('character id mismatch');
    if (existing !== null && existing !== undefined) {
      if (!isObj(existing) || existing.ownerUserId !== uid) return deny('not your character');
    }
    return OK;
  }

  if (!isObj(existing) || existing.ownerUserId !== uid) return deny('not your character');
  if (existing.gameId !== ctx.gameId) return deny('character belongs to another game');
  if (CHARACTER_FIXED.has(field)) return deny(`${field} cannot be changed`);
  return OK;
}

// ---------------------------------------------------------------------------
// A player's own character: the numbers
// ---------------------------------------------------------------------------

const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const playOf = (c: Obj | null): Obj => (c && isObj(c.play) ? c.play : {});
const scoresOf = (c: Obj | null): Record<string, number> => {
  const d = c && isObj(c.definition) ? c.definition : {};
  const s = isObj(d.coreScores) ? d.coreScores : {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(s)) out[k] = typeof v === 'number' ? v : NaN;
  return out;
};
/** Highest total a dice expression like "2d4" or "d6+1" can roll. */
const diceMax = (notation: string | undefined): number | null => {
  const p = notation ? parseDice(notation) : null;
  return p ? p.count * p.sides + p.modifier : null;
};
const diceMin = (notation: string | undefined): number | null => {
  const p = notation ? parseDice(notation) : null;
  return p ? p.count + p.modifier : null;
};

/** The game's rules with the GM's homebrew folded in (as the sheet sees them). */
async function systemFor(character: Obj, ctx: GateContext): Promise<SystemDefinition | undefined> {
  const base = typeof character.systemId === 'string' ? getSystem(character.systemId) : undefined;
  if (!base) return undefined;
  const library = await ctx.read(`users/${ctx.gmUid}/library`);
  const playerOptions = isObj(library) ? (library.playerOptions as Parameters<typeof withHomebrewOptions>[1]) : undefined;
  return withHomebrewOptions(base, playerOptions);
}

/** Highest value each resource pool (HP, Arcana, Luck…) can hold for this character. */
function poolMaxima(system: SystemDefinition, character: Obj): Record<string, number> {
  try {
    if (isClassAndLevel(system)) {
      // pcDerived counts the average hit die per level; campaigns that use max or
      // rolled HP can go higher, so allow up to a full hit die every level.
      const d = pcDerived(system, character as unknown as Character);
      const cls = system.classes?.find((c) => c.id === (character.definition as Obj | undefined)?.classId);
      const size = Number(String(cls?.hitDie ?? '').replace(/^\D*/, '')) || 0;
      const level = num(playOf(character).level) ?? 1;
      const avg = Math.floor(size / 2) + 1;
      // Bound by the average formula plus a full die every level — not by the stored extra.
      return { hp: d.maxHp - d.hpExtra + Math.max(0, level - 1) * Math.max(0, size - avg) };
    }
    const play = playOf(character);
    const armor = system.equipment.armor.find((a) => a.id === play.equippedArmorId);
    const equip = armor ? { armor: { dr: armor.dr, speedPenalty: armor.speedPenalty } } : undefined;
    const out: Record<string, number> = {};
    for (const d of computeDerived(system, scoresOf(character), equip)) {
      if (d.resourcePool && typeof d.value === 'number') out[d.id] = d.value;
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * The numbers on a player's own character. Honest play is untouched; what's blocked
 * is a modified app granting itself levels, stats, XP or HP. Lowering a pool
 * (damage, spending) is always fine; raising it can't pass its maximum.
 */
async function checkCharacterNumbers(before: Obj | null, after: Obj, ctx: GateContext): Promise<Verdict> {
  const system = await systemFor(after, ctx);
  if (!system) return OK; // rules unknown here: nothing to measure against
  const game = await ctx.read(`games/${ctx.gameId}`);
  const g = isObj(game) ? game : {};
  const levelGrant = num(g.levelGrant) ?? 1;
  const startingLevel = num(g.startingLevel) ?? 1;
  const fiveE = isClassAndLevel(system);
  const pb = playOf(before);
  const pa = playOf(after);

  // --- Level ---
  const levelA = pa.level;
  if (typeof levelA !== 'number' || !Number.isInteger(levelA) || levelA < 1 || levelA > 20) return deny('bad level');
  const building = !before || before.buildComplete !== true;
  const levelB = num(pb.level) ?? 1;
  const xpB = num(pb.xp) ?? 0;
  const allowedLevel = Math.max(levelGrant, startingLevel, fiveE ? levelForXp(xpB) : 1);
  let leveledUp = false;
  if (!before) {
    if (levelA > Math.max(levelGrant, startingLevel)) return deny('that level was not granted');
  } else if (levelA !== levelB) {
    if (levelA !== levelB + 1) return deny('levels go up one at a time');
    if (levelA > allowedLevel && pb.levelUpPending !== true) return deny('that level was not granted');
    leveledUp = true;
  }

  // --- XP: the GM's to award ---
  if (before && (num(pa.xp) ?? 0) !== xpB) return deny('only the GM awards XP');
  if (!before && (num(pa.xp) ?? 0) !== 0) return deny('only the GM awards XP');

  // --- Pending level-up: the GM grants it; a player may only clear it, or re-arm it while
  //     catching up to the game's starting level ---
  if (pa.levelUpPending === true && pb.levelUpPending !== true && levelA >= startingLevel) {
    return deny('only the GM grants a level-up');
  }

  // --- Core scores ---
  const sa = scoresOf(after);
  const sb = scoresOf(before);
  const ids = new Set([...Object.keys(sa), ...Object.keys(sb)]);
  if ([...ids].some((k) => !Number.isFinite(sa[k] ?? NaN) && k in sa)) return deny('bad scores');
  if (building) {
    // Stored scores already include the race's bonuses (fixed ones, plus any flexible
    // bonus the player could have put on this stat).
    const def = isObj(after.definition) ? after.definition : {};
    const ancestry = system.ancestries.find((a) => a.id === def.ancestryId);
    const raceRange = (statId: string): [number, number] => {
      let lo = 0;
      let hi = 0;
      for (const b of ancestry?.bonuses ?? []) {
        if (b.kind === 'fixed') {
          if (b.stat === statId) {
            lo += Math.min(0, b.amount);
            hi += Math.max(0, b.amount);
          }
        } else {
          hi += Math.max(0, b.amount);
        }
      }
      return [lo, hi];
    };
    for (const stat of system.coreStats) {
      const v = sa[stat.id];
      if (v === undefined) continue;
      if (fiveE) {
        if (v < 1 || v > 20) return deny(`${stat.id} is out of range`);
      } else {
        const max = diceMax(stat.roll);
        const min = diceMin(stat.roll);
        const [lo, hi] = raceRange(stat.id);
        if (max !== null && min !== null && (v < min + lo || v > max + hi)) return deny(`${stat.id} is out of range`);
      }
    }
  } else if (leveledUp) {
    let total = 0;
    const stepMax = fiveE ? 2 : diceMax(dieForLevel(levelA, system.modes.progression)) ?? 0;
    for (const k of ids) {
      const inc = (sa[k] ?? 0) - (sb[k] ?? 0);
      if (inc < 0) return deny('scores never go down');
      if (inc > stepMax) return deny(`${k} rose more than a level allows`);
      if (fiveE && (sa[k] ?? 0) > 20) return deny(`${k} is above 20`);
      total += inc;
    }
    if (fiveE && total > 2) return deny('a level grants at most +2 to scores');
  } else if (JSON.stringify(sa) !== JSON.stringify(sb)) {
    return deny('scores are locked once the character is built');
  }

  // --- Skill points (Solryn): only a level-up hands out more ---
  if (!fiveE && before) {
    const ua = num(pa.unspentSkillPoints) ?? 0;
    const ub = num(pb.unspentSkillPoints) ?? 0;
    const perLevel = system.modes.progression.skillPointsPerLevel ?? 2;
    if (ua > ub + (leveledUp ? perLevel : 0)) return deny('skill points come from levels');
    // Points placed in skills must be paid for out of unspent points, and never taken back.
    const skillsA = isObj(pa.skills) ? pa.skills : {};
    const skillsB = isObj(pb.skills) ? pb.skills : {};
    let placed = 0;
    for (const id of new Set([...Object.keys(skillsA), ...Object.keys(skillsB)])) {
      const a = isObj(skillsA[id]) ? (skillsA[id] as Obj) : {};
      const b = isObj(skillsB[id]) ? (skillsB[id] as Obj) : {};
      const ia = num(a.investedPoints) ?? 0;
      const ib = num(b.investedPoints) ?? 0;
      if (ia < ib) return deny('placed skill points stay placed');
      if ((num(a.realizedPoints) ?? 0) > ia) return deny("training can't go past the points placed");
      placed += ia - ib;
    }
    if (placed > 0 && ub - ua !== placed) return deny("skill points placed don't match the points spent");
  }

  // --- Pools (HP etc.): never above the maximum ---
  const maxima = poolMaxima(system, after);
  const poolsA = isObj(pa.pools) ? pa.pools : {};
  const poolsB = isObj(pb.pools) ? pb.pools : {};
  for (const [id, pool] of Object.entries(poolsA)) {
    const cur = isObj(pool) ? pool.current : undefined;
    if (cur === undefined || cur === null) continue;
    if (typeof cur !== 'number' || !Number.isFinite(cur)) return deny(`bad ${id}`);
    const was = isObj(poolsB[id]) ? num((poolsB[id] as Obj).current) : undefined;
    const max = maxima[id];
    if (max !== undefined && cur > max && (was === undefined || cur > was)) return deny(`${id} can't go above ${max}`);
  }
  return OK;
}

async function checkToken(
  tokenId: string,
  rest: string[],
  value: unknown,
  uid: string,
  ctx: GateContext,
): Promise<Verdict> {
  const existing = await ctx.read(`games/${ctx.gameId}/tokens/${tokenId}`);

  if (rest.length === 0) {
    // Creating a token: only your own character's, once.
    if (existing !== null && existing !== undefined) return deny('only the GM replaces tokens');
    if (!isObj(value)) return deny('GM only');
    if (value.kind !== 'character' || value.ownerUserId !== uid) return deny('you can only place your own token');
    if (value.id !== tokenId) return deny('token id mismatch');
    if (value.visible === false) return deny('players cannot place hidden tokens');
    if (!isCell(value.col) || !isCell(value.row)) return deny('bad position');
    if (!isStr(value.name, 120) || !isStr(value.mapId, 64)) return deny('bad token');
    const ch = await ctx.read(`characters/${value.characterId}`);
    if (!isObj(ch) || ch.ownerUserId !== uid) return deny('that character is not yours');
    return OK;
  }

  if (!isObj(existing)) return deny('no such token');
  const [field, sub] = rest;

  if (existing.kind === 'party') {
    if (field === 'col' || field === 'row') return isCell(value) && !sub ? OK : deny('bad position');
    if (field === 'draggedBy') return !sub && (value === null || value === uid) ? OK : deny('bad lock');
    if (field === 'draggedAt') return !sub && (value === null || typeof value === 'number') ? OK : deny('bad lock');
    return deny('GM only');
  }

  if (existing.kind !== 'character' || existing.ownerUserId !== uid) return deny('not your token');
  if (field === 'col' || field === 'row') return isCell(value) && !sub ? OK : deny('bad position');
  if (field === 'conditions') {
    if (sub) return value === null || value === true ? OK : deny('bad condition');
    return value === null || (isObj(value) && Object.values(value).every((v) => v === true)) ? OK : deny('bad conditions');
  }
  if (field === 'sizeCategory') return value === null || isStr(value, 32) ? OK : deny('bad size');
  if (field === 'stats') return value === null || isObj(value) ? OK : deny('bad stats');
  return deny('GM only');
}

async function checkChat(id: string, value: unknown, uid: string, ctx: GateContext): Promise<Verdict> {
  const existing = await ctx.read(`games/${ctx.gameId}/chat/${id}`);
  if (existing !== null && existing !== undefined) return deny('messages cannot be changed');
  if (!isObj(value)) return deny('bad message');
  if (value.senderId !== uid) return deny('you can only send as yourself');
  if (value.id !== id || !isStr(value.text, 2000) || !isStr(value.senderName, 64)) return deny('bad message');
  if (!isStr(value.audience, 128)) return deny('bad audience');
  return OK;
}

const ROLL_FIELDS = new Set(['id', 'text', 'at', 'byUid', 'by', 'rngId', 'dice', 'hit']);

async function checkRoll(id: string, value: unknown, uid: string, ctx: GateContext): Promise<Verdict> {
  const existing = await ctx.read(`games/${ctx.gameId}/rollLog/${id}`);
  if (existing !== null && existing !== undefined) return deny('rolls cannot be changed');
  if (!isObj(value)) return deny('rolls cannot be removed by players');
  if (value.byUid !== uid) return deny('you can only roll as yourself');
  if (value.id !== id || !isStr(value.text, 1000) || !isStr(value.by, 64)) return deny('bad roll');
  if (Object.keys(value).some((k) => !ROLL_FIELDS.has(k))) return deny('bad roll');
  const hit = value.hit;
  if (hit !== undefined) {
    if (!isObj(hit) || !isStr(hit.tokenId, 64) || typeof hit.amount !== 'number' || !Number.isInteger(hit.amount) || hit.amount < 0) {
      return deny('bad roll');
    }
    // Attacks only on your own turn during combat (unless the GM allows off-turn attacks).
    if (!mayAttackNow(asInitiative(await ctx.read(`games/${ctx.gameId}/initiative`)), { uid })) {
      return deny("it isn't your turn");
    }
    // A character at 0 HP is down and can't deal damage.
    const myCharId = await ctx.read(`gameCharacters/${ctx.gameId}/${uid}`);
    if (isStr(myCharId, 64)) {
      const hp = await ctx.read(`characters/${myCharId}/play/pools/hp/current`);
      if (typeof hp === 'number' && hp <= 0) return deny("you're down at 0 HP");
    }
  }
  if (value.dice === undefined && value.rngId === undefined) {
    // A plain line, not a checked roll — and so it can't deal damage.
    return hit === undefined ? OK : deny('damage needs checked dice');
  }
  // Claimed dice must be the numbers the GM handed out.
  if (!ctx.dice) return deny('dice cannot be checked');
  const verdict = ctx.dice.verify(uid, { rngId: value.rngId, dice: value.dice });
  if (!verdict.ok) return deny(verdict.reason);
  const followUps: Record<string, unknown> = {};
  if (verdict.skipped > 0) followUps[`/games/${ctx.gameId}/rollLog/${id}/skipped`] = verdict.skipped;
  if (isObj(hit)) {
    const h = hit as unknown as Hit;
    if (h.amount > maxClaimableDamage(value.dice as { s: number; f: number }[])) return deny('more damage than those dice can do');
    Object.assign(followUps, await hitFollowUps(id, h, ctx));
  }
  return Object.keys(followUps).length ? { ok: true, followUps } : OK;
}

/**
 * The GM's copy applies a checked hit: HP off the target (0 → defeated) plus a note on the roll.
 * A target that's gone, already down, or has no HP tracked just gets no damage.
 */
export async function hitFollowUps(
  rollId: string,
  hit: Hit,
  ctx: Pick<GateContext, 'gameId' | 'read'>,
): Promise<Record<string, unknown>> {
  const token = (await ctx.read(`games/${ctx.gameId}/tokens/${hit.tokenId}`)) as Token | null;
  if (!isObj(token) || isDefeated(token)) return {};
  let charHp: number | undefined;
  if (token.kind === 'character' && token.characterId) {
    const v = await ctx.read(`characters/${token.characterId}/play/pools/hp/current`);
    charHp = typeof v === 'number' ? v : undefined;
  }
  // A character already at 0 HP doesn't lose more — each hit is a failed death save (5e).
  if (token.kind === 'character' && token.characterId && charHp === 0) {
    const ds = (await ctx.read(`characters/${token.characterId}/play/deathSaves`)) as DeathSaves | null;
    const next = damageAtZero(ds ?? undefined);
    return {
      [`/characters/${token.characterId}/play/deathSaves`]: next,
      [`/games/${ctx.gameId}/rollLog/${rollId}/applied`]: `${token.name} is hit while down — a failed death save${next.failures >= 3 ? ' · DEAD' : ''}`,
    };
  }
  const changes = hitChanges(ctx.gameId, token, hit.amount, charHp);
  if (!changes) return {};
  const after = token.kind === 'character' ? Math.max(0, (charHp ?? 0) - hit.amount) : Math.max(0, (token.hp?.current ?? 0) - hit.amount);
  return {
    ...changes,
    [`/games/${ctx.gameId}/rollLog/${rollId}/applied`]: hitNote(token.name, hit.amount, after === 0),
  };
}

/** Moving your own placed shape: a new grid square only (token-bound shapes move with the token). */
async function checkShapeMove(id: string, value: unknown, uid: string, ctx: GateContext): Promise<Verdict> {
  const existing = await ctx.read(`games/${ctx.gameId}/shapes/${id}`);
  if (!isObj(existing) || existing.ownerUid !== uid) return deny('not your shape');
  if (!isObj(existing.anchor) || !('col' in existing.anchor)) return deny('that shape follows a token');
  if (!isObj(value) || Object.keys(value).length !== 2 || !Number.isInteger(value.col) || !Number.isInteger(value.row)) {
    return deny('bad shape position');
  }
  return OK;
}

async function checkShapeTurn(id: string, value: unknown, uid: string, ctx: GateContext): Promise<Verdict> {
  const existing = await ctx.read(`games/${ctx.gameId}/shapes/${id}`);
  if (!isObj(existing) || existing.ownerUid !== uid) return deny('not your shape');
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 360) return deny('bad shape angle');
  return OK;
}

async function checkShape(id: string, value: unknown, uid: string, ctx: GateContext): Promise<Verdict> {
  const existing = await ctx.read(`games/${ctx.gameId}/shapes/${id}`);
  if (value === null) {
    return isObj(existing) && existing.ownerUid === uid ? OK : deny('not your shape');
  }
  if (existing !== null && existing !== undefined) return deny('shapes cannot be changed');
  if (!isObj(value) || value.ownerUid !== uid || value.id !== id) return deny('bad shape');
  if (value.hidden) return deny('players cannot draw hidden shapes');
  return OK;
}

interface CombatantLike {
  id: string;
  kind?: string;
  ownerUserId?: string;
  initiative?: unknown;
  tieBreak?: unknown;
  /** The checked d20 behind a player's initiative. */
  roll?: { rngId?: unknown; dice?: unknown };
}
interface InitiativeLike {
  active: boolean;
  phase?: string;
  allowOffTurn?: boolean;
  round: number;
  turnIndex: number;
  order: CombatantLike[];
}

const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

function asInitiative(v: unknown): InitiativeLike | null {
  if (!isObj(v)) return null;
  if (typeof v.round !== 'number' || typeof v.turnIndex !== 'number') return null;
  // An empty order can come back missing (empty arrays aren't stored); that's an empty fight.
  if (v.order === undefined) return { ...(v as unknown as InitiativeLike), order: [] };
  if (!Array.isArray(v.order)) return null;
  return v as unknown as InitiativeLike;
}

/** Initiative is rewritten whole; allow exactly "roll me in" and "end my turn". */
async function checkInitiative(value: unknown, uid: string, ctx: GateContext): Promise<Verdict> {
  const before = asInitiative(await ctx.read(`games/${ctx.gameId}/initiative`));
  const after = asInitiative(value);
  if (!before || !after || !before.active || !after.active) return deny('only the GM starts or ends combat');
  if (after.order.length > 200) return deny('bad initiative');
  if ((after.phase ?? 'running') !== (before.phase ?? 'running')) return deny('only the GM begins combat');
  if (!!after.allowOffTurn !== !!before.allowOffTurn) return deny('only the GM allows off-turn attacks');

  const beforeIds = new Set(before.order.map((c) => c.id));
  const added = after.order.filter((c) => !beforeIds.has(c.id));
  const kept = after.order.filter((c) => beforeIds.has(c.id));
  // Nobody removed, and nobody else's entry changed.
  if (kept.length !== before.order.length) return deny('only the GM removes combatants');
  for (const c of kept) {
    if (!same(c, before.order.find((o) => o.id === c.id))) return deny("you can't change other combatants");
  }

  if (added.length === 1) {
    const me = added[0];
    if (me.kind !== 'character' || me.ownerUserId !== uid) return deny('you can only add yourself');
    if (typeof me.initiative !== 'number' || !Number.isFinite(me.initiative)) return deny('bad initiative');
    if (ctx.dice) {
      // initiative = a checked d20 + the character's modifier (a sane one).
      const dice = me.roll?.dice;
      const tie = me.tieBreak;
      if (!Array.isArray(dice) || dice.length !== 1 || (dice[0] as { s?: unknown })?.s !== 20) {
        return deny('initiative needs a d20 roll');
      }
      if (typeof tie !== 'number' || !Number.isInteger(tie)) return deny('bad initiative modifier');
      const ch = await ctx.read(`characters/${(me as { characterId?: unknown }).characterId}`);
      if (!isObj(ch) || ch.ownerUserId !== uid) return deny('that character is not yours');
      const system = await systemFor(ch, ctx);
      if (system && tie !== initiativeModifier(system, ch as unknown as Character)) {
        return deny("that isn't your character's initiative modifier");
      }
      if (me.initiative !== (dice[0] as { f: number }).f + tie) return deny("initiative doesn't match the roll");
      const verdict = ctx.dice.verify(uid, { rngId: me.roll?.rngId, dice });
      if (!verdict.ok) return deny(verdict.reason);
    }
    if (after.round !== before.round) return deny('joining combat does not change the round');
    const currentId = before.order[before.turnIndex]?.id;
    if (currentId !== undefined && after.order[after.turnIndex]?.id !== currentId) {
      return deny('joining combat does not change whose turn it is');
    }
    return OK;
  }
  if (added.length > 1) return deny('you can only add yourself');

  // Same combatants: must be ending your own turn (once turns have begun).
  if (!same(after.order, before.order)) return deny('only the GM reorders combat');
  if (before.phase === 'rolling') return deny("turns haven't started yet");
  const current = before.order[before.turnIndex];
  if (!current || current.ownerUserId !== uid) return deny("it isn't your turn");
  if (after.turnIndex === before.turnIndex && after.round === before.round) return deny('nothing changed');
  if (after.round !== before.round && after.round !== before.round + 1) return deny('bad round');
  if (after.turnIndex < 0 || after.turnIndex >= after.order.length) return deny('bad turn');
  return OK;
}

// ---------------------------------------------------------------------------
// Reads: what each player is sent
// ---------------------------------------------------------------------------

/**
 * The smallest piece of data whose visibility is decided as a whole. When anything
 * inside one changes, the whole piece is re-read and re-sent (or removed) per player.
 */
export function visibilityRoot(path: string): string {
  const s = split(path);
  const [root, a, b, c, d] = s;
  if (root === 'games' && a && (b === 'tokens' || b === 'chat' || b === 'shapes') && c) {
    return s.slice(0, 4).join('/');
  }
  if (root === 'characters' && a) return s.slice(0, 2).join('/');
  if (root === 'users' && a && b) {
    if (b === 'library' && c) return s.slice(0, 4).join('/');
    return s.slice(0, 3).join('/');
  }
  void d;
  return s.join('/');
}

/** Absent = this player gets nothing for that path (not even a delete). */
export const NOTHING = undefined;

export interface Viewer {
  uid: string;
}

/**
 * What `viewer` may see of `value` stored at `path` (at or above a visibility root).
 * Returns `undefined` when the path is none of the player's business, `null` when
 * they should see it as removed.
 */
export function projectForPlayer(path: string, value: unknown, viewer: Viewer, ctx: GateContext): unknown {
  const s = split(path);
  const [root, a, b, c] = s;
  switch (root) {
    case 'games':
      if (!a) return mapProject(value, (id, v) => (id === ctx.gameId ? projectGame(v, viewer, ctx) : NOTHING));
      if (a !== ctx.gameId) return NOTHING;
      if (!b) return projectGame(value, viewer, ctx);
      if (!c) return projectGameSection(b, value, viewer);
      if (b === 'tokens') return s.length === 4 ? projectToken(value, viewer) : NOTHING;
      if (b === 'chat') return s.length === 4 ? projectChat(value, viewer) : NOTHING;
      if (b === 'shapes') return s.length === 4 ? projectShape(value) : NOTHING;
      return value; // the rest of the game is shared with every player

    case 'characters':
      if (!a) return mapProject(value, (_id, v) => projectCharacter(v, viewer, ctx));
      return s.length === 2 ? projectCharacter(value, viewer, ctx) : NOTHING;

    case 'gameCharacters':
      if (!a) return mapProject(value, (id, v) => (id === ctx.gameId ? v : NOTHING));
      return a === ctx.gameId ? value : NOTHING;

    case 'users':
      if (!a) return mapProject(value, (id, v) => (id === ctx.gmUid ? projectGmUser(v) : NOTHING));
      if (a !== ctx.gmUid) return NOTHING;
      if (!b) return projectGmUser(value);
      if (b === 'library') {
        if (!c) return projectLibrary(value);
        return LIBRARY_SHARED.has(c) && s.length === 4 ? value : NOTHING;
      }
      if (b === 'creatureArt' && s.length === 3) return value;
      if (b === 'creatures' && s.length === 3) return mapProject(value, (_id, v) => creatureSummary(v));
      return NOTHING;

    default:
      return NOTHING; // inviteCodes, userGames, local, anything unknown
  }
}

function mapProject(value: unknown, fn: (key: string, v: unknown) => unknown): unknown {
  if (value === null || value === undefined) return null;
  if (!isObj(value)) return NOTHING;
  const out: Obj = {};
  for (const [k, v] of Object.entries(value)) {
    const p = fn(k, v);
    if (p !== undefined && p !== null) out[k] = p;
  }
  return out;
}

function projectGame(value: unknown, viewer: Viewer, ctx: GateContext): unknown {
  void ctx;
  if (value === null || value === undefined) return null;
  if (!isObj(value)) return NOTHING;
  const out: Obj = {};
  for (const [k, v] of Object.entries(value)) {
    const p = projectGameSection(k, v, viewer);
    if (p !== undefined) out[k] = p;
  }
  return out;
}

function projectGameSection(section: string, value: unknown, viewer: Viewer): unknown {
  switch (section) {
    case 'tokens':
      return mapProject(value, (_id, v) => projectToken(v, viewer));
    case 'chat':
      return mapProject(value, (_id, v) => projectChat(v, viewer));
    case 'shapes':
      return mapProject(value, (_id, v) => projectShape(v));
    default:
      return value;
  }
}

function projectToken(value: unknown, viewer: Viewer): unknown {
  if (!isObj(value)) return value === undefined ? NOTHING : null;
  if (value.kind === 'party') return value;
  const own = value.kind === 'character' && value.ownerUserId === viewer.uid;
  if (!own && value.visible === false) return null; // hidden from this player
  if (value.kind === 'creature' || value.kind === 'trap') {
    // Monsters stay mysterious. Players' attacks need the target's AC (5e) or DR
    // (Solryn); the rest of the stat block, HP and loot stay with the GM.
    const { hp: _hp, lootGiven: _loot, stats, ...rest } = value;
    const shown: Obj = {};
    if (isObj(stats)) for (const k of ATTACK_STATS) if (stats[k] !== undefined) shown[k] = stats[k];
    return Object.keys(shown).length ? { ...rest, stats: shown } : rest;
  }
  return value;
}

/** The only monster stats players receive: what resolving an attack against it needs. */
const ATTACK_STATS = ['ac', 'dr'];

function projectChat(value: unknown, viewer: Viewer): unknown {
  if (!isObj(value)) return value === undefined ? NOTHING : null;
  const visible =
    value.audience === 'public' || value.senderId === viewer.uid || value.audience === viewer.uid;
  return visible ? value : null;
}

function projectShape(value: unknown): unknown {
  if (!isObj(value)) return value === undefined ? NOTHING : null;
  return value.hidden ? null : value;
}

const CHARACTER_PUBLIC = ['id', 'name', 'imageUrl', 'gameId', 'ownerUserId', 'buildComplete'];

function projectCharacter(value: unknown, viewer: Viewer, ctx: GateContext): unknown {
  if (!isObj(value)) return value === undefined ? NOTHING : null;
  if (value.gameId !== ctx.gameId) return NOTHING;
  if (value.ownerUserId === viewer.uid) return value;
  const out: Obj = {};
  for (const k of CHARACTER_PUBLIC) if (value[k] !== undefined) out[k] = value[k];
  return out; // other players' sheets stay private
}

const LIBRARY_SHARED = new Set(['playerOptions', 'rules', 'equipment']);

function projectLibrary(value: unknown): unknown {
  if (!isObj(value)) return value === undefined ? NOTHING : null;
  const out: Obj = {};
  for (const k of LIBRARY_SHARED) if (value[k] !== undefined) out[k] = value[k];
  return out;
}

function creatureSummary(value: unknown): unknown {
  if (!isObj(value)) return NOTHING;
  const out: Obj = {};
  for (const k of ['id', 'name', 'imageUrl']) if (value[k] !== undefined) out[k] = value[k];
  return out;
}

function projectGmUser(value: unknown): unknown {
  if (!isObj(value)) return value === undefined ? NOTHING : null;
  const out: Obj = {};
  if (value.library !== undefined) out.library = projectLibrary(value.library);
  if (value.creatureArt !== undefined) out.creatureArt = value.creatureArt;
  if (value.creatures !== undefined) out.creatures = mapProject(value.creatures, (_id, v) => creatureSummary(v));
  return out;
}

/** Paths that never leave this computer, in either direction. */
export function isPrivatePath(path: string): boolean {
  const p = norm(path);
  if (p === 'local' || p.startsWith('local/')) return true;
  // Each computer keeps its own lobby index and invite-code lookup.
  if (p === 'userGames' || p.startsWith('userGames/')) return true;
  if (p === 'inviteCodes' || p.startsWith('inviteCodes/')) return true;
  // Personal notes are only ever for the person who wrote them.
  return /^users\/[^/]+\/notes(\/|$)/.test(p);
}
