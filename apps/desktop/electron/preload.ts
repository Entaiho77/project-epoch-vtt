import { contextBridge, ipcRenderer } from 'electron';
import type { ClientMessage, ServerMessage } from '@solryn/protocol';
import type { RelayStatus } from './relay-client';

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

contextBridge.exposeInMainWorld('relay', relayApi);
contextBridge.exposeInMainWorld('app', appApi);

export type RelayApi = typeof relayApi;
export type AppApi = typeof appApi;
