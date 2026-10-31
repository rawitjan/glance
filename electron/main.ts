import { app, BrowserWindow, ipcMain, globalShortcut, shell, clipboard, Tray, Menu, nativeImage, screen, systemPreferences } from 'electron';
import path from 'path';
import fs from 'fs';
import { StorageManager, Task, AppSettings } from './storage';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let storage: StorageManager;
let isCollapsed = false;
const EXPANDED_HEIGHT = 620;
const COLLAPSED_HEIGHT = 76;
const WIDGET_WIDTH = 380;

function createTrayIcon(): Electron.NativeImage {
  // 16x16 purple/lavender canvas icon fallback
  const size = 16;
  const buffer = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Circle icon in #6e56cf
      const dx = x - 7.5;
      const dy = y - 7.5;
      if (dx * dx + dy * dy <= 36) {
        buffer[idx] = 110;     // R
        buffer[idx + 1] = 86;  // G
        buffer[idx + 2] = 207; // B
        buffer[idx + 3] = 255; // A
      } else {
        buffer[idx + 3] = 0;   // Transparent
      }
    }
  }
  return nativeImage.createFromBuffer(buffer, { width: size, height: size });
}

function createWindow() {
  storage = new StorageManager();
  const settings = storage.getSettings();
  isCollapsed = !!settings.isCollapsed;

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Default to right side of screen
  const defaultX = screenWidth - WIDGET_WIDTH - 24;
  const defaultY = Math.max(40, Math.floor((screenHeight - EXPANDED_HEIGHT) / 2));

  const winX = settings.windowX !== undefined ? settings.windowX : defaultX;
  const winY = settings.windowY !== undefined ? settings.windowY : defaultY;
  const winHeight = isCollapsed ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT;

  const iconPngPath = path.join(__dirname, '../assets/icon.png');
  const hasIcon = fs.existsSync(iconPngPath);

  mainWindow = new BrowserWindow({
    width: WIDGET_WIDTH,
    height: winHeight,
    x: winX,
    y: winY,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: false,
    alwaysOnTop: !!settings.alwaysOnTop,
    skipTaskbar: false,
    icon: hasIcon ? iconPngPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Track window move and save position
  let moveTimeout: NodeJS.Timeout | null = null;
  mainWindow.on('move', () => {
    if (moveTimeout) clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      if (mainWindow) {
        const [x, y] = mainWindow.getPosition();
        storage.saveSettings({ windowX: x, windowY: y });
      }
    }, 400);
  });

  // Dev server vs production build
  const distHtml = path.join(__dirname, '../dist/index.html');
  const isDevArg = process.argv.includes('--dev');
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || (isDevArg ? 'http://localhost:5173' : null);

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl).catch(() => {
      if (fs.existsSync(distHtml)) {
        mainWindow?.loadFile(distHtml);
      }
    });
  } else if (fs.existsSync(distHtml)) {
    mainWindow.loadFile(distHtml);
  } else {
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      console.error('Could not load app: dist/index.html does not exist and http://localhost:5173 is not running.');
    });
  }

  // Register Global Hotkey Ctrl+Alt+N
  registerGlobalHotkey(settings.globalHotkey || 'Ctrl+Alt+N');

  // Create System Tray
  setupTray();
}

function registerGlobalHotkey(hotkey: string) {
  try {
    globalShortcut.unregisterAll();
    const registered = globalShortcut.register(hotkey, () => {
      if (!mainWindow) return;
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      if (isCollapsed) {
        // Expand on quick capture
        setWindowCollapsed(false);
      }
      mainWindow.focus();
      mainWindow.webContents.send('quick-capture');
    });

    if (!registered) {
      console.warn(`Failed to register global hotkey: ${hotkey}`);
    }
  } catch (err) {
    console.error('Error registering global hotkey:', err);
  }
}

function setWindowCollapsed(collapsed: boolean) {
  if (!mainWindow) return;
  isCollapsed = collapsed;
  const [x, y] = mainWindow.getPosition();
  const targetHeight = collapsed ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT;
  mainWindow.setBounds({
    x,
    y,
    width: WIDGET_WIDTH,
    height: targetHeight,
  });
  storage.saveSettings({ isCollapsed: collapsed });
}

function setupTray() {
  const icoPath = path.join(__dirname, '../assets/icon.ico');
  const pngPath = path.join(__dirname, '../assets/icon.png');
  let icon: Electron.NativeImage;
  if (fs.existsSync(icoPath)) {
    icon = nativeImage.createFromPath(icoPath);
  } else if (fs.existsSync(pngPath)) {
    icon = nativeImage.createFromPath(pngPath);
  } else {
    icon = createTrayIcon();
  }
  tray = new Tray(icon);
  tray.setToolTip('Glance — Desktop Todo Widget');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Glance ашу (Қалпына келтіру)',
      click: () => {
        if (!mainWindow) return;
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
      },
    },
    {
      label: 'Жаңа тапсырма (Ctrl+Alt+N)',
      click: () => {
        if (!mainWindow) return;
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('quick-capture');
      },
    },
    { type: 'separator' },
    {
      label: 'Шығу (Exit)',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) {
      if (mainWindow.isFocused()) {
        mainWindow.hide();
      } else {
        mainWindow.focus();
      }
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// IPC Handlers
ipcMain.handle('get-tasks', async () => {
  return storage.getTasks();
});

ipcMain.handle('save-tasks', async (_event, tasks: Task[]) => {
  return storage.saveTasks(tasks);
});

ipcMain.handle('archive-tasks', async (_event, tasks: Task[]) => {
  return storage.archiveTasks(tasks);
});

ipcMain.handle('get-settings', async () => {
  return storage.getSettings();
});

ipcMain.handle('save-settings', async (_event, settings: Partial<AppSettings>) => {
  return storage.saveSettings(settings);
});

ipcMain.handle('set-window-collapsed', async (_event, collapsed: boolean) => {
  setWindowCollapsed(collapsed);
});

ipcMain.handle('set-always-on-top', async (_event, alwaysOnTop: boolean) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(alwaysOnTop);
    storage.saveSettings({ alwaysOnTop });
  }
});

ipcMain.handle('open-external', async (_event, url: string) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:'))) {
    shell.openExternal(url);
  }
});

ipcMain.handle('copy-to-clipboard', async (_event, text: string) => {
  clipboard.writeText(text);
});

ipcMain.handle('play-notification-sound', async () => {
  // Beep notification
  shell.beep();
});

ipcMain.handle('minimize-window', async () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('close-window', async () => {
  if (mainWindow) mainWindow.hide();
});

ipcMain.handle('get-system-accent-color', async () => {
  if (process.platform === 'win32' && systemPreferences && typeof systemPreferences.getAccentColor === 'function') {
    try {
      const hex = systemPreferences.getAccentColor();
      if (hex && hex.length >= 6) {
        return '#' + hex.slice(0, 6);
      }
    } catch (e) {
      console.error('Failed to get system accent color:', e);
    }
  }
  return null;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  // Keep alive in tray if desired, or quit on Windows
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
