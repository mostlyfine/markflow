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
  // メニューからのファイルを開くイベント
  onFileOpen: (callback: () => void) => {
    ipcRenderer.on('trigger-file-open', callback);
  },
  // メニューからの設定画面トグルイベント
  onToggleSettings: (callback: () => void) => {
    ipcRenderer.on('toggle-settings', callback);
  },
  // CLIから渡されたファイルを開くイベント
  onFileOpenFromCLI: (
    callback: (data: { filePath: string; content: string }) => void,
  ) => {
    ipcRenderer.on('load-file-from-cli', (_event, data) => callback(data));
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
  onFileOpen: (callback: () => void) => void;
  onToggleSettings: (callback: () => void) => void;
  onFileOpenFromCLI: (
    callback: (data: { filePath: string; content: string }) => void,
  ) => void;
  openExternal: (url: string) => Promise<boolean>;
}
