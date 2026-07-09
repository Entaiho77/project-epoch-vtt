import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import initSqlJs, { type Database as SqlDatabase } from 'sql.js';
import type { Campaign, NewCampaign } from '../src/shared/persistence';

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
  /** Flush + release. Exposed for tests and clean shutdown. */
  close(): void;
}

const SCHEMA_VERSION = 1;

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
    db.run('DELETE FROM characters WHERE campaign_id = ?', [id]);
    db.run('DELETE FROM scenes WHERE campaign_id = ?', [id]);
    db.run('DELETE FROM campaigns WHERE id = ?', [id]);
    persist();
  };

  const close = (): void => {
    if (closed) return;
    closed = true;
    persist();
    db.close();
  };

  return { listCampaigns, createCampaign, renameCampaign, deleteCampaign, close };
}
