import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import initSqlJs, { type Database as SqlDatabase } from 'sql.js';
import type {
  Campaign,
  Character,
  NewCampaign,
  NewCampaignChild,
  NewToken,
  Scene,
  SceneMapPatch,
  Token,
  TokenPatch,
} from '../src/shared/persistence';
import type { MapScale } from '@solryn/protocol';

/**
 * The main-process repository. Synchronous (sql.js runs in-process), returning
 * plain rows; the IPC handlers in main.ts wrap these for the renderer. The whole
 * DB is exported to a file after every mutation — cheap for a single-user, local
 * campaign store, and it keeps writes crash-safe via a temp-file + rename.
 */
export interface Repository {
  listCampaigns(): Campaign[];
  createCampaign(input: NewCampaign): Campaign;
  renameCampaign(id: string, name: string): void;
  deleteCampaign(id: string): void;

  listCharacters(campaignId: string): Character[];
  createCharacter(input: NewCampaignChild): Character;
  renameCharacter(id: string, name: string): void;
  deleteCharacter(id: string): void;

  listScenes(campaignId: string): Scene[];
  createScene(input: NewCampaignChild): Scene;
  renameScene(id: string, name: string): void;
  deleteScene(id: string): void;
  getScene(id: string): Scene | null;
  updateSceneMap(id: string, patch: SceneMapPatch): Scene;
  setSceneFog(id: string, fog: string[]): void;

  listTokens(sceneId: string): Token[];
  addToken(input: NewToken): Token;
  updateToken(id: string, patch: TokenPatch): Token;
  moveToken(id: string, x: number, y: number): void;
  removeToken(id: string): void;

  getActiveScene(campaignId: string): string | null;
  setActiveScene(campaignId: string, sceneId: string | null): void;

  /** Flush + release. Exposed for tests and clean shutdown. */
  close(): void;
}

const SCHEMA_VERSION = 2;

function userVersion(db: SqlDatabase): number {
  const res = db.exec('PRAGMA user_version');
  return res.length && res[0].values.length ? Number(res[0].values[0][0]) : 0;
}

