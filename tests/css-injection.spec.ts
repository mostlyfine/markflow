import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

/**
 * CSS注入機能のテスト
 * カスタムCSSの動的適用をテスト
 */
describe('CSS Injection', () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
    document = dom.window.document;
    global.document = document as unknown as Document;
    global.window = dom.window as unknown as Window & typeof globalThis;
  });

  describe('MarkdownViewer CSS Application', () => {
    it('should inject custom CSS into the viewer', async () => {
      const { MarkdownViewer } = await import('../src/renderer/components/MarkdownViewer');

      const container = document.createElement('div');
      container.id = 'viewer';
      document.body.appendChild(container);

      const viewer = new MarkdownViewer('viewer');
      const customCSS = 'body { background: red; }';

      viewer.applyCustomCSS(customCSS);

      // カスタムCSS用のstyleタグが追加されているか確認
      const styleTag = document.getElementById('custom-markdown-css');
      expect(styleTag).not.toBeNull();
      expect(styleTag?.textContent).toBe(customCSS);
    });

    it('should update existing custom CSS', async () => {
      const { MarkdownViewer } = await import('../src/renderer/components/MarkdownViewer');

      const container = document.createElement('div');
      container.id = 'viewer';
      document.body.appendChild(container);

      const viewer = new MarkdownViewer('viewer');

      viewer.applyCustomCSS('body { color: red; }');
      viewer.applyCustomCSS('body { color: blue; }');

      const styleTag = document.getElementById('custom-markdown-css');
      expect(styleTag?.textContent).toBe('body { color: blue; }');
    });

    it('should remove custom CSS when empty string is provided', async () => {
      const { MarkdownViewer } = await import('../src/renderer/components/MarkdownViewer');

      const container = document.createElement('div');
      container.id = 'viewer';
      document.body.appendChild(container);

      const viewer = new MarkdownViewer('viewer');

      viewer.applyCustomCSS('body { color: red; }');
      viewer.applyCustomCSS('');

      const styleTag = document.getElementById('custom-markdown-css');
      expect(styleTag?.textContent).toBe('');
    });

    it('should not affect default styles', async () => {
      const { MarkdownViewer } = await import('../src/renderer/components/MarkdownViewer');

      const container = document.createElement('div');
      container.id = 'viewer';
      document.body.appendChild(container);

      // デフォルトスタイルを模擬
      const defaultStyle = document.createElement('link');
      defaultStyle.id = 'default-style';
      defaultStyle.rel = 'stylesheet';
      document.head.appendChild(defaultStyle);

      const viewer = new MarkdownViewer('viewer');
      viewer.applyCustomCSS('body { color: red; }');

      // デフォルトスタイルがそのまま存在するか確認
      expect(document.getElementById('default-style')).not.toBeNull();
    });
  });

  describe('Settings Component', () => {
    it('should create a settings UI with textarea for CSS', async () => {
      const { Settings } = await import('../src/renderer/components/Settings');

      const container = document.createElement('div');
      container.id = 'settings';
      document.body.appendChild(container);

      const settings = new Settings('settings');

      const textarea = settings.getContainer().querySelector('textarea');
      expect(textarea).not.toBeNull();
      expect(textarea?.id).toBe('custom-css-input');
    });

    it('should have save button', async () => {
      const { Settings } = await import('../src/renderer/components/Settings');

      const container = document.createElement('div');
      container.id = 'settings';
      document.body.appendChild(container);

      const settings = new Settings('settings');

      const saveButton = settings.getContainer().querySelector('button#save-css');
      expect(saveButton).not.toBeNull();
      expect(saveButton?.textContent).toContain('保存');
    });

    it('should load current CSS on initialization', async () => {
      const { Settings } = await import('../src/renderer/components/Settings');

      // window.electronAPI.getCustomCSSをモック
      global.window = {
        electronAPI: {
          getCustomCSS: async () => 'body { color: red; }',
          setCustomCSS: async () => true,
        },
      } as never;

      const container = document.createElement('div');
      container.id = 'settings';
      document.body.appendChild(container);

      const settings = new Settings('settings');
      await settings.loadCSS();

      const textarea = settings.getContainer().querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea?.value).toBe('body { color: red; }');
    });

    it('should save CSS when save button is clicked', async () => {
      const { Settings } = await import('../src/renderer/components/Settings');

      let savedCSS = '';
      let dispatchedEvent: Event | null = null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.window as any).electronAPI = {
        getCustomCSS: async () => '',
        setCustomCSS: async (css: string) => {
          savedCSS = css;
          return true;
        },
      };

      const originalDispatchEvent = global.window.dispatchEvent.bind(
        global.window
      );
      global.window.dispatchEvent = (event: Event) => {
        dispatchedEvent = event;
        return originalDispatchEvent(event);
      };

      const container = document.createElement('div');
      container.id = 'settings';
      document.body.appendChild(container);

      const settings = new Settings('settings');
      const textarea = settings
        .getContainer()
        .querySelector('textarea') as HTMLTextAreaElement;
      const saveButton = settings
        .getContainer()
        .querySelector('button#save-css') as HTMLButtonElement;

      textarea.value = 'body { background: blue; }';
      saveButton.click();

      // 非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(savedCSS).toBe('body { background: blue; }');
      expect(dispatchedEvent).not.toBeNull();
      if (dispatchedEvent) {
        expect(dispatchedEvent.type).toBe('css-updated');
      }
    });
  });
});
