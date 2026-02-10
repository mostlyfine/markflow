import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

/**
 * markdown.tsのテスト
 * GFM要素のレンダリングをテスト
 */
describe('Markdown Rendering', () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    document = dom.window.document;
    global.document = document as unknown as Document;
  });

  describe('GFM Tables', () => {
    it('should render a simple table', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;
      const html = renderMarkdown(markdown);

      expect(html).toContain('<table>');
      expect(html).toContain('<thead>');
      expect(html).toContain('<tbody>');
      expect(html).toContain('Header 1');
      expect(html).toContain('Cell 1');
    });

    it('should render table with alignment', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = `
| Left | Center | Right |
|:-----|:------:|------:|
| L1   | C1     | R1    |
`;
      const html = renderMarkdown(markdown);

      expect(html).toContain('<table>');
      expect(html).toContain('Left');
      expect(html).toContain('Center');
      expect(html).toContain('Right');
    });
  });

  describe('GFM Task Lists', () => {
    it('should render unchecked task list items', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = `
- [ ] Task 1
- [ ] Task 2
`;
      const html = renderMarkdown(markdown);

      expect(html).toContain('<input');
      expect(html).toContain('type="checkbox"');
      expect(html).toContain('Task 1');
      expect(html).toContain('Task 2');
    });

    it('should render checked task list items', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = `
- [x] Completed task
- [ ] Incomplete task
`;
      const html = renderMarkdown(markdown);

      expect(html).toContain('type="checkbox"');
      expect(html).toContain('Completed task');
      expect(html).toContain('Incomplete task');
    });
  });

  describe('GFM Strikethrough', () => {
    it('should render strikethrough text', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = '~~strikethrough~~';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<del>');
      expect(html).toContain('strikethrough');
      expect(html).toContain('</del>');
    });
  });

  describe('GFM Autolinks', () => {
    it('should auto-link URLs', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = 'Visit https://github.com for more info.';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<a');
      expect(html).toContain('href="https://github.com"');
      expect(html).toContain('https://github.com');
    });

    it('should auto-link email addresses', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = 'Contact us at test@example.com';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<a');
      expect(html).toContain('mailto:test@example.com');
    });
  });

  describe('Code Blocks', () => {
    it('should render fenced code blocks', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = '```javascript\nconst x = 42;\n```';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<code');
      expect(html).toContain('const x = 42;');
    });

    it('should include language class for syntax highlighting', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = '```python\ndef hello():\n    print("Hello")\n```';
      const html = renderMarkdown(markdown);

      expect(html).toContain('language-python');
      expect(html).toContain('def hello()');
    });
  });

  describe('XSS Protection', () => {
    it('should sanitize dangerous HTML', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = '<script>alert("XSS")</script>';
      const html = renderMarkdown(markdown);

      // scriptタグはエスケープまたは削除されるべき
      expect(html).not.toContain('<script>alert("XSS")</script>');
    });

    it('should sanitize dangerous attributes', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = '<img src="x" onerror="alert(1)">';
      const html = renderMarkdown(markdown);

      // onerrorイベントハンドラは削除されるべき
      expect(html).not.toContain('onerror=');
    });
  });

  describe('Basic Markdown', () => {
    it('should render headings', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = '# Heading 1\n## Heading 2';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<h1');
      expect(html).toContain('Heading 1');
      expect(html).toContain('<h2');
      expect(html).toContain('Heading 2');
    });

    it('should render paragraphs', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = 'This is a paragraph.\n\nThis is another paragraph.';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<p>');
      expect(html).toContain('This is a paragraph.');
      expect(html).toContain('This is another paragraph.');
    });

    it('should render emphasis and strong', async () => {
      const { renderMarkdown } = await import('../src/renderer/markdown');
      const markdown = '*italic* and **bold**';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<em>');
      expect(html).toContain('italic');
      expect(html).toContain('<strong>');
      expect(html).toContain('bold');
    });
  });
});
