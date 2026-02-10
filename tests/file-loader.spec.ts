import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('FileLoader', () => {
  let dom: JSDOM;
  let document: Document;
  let FileLoader: unknown;

  beforeEach(async () => {
    // DOMセットアップ
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="file-loader"></div>
        </body>
      </html>
    `);
    document = dom.window.document;
    global.document = document;
    global.window = dom.window as unknown as Window & typeof globalThis;

    // FileLoaderコンポーネントをインポート
    const module = await import('../src/renderer/components/FileLoader');
    FileLoader = module.FileLoader;
  });

  describe('初期化', () => {
    it('should create file loader UI elements', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loader = new (FileLoader as any)('file-loader');
      const container = document.getElementById('file-loader');

      expect(container?.querySelector('.file-loader-container')).toBeTruthy();
      expect(container?.querySelector('.file-select-button')).toBeTruthy();
      expect(container?.querySelector('.file-info')).toBeTruthy();
      expect(loader).toBeTruthy();
    });

    it('should throw error if container not found', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (FileLoader as any)('non-existent');
      }).toThrow('Container element with id "non-existent" not found');
    });
  });

  describe('ファイル選択', () => {
    it('should open file dialog when select button is clicked', async () => {
      // electronAPIのモック
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window.electronAPI = {
        selectFile: vi.fn().mockResolvedValue({
          filePath: '/path/to/test.md',
          content: '# Test',
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (FileLoader as any)('file-loader');
      const button = document.querySelector('.file-select-button') as HTMLButtonElement;

      button.click();

      // 非同期処理を待つ
      await new Promise(resolve => setTimeout(resolve, 10));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((window as any).electronAPI.selectFile).toHaveBeenCalled();
    });

    it('should display file info after file is loaded', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window.electronAPI = {
        selectFile: vi.fn().mockResolvedValue({
          filePath: '/path/to/test.md',
          content: '# Test Markdown',
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loader = new (FileLoader as any)('file-loader');
      await loader.selectFile();

      const fileInfo = document.querySelector('.file-info');
      expect(fileInfo?.textContent).toContain('test.md');
    });

    it('should emit file-loaded event with content', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window.electronAPI = {
        selectFile: vi.fn().mockResolvedValue({
          filePath: '/path/to/test.md',
          content: '# Test Content',
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loader = new (FileLoader as any)('file-loader');

      let receivedContent = '';
      window.addEventListener('file-loaded', ((e: CustomEvent) => {
        receivedContent = e.detail.content;
      }) as EventListener);

      await loader.selectFile();

      expect(receivedContent).toBe('# Test Content');
    });

    it('should handle file selection cancellation', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window.electronAPI = {
        selectFile: vi.fn().mockResolvedValue(null),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loader = new (FileLoader as any)('file-loader');
      await loader.selectFile();

      const fileInfo = document.querySelector('.file-info');
      expect(fileInfo?.textContent).toBe('ファイルが選択されていません');
    });
  });

  describe('エラーハンドリング', () => {
    it('should display error message when file loading fails', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window.electronAPI = {
        selectFile: vi.fn().mockRejectedValue(new Error('File read error')),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loader = new (FileLoader as any)('file-loader');
      await loader.selectFile();

      const fileInfo = document.querySelector('.file-info');
      expect(fileInfo?.textContent).toContain('エラー');
    });

    it('should clear previous file info when loading new file', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window.electronAPI = {
        selectFile: vi
          .fn()
          .mockResolvedValueOnce({
            filePath: '/path/to/first.md',
            content: '# First',
          })
          .mockResolvedValueOnce({
            filePath: '/path/to/second.md',
            content: '# Second',
          }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loader = new (FileLoader as any)('file-loader');

      await loader.selectFile();
      let fileInfo = document.querySelector('.file-info');
      expect(fileInfo?.textContent).toContain('first.md');

      await loader.selectFile();
      fileInfo = document.querySelector('.file-info');
      expect(fileInfo?.textContent).toContain('second.md');
      expect(fileInfo?.textContent).not.toContain('first.md');
    });
  });

  describe('ファイルパス表示', () => {
    it('should display only filename, not full path', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).window.electronAPI = {
        selectFile: vi.fn().mockResolvedValue({
          filePath: '/very/long/path/to/document.md',
          content: '# Content',
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loader = new (FileLoader as any)('file-loader');
      await loader.selectFile();

      const fileInfo = document.querySelector('.file-info');
      expect(fileInfo?.textContent).toContain('document.md');
      expect(fileInfo?.textContent).not.toContain('/very/long/path');
    });
  });
});
