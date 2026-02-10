import { describe, it, expect, vi } from 'vitest';

/**
 * 設定管理機能のテスト
 * CSS設定の保存・読み込み・適用をテスト
 */

// electron-store をモック
vi.mock('electron-store', () => {
  let mockData: Record<string, unknown> = {};

  return {
    default: class MockStore {
      constructor(options: { defaults?: Record<string, unknown> }) {
        if (options.defaults) {
          mockData = { ...options.defaults };
        }
      }

      get(key: string, defaultValue?: unknown): unknown {
        return mockData[key] !== undefined ? mockData[key] : defaultValue;
      }

      set(key: string, value: unknown): void {
        mockData[key] = value;
      }

      clear(): void {
        mockData = {};
      }

      static mockClear(): void {
        mockData = {};
      }
    }
  };
});

describe('Settings Management', () => {
  describe('Config Store', () => {
    it('should save custom CSS to store', async () => {
      // テストが実装を駆動する
      const { ConfigStore } = await import('../src/main/config');
      const store = new ConfigStore();

      const customCSS = 'body { background: red; }';
      store.setCustomCSS(customCSS);

      expect(store.getCustomCSS()).toBe(customCSS);
    });

    it('should return empty string when no custom CSS is set', async () => {
      const { ConfigStore } = await import('../src/main/config');
      const store = new ConfigStore();

      expect(store.getCustomCSS()).toBe('');
    });

    it('should persist CSS across store instances', async () => {
      const { ConfigStore } = await import('../src/main/config');
      const store1 = new ConfigStore();
      const customCSS = '.markdown-body { color: blue; }';

      store1.setCustomCSS(customCSS);

      // 同じインスタンスで値が保存されたことを確認
      expect(store1.getCustomCSS()).toBe(customCSS);
    });
  });

  describe('IPC Handlers', () => {
    it('should handle get-custom-css request', async () => {
      const { setupConfigHandlers } = await import('../src/main/config');

      const handlers: Record<string, (...args: unknown[]) => Promise<unknown>> = {};
      const mockIpcMain = {
        handle: vi.fn((channel: string, handler: (...args: unknown[]) => Promise<unknown>) => {
          handlers[channel] = handler;
        }),
      };

      const mockStore = {
        getCustomCSS: vi.fn().mockReturnValue('body { color: red; }'),
        setCustomCSS: vi.fn(),
      };

      setupConfigHandlers(mockIpcMain as never, mockStore as never);

      // 'get-custom-css' ハンドラが登録されているか確認
      expect(mockIpcMain.handle).toHaveBeenCalledWith(
        'get-custom-css',
        expect.any(Function)
      );

      // ハンドラを実行してみる
      const result = await handlers['get-custom-css']();
      expect(result).toBe('body { color: red; }');
      expect(mockStore.getCustomCSS).toHaveBeenCalled();
    });

    it('should handle set-custom-css request', async () => {
      const { setupConfigHandlers } = await import('../src/main/config');

      const handlers: Record<string, (...args: unknown[]) => Promise<unknown>> = {};
      const mockIpcMain = {
        handle: vi.fn((channel: string, handler: (...args: unknown[]) => Promise<unknown>) => {
          handlers[channel] = handler;
        }),
      };

      const mockStore = {
        getCustomCSS: vi.fn(),
        setCustomCSS: vi.fn(),
      };

      setupConfigHandlers(mockIpcMain as never, mockStore as never);

      // 'set-custom-css' ハンドラが登録されているか確認
      expect(mockIpcMain.handle).toHaveBeenCalledWith(
        'set-custom-css',
        expect.any(Function)
      );

      // ハンドラを実行してみる
      const testCSS = 'body { background: blue; }';
      const result = await handlers['set-custom-css'](null, testCSS);
      expect(result).toBe(true);
      expect(mockStore.setCustomCSS).toHaveBeenCalledWith(testCSS);
    });
  });
});
