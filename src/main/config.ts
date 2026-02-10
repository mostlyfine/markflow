import Store from 'electron-store';
import { IpcMain } from 'electron';

/**
 * 設定データのスキーマ
 */
interface ConfigSchema {
  customCSS: string;
}

type ElectronStore<T> = {
  get<K extends keyof T>(key: K): T[K];
  set<K extends keyof T>(key: K, value: T[K]): void;
};

/**
 * 設定ストア
 * electron-storeを使用して設定を永続化
 */
export class ConfigStore {
  private store: ElectronStore<ConfigSchema> & Store<ConfigSchema>;

  constructor() {
    this.store = new Store<ConfigSchema>({
      name: 'markdown-viewer-config',
      defaults: {
        customCSS: '',
      },
    }) as ElectronStore<ConfigSchema> & Store<ConfigSchema>;
  }

  /**
   * カスタムCSSを取得
   */
  getCustomCSS(): string {
    return this.store.get('customCSS');
  }

  /**
   * カスタムCSSを保存
   */
  setCustomCSS(css: string): void {
    this.store.set('customCSS', css);
  }
}

/**
 * IPC通信ハンドラをセットアップ
 */
export function setupConfigHandlers(
  ipcMain: IpcMain,
  configStore: ConfigStore
): void {
  // カスタムCSSを取得
  ipcMain.handle('get-custom-css', async () => {
    return configStore.getCustomCSS();
  });

  // カスタムCSSを保存
  ipcMain.handle('set-custom-css', async (_event, css: string) => {
    configStore.setCustomCSS(css);
    return true;
  });
}
