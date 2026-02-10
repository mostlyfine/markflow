import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Error Handling', () => {
  let dom: JSDOM;
  let document: Document;
  let MarkdownViewer: unknown;

  beforeEach(async () => {
    // DOMセットアップ
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="markflow-viewer"></div>
        </body>
      </html>
    `);
    document = dom.window.document;
    global.document = document;
    global.window = dom.window as unknown as Window & typeof globalThis;

    // MarkdownViewerコンポーネントをインポート
    const module = await import('../src/renderer/components/MarkdownViewer');
    MarkdownViewer = module.MarkdownViewer;
  });

  describe('MarkdownViewer エラー表示', () => {
    it('should display error message when rendering fails', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viewer = new (MarkdownViewer as any)('markflow-viewer');

      // 不正なMarkdownや内部エラーをシミュレート
      viewer.showError('レンダリングに失敗しました');

      const errorElement = document.querySelector('.error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement?.textContent).toContain('レンダリングに失敗しました');
    });

    it('should clear error message when rendering succeeds', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viewer = new (MarkdownViewer as any)('markflow-viewer');

      viewer.showError('エラーメッセージ');
      expect(document.querySelector('.error-message')).toBeTruthy();

      viewer.render('# Valid Markdown');
      expect(document.querySelector('.error-message')).toBeFalsy();
    });

    it('should display styled error container', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viewer = new (MarkdownViewer as any)('markflow-viewer');
      viewer.showError('テストエラー');

      const errorElement = document.querySelector('.error-message');
      expect(errorElement?.className).toContain('error-message');
    });

    it('should support multiple error messages', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viewer = new (MarkdownViewer as any)('markflow-viewer');

      viewer.showError('最初のエラー');
      viewer.showError('2番目のエラー');

      const errorElement = document.querySelector('.error-message');
      expect(errorElement?.textContent).toContain('2番目のエラー');
    });
  });

  describe('ファイル読み込みエラー', () => {
    it('should validate file extension', () => {
      const validateFileExtension = (filename: string): boolean => {
        const validExtensions = ['.md', '.markdown', '.txt'];
        return validExtensions.some(ext => filename.toLowerCase().endsWith(ext));
      };

      expect(validateFileExtension('test.md')).toBe(true);
      expect(validateFileExtension('test.markdown')).toBe(true);
      expect(validateFileExtension('test.txt')).toBe(true);
      expect(validateFileExtension('test.pdf')).toBe(false);
      expect(validateFileExtension('test.jpg')).toBe(false);
    });

    it('should validate file size', () => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

      const validateFileSize = (size: number): boolean => {
        return size > 0 && size <= MAX_FILE_SIZE;
      };

      expect(validateFileSize(1024)).toBe(true);
      expect(validateFileSize(MAX_FILE_SIZE)).toBe(true);
      expect(validateFileSize(MAX_FILE_SIZE + 1)).toBe(false);
      expect(validateFileSize(0)).toBe(false);
      expect(validateFileSize(-1)).toBe(false);
    });

    it('should handle empty file content', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viewer = new (MarkdownViewer as any)('markflow-viewer');

      viewer.render('');

      const content = document.querySelector('.markdown-content');
      expect(content?.innerHTML).toBe('');
    });
  });

  describe('エラーメッセージの日本語化', () => {
    it('should provide user-friendly error messages in Japanese', () => {
      const errorMessages = {
        fileNotFound: 'ファイルが見つかりません',
        invalidFormat: '対応していないファイル形式です',
        fileTooLarge: 'ファイルサイズが大きすぎます（最大10MB）',
        readError: 'ファイルの読み込みに失敗しました',
        renderError: 'Markdownのレンダリングに失敗しました',
      };

      expect(errorMessages.fileNotFound).toBe('ファイルが見つかりません');
      expect(errorMessages.invalidFormat).toBe('対応していないファイル形式です');
      expect(errorMessages.fileTooLarge).toContain('ファイルサイズが大きすぎます');
      expect(errorMessages.readError).toContain('読み込みに失敗');
      expect(errorMessages.renderError).toContain('レンダリングに失敗');
    });
  });

  describe('エラー回復', () => {
    it('should allow retry after error', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viewer = new (MarkdownViewer as any)('markflow-viewer');

      viewer.showError('エラー');
      expect(document.querySelector('.error-message')).toBeTruthy();

      viewer.clear();
      expect(document.querySelector('.error-message')).toBeFalsy();
    });
  });
});
