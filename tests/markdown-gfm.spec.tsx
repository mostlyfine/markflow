import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { act } from 'react';
import MarkdownViewer from '../src/renderer/components/MarkdownViewer';

describe('MarkdownViewer GFM rendering', () => {
  let container: HTMLElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.body.innerHTML = '<div id="root"></div>';
    container = document.getElementById('root') as HTMLElement;
    root = createRoot(container);
    Object.assign(window, {
      electronAPI: {
        openExternal: vi.fn(),
      },
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('renders tables, task lists, and strikethrough text', async () => {
    const markdown = `| Feature | Status |
| ------- | :----: |
| Tables | ✅ |
| Task Lists | ✅ |

- [x] First
- [ ] Second

~~done~~`;

    await act(async () => {
      root.render(<MarkdownViewer markdown={markdown} />);
    });

    expect(container.querySelector('table')).toBeTruthy();
    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(2);
    expect(container.querySelector('del')?.textContent).toBe('done');
  });

  it('renders syntax highlighting and math via KaTeX', async () => {
    const markdown = `Inline math $E=mc^2$.

\`\`\`javascript
const answer = 42;
\`\`\``;

    await act(async () => {
      root.render(<MarkdownViewer markdown={markdown} />);
    });

    expect(container.querySelector('.katex')).toBeTruthy();
    expect(container.querySelector('code.language-javascript')).toBeTruthy();
  });

  it('delegates external links to electronAPI.openExternal', async () => {
    const openExternal = vi.fn();
    (window as unknown as { electronAPI: { openExternal: typeof openExternal } }).electronAPI = {
      openExternal,
    };

    await act(async () => {
      root.render(<MarkdownViewer markdown={'[External](https://example.com)'} />);
    });

    const anchor = container.querySelector('a');
    expect(anchor).toBeTruthy();

    anchor?.dispatchEvent(
      new window.MouseEvent('click', { bubbles: true, cancelable: true })
    );

    expect(openExternal).toHaveBeenCalledWith('https://example.com');
  });
});
