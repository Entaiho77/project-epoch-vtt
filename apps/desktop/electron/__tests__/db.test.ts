import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { openDatabase, type Repository } from '../db';

const require = createRequire(import.meta.url);
const wasmPath = require.resolve('sql.js/dist/sql-wasm.wasm');

describe('campaign repository', () => {
  let dir: string;
  let dbPath: string;
  let repo: Repository;

  beforeEach(async () => {
    dir = mkdtempSync(join(tmpdir(), 'epoch-db-'));
    dbPath = join(dir, 'epoch.db');
    repo = await openDatabase(dbPath, wasmPath);
  });

  afterEach(() => {
    repo.close();
    rmSync(dir, { recursive: true, force: true });
  });

  it('starts empty', () => {
    expect(repo.listCampaigns()).toEqual([]);
  });

  it('creates and lists a campaign', () => {
    const created = repo.createCampaign({ name: 'Curse of Strahd', system: 'dnd5e' });
    expect(created.id).toBeTruthy();
    expect(created.name).toBe('Curse of Strahd');

    const list = repo.listCampaigns();
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ name: 'Curse of Strahd', system: 'dnd5e' });
  });

  it('renames a campaign', () => {
    const c = repo.createCampaign({ name: 'Draft', system: 'solryn' });
    repo.renameCampaign(c.id, 'The Sunless Vale');
    expect(repo.listCampaigns()[0].name).toBe('The Sunless Vale');
  });

  it('deletes a campaign', () => {
    const c = repo.createCampaign({ name: 'Throwaway', system: 'dnd5e' });
    repo.deleteCampaign(c.id);
    expect(repo.listCampaigns()).toEqual([]);
  });

  it('orders by most recently updated first', () => {
    const a = repo.createCampaign({ name: 'A', system: 'dnd5e' });
    repo.createCampaign({ name: 'B', system: 'dnd5e' });
    // Touch A so it becomes the most recently updated.
    repo.renameCampaign(a.id, 'A (edited)');
    expect(repo.listCampaigns().map((c) => c.name)).toEqual(['A (edited)', 'B']);
  });

  it('persists across reopen', async () => {
    repo.createCampaign({ name: 'Persistent', system: 'solryn' });
    repo.close();

    const reopened = await openDatabase(dbPath, wasmPath);
    const list = reopened.listCampaigns();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Persistent');
    reopened.close();
  });
});

describe('characters & scenes', () => {
  let dir: string;
  let dbPath: string;
  let repo: Repository;
  let campaignId: string;

  beforeEach(async () => {
    dir = mkdtempSync(join(tmpdir(), 'epoch-db-'));
    dbPath = join(dir, 'epoch.db');
    repo = await openDatabase(dbPath, wasmPath);
    campaignId = repo.createCampaign({ name: 'Campaign', system: 'dnd5e' }).id;
  });

  afterEach(() => {
    repo.close();
    rmSync(dir, { recursive: true, force: true });
  });

  it('creates and lists characters scoped to their campaign', () => {
    const other = repo.createCampaign({ name: 'Other', system: 'dnd5e' }).id;
    repo.createCharacter({ campaignId, name: 'Aria' });
    repo.createCharacter({ campaignId, name: 'Borin' });
    repo.createCharacter({ campaignId: other, name: 'Elsewhere' });

    const names = repo.listCharacters(campaignId).map((c) => c.name);
    expect(names).toContain('Aria');
    expect(names).toContain('Borin');
    expect(names).not.toContain('Elsewhere');
    expect(repo.listCharacters(other)).toHaveLength(1);
  });

  it('renames and deletes a scene', () => {
    const s = repo.createScene({ campaignId, name: 'Tavern' });
    repo.renameScene(s.id, 'The Yawning Portal');
    expect(repo.listScenes(campaignId)[0].name).toBe('The Yawning Portal');
    repo.deleteScene(s.id);
    expect(repo.listScenes(campaignId)).toEqual([]);
  });

  it('cascades: deleting a campaign removes its characters and scenes', () => {
    repo.createCharacter({ campaignId, name: 'Aria' });
    repo.createScene({ campaignId, name: 'Tavern' });
    repo.deleteCampaign(campaignId);
    expect(repo.listCharacters(campaignId)).toEqual([]);
    expect(repo.listScenes(campaignId)).toEqual([]);
  });

  it('persists characters across reopen', async () => {
    repo.createCharacter({ campaignId, name: 'Aria' });
    repo.close();

    const reopened = await openDatabase(dbPath, wasmPath);
    expect(reopened.listCharacters(campaignId).map((c) => c.name)).toEqual(['Aria']);
    reopened.close();
  });
});

