import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { act } from 'react';
import MarkdownViewer from '../src/renderer/components/MarkdownViewer';

describe('MarkdownViewer basic rendering', () => {
  let container: HTMLElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.body.innerHTML = '<div id="root"></div>';
    container = document.getElementById('root') as HTMLElement;
    root = createRoot(container);
    Object.assign(window, { electronAPI: {} });
  });

  afterEach(() => {
    act(() => root.unmount());
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('renders headings, paragraphs, and emphasis', async () => {
    const markdown = '# Title\n\nThis is **bold** and *italic*.';

    await act(async () => {
      root.render(<MarkdownViewer markdown={markdown} />);
    });

    expect(container.querySelector('h1')?.textContent).toBe('Title');
    expect(container.querySelector('strong')?.textContent).toBe('bold');
    expect(container.querySelector('em')?.textContent).toBe('italic');
  });

  it('renders images and inline HTML', async () => {
    const markdown = '![alt text](image.jpg) <span class="note">note</span>';

    await act(async () => {
      root.render(<MarkdownViewer markdown={markdown} />);
    });

    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      'image.jpg'
    );
    expect(container.querySelector('.note')?.textContent).toBe('note');
  });

  it('renders task list items as disabled checkboxes', async () => {
    const markdown = '- [x] Done\n- [ ] Todo';

    await act(async () => {
      root.render(<MarkdownViewer markdown={markdown} />);
    });

    const checkboxes = Array.from(
      container.querySelectorAll('input[type="checkbox"]')
    ) as HTMLInputElement[];
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes.every((box) => box.disabled)).toBe(true);
  });

  it('renders code blocks without syntax highlighting', async () => {
    const markdown = '```js\nconst a = 1;\n```';

    await act(async () => {
      root.render(<MarkdownViewer markdown={markdown} />);
    });

    const pre = container.querySelector('pre');
    expect(pre).toBeTruthy();
    expect(pre?.getAttribute('style')).toBeNull();
    expect(pre?.querySelector('[style]')).toBeNull();
    expect(container.querySelector('pre code')?.textContent).toContain(
      'const a = 1;'
    );
  });
});
