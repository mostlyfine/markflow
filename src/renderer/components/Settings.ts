/**
 * 設定画面コンポーネント
 */
export class Settings {
  private container: HTMLElement;
  private textarea: HTMLTextAreaElement | null = null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }
    this.container = container;
    this.render();
  }

  /**
   * 設定画面UIをレンダリング
   */
  private render(): void {
    this.container.innerHTML = `
      <div class="settings-panel">
        <h2>カスタムCSS</h2>
        <p>Markdownプレビューに適用するカスタムCSSを編集できます。</p>
        <textarea
          id="custom-css-input"
          rows="20"
          placeholder="例: body { font-size: 16px; }"
        ></textarea>
        <div class="settings-actions">
          <button id="save-css" class="btn-primary">保存</button>
          <button id="reset-css" class="btn-secondary">リセット</button>
        </div>
      </div>
    `;

    this.textarea = this.container.querySelector('#custom-css-input');
    this.setupEventListeners();
  }

  /**
   * イベントリスナーをセットアップ
   */
  private setupEventListeners(): void {
    const saveButton = this.container.querySelector('#save-css');
    const resetButton = this.container.querySelector('#reset-css');

    saveButton?.addEventListener('click', () => this.saveCSS());
    resetButton?.addEventListener('click', () => this.resetCSS());
  }

  /**
   * 現在のCSSを読み込み
   */
  async loadCSS(): Promise<void> {
    try {
      const css = await window.electronAPI.getCustomCSS();
      if (this.textarea) {
        this.textarea.value = css;
      }
    } catch (error) {
      console.error('Failed to load CSS:', error);
    }
  }

  /**
   * CSSを保存
   */
  private async saveCSS(): Promise<void> {
    if (!this.textarea) return;

    try {
      const css = this.textarea.value;
      await window.electronAPI.setCustomCSS(css);

      // 保存成功のフィードバック
      this.showFeedback('保存しました', 'success');

      // カスタムイベントを発火してプレビューを更新
      window.dispatchEvent(new CustomEvent('css-updated', { detail: { css } }));
    } catch (error) {
      console.error('Failed to save CSS:', error);
      this.showFeedback('保存に失敗しました', 'error');
    }
  }

  /**
   * CSSをリセット
   */
  private async resetCSS(): Promise<void> {
    if (!this.textarea) return;

    if (confirm('カスタムCSSをリセットしてもよろしいですか?')) {
      this.textarea.value = '';
      await this.saveCSS();
    }
  }

  /**
   * フィードバックメッセージを表示
   */
  private showFeedback(message: string, type: 'success' | 'error'): void {
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.textContent = message;

    const actionsDiv = this.container.querySelector('.settings-actions');
    actionsDiv?.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 3000);
  }

  /**
   * コンテナ要素を取得
   */
  getContainer(): HTMLElement {
    return this.container;
  }
}
