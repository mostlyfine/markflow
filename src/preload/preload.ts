import { contextBridge, ipcRenderer } from 'electron';

/**
 * Secure preload script that exposes a minimal API via contextBridge.
 */

// Expose only the APIs the renderer needs
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  // Settings API
  getCustomCSS: (): Promise<string> => ipcRenderer.invoke('get-custom-css'),
  setCustomCSS: (css: string): Promise<boolean> =>
    ipcRenderer.invoke('set-custom-css', css),
  // File loading API
  selectFile: (): Promise<{ filePath: string; content: string } | null> =>
    ipcRenderer.invoke('select-file'),
  reloadFile: (): Promise<{ filePath: string; content: string } | null> =>
    ipcRenderer.invoke('reload-file'),
  // Menu-driven file open event
  onFileOpen: (callback: () => void) => {
    ipcRenderer.on('trigger-file-open', callback);
    return () => {
      ipcRenderer.removeListener('trigger-file-open', callback);
    };
  },
  // Menu-driven reload event
  onFileReload: (callback: () => void) => {
    ipcRenderer.on('trigger-file-reload', callback);
    return () => {
      ipcRenderer.removeListener('trigger-file-reload', callback);
    };
  },
  // Toggle settings panel from the menu
  onToggleSettings: (callback: () => void) => {
    ipcRenderer.on('toggle-settings', callback);
    return () => {
      ipcRenderer.removeListener('toggle-settings', callback);
    };
  },
  // File open event triggered via CLI arguments
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
  // Open external URLs
  openExternal: (url: string): Promise<boolean> =>
    ipcRenderer.invoke('open-external', url),
});

// TypeScript contract for renderer usage
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
