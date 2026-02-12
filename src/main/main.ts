import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { resolve as resolvePath } from 'path';
import { ConfigStore, setupConfigHandlers } from './config.js';
import { buildMenuTemplate } from './menu.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;
const configStore = new ConfigStore();
let initialFilePath: string | null = null;
let currentFilePath: string | null = null;

// Set the app name for the macOS menu bar
app.name = 'MarkFlow';

/**
 * Create the main application window.
 */
function createWindow(): void {
  // Restore persisted window state
  const windowState = configStore.getWindowState();

  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    icon: join(__dirname, '../../build/icon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  // Restore maximized state
  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  // Determine whether to load from dev server or built files
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  console.log('🔍 VITE_DEV_SERVER_URL:', devServerUrl);
  console.log('🔍 __dirname:', __dirname);

  if (devServerUrl) {
    console.log('📱 Loading from dev server:', devServerUrl);
    mainWindow.loadURL(devServerUrl);
    // Keep DevTools closed even in development
    // mainWindow.webContents.openDevTools();
  } else {
    const indexPath = join(__dirname, '../dist/index.html');
    console.log('📦 Loading from file:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  // Load CLI provided file after the window finishes loading
  mainWindow.webContents.on('did-finish-load', async () => {
    if (initialFilePath && mainWindow) {
      await loadFileFromCLI(initialFilePath, mainWindow);
    }
  });

  // Persist window state when it changes
  const saveWindowState = (): void => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      configStore.setWindowState({
        width: mainWindow.getNormalBounds().width,
        height: mainWindow.getNormalBounds().height,
        x: mainWindow.getNormalBounds().x,
        y: mainWindow.getNormalBounds().y,
        isMaximized: mainWindow.isMaximized(),
      });
    }
  };

  mainWindow.on('resize', saveWindowState);
  mainWindow.on('move', saveWindowState);
  mainWindow.on('maximize', saveWindowState);
  mainWindow.on('unmaximize', saveWindowState);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Register IPC handlers for config operations
setupConfigHandlers(ipcMain, configStore);

// Open external links in the default browser
ipcMain.handle('open-external', async (_event, url: string) => {
  try {
    await shell.openExternal(url);
    return true;
  } catch (error) {
    console.error('Failed to open external URL:', error);
    return false;
  }
});

// Reload the currently open file
ipcMain.handle('reload-file', async () => {
  console.log('reload-file IPC handler called');
  if (!currentFilePath) {
    console.log('No file to reload');
    return null;
  }

  try {
    // Enforce a 10 MB size limit
    const fs = await import('fs');
    const stats = fs.statSync(currentFilePath);
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (stats.size > MAX_FILE_SIZE) {
      throw new Error('File is too large (max 10MB)');
    }

    const content = await readFile(currentFilePath, 'utf-8');
    return { filePath: currentFilePath, content };
  } catch (error) {
    console.error('File reload error:', error);
    throw error;
  }
});

// Handle manual file selection via dialog
ipcMain.handle('select-file', async () => {
  console.log('select-file IPC handler called');
  if (!mainWindow) {
    console.log('mainWindow is null');
    return null;
  }

  console.log('Showing file dialog...');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown'] },
      { name: 'Text', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  console.log('Dialog result:', result);
  if (result.canceled || result.filePaths.length === 0) {
    console.log('User canceled or no files selected');
    return null;
  }

  const filePath = result.filePaths[0];

  try {
    // Enforce a 10 MB size limit
    const fs = await import('fs');
    const stats = fs.statSync(filePath);
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (stats.size > MAX_FILE_SIZE) {
      throw new Error('File is too large (max 10MB)');
    }

    const content = await readFile(filePath, 'utf-8');
    currentFilePath = filePath;
    return { filePath, content };
  } catch (error) {
    console.error('File read error:', error);
    throw error;
  }
});

/**
 * Configure the application menu.
 */
function setupMenu(): void {
  const menu = Menu.buildFromTemplate(
    buildMenuTemplate(
      () => (mainWindow && !mainWindow.isDestroyed() ? mainWindow : null),
      () => app.quit(),
    ),
  );
  Menu.setApplicationMenu(menu);
}

/**
 * Load a file that was provided via the CLI.
 */
async function loadFileFromCLI(
  filePath: string,
  window: BrowserWindow,
): Promise<void> {
  try {
    const absolutePath = resolvePath(filePath);
    console.log('📄 Loading file from CLI:', absolutePath);

    const content = await readFile(absolutePath, 'utf-8');
    currentFilePath = absolutePath;

    // Send file contents to the renderer process
    window.webContents.send('load-file-from-cli', {
      filePath: absolutePath,
      content: content,
    });
  } catch (error) {
    console.error('Failed to load file from CLI:', error);
    dialog.showErrorBox(
      'File Load Error',
      `Could not open file: ${filePath}`,
    );
  }
}

/**
 * Process CLI arguments for an initial file path.
 */
function processCommandLineArgs(): void {
  // Use the first file-like argument as the initial path
  const args = process.argv.slice(process.defaultApp ? 2 : 1);
  const filePath = args.find(
    (arg) =>
      !arg.startsWith('-') &&
      (arg.endsWith('.md') ||
        arg.endsWith('.markdown') ||
        arg.endsWith('.txt')),
  );

  if (filePath) {
    initialFilePath = filePath;
    console.log('📋 File specified in CLI:', filePath);
  }
}

/**
 * Initialize once the Electron app is ready.
 */
app.whenReady().then(() => {
  processCommandLineArgs();
  setupMenu();
  createWindow();

  app.on('activate', () => {
    // Re-create the window when the dock icon is clicked on macOS
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * Quit the app when every window closes (except on macOS).
 */
app.on('window-all-closed', () => {
  // On non-macOS platforms, quit immediately
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
