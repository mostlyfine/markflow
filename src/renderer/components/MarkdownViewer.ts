import { renderMarkdown } from '../markdown';

/**
 * Markdownビューアコンポーネント
 */
export class MarkdownViewer {
  private container: HTMLElement;
  private contentElement: HTMLElement;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }
    this.container = container;
    this.contentElement = this.createContentElement();
    this.container.appendChild(this.contentElement);
  }

  /**
   * コンテンツ表示用のDIV要素を作成
   */
  private createContentElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'markdown-content';
    return element;
  }

  /**
   * Markdownコンテンツをレンダリングして表示
   * @param markdown Markdownテキスト
   */
  public render(markdown: string): void {
    const html = renderMarkdown(markdown);
    this.contentElement.innerHTML = html;
  }

  /**
   * コンテンツをクリア
   */
  public clear(): void {
    this.contentElement.innerHTML = '';
  }

  /**
   * コンテナ要素を取得
   */
  public getContainer(): HTMLElement {
    return this.container;
  }

  /**
   * コンテンツ要素を取得
   */
  public getContentElement(): HTMLElement {
    return this.contentElement;
  }

  /**
   * カスタムCSSを適用
   * @param css カスタムCSSテキスト
   */
  public applyCustomCSS(css: string): void {
    const styleId = 'custom-markdown-css';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }
}
