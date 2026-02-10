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

// アプリ名を設定（macOSメニューバーに表示）
app.name = 'MarkFlow';

/**
 * メインウィンドウを作成
 */
function createWindow(): void {
  // 保存されたウィンドウ状態を復元
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

  // ウィンドウの最大化状態を復元
  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  // 開発環境かビルド後かを判定
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  console.log('🔍 VITE_DEV_SERVER_URL:', devServerUrl);
  console.log('🔍 __dirname:', __dirname);

  if (devServerUrl) {
    console.log('📱 Loading from dev server:', devServerUrl);
    mainWindow.loadURL(devServerUrl);
    // 開発環境でもDevToolsを自動で開かない
    // mainWindow.webContents.openDevTools();
  } else {
    const indexPath = join(__dirname, '../dist/index.html');
    console.log('📦 Loading from file:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  // ウィンドウの準備ができたら、CLIから渡されたファイルを読み込む
  mainWindow.webContents.on('did-finish-load', async () => {
    if (initialFilePath && mainWindow) {
      await loadFileFromCLI(initialFilePath, mainWindow);
    }
  });

  // ウィンドウ状態の保存
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

// IPC通信ハンドラをセットアップ
setupConfigHandlers(ipcMain, configStore);

// 外部リンクを開く
ipcMain.handle('open-external', async (_event, url: string) => {
  try {
    await shell.openExternal(url);
    return true;
  } catch (error) {
    console.error('Failed to open external URL:', error);
    return false;
  }
});

// ファイルを再読み込み
ipcMain.handle('reload-file', async () => {
  console.log('reload-file IPC handler called');
  if (!currentFilePath) {
    console.log('No file to reload');
    return null;
  }

  try {
    // ファイルサイズチェック (10MB制限)
    const fs = await import('fs');
    const stats = fs.statSync(currentFilePath);
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (stats.size > MAX_FILE_SIZE) {
      throw new Error('ファイルサイズが大きすぎます（最大10MB）');
    }

    const content = await readFile(currentFilePath, 'utf-8');
    return { filePath: currentFilePath, content };
  } catch (error) {
    console.error('File reload error:', error);
    throw error;
  }
});

// ファイル選択ダイアログ
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
    // ファイルサイズチェック (10MB制限)
    const fs = await import('fs');
    const stats = fs.statSync(filePath);
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (stats.size > MAX_FILE_SIZE) {
      throw new Error('ファイルサイズが大きすぎます（最大10MB）');
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
 * アプリケーションメニューを設定
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
 * CLIから指定されたファイルを読み込む
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

    // レンダラープロセスにファイル内容を送信
    window.webContents.send('load-file-from-cli', {
      filePath: absolutePath,
      content: content,
    });
  } catch (error) {
    console.error('Failed to load file from CLI:', error);
    dialog.showErrorBox(
      'ファイル読み込みエラー',
      `ファイルを開けませんでした: ${filePath}`,
    );
  }
}

/**
 * コマンドライン引数を処理
 */
function processCommandLineArgs(): void {
  // 引数からファイルパスを取得（最初のファイル引数を使用）
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
 * アプリケーション準備完了時の処理
 */
app.whenReady().then(() => {
  processCommandLineArgs();
  setupMenu();
  createWindow();

  app.on('activate', () => {
    // macOSでDockアイコンクリック時、ウィンドウがなければ作成
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * すべてのウィンドウが閉じられた時の処理
 */
app.on('window-all-closed', () => {
  // macOS以外ではアプリを終了
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
