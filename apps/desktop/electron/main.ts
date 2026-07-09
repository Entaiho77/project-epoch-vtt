import { join } from 'node:path';
import { app, BrowserWindow, ipcMain } from 'electron';
import type { ClientMessage } from '@solryn/protocol';
import type { NewCampaign } from '../src/shared/persistence';
import { RelayClient } from './relay-client';
import { openDatabase, type Repository } from './db';

// --- Linux headless / sandbox compatibility switches ------------------------
// These force a predictable software path for headless-ish CI/sandbox hosts
// (no GPU, small or missing /dev/shm, XWayland quirks). They are HARMFUL on a
// normal desktop — e.g. `disable-dev-shm-usage` redirects shared memory into
// /tmp, which fails on systems where /tmp is namespaced or restricted — so they
// are opt-in. Set EPOCH_LINUX_COMPAT=1 to enable them; a real desktop should
// leave it unset and use Electron's own platform detection.
if (process.platform === 'linux' && process.env['EPOCH_LINUX_COMPAT'] === '1') {
  app.commandLine.appendSwitch('ozone-platform', 'x11');
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('no-sandbox');
  app.commandLine.appendSwitch('disable-dev-shm-usage');
}

let mainWindow: BrowserWindow | null = null;
let relay: RelayClient | null = null;
let repo: Repository | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1280,
    minHeight: 800,
    show: false,
    paintWhenInitiallyHidden: true,
    frame: true,
    autoHideMenuBar: false,
    backgroundColor: '#1a1a2e',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Some X11 window managers ignore the first show(); reveal aggressively both
  // on ready-to-show and again after the content has loaded.
  const reveal = (): void => {
    if (!mainWindow) return;
    mainWindow.show();
    mainWindow.focus();
    mainWindow.moveTop();
  };

  mainWindow.on('ready-to-show', reveal);

  const rendererUrl = process.env['ELECTRON_RENDERER_URL'];
  if (rendererUrl) {
    void mainWindow.loadURL(rendererUrl).then(reveal);
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html')).then(reveal);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// --- IPC: relay bridge ------------------------------------------------------
function pushToRenderer(channel: string, ...args: unknown[]): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, ...args);
  }
}

ipcMain.handle('relay:connect', (_evt, url: string) => {
  relay?.disconnect();
  relay = new RelayClient(url, {
    onMessage: (msg) => pushToRenderer('relay:message', msg),
    onStatus: (status) => pushToRenderer('relay:status', status),
  });
  relay.connect();
});

ipcMain.handle('relay:disconnect', () => {
  relay?.disconnect();
  relay = null;
});

ipcMain.handle('relay:send', (_evt, msg: ClientMessage) => {
  relay?.send(msg);
});

ipcMain.handle('app:getVersion', () => app.getVersion());

// --- IPC: local database (sql.js, persisted under userData) -----------------
function registerDbIpc(repo: Repository): void {
  ipcMain.handle('db:listCampaigns', () => repo.listCampaigns());
  ipcMain.handle('db:createCampaign', (_evt, input: NewCampaign) => repo.createCampaign(input));
  ipcMain.handle('db:renameCampaign', (_evt, id: string, name: string) => repo.renameCampaign(id, name));
  ipcMain.handle('db:deleteCampaign', (_evt, id: string) => repo.deleteCampaign(id));
}

async function initDatabase(): Promise<void> {
  // sql.js loads its wasm from node_modules; require.resolve keeps this working
  // both in dev and inside a packaged asar.
  const wasmPath = require.resolve('sql.js/dist/sql-wasm.wasm');
  const dbPath = join(app.getPath('userData'), 'epoch.db');
  repo = await openDatabase(dbPath, wasmPath);
  registerDbIpc(repo);
}

app.whenReady().then(async () => {
  await initDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  relay?.disconnect();
  relay = null;
  repo?.close();
  repo = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
