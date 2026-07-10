/**
 * Pure persistence types shared by the main-process DB layer (electron/db.ts)
 * and the renderer's window.db bridge. Only `import type` — both sides erase it,
 * so the renderer never pulls in Node/Electron code.
 *
 * The storage engine (currently sql.js) lives entirely behind DbApi; swapping it
 * (e.g. for better-sqlite3) must not change these shapes.
 */

import type { MapScale } from '@solryn/protocol';

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

/**
 * A map/encounter scene belonging to a campaign. Carries the tabletop map: the
 * uploaded image (a filename under userData/maps, GM-local), grid size, scale,
 * and the fog cell set ("col,row" keys).
 */
export interface Scene {
  id: string;
  campaignId: string;
  name: string;
  /** Filename of the map image under userData/maps, or null if none uploaded. */
  mapImage: string | null;
  /** Pixels per grid square in the map image's coordinate space. */
  gridSize: number;
  scale: MapScale;
  /** Fogged grid cells as "col,row" keys. */
  fog: string[];
  createdAt: number;
  updatedAt: number;
}

/** Input for creating a campaign-scoped, named entity (character or scene). */
export interface NewCampaignChild {
  campaignId: string;
  name: string;
}

/** Patch for a scene's map configuration. */
export interface SceneMapPatch {
  mapImage?: string | null;
  gridSize?: number;
  scale?: MapScale;
}

/** A token placed on a scene's map. Coordinates are in grid squares. */
export interface Token {
  id: string;
  sceneId: string;
  /** Set when the token represents a campaign character; null for ad-hoc tokens. */
  characterId: string | null;
  name: string;
  x: number;
  y: number;
  /** Footprint in squares (1 = medium, 2 = large, …). */
  size: number;
  color: string;
  /** Optional token image as a data URL, or null. */
  image: string | null;
  /** GM-only visibility: hidden tokens are never sent to players. */
  hidden: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface NewToken {
  sceneId: string;
  characterId?: string | null;
  name: string;
  x: number;
  y: number;
  size?: number;
  color: string;
  image?: string | null;
  hidden?: boolean;
}

/** Mutable token fields (position, appearance, visibility). */
export interface TokenPatch {
  name?: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  image?: string | null;
  hidden?: boolean;
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
  getScene(id: string): Promise<Scene | null>;
  updateSceneMap(id: string, patch: SceneMapPatch): Promise<Scene>;
  setSceneFog(id: string, fog: string[]): Promise<void>;

  listTokens(sceneId: string): Promise<Token[]>;
  addToken(input: NewToken): Promise<Token>;
  updateToken(id: string, patch: TokenPatch): Promise<Token>;
  moveToken(id: string, x: number, y: number): Promise<void>;
  removeToken(id: string): Promise<void>;

  /** The scene the GM currently has active for a campaign's session, if any. */
  getActiveScene(campaignId: string): Promise<string | null>;
  setActiveScene(campaignId: string, sceneId: string | null): Promise<void>;
}
