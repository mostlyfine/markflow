import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { act } from 'react';
import App from '../src/renderer/App';
import Settings from '../src/renderer/components/Settings';

describe('Error handling', () => {
  let container: HTMLElement;
  let root: Root;
  let originalAlert: typeof window.alert;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.body.innerHTML = '<div id="root"></div>';
    container = document.getElementById('root') as HTMLElement;
    root = createRoot(container);
    if (!HTMLElement.prototype.scrollTo) {
      HTMLElement.prototype.scrollTo = vi.fn();
    }
    originalAlert = window.alert;
    window.alert = vi.fn();
  });

  afterEach(() => {
    act(() => root.unmount());
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    window.alert = originalAlert;
    document.body.innerHTML = '';
  });

  it('shows an alert when unsupported files are dropped', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const noop = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '' });
    Object.assign(window, {
      electronAPI: {
        getCustomCSS: vi.fn().mockResolvedValue(''),
        setCustomCSS: vi.fn(),
        selectFile: vi.fn(),
        onFileOpen: noop,
        onFileReload: noop,
        onToggleSettings: noop,
        onFileOpenFromCLI: noop,
      },
      fetch: fetchMock,
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await act(async () => {
      root.render(<App />);
      await Promise.resolve();
    });

    const appContainer = container.querySelector('.app-container');
    expect(appContainer).toBeTruthy();

    const invalidFile = { name: 'note.pdf' } as File;
    const dropEvent = new window.Event('drop', { bubbles: true, cancelable: true });
    Object.assign(dropEvent, {
      dataTransfer: { files: [invalidFile] },
      preventDefault: () => undefined,
      stopPropagation: () => undefined,
    });

    await act(async () => {
      appContainer?.dispatchEvent(dropEvent);
    });

    expect(alertSpy).toHaveBeenCalledWith('Markdownファイルを選択してください');
  });

  it('alerts when saving CSS fails in Settings', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const cssValue = '.app { color: red; }';
    const getCustomCSS = vi.fn().mockResolvedValue(cssValue);
    const setCustomCSS = vi.fn().mockResolvedValue(false);
    const onCSSUpdate = vi.fn();

    Object.assign(window, {
      electronAPI: {
        getCustomCSS,
        setCustomCSS,
      },
    });

    await act(async () => {
      root.render(<Settings onClose={() => undefined} onCSSUpdate={onCSSUpdate} />);
      await Promise.resolve();
    });

    await act(async () => { await Promise.resolve(); });

    const textarea = container.querySelector('textarea');
    const saveButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('保存')
    );

    await act(async () => { await Promise.resolve(); });
    expect(textarea?.value).toBe(cssValue);

    await act(async () => {
      saveButton?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    });

    expect(setCustomCSS).toHaveBeenCalledWith(cssValue);
    expect(onCSSUpdate).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('設定の保存に失敗しました');
  });
});
