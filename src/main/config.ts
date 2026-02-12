import Store from 'electron-store';
import { IpcMain } from 'electron';

/**
 * Schema for persisted configuration data.
 */
interface ConfigSchema {
  customCSS: string;
  windowState: WindowState;
}

/**
 * Window state persisted between sessions.
 */
interface WindowState {
  width: number;
  height: number;
  x: number | undefined;
  y: number | undefined;
  isMaximized: boolean;
}

type ElectronStore<T> = {
  get<K extends keyof T>(key: K): T[K];
  set<K extends keyof T>(key: K, value: T[K]): void;
};

/**
 * Wrapper around electron-store for MarkFlow settings.
 */
export class ConfigStore {
  private store: ElectronStore<ConfigSchema> & Store<ConfigSchema>;

  constructor() {
    this.store = new Store<ConfigSchema>({
      name: 'markflow-config',
      defaults: {
        customCSS: '',
        windowState: {
          width: 1200,
          height: 800,
          x: undefined,
          y: undefined,
          isMaximized: false,
        },
      },
    }) as ElectronStore<ConfigSchema> & Store<ConfigSchema>;
  }

  /**
   * Retrieve persisted custom CSS.
   */
  getCustomCSS(): string {
    return this.store.get('customCSS');
  }

  /**
   * Get the last saved window state.
   */
  getWindowState(): WindowState {
    return this.store.get('windowState');
  }

  /**
   * Persist the current window state.
   */
  setWindowState(state: WindowState): void {
    this.store.set('windowState', state);
  }

  /**
   * Persist custom CSS entered by the user.
   */
  setCustomCSS(css: string): void {
    this.store.set('customCSS', css);
  }
}

/**
 * Register IPC handlers for retrieving and storing config.
 */
export function setupConfigHandlers(
  ipcMain: IpcMain,
  configStore: ConfigStore
): void {
  // Retrieve custom CSS when requested
  ipcMain.handle('get-custom-css', async () => {
    return configStore.getCustomCSS();
  });

  // Persist new CSS provided by the renderer
  ipcMain.handle('set-custom-css', async (_event, css: string) => {
    configStore.setCustomCSS(css);
    return true;
  });
}
