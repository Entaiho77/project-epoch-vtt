/**
 * Pure persistence types shared by the main-process DB layer (electron/db.ts)
 * and the renderer's window.db bridge. No runtime imports — `import type` on
 * both sides erases, so the renderer never pulls in Node/Electron code.
 *
 * The storage engine (currently sql.js) lives entirely behind DbApi; swapping it
 * (e.g. for better-sqlite3) must not change these shapes.
 */

export interface Campaign {
  id: string;
  name: string;
  /** System id, e.g. 'dnd5e' or 'solryn'. */
  system: string;
  createdAt: number;
  updatedAt: number;
}

export interface NewCampaign {
  name: string;
  system: string;
}

/** A player character or NPC belonging to a campaign. `data` holds system-specific state. */
export interface Character {
  id: string;
  campaignId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

/** A map/encounter scene belonging to a campaign. */
export interface Scene {
  id: string;
  campaignId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

/** Input for creating a campaign-scoped, named entity (character or scene). */
export interface NewCampaignChild {
  campaignId: string;
  name: string;
}

/** The surface exposed to the renderer as `window.db`. All calls cross IPC → Promises. */
export interface DbApi {
  listCampaigns(): Promise<Campaign[]>;
  createCampaign(input: NewCampaign): Promise<Campaign>;
  renameCampaign(id: string, name: string): Promise<void>;
  deleteCampaign(id: string): Promise<void>;

  listCharacters(campaignId: string): Promise<Character[]>;
  createCharacter(input: NewCampaignChild): Promise<Character>;
  renameCharacter(id: string, name: string): Promise<void>;
  deleteCharacter(id: string): Promise<void>;

  listScenes(campaignId: string): Promise<Scene[]>;
  createScene(input: NewCampaignChild): Promise<Scene>;
  renameScene(id: string, name: string): Promise<void>;
  deleteScene(id: string): Promise<void>;
}
