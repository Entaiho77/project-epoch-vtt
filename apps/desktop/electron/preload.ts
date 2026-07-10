import { contextBridge, ipcRenderer } from 'electron';

/**
 * The renderer's only two doors into native capability (contextIsolation on,
 * nodeIntegration off). Shapes match the brief: window.db is the Firebase-path
 * key-value store, window.relay is the multiplayer socket.
 */

const dbApi = {
  read: (path: string): Promise<unknown> => ipcRenderer.invoke('db:read', path),
  write: (path: string, value: unknown): Promise<void> => ipcRenderer.invoke('db:write', path, value),
  update: (path: string, value: unknown): Promise<void> => ipcRenderer.invoke('db:update', path, value),
  multiUpdate: (updates: Record<string, unknown>): Promise<void> =>
    ipcRenderer.invoke('db:multiUpdate', updates),
  delete: (path: string): Promise<void> => ipcRenderer.invoke('db:delete', path),
  newKey: (): Promise<string> => ipcRenderer.invoke('db:newKey'),
  subscribe: (path: string, id: string): Promise<void> => ipcRenderer.invoke('db:subscribe', path, id),
  unsubscribe: (id: string): Promise<void> => ipcRenderer.invoke('db:unsubscribe', id),
  onUpdate: (callback: (path: string, value: unknown, subId: string) => void): void => {
    ipcRenderer.on('db:update', (_evt, path: string, value: unknown, subId: string) =>
      callback(path, value, subId),
    );
  },
};

const relayApi = {
  connect: (url: string, identity: unknown): Promise<void> =>
    ipcRenderer.invoke('relay:connect', url, identity),
  disconnect: (): Promise<void> => ipcRenderer.invoke('relay:disconnect'),
  send: (message: unknown): Promise<void> => ipcRenderer.invoke('relay:send', message),
  onMessage: (callback: (message: unknown) => void): void => {
    ipcRenderer.on('relay:message', (_evt, msg: unknown) => callback(msg));
  },
  onStatus: (callback: (status: string) => void): void => {
    ipcRenderer.on('relay:status', (_evt, status: string) => callback(status));
  },
  removeListeners: (): void => {
    ipcRenderer.removeAllListeners('relay:message');
    ipcRenderer.removeAllListeners('relay:status');
  },
};

const appApi = {
  getVersion: (): Promise<string> => ipcRenderer.invoke('app:getVersion'),
};

contextBridge.exposeInMainWorld('db', dbApi);
contextBridge.exposeInMainWorld('relay', relayApi);
contextBridge.exposeInMainWorld('epochApp', appApi);
