import React from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from 'react';
import App from '../src/renderer/App';

describe('settings toggle wiring', () => {
  let container: HTMLElement;
  let root: Root;
  let toggleCallbacks: Array<() => void>;
  let originalFetch: typeof fetch;
  let originalScrollTo: typeof HTMLElement.prototype.scrollTo;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    toggleCallbacks = [];

    originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('# Welcome'),
    } as unknown as Response);

    originalScrollTo = HTMLElement.prototype.scrollTo;
    HTMLElement.prototype.scrollTo = vi.fn();

    Object.assign(window, {
      electronAPI: {
        platform: process.platform,
        versions: process.versions,
        getCustomCSS: vi.fn().mockResolvedValue(''),
        setCustomCSS: vi.fn().mockResolvedValue(true),
        selectFile: vi.fn(),
        reloadFile: vi.fn(),
        onFileOpen: vi.fn(),
        onFileReload: vi.fn(),
        onToggleSettings: vi.fn((callback: () => void) => {
          toggleCallbacks.push(callback);
        }),
        onFileOpenFromCLI: vi.fn(),
        openExternal: vi.fn(),
      },
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    vi.restoreAllMocks();
    global.fetch = originalFetch;
    if (originalScrollTo) {
      HTMLElement.prototype.scrollTo = originalScrollTo;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (HTMLElement.prototype as any).scrollTo;
    }
    document.body.innerHTML = '';
  });

  it('toggles the settings panel when toggle-settings event fires', async () => {
    await act(async () => {
      root.render(<App />);
      await Promise.resolve();
    });

    expect(toggleCallbacks.length).toBe(1);
    expect(container.querySelector('#settings-panel')).toBeNull();

    await act(async () => {
      toggleCallbacks[0]();
    });

    expect(container.querySelector('#settings-panel')).not.toBeNull();

    await act(async () => {
      toggleCallbacks[0]();
    });

    expect(container.querySelector('#settings-panel')).toBeNull();
  });
});
