import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import App from '../src/renderer/App';

interface ElectronCallbacks {
  fileOpen?: () => void;
  fileReload?: () => void;
  fileOpenFromCLI?: (data: { filePath: string; content: string }) => void;
}

const flushPromises = async () => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
};

const setupScrollSpy = () => {
  const positions: number[] = [];

  (HTMLElement.prototype as unknown as { scrollTo: (options?: unknown, y?: number) => void }).scrollTo = function scrollTo(
    options?: unknown,
    y?: number,
  ) {
    if (typeof options === 'number') {
      positions.push(options);
      this.scrollTop = options;
      return;
    }

    if (typeof options === 'object' && options !== null && 'top' in (options as { top?: number })) {
      const top = (options as { top?: number }).top ?? 0;
      positions.push(top);
      this.scrollTop = top;
      return;
    }

    if (typeof y === 'number') {
      positions.push(y);
      this.scrollTop = y;
    }
  };

  return positions;
};

const renderApp = async () => {
  const dom = new JSDOM('<!DOCTYPE html><div id="root"></div>', { url: 'http://localhost' });
  const { window } = dom;
  const callbacks: ElectronCallbacks = {};

  vi.useFakeTimers();

  global.window = window as unknown as Window & typeof globalThis;
  global.document = window.document as unknown as Document;
  global.navigator = window.navigator as Navigator;
  global.HTMLElement = window.HTMLElement;
  global.File = window.File;

  const scrollPositions = setupScrollSpy();

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    text: () => Promise.resolve('# Welcome'),
  }) as unknown as typeof fetch;

  const selectFileMock = vi.fn().mockResolvedValue({
    filePath: '/path/to/file.md',
    content: '# File content',
  });

  const reloadFileMock = vi.fn().mockResolvedValue({
    filePath: '/path/to/file.md',
    content: '# File content',
  });

  window.electronAPI = {
    platform: 'darwin',
    versions: { node: '0.0.0', chrome: '0.0.0', electron: '0.0.0' },
    getCustomCSS: vi.fn().mockResolvedValue(''),
    setCustomCSS: vi.fn().mockResolvedValue(true),
    selectFile: selectFileMock,
    reloadFile: reloadFileMock,
    onFileOpen: cb => {
      callbacks.fileOpen = cb;
    },
    onFileReload: cb => {
      callbacks.fileReload = cb;
    },
    onToggleSettings: vi.fn(),
    onFileOpenFromCLI: cb => {
      callbacks.fileOpenFromCLI = cb;
    },
    openExternal: vi.fn(),
  };

  const rootElement = window.document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  await act(async () => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });

  const appContainer = window.document.querySelector('.app-container') as HTMLElement;

  const flushAll = async () => {
    await flushPromises();
    vi.runAllTimers();
    await flushPromises();
  };

  return {
    window,
    root,
    appContainer,
    callbacks,
    scrollPositions,
    selectFileMock,
    reloadFileMock,
    flushAll,
  };
};

describe('Scroll reset behavior', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('scrolls to top after initial welcome load', async () => {
    const { appContainer, scrollPositions, flushAll, root } = await renderApp();

    appContainer.scrollTop = 120;

    await flushAll();

    expect(appContainer.scrollTop).toBe(0);
    expect(scrollPositions.at(-1)).toBe(0);

    await act(async () => {
      root.unmount();
    });
  });

  it('scrolls to top after opening a file', async () => {
    const { appContainer, callbacks, scrollPositions, flushAll, root } = await renderApp();

    appContainer.scrollTop = 200;

    callbacks.fileOpen?.();
    await flushAll();

    expect(appContainer.scrollTop).toBe(0);
    expect(scrollPositions.at(-1)).toBe(0);

    await act(async () => {
      root.unmount();
    });
  });

  it('scrolls to top when reloading the same content', async () => {
    const { appContainer, callbacks, scrollPositions, flushAll, root } = await renderApp();

    callbacks.fileOpen?.();
    await flushAll();

    appContainer.scrollTop = 180;

    callbacks.fileReload?.();
    await flushAll();

    expect(appContainer.scrollTop).toBe(0);
    expect(scrollPositions.at(-1)).toBe(0);

    await act(async () => {
      root.unmount();
    });
  });

  it('scrolls to top after drag-and-drop load', async () => {
    const { window, appContainer, scrollPositions, flushAll, root } = await renderApp();

    const file = new window.File(['# Drag content'], 'drag.md', {
      type: 'text/markdown',
    });

    appContainer.scrollTop = 160;

    const dropEvent = new window.Event('drop', { bubbles: true }) as DragEvent;
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: [file] },
    });

    appContainer.dispatchEvent(dropEvent);

    await flushAll();

    expect(appContainer.scrollTop).toBe(0);
    expect(scrollPositions.at(-1)).toBe(0);

    await act(async () => {
      root.unmount();
    });
  });
});
