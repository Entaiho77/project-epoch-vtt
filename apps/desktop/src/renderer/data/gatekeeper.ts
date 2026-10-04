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
 *  - chat messages and dice-log entries they send (new entries only)
 *  - shapes they draw (not GM-hidden ones), and removing their own shapes
 *  - initiative: rolling themselves in, and ending their own turn
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
}

export type Verdict = { ok: true } | { ok: false; reason: string };

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
  for (const [path, value] of assignments) {
    const verdict = await checkAssignment(split(path), value, uid, ctx, read, assignments);
    if (!verdict.ok) return { ok: false, reason: `${path}: ${verdict.reason}` };
  }
  return OK;
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
      return c && rest.length === 0 ? checkShape(c, value, uid, ctx) : deny('GM only');
    case 'initiative':
      return c === undefined ? checkInitiative(value, uid, ctx) : deny('GM only');
    default:
      void all;
      return deny('GM only');
  }
}

/** Fields a player can never change on their own character. */
const CHARACTER_FIXED = new Set(['id', 'ownerUserId', 'gameId']);

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

async function checkRoll(id: string, value: unknown, uid: string, ctx: GateContext): Promise<Verdict> {
  const existing = await ctx.read(`games/${ctx.gameId}/rollLog/${id}`);
  if (existing !== null && existing !== undefined) return deny('rolls cannot be changed');
  if (!isObj(value)) return deny('rolls cannot be removed by players');
  if (value.byUid !== uid) return deny('you can only roll as yourself');
  if (value.id !== id || !isStr(value.text, 1000) || !isStr(value.by, 64)) return deny('bad roll');
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
}
interface InitiativeLike {
  active: boolean;
  round: number;
  turnIndex: number;
  order: CombatantLike[];
}

const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

function asInitiative(v: unknown): InitiativeLike | null {
  if (!isObj(v) || !Array.isArray(v.order)) return null;
  if (typeof v.round !== 'number' || typeof v.turnIndex !== 'number') return null;
  return v as unknown as InitiativeLike;
}

/** Initiative is rewritten whole; allow exactly "roll me in" and "end my turn". */
async function checkInitiative(value: unknown, uid: string, ctx: GateContext): Promise<Verdict> {
  const before = asInitiative(await ctx.read(`games/${ctx.gameId}/initiative`));
  const after = asInitiative(value);
  if (!before || !after || !before.active || !after.active) return deny('only the GM starts or ends combat');
  if (after.order.length > 200) return deny('bad initiative');

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
    if (after.round !== before.round) return deny('joining combat does not change the round');
    const currentId = before.order[before.turnIndex]?.id;
    if (currentId !== undefined && after.order[after.turnIndex]?.id !== currentId) {
      return deny('joining combat does not change whose turn it is');
    }
    return OK;
  }
  if (added.length > 1) return deny('you can only add yourself');

  // Same combatants: must be ending your own turn.
  if (!same(after.order, before.order)) return deny('only the GM reorders combat');
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
