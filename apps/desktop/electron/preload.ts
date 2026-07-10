import { contextBridge, ipcRenderer } from 'electron';
import type { ClientMessage, ServerMessage } from '@solryn/protocol';
import type { RelayStatus } from './relay-client';
import type {
  Campaign,
  Character,
  DbApi,
  NewCampaign,
  NewCampaignChild,
  NewToken,
  Scene,
  SceneMapPatch,
  Token,
  TokenPatch,
} from '../src/shared/persistence';

// contextIsolation is on and nodeIntegration is off, so the renderer only ever
// sees these two narrow, typed surfaces — never `ipcRenderer` or node globals.
const relayApi = {
  connect: (url: string): Promise<void> => ipcRenderer.invoke('relay:connect', url),
  disconnect: (): Promise<void> => ipcRenderer.invoke('relay:disconnect'),
  send: (msg: ClientMessage): Promise<void> => ipcRenderer.invoke('relay:send', msg),
  onMessage: (cb: (msg: ServerMessage) => void): void => {
    ipcRenderer.on('relay:message', (_evt, msg: ServerMessage) => cb(msg));
  },
  onStatus: (cb: (status: RelayStatus) => void): void => {
    ipcRenderer.on('relay:status', (_evt, status: RelayStatus) => cb(status));
  },
  removeAllListeners: (): void => {
    ipcRenderer.removeAllListeners('relay:message');
    ipcRenderer.removeAllListeners('relay:status');
  },
};

const appApi = {
  getVersion: (): Promise<string> => ipcRenderer.invoke('app:getVersion'),
};

const dbApi: DbApi = {
  listCampaigns: (): Promise<Campaign[]> => ipcRenderer.invoke('db:listCampaigns'),
  createCampaign: (input: NewCampaign): Promise<Campaign> =>
    ipcRenderer.invoke('db:createCampaign', input),
  renameCampaign: (id: string, name: string): Promise<void> =>
    ipcRenderer.invoke('db:renameCampaign', id, name),
  deleteCampaign: (id: string): Promise<void> => ipcRenderer.invoke('db:deleteCampaign', id),

  listCharacters: (campaignId: string): Promise<Character[]> =>
    ipcRenderer.invoke('db:listCharacters', campaignId),
  createCharacter: (input: NewCampaignChild): Promise<Character> =>
    ipcRenderer.invoke('db:createCharacter', input),
  renameCharacter: (id: string, name: string): Promise<void> =>
    ipcRenderer.invoke('db:renameCharacter', id, name),
  deleteCharacter: (id: string): Promise<void> => ipcRenderer.invoke('db:deleteCharacter', id),

  listScenes: (campaignId: string): Promise<Scene[]> =>
    ipcRenderer.invoke('db:listScenes', campaignId),
  createScene: (input: NewCampaignChild): Promise<Scene> =>
    ipcRenderer.invoke('db:createScene', input),
  renameScene: (id: string, name: string): Promise<void> =>
    ipcRenderer.invoke('db:renameScene', id, name),
  deleteScene: (id: string): Promise<void> => ipcRenderer.invoke('db:deleteScene', id),
  getScene: (id: string): Promise<Scene | null> => ipcRenderer.invoke('db:getScene', id),
  updateSceneMap: (id: string, patch: SceneMapPatch): Promise<Scene> =>
    ipcRenderer.invoke('db:updateSceneMap', id, patch),
  setSceneFog: (id: string, fog: string[]): Promise<void> =>
    ipcRenderer.invoke('db:setSceneFog', id, fog),

  listTokens: (sceneId: string): Promise<Token[]> => ipcRenderer.invoke('db:listTokens', sceneId),
  addToken: (input: NewToken): Promise<Token> => ipcRenderer.invoke('db:addToken', input),
  updateToken: (id: string, patch: TokenPatch): Promise<Token> =>
    ipcRenderer.invoke('db:updateToken', id, patch),
  moveToken: (id: string, x: number, y: number): Promise<void> =>
    ipcRenderer.invoke('db:moveToken', id, x, y),
  removeToken: (id: string): Promise<void> => ipcRenderer.invoke('db:removeToken', id),

  getActiveScene: (campaignId: string): Promise<string | null> =>
    ipcRenderer.invoke('db:getActiveScene', campaignId),
  setActiveScene: (campaignId: string, sceneId: string | null): Promise<void> =>
    ipcRenderer.invoke('db:setActiveScene', campaignId, sceneId),
};

const mapsApi = {
  /** Open a file picker, copy the chosen image locally, return its stored filename (or null). */
  import: (): Promise<string | null> => ipcRenderer.invoke('map:import'),
  /** Read a stored map image back as a data URL (or null if missing). */
  read: (filename: string): Promise<string | null> => ipcRenderer.invoke('map:read', filename),
};

contextBridge.exposeInMainWorld('relay', relayApi);
contextBridge.exposeInMainWorld('app', appApi);
contextBridge.exposeInMainWorld('db', dbApi);
contextBridge.exposeInMainWorld('maps', mapsApi);

export type RelayApi = typeof relayApi;
export type AppApi = typeof appApi;
export type MapsApi = typeof mapsApi;
