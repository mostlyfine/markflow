import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Markdownレンダリング設定
 */
function configureMarked(): void {
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // GFM改行の扱い
    pedantic: false,
  });
}

/**
 * HTMLサニタイズ設定
 */
function getSanitizeConfig(): DOMPurify.Config {
  return {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'hr',
      'ul',
      'ol',
      'li',
      'a',
      'strong',
      'em',
      'del',
      'code',
      'pre',
      'blockquote',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'img',
      'input', // タスクリスト用
    ],
    ALLOWED_ATTR: [
      'href',
      'title',
      'alt',
      'src',
      'type',
      'checked',
      'disabled', // タスクリスト用
      'align', // テーブル用
      'class', // コードブロックのシンタックスハイライト用
    ],
    ALLOW_DATA_ATTR: false,
  };
}

/**
 * MarkdownをHTMLにレンダリング
 * @param markdown Markdownテキスト
 * @returns サニタイズされたHTML
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) {
    return '';
  }

  // markedの設定
  configureMarked();

  // MarkdownをHTMLに変換
  const rawHtml = marked.parse(markdown) as string;

  // XSS対策: HTMLをサニタイズ
  const sanitizedHtml = DOMPurify.sanitize(rawHtml, getSanitizeConfig());

  return sanitizedHtml;
}
