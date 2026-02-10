import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../src/renderer/markdown';

describe('GitHub Flavored Markdown (GFM) Specification', () => {
  describe('4.10 Tables (extension)', () => {
    it('should render basic table', () => {
      const markdown = `| foo | bar |
| --- | --- |
| baz | bim |`;

      const html = renderMarkdown(markdown);
      expect(html).toContain('<table>');
      expect(html).toContain('<thead>');
      expect(html).toContain('<tbody>');
      expect(html).toContain('<th>foo</th>');
      expect(html).toContain('<td>baz</td>');
    });

    it('should support column alignment', () => {
      const markdown = `| abc | defghi |
|:-:|----------:|
| bar | baz |`;

      const html = renderMarkdown(markdown);
      expect(html).toContain('align="center"');
      expect(html).toContain('align="right"');
    });

    it('should handle escaped pipes in cells', () => {
      const markdown = `| f\\|oo  |
| ------ |
| b \`\\|\` az |
| b **\\|** im |`;

      const html = renderMarkdown(markdown);
      expect(html).toContain('f|oo');
      expect(html).toContain('<code>|</code>');
    });
  });

  describe('5.3 Task list items (extension)', () => {
    it('should render unchecked task list item', () => {
      const markdown = '- [ ] foo';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<input');
      expect(html).toContain('type="checkbox"');
      expect(html).toContain('disabled');
      expect(html).not.toContain('checked');
    });

    it('should render checked task list item', () => {
      const markdown = '- [x] bar';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<input');
      expect(html).toContain('type="checkbox"');
      expect(html).toContain('checked');
      expect(html).toContain('disabled');
    });

    it('should support nested task lists', () => {
      const markdown = `- [x] foo
  - [ ] bar
  - [x] baz
- [ ] bim`;

      const html = renderMarkdown(markdown);
      const checkboxMatches = html.match(/type="checkbox"/g);
      expect(checkboxMatches).toHaveLength(4);
    });
  });

  describe('6.5 Strikethrough (extension)', () => {
    it('should render strikethrough with double tildes', () => {
      const markdown = '~~Hi~~ Hello, ~there~ world!';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<del>Hi</del>');
      expect(html).toContain('<del>there</del>');
    });

    it('should not create strikethrough across paragraphs', () => {
      const markdown = `This ~~has a

new paragraph~~.`;

      const html = renderMarkdown(markdown);
      expect(html).not.toContain('<del>');
      expect(html).toContain('~~has a');
      expect(html).toContain('paragraph~~');
    });

    it('should not create strikethrough with three or more tildes', () => {
      const markdown = 'This will ~~~not~~~ strike.';
      const html = renderMarkdown(markdown);

      expect(html).not.toContain('<del>not</del>');
      expect(html).toContain('~~~not~~~');
    });
  });

  describe('6.9 Autolinks (extension)', () => {
    it('should autolink www URLs', () => {
      const markdown = 'www.commonmark.org';
      const html = renderMarkdown(markdown);

      expect(html).toContain('href="http://www.commonmark.org"');
      expect(html).toContain('www.commonmark.org</a>');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
    });

    it('should autolink www URLs with path', () => {
      const markdown = 'Visit www.commonmark.org/help for more information.';
      const html = renderMarkdown(markdown);

      expect(html).toContain('href="http://www.commonmark.org/help"');
    });

    it('should autolink email addresses', () => {
      const markdown = 'foo@bar.baz';
      const html = renderMarkdown(markdown);

      expect(html).toContain('href="mailto:foo@bar.baz"');
      expect(html).toContain('foo@bar.baz</a>');
      expect(html).toContain('target="_blank"');
    });

    it('should handle trailing punctuation correctly', () => {
      const markdown = 'Visit www.commonmark.org.';
      const html = renderMarkdown(markdown);

      // ピリオドはリンクに含まれない
      expect(html).toContain('href="http://www.commonmark.org"');
      expect(html).toContain('www.commonmark.org</a>.');
      expect(html).toContain('target="_blank"');
    });
  });

  describe('6.11 Disallowed Raw HTML (tagfilter extension)', () => {
    it('should filter dangerous HTML tags', () => {
      const dangerousTags = [
        '<script>alert("xss")</script>',
        '<style>body{display:none}</style>',
        '<iframe src="evil.com"></iframe>',
        '<title>Bad Title</title>',
        '<textarea>text</textarea>',
        '<xmp>code</xmp>',
        '<noembed>content</noembed>',
        '<noframes>content</noframes>',
        '<plaintext>text',
      ];

      dangerousTags.forEach(tag => {
        const html = renderMarkdown(tag);
        // これらのタグは削除またはエスケープされる
        expect(html).not.toContain(tag);
      });
    });

    it('should allow safe HTML tags', () => {
      const markdown = '<strong> <em>';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<strong>');
      expect(html).toContain('<em>');
    });
  });

  describe('Other GFM Features', () => {
    it('should support line breaks with double space', () => {
      const markdown = 'foo  \nbar';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<br');
    });

    it('should support line breaks with backslash', () => {
      const markdown = 'foo\\\nbar';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<br');
    });

    it('should render fenced code blocks with language', () => {
      const markdown = '```javascript\nconst x = 1;\n```';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
      expect(html).toContain('class="hljs language-javascript"');
      expect(html).toContain('const');
      expect(html).toContain('1');
    });

    it('should handle blockquotes', () => {
      const markdown = '> This is a quote\n> with multiple lines';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<blockquote>');
      expect(html).toContain('This is a quote');
    });

    it('should render links', () => {
      const markdown = '[link text](http://example.com "title")';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<a href="http://example.com"');
      expect(html).toContain('title="title"');
      expect(html).toContain('link text');
    });

    it('should render images', () => {
      const markdown = '![alt text](image.jpg "image title")';
      const html = renderMarkdown(markdown);

      expect(html).toContain('<img');
      expect(html).toContain('src="image.jpg"');
      expect(html).toContain('alt="alt text"');
      expect(html).toContain('title="image title"');
    });
  });

  describe('XSS Protection', () => {
    it('should sanitize javascript: URLs', () => {
      const markdown = '[click me](javascript:alert("xss"))';
      const html = renderMarkdown(markdown);

      // javascript: スキームは削除される
      expect(html).not.toContain('javascript:');
    });

    it('should sanitize onclick attributes', () => {
      const markdown = '<a href="#" onclick="alert(\'xss\')">click</a>';
      const html = renderMarkdown(markdown);

      // onclick属性は削除される
      expect(html).not.toContain('onclick');
    });

    it('should sanitize data attributes', () => {
      const markdown = '<div data-foo="bar">content</div>';
      const html = renderMarkdown(markdown);

      // data-*属性は削除される
      expect(html).not.toContain('data-foo');
    });
  });

  describe('Complex GFM Documents', () => {
    it('should handle mixed GFM features', () => {
      const markdown = `# GitHub Flavored Markdown Test

## Tables and Task Lists

| Feature | Status |
|---------|:------:|
| Tables | ✅ |
| Task Lists | ✅ |

- [x] Implement tables
- [x] Implement task lists
- [ ] More features

## Formatting

This is **bold** and *italic* and ~~strikethrough~~.

Visit www.github.com for more info.

## Code

\`\`\`javascript
const gfm = true;
\`\`\`

Email: test@example.com
`;

      const html = renderMarkdown(markdown);

      // すべての機能が正しく動作することを確認
      expect(html).toContain('<h1>');
      expect(html).toContain('<table>');
      expect(html).toContain('type="checkbox"');
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<em>italic</em>');
      expect(html).toContain('<del>strikethrough</del>');
      expect(html).toContain('href="http://www.github.com"');
      expect(html).toContain('<code');
      expect(html).toContain('mailto:test@example.com');
    });
  });
});
