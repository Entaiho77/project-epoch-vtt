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

/** The surface exposed to the renderer as `window.db`. All calls cross IPC → Promises. */
export interface DbApi {
  listCampaigns(): Promise<Campaign[]>;
  createCampaign(input: NewCampaign): Promise<Campaign>;
  renameCampaign(id: string, name: string): Promise<void>;
  deleteCampaign(id: string): Promise<void>;
}
