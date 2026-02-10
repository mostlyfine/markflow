import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { act } from 'react';
import App from '../src/renderer/App';
import Settings from '../src/renderer/components/Settings';

describe('CSS injection and persistence', () => {
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

  it('applies custom CSS returned from electronAPI on mount', async () => {
    const getCustomCSS = vi.fn().mockResolvedValue('body { background: red; }');
    const selectFile = vi.fn();
    const noop = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => '# Welcome' });
    Object.assign(window, {
      electronAPI: {
        getCustomCSS,
        setCustomCSS: vi.fn(),
        selectFile,
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

    const styleTags = Array.from(container.querySelectorAll('style'));
    const customStyle = styleTags.find((tag) => tag.textContent?.includes('background: red'));
    expect(getCustomCSS).toHaveBeenCalled();
    expect(customStyle?.textContent).toContain('background: red');
  });

  it('saves CSS through Settings and notifies parent', async () => {
    const cssValue = 'body { color: blue; }';
    const getCustomCSS = vi.fn().mockResolvedValue(cssValue);
    const setCustomCSS = vi.fn().mockResolvedValue(true);
    const onCSSUpdate = vi.fn();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);

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

    expect(textarea).toBeTruthy();
    expect(saveButton).toBeTruthy();

    await act(async () => {
      saveButton?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    });

    expect(setCustomCSS).toHaveBeenCalledWith(cssValue);
    expect(onCSSUpdate).toHaveBeenCalledWith(cssValue);
    expect(alertSpy).toHaveBeenCalled();
  });
});