function migrate(db: SqlDatabase): void {
  if (userVersion(db) < 1) {
    db.run(`
      CREATE TABLE campaigns (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        system     TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE TABLE characters (
        id          TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL REFERENCES campaigns(id),
        name        TEXT NOT NULL,
        data        TEXT NOT NULL DEFAULT '{}',
        created_at  INTEGER NOT NULL,
        updated_at  INTEGER NOT NULL
      );
      CREATE TABLE scenes (
        id          TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL REFERENCES campaigns(id),
        name        TEXT NOT NULL,
        data        TEXT NOT NULL DEFAULT '{}',
        created_at  INTEGER NOT NULL,
        updated_at  INTEGER NOT NULL
      );
      CREATE INDEX idx_characters_campaign ON characters(campaign_id);
      CREATE INDEX idx_scenes_campaign ON scenes(campaign_id);
    `);
    db.run('PRAGMA user_version = 1');
  }

  // v2 — the tabletop: map config on scenes, tokens, and per-campaign session state.
  if (userVersion(db) < 2) {
    db.run(`
      ALTER TABLE scenes ADD COLUMN map_image TEXT;
      ALTER TABLE scenes ADD COLUMN grid_size INTEGER NOT NULL DEFAULT 70;
      ALTER TABLE scenes ADD COLUMN map_scale TEXT NOT NULL DEFAULT 'battle';
      ALTER TABLE scenes ADD COLUMN fog TEXT NOT NULL DEFAULT '[]';
      CREATE TABLE tokens (
        id           TEXT PRIMARY KEY,
        scene_id     TEXT NOT NULL REFERENCES scenes(id),
        character_id TEXT,
        name         TEXT NOT NULL,
        x            REAL NOT NULL,
        y            REAL NOT NULL,
        size         INTEGER NOT NULL DEFAULT 1,
        color        TEXT NOT NULL,
        image        TEXT,
        hidden       INTEGER NOT NULL DEFAULT 0,
        created_at   INTEGER NOT NULL,
        updated_at   INTEGER NOT NULL
      );
      CREATE INDEX idx_tokens_scene ON tokens(scene_id);
      CREATE TABLE session_state (
        campaign_id     TEXT PRIMARY KEY REFERENCES campaigns(id),
        active_scene_id TEXT,
        updated_at      INTEGER NOT NULL
      );
    `);
    db.run(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  }
}

/**
 * Open (or create) the campaign database at `dbPath`. `wasmPath` is the absolute
 * path to sql.js's `sql-wasm.wasm`; the caller resolves it (via require.resolve)
 * so this module stays free of any Electron/bundler assumptions and is testable
 * headlessly.
 */
export async function openDatabase(dbPath: string, wasmPath: string): Promise<Repository> {
  const SQL = await initSqlJs({ locateFile: () => wasmPath });
  const db: SqlDatabase = existsSync(dbPath)
    ? new SQL.Database(readFileSync(dbPath))
    : new SQL.Database();

  migrate(db);

  let closed = false;

  const persist = (): void => {
    const bytes = Buffer.from(db.export());
    const tmp = `${dbPath}.tmp`;
    writeFileSync(tmp, bytes);
    renameSync(tmp, dbPath);
  };

  const listCampaigns = (): Campaign[] => {
    const res = db.exec(
      'SELECT id, name, system, created_at, updated_at FROM campaigns ORDER BY updated_at DESC',
    );
    if (!res.length) return [];
    return res[0].values.map((row) => ({
      id: String(row[0]),
      name: String(row[1]),
      system: String(row[2]),
      createdAt: Number(row[3]),
      updatedAt: Number(row[4]),
    }));
  };

  const createCampaign = (input: NewCampaign): Campaign => {
    const now = Date.now();
    const campaign: Campaign = {
      id: randomUUID(),
      name: input.name.trim(),
      system: input.system,
      createdAt: now,
      updatedAt: now,
    };
    db.run('INSERT INTO campaigns (id, name, system, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [
      campaign.id,
      campaign.name,
      campaign.system,
      campaign.createdAt,
      campaign.updatedAt,
    ]);
    persist();
    return campaign;
  };

  const renameCampaign = (id: string, name: string): void => {
    db.run('UPDATE campaigns SET name = ?, updated_at = ? WHERE id = ?', [name.trim(), Date.now(), id]);
    persist();
  };

  const deleteCampaign = (id: string): void => {
    db.run('DELETE FROM tokens WHERE scene_id IN (SELECT id FROM scenes WHERE campaign_id = ?)', [id]);
    db.run('DELETE FROM characters WHERE campaign_id = ?', [id]);
    db.run('DELETE FROM scenes WHERE campaign_id = ?', [id]);
    db.run('DELETE FROM session_state WHERE campaign_id = ?', [id]);
    db.run('DELETE FROM campaigns WHERE id = ?', [id]);
    persist();
  };

  // Characters are simple campaign-scoped, named rows.
  const characterRepo = () => {
    const list = (campaignId: string): Character[] => {
      const res = db.exec(
        'SELECT id, campaign_id, name, created_at, updated_at FROM characters WHERE campaign_id = ? ORDER BY updated_at DESC',
        [campaignId],
      );
      if (!res.length) return [];
      return res[0].values.map((row) => ({
        id: String(row[0]),
        campaignId: String(row[1]),
        name: String(row[2]),
        createdAt: Number(row[3]),
        updatedAt: Number(row[4]),
      }));
    };

    const create = (input: NewCampaignChild): Character => {
      const now = Date.now();
      const entity: Character = {
        id: randomUUID(),
        campaignId: input.campaignId,
        name: input.name.trim(),
        createdAt: now,
        updatedAt: now,
      };
      db.run('INSERT INTO characters (id, campaign_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [
        entity.id,
        entity.campaignId,
        entity.name,
        now,
        now,
      ]);
      persist();
      return entity;
    };

    const rename = (id: string, name: string): void => {
      db.run('UPDATE characters SET name = ?, updated_at = ? WHERE id = ?', [name.trim(), Date.now(), id]);
      persist();
    };

    const remove = (id: string): void => {
      db.run('DELETE FROM characters WHERE id = ?', [id]);
      persist();
    };

    return { list, create, rename, remove };
  };

  const characters = characterRepo();

  // --- Scenes (now carry the map: image, grid, scale, fog) ------------------
  const SCENE_COLS = 'id, campaign_id, name, map_image, grid_size, map_scale, fog, created_at, updated_at';
  const rowToScene = (row: unknown[]): Scene => ({
    id: String(row[0]),
    campaignId: String(row[1]),
    name: String(row[2]),
    mapImage: row[3] === null ? null : String(row[3]),
    gridSize: Number(row[4]),
    scale: String(row[5]) as MapScale,
    fog: JSON.parse(String(row[6])) as string[],
    createdAt: Number(row[7]),
    updatedAt: Number(row[8]),
  });

  const listScenes = (campaignId: string): Scene[] => {
    const res = db.exec(
      `SELECT ${SCENE_COLS} FROM scenes WHERE campaign_id = ? ORDER BY updated_at DESC`,
      [campaignId],
    );
    return res.length ? res[0].values.map(rowToScene) : [];
  };

  const getScene = (id: string): Scene | null => {
    const res = db.exec(`SELECT ${SCENE_COLS} FROM scenes WHERE id = ?`, [id]);
    return res.length && res[0].values.length ? rowToScene(res[0].values[0]) : null;
  };

  const createScene = (input: NewCampaignChild): Scene => {
    const now = Date.now();
    const id = randomUUID();
    db.run(
      'INSERT INTO scenes (id, campaign_id, name, grid_size, map_scale, fog, created_at, updated_at) VALUES (?, ?, ?, 70, ?, ?, ?, ?)',
      [id, input.campaignId, input.name.trim(), 'battle', '[]', now, now],
    );
    persist();
    return {
      id,
      campaignId: input.campaignId,
      name: input.name.trim(),
      mapImage: null,
      gridSize: 70,
      scale: 'battle',
      fog: [],
      createdAt: now,
      updatedAt: now,
    };
  };

  const renameScene = (id: string, name: string): void => {
    db.run('UPDATE scenes SET name = ?, updated_at = ? WHERE id = ?', [name.trim(), Date.now(), id]);
    persist();
  };

  const deleteScene = (id: string): void => {
    db.run('DELETE FROM tokens WHERE scene_id = ?', [id]);
    db.run('DELETE FROM scenes WHERE id = ?', [id]);
    persist();
  };

  const updateSceneMap = (id: string, patch: SceneMapPatch): Scene => {
    const sets: string[] = [];
    const vals: unknown[] = [];
    if (patch.mapImage !== undefined) {
      sets.push('map_image = ?');
      vals.push(patch.mapImage);
    }
    if (patch.gridSize !== undefined) {
      sets.push('grid_size = ?');
      vals.push(patch.gridSize);
    }
    if (patch.scale !== undefined) {
      sets.push('map_scale = ?');
      vals.push(patch.scale);
    }
    sets.push('updated_at = ?');
    vals.push(Date.now());
    vals.push(id);
    db.run(`UPDATE scenes SET ${sets.join(', ')} WHERE id = ?`, vals as never[]);
    persist();
    const scene = getScene(id);
    if (!scene) throw new Error(`Scene ${id} not found`);
    return scene;
  };

  const setSceneFog = (id: string, fog: string[]): void => {
    db.run('UPDATE scenes SET fog = ?, updated_at = ? WHERE id = ?', [JSON.stringify(fog), Date.now(), id]);
    persist();
  };

  // --- Tokens ----------------------------------------------------------------
  const TOKEN_COLS =
    'id, scene_id, character_id, name, x, y, size, color, image, hidden, created_at, updated_at';
  const rowToToken = (row: unknown[]): Token => ({
    id: String(row[0]),
    sceneId: String(row[1]),
    characterId: row[2] === null ? null : String(row[2]),
    name: String(row[3]),
    x: Number(row[4]),
    y: Number(row[5]),
    size: Number(row[6]),
    color: String(row[7]),
    image: row[8] === null ? null : String(row[8]),
    hidden: Number(row[9]) === 1,
    createdAt: Number(row[10]),
    updatedAt: Number(row[11]),
  });

  const listTokens = (sceneId: string): Token[] => {
    const res = db.exec(
      `SELECT ${TOKEN_COLS} FROM tokens WHERE scene_id = ? ORDER BY created_at ASC`,
      [sceneId],
    );
    return res.length ? res[0].values.map(rowToToken) : [];
  };

  const getToken = (id: string): Token | null => {
    const res = db.exec(`SELECT ${TOKEN_COLS} FROM tokens WHERE id = ?`, [id]);
    return res.length && res[0].values.length ? rowToToken(res[0].values[0]) : null;
  };

  const addToken = (input: NewToken): Token => {
    const now = Date.now();
    const token: Token = {
      id: randomUUID(),
      sceneId: input.sceneId,
      characterId: input.characterId ?? null,
      name: input.name,
      x: input.x,
      y: input.y,
      size: input.size ?? 1,
      color: input.color,
      image: input.image ?? null,
      hidden: input.hidden ?? false,
      createdAt: now,
      updatedAt: now,
    };
    db.run(
      `INSERT INTO tokens (${TOKEN_COLS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        token.id,
        token.sceneId,
        token.characterId,
        token.name,
        token.x,
        token.y,
        token.size,
        token.color,
        token.image,
        token.hidden ? 1 : 0,
        token.createdAt,
        token.updatedAt,
      ],
    );
    persist();
    return token;
  };

  const updateToken = (id: string, patch: TokenPatch): Token => {
    const cols: Record<keyof TokenPatch, string> = {
      name: 'name',
      x: 'x',
      y: 'y',
      size: 'size',
      color: 'color',
      image: 'image',
      hidden: 'hidden',
    };
    const sets: string[] = [];
    const vals: unknown[] = [];
    (Object.keys(patch) as (keyof TokenPatch)[]).forEach((key) => {
      const value = patch[key];
      if (value === undefined) return;
      sets.push(`${cols[key]} = ?`);
      vals.push(key === 'hidden' ? (value ? 1 : 0) : value);
    });
    sets.push('updated_at = ?');
    vals.push(Date.now());
    vals.push(id);
    db.run(`UPDATE tokens SET ${sets.join(', ')} WHERE id = ?`, vals as never[]);
    persist();
    const token = getToken(id);
    if (!token) throw new Error(`Token ${id} not found`);
    return token;
  };

  // Hot path during a drag — avoids reading the row back on every move.
  const moveToken = (id: string, x: number, y: number): void => {
    db.run('UPDATE tokens SET x = ?, y = ?, updated_at = ? WHERE id = ?', [x, y, Date.now(), id]);
    persist();
  };

  const removeToken = (id: string): void => {
    db.run('DELETE FROM tokens WHERE id = ?', [id]);
    persist();
  };

  // --- Per-campaign session state -------------------------------------------
  const getActiveScene = (campaignId: string): string | null => {
    const res = db.exec('SELECT active_scene_id FROM session_state WHERE campaign_id = ?', [campaignId]);
    if (!res.length || !res[0].values.length) return null;
    const value = res[0].values[0][0];
    return value === null ? null : String(value);
  };

  const setActiveScene = (campaignId: string, sceneId: string | null): void => {
    db.run(
      `INSERT INTO session_state (campaign_id, active_scene_id, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(campaign_id) DO UPDATE SET active_scene_id = excluded.active_scene_id, updated_at = excluded.updated_at`,
      [campaignId, sceneId, Date.now()],
    );
    persist();
  };

  const close = (): void => {
    if (closed) return;
    closed = true;
    persist();
    db.close();
  };

  return {
    listCampaigns,
    createCampaign,
    renameCampaign,
    deleteCampaign,
    listCharacters: characters.list,
    createCharacter: characters.create,
    renameCharacter: characters.rename,
    deleteCharacter: characters.remove,
    listScenes,
    createScene,
    renameScene,
    deleteScene,
    getScene,
    updateSceneMap,
    setSceneFog,
    listTokens,
    addToken,
    updateToken,
    moveToken,
    removeToken,
    getActiveScene,
    setActiveScene,
    close,
  };
}