describe('scene map, tokens, fog & session state', () => {
  let dir: string;
  let dbPath: string;
  let repo: Repository;
  let campaignId: string;
  let sceneId: string;

  beforeEach(async () => {
    dir = mkdtempSync(join(tmpdir(), 'epoch-db-'));
    dbPath = join(dir, 'epoch.db');
    repo = await openDatabase(dbPath, wasmPath);
    campaignId = repo.createCampaign({ name: 'Campaign', system: 'dnd5e' }).id;
    sceneId = repo.createScene({ campaignId, name: 'Dungeon' }).id;
  });

  afterEach(() => {
    repo.close();
    rmSync(dir, { recursive: true, force: true });
  });

  it('gives new scenes sensible map defaults', () => {
    const scene = repo.getScene(sceneId);
    expect(scene).not.toBeNull();
    expect(scene).toMatchObject({ mapImage: null, gridSize: 70, scale: 'battle', fog: [] });
  });

  it('updates scene map config', () => {
    const updated = repo.updateSceneMap(sceneId, { mapImage: 'abc.png', gridSize: 50, scale: 'area' });
    expect(updated).toMatchObject({ mapImage: 'abc.png', gridSize: 50, scale: 'area' });
    expect(repo.getScene(sceneId)?.gridSize).toBe(50);
  });

  it('saves and reads fog cells', () => {
    repo.setSceneFog(sceneId, ['1,1', '1,2', '2,1']);
    expect(repo.getScene(sceneId)?.fog).toEqual(['1,1', '1,2', '2,1']);
  });

  it('adds, moves, updates and removes tokens', () => {
    const t = repo.addToken({ sceneId, name: 'Goblin', x: 3, y: 4, color: '#c33' });
    expect(t).toMatchObject({ name: 'Goblin', x: 3, y: 4, size: 1, hidden: false });

    repo.moveToken(t.id, 5, 6);
    expect(repo.listTokens(sceneId)[0]).toMatchObject({ x: 5, y: 6 });

    const upd = repo.updateToken(t.id, { size: 2, hidden: true, color: '#39f' });
    expect(upd).toMatchObject({ size: 2, hidden: true, color: '#39f' });

    repo.removeToken(t.id);
    expect(repo.listTokens(sceneId)).toEqual([]);
  });

  it('scopes tokens to their scene', () => {
    const other = repo.createScene({ campaignId, name: 'Forest' }).id;
    repo.addToken({ sceneId, name: 'A', x: 0, y: 0, color: '#111' });
    repo.addToken({ sceneId: other, name: 'B', x: 0, y: 0, color: '#222' });
    expect(repo.listTokens(sceneId).map((t) => t.name)).toEqual(['A']);
    expect(repo.listTokens(other).map((t) => t.name)).toEqual(['B']);
  });

  it('links a token to a character', () => {
    const charId = repo.createCharacter({ campaignId, name: 'Aria' }).id;
    const t = repo.addToken({ sceneId, characterId: charId, name: 'Aria', x: 1, y: 1, color: '#0a0' });
    expect(t.characterId).toBe(charId);
  });

  it('tracks the active scene per campaign', () => {
    expect(repo.getActiveScene(campaignId)).toBeNull();
    repo.setActiveScene(campaignId, sceneId);
    expect(repo.getActiveScene(campaignId)).toBe(sceneId);
    repo.setActiveScene(campaignId, null);
    expect(repo.getActiveScene(campaignId)).toBeNull();
  });

  it('deleting a scene removes its tokens', () => {
    repo.addToken({ sceneId, name: 'A', x: 0, y: 0, color: '#111' });
    repo.deleteScene(sceneId);
    expect(repo.listTokens(sceneId)).toEqual([]);
  });

  it('deleting a campaign cascades to tokens and session state', () => {
    repo.addToken({ sceneId, name: 'A', x: 0, y: 0, color: '#111' });
    repo.setActiveScene(campaignId, sceneId);
    repo.deleteCampaign(campaignId);
    expect(repo.listTokens(sceneId)).toEqual([]);
    expect(repo.getActiveScene(campaignId)).toBeNull();
  });

  it('persists map, tokens & fog across reopen', async () => {
    repo.updateSceneMap(sceneId, { mapImage: 'm.png', gridSize: 64 });
    repo.addToken({ sceneId, name: 'Keep', x: 2, y: 2, color: '#abc' });
    repo.setSceneFog(sceneId, ['0,0']);
    repo.setActiveScene(campaignId, sceneId);
    repo.close();

    const reopened = await openDatabase(dbPath, wasmPath);
    expect(reopened.getScene(sceneId)).toMatchObject({ mapImage: 'm.png', gridSize: 64, fog: ['0,0'] });
    expect(reopened.listTokens(sceneId).map((t) => t.name)).toEqual(['Keep']);
    expect(reopened.getActiveScene(campaignId)).toBe(sceneId);
    reopened.close();
  });
});

// A v1 database (campaigns/characters/scenes, no map columns) must upgrade to v2
// on open without losing data — the real path for anyone who ran the last build.
describe('v1 → v2 migration', () => {
  it('adds map columns and tables to an existing v1 database', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'epoch-db-'));
    const dbPath = join(dir, 'epoch.db');

    // Build a v1 database by hand (mirrors the original schema + user_version 1).
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs({ locateFile: () => wasmPath });
    const raw = new SQL.Database();
    raw.run(`
      CREATE TABLE campaigns (id TEXT PRIMARY KEY, name TEXT NOT NULL, system TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
      CREATE TABLE characters (id TEXT PRIMARY KEY, campaign_id TEXT NOT NULL, name TEXT NOT NULL, data TEXT NOT NULL DEFAULT '{}', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
      CREATE TABLE scenes (id TEXT PRIMARY KEY, campaign_id TEXT NOT NULL, name TEXT NOT NULL, data TEXT NOT NULL DEFAULT '{}', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
      INSERT INTO campaigns VALUES ('c1', 'Legacy', 'dnd5e', 1, 1);
      INSERT INTO scenes VALUES ('s1', 'c1', 'Old Scene', '{}', 1, 1);
      PRAGMA user_version = 1;
    `);
    writeFileSync(dbPath, Buffer.from(raw.export()));
    raw.close();

    const repo = await openDatabase(dbPath, wasmPath);
    // Existing data survived and gained v2 defaults.
    const scene = repo.getScene('s1');
    expect(scene).toMatchObject({ name: 'Old Scene', gridSize: 70, scale: 'battle', fog: [] });
    // New v2 capabilities work on the upgraded DB.
    repo.addToken({ sceneId: 's1', name: 'New', x: 0, y: 0, color: '#111' });
    expect(repo.listTokens('s1')).toHaveLength(1);
    repo.close();
    rmSync(dir, { recursive: true, force: true });
  });
});
