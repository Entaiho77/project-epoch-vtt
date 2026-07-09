import { join } from 'node:path';
import { app, BrowserWindow, ipcMain } from 'electron';
import type { ClientMessage } from '@solryn/protocol';
import { RelayClient } from './relay-client';

// --- Linux / X11 stability switches -----------------------------------------
// Headless-ish Linux hosts (and many X11 setups) otherwise render a blank or
// never-shown window. These switches force a predictable software path.
app.commandLine.appendSwitch('ozone-platform', 'x11');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-dev-shm-usage');

let mainWindow: BrowserWindow | null = null;
let relay: RelayClient | null = null;

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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  relay?.disconnect();
  relay = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
