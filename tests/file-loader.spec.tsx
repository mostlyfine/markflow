import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { act } from 'react';
import FileLoader from '../src/renderer/components/FileLoader';

describe('FileLoader component', () => {
  let container: HTMLElement;
  let root: Root;
  let originalAlert: typeof window.alert;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.body.innerHTML = '<div id="root"></div>';
    container = document.getElementById('root') as HTMLElement;
    root = createRoot(container);
    originalAlert = window.alert;
    window.alert = vi.fn();
  });

  afterEach(() => {
    act(() => root.unmount());
    vi.restoreAllMocks();
    window.alert = originalAlert;
    document.body.innerHTML = '';
  });

  it('loads a file via electronAPI and passes content to callback', async () => {
    const selectFile = vi.fn().mockResolvedValue({ content: '# Test Content' });
    const onFileLoad = vi.fn();

    Object.assign(window, {
      electronAPI: {
        selectFile,
      },
    });

    await act(async () => {
      root.render(<FileLoader onFileLoad={onFileLoad} />);
      await Promise.resolve();
    });

    const button = container.querySelector('button');
    expect(button).toBeTruthy();

    await act(async () => {
      button?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    });

    expect(selectFile).toHaveBeenCalled();
    expect(onFileLoad).toHaveBeenCalledWith('# Test Content');
  });

  it('ignores callback when file selection is cancelled', async () => {
    const selectFile = vi.fn().mockResolvedValue(null);
    const onFileLoad = vi.fn();

    Object.assign(window, {
      electronAPI: {
        selectFile,
      },
    });

    await act(async () => {
      root.render(<FileLoader onFileLoad={onFileLoad} />);
      await Promise.resolve();
    });

    const button = container.querySelector('button');
    await act(async () => {
      button?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    });

    expect(selectFile).toHaveBeenCalled();
    expect(onFileLoad).not.toHaveBeenCalled();
  });

  it('alerts when file loading throws', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const selectFile = vi.fn().mockRejectedValue(new Error('read error'));

    Object.assign(window, {
      electronAPI: {
        selectFile,
      },
    });

    await act(async () => {
      root.render(<FileLoader onFileLoad={() => undefined} />);
      await Promise.resolve();
    });

    const button = container.querySelector('button');
    await act(async () => {
      button?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    });

    expect(selectFile).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Failed to load the file');
  });
});
