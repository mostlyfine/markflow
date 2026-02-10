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
}
