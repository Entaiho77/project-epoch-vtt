import { mkdtempSync, rmSync } from 'node:fs';
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
