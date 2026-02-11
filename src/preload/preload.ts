import { contextBridge, ipcRenderer } from 'electron';

/**
 * セキュアなpreloadスクリプト
 * contextBridgeを使用してレンダラープロセスに安全にAPIを公開
 */

// 現時点では最小限のAPIのみ公開
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  // 設定API
  getCustomCSS: (): Promise<string> => ipcRenderer.invoke('get-custom-css'),
  setCustomCSS: (css: string): Promise<boolean> =>
    ipcRenderer.invoke('set-custom-css', css),
  // ファイル読み込みAPI
  selectFile: (): Promise<{ filePath: string; content: string } | null> =>
    ipcRenderer.invoke('select-file'),
  reloadFile: (): Promise<{ filePath: string; content: string } | null> =>
    ipcRenderer.invoke('reload-file'),
  // メニューからのファイルを開くイベント
  onFileOpen: (callback: () => void) => {
    ipcRenderer.on('trigger-file-open', callback);
    return () => {
      ipcRenderer.removeListener('trigger-file-open', callback);
    };
  },
  // メニューからのファイル再読み込みイベント
  onFileReload: (callback: () => void) => {
    ipcRenderer.on('trigger-file-reload', callback);
    return () => {
      ipcRenderer.removeListener('trigger-file-reload', callback);
    };
  },
  // メニューからの設定画面トグルイベント
  onToggleSettings: (callback: () => void) => {
    ipcRenderer.on('toggle-settings', callback);
    return () => {
      ipcRenderer.removeListener('toggle-settings', callback);
    };
  },
  // CLIから渡されたファイルを開くイベント
  onFileOpenFromCLI: (
    callback: (data: { filePath: string; content: string }) => void
  ) => {
    const handler = (
      _event: Electron.IpcRendererEvent,
      data: { filePath: string; content: string }
    ) => callback(data);
    ipcRenderer.on('load-file-from-cli', handler);
    return () => {
      ipcRenderer.removeListener('load-file-from-cli', handler);
    };
  },
  // 外部リンクを開く
  openExternal: (url: string): Promise<boolean> =>
    ipcRenderer.invoke('open-external', url),
});

// TypeScript型定義（レンダラー側で使用）
export interface ElectronAPI {
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
  getCustomCSS: () => Promise<string>;
  setCustomCSS: (css: string) => Promise<boolean>;
  selectFile: () => Promise<{ filePath: string; content: string } | null>;
  reloadFile: () => Promise<{ filePath: string; content: string } | null>;
  onFileOpen: (callback: () => void) => void | (() => void);
  onFileReload: (callback: () => void) => void | (() => void);
  onToggleSettings: (callback: () => void) => void | (() => void);
  onFileOpenFromCLI: (
    callback: (data: { filePath: string; content: string }) => void
  ) => void | (() => void);
  openExternal: (url: string) => Promise<boolean>;
}
