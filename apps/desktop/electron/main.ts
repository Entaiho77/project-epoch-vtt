import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { app, BrowserWindow, ipcMain } from 'electron';
import { openKv, type KvStore } from './db';
import { RelayConnection, type RelayIdentity } from './relay';

// Linux headless/CI compatibility (harmless on most desktops, opt-out unnecessary
// for the dev sandbox this is verified in; revisit if a desktop distro misbehaves).
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('no-sandbox');
  app.commandLine.appendSwitch('disable-dev-shm-usage');
}

let mainWindow: BrowserWindow | null = null;
let kv: KvStore | null = null;
let relay: RelayConnection | null = null;

function pushToRenderer(channel: string, ...args: unknown[]): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, ...args);
  }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    backgroundColor: '#101423',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.on('ready-to-show', () => mainWindow?.show());

  const rendererUrl = process.env['ELECTRON_RENDERER_URL'];
  if (rendererUrl) {
    void mainWindow.loadURL(rendererUrl);
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// --- IPC: SQLite key-value store --------------------------------------------
function registerDbIpc(store: KvStore): void {
  ipcMain.handle('db:read', (_evt, path: string) => store.read(path));
  ipcMain.handle('db:write', (_evt, path: string, value: unknown) => store.write(path, value));
  ipcMain.handle('db:update', (_evt, path: string, partial: Record<string, unknown>) =>
    store.update(path, partial),
  );
  ipcMain.handle('db:multiUpdate', (_evt, updates: Record<string, unknown>) =>
    store.multiUpdate(updates),
  );
  ipcMain.handle('db:delete', (_evt, path: string) => store.remove(path));
  ipcMain.handle('db:newKey', () => randomUUID());
  ipcMain.handle('db:subscribe', (_evt, path: string, id: string) => store.subscribe(id, path));
  ipcMain.handle('db:unsubscribe', (_evt, id: string) => store.unsubscribe(id));
}

// --- IPC: relay ---------------------------------------------------------------
function registerRelayIpc(): void {
  ipcMain.handle('relay:connect', (_evt, url: string, identity: RelayIdentity) => {
    relay?.disconnect();
    relay = new RelayConnection(url, identity, (event) => {
      if (event.type === 'message') pushToRenderer('relay:message', event.message);
      else pushToRenderer('relay:status', event.status);
    });
    relay.connect();
  });

  ipcMain.handle('relay:disconnect', () => {
    relay?.disconnect();
    relay = null;
  });

  ipcMain.handle('relay:send', (_evt, message: unknown) => {
    relay?.send(message);
  });
}

ipcMain.handle('app:getVersion', () => app.getVersion());

app.whenReady().then(() => {
  kv = openKv(join(app.getPath('userData'), 'epoch.db'), (subId, path, value) => {
    // subId lets the renderer route to the exact subscription; path for filtering.
    pushToRenderer('db:update', path, value, subId);
  });
  registerDbIpc(kv);
  registerRelayIpc();
  createWindow();
});

app.on('window-all-closed', () => {
  relay?.disconnect();
  relay = null;
  kv?.close();
  kv = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
