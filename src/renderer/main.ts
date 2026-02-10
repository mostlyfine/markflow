import { ElectronAPI } from '../preload/preload';
import { MarkdownViewer } from './components/MarkdownViewer';
import { Settings } from './components/Settings';
import './styles/default.css';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

let viewer: MarkdownViewer;
let settings: Settings;

/**
 * レンダラープロセスの初期化
 */
async function initializeRenderer(): Promise<void> {
  // MarkdownViewerの初期化
  viewer = new MarkdownViewer('markdown-viewer');

  // 設定画面の初期化
  settings = new Settings('settings');

  // 保存されているカスタムCSSを読み込んで適用
  await loadAndApplyCustomCSS();

  // 設定トグルボタンのイベントリスナー
  const toggleButton = document.getElementById('toggle-settings');
  toggleButton?.addEventListener('click', toggleSettings);

  // CSS更新イベントのリスナー
  window.addEventListener('css-updated', handleCSSUpdate);

  // サンプルMarkdownを表示
  const sampleMarkdown = `
# Markdown Viewer

## Phase 3: 設定画面とCSS編集完了

### 機能

- **GFMテーブル**対応
- **タスクリスト**対応
- ~~取り消し線~~対応
- 自動リンク: https://github.com
- **カスタムCSS編集**対応

### サンプルテーブル

| 機能 | 状態 | 備考 |
|:-----|:----:|-----:|
| テーブル | ✓ | 完了 |
| タスクリスト | ✓ | 完了 |
| 自動リンク | ✓ | 完了 |
| カスタムCSS | ✓ | 完了 |

### タスクリスト

- [x] Phase 1: 基盤セットアップ
- [x] Phase 2: GFMレンダリング
- [x] Phase 3: 設定画面とCSS編集
- [ ] Phase 4: ファイル操作
- [ ] Phase 5: UI/UX強化

### コードブロック

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

### カスタムCSS

右上の「設定」ボタンからカスタムCSSを編集できます！

### その他

- 通常のリスト項目
- **太字**と*斜体*
- \`inline code\`
`;

  viewer.render(sampleMarkdown);

  // Electron API情報を表示（開発用）
  if (window.electronAPI) {
    const { platform, versions } = window.electronAPI;
    console.log('Platform:', platform);
    console.log('Versions:', versions);
  }
}

/**
 * カスタムCSSを読み込んで適用
 */
async function loadAndApplyCustomCSS(): Promise<void> {
  try {
    const css = await window.electronAPI.getCustomCSS();
    if (css) {
      viewer.applyCustomCSS(css);
    }
    // 設定画面にもCSSを読み込む
    await settings.loadCSS();
  } catch (error) {
    console.error('Failed to load custom CSS:', error);
  }
}

/**
 * 設定パネルの表示/非表示を切り替え
 */
function toggleSettings(): void {
  const settingsPanel = document.getElementById('settings-panel');
  const viewerContainer = document.getElementById('markdown-viewer');

  if (settingsPanel && viewerContainer) {
    const isVisible = settingsPanel.style.display !== 'none';

    if (isVisible) {
      // 設定を閉じる
      settingsPanel.style.display = 'none';
      viewerContainer.style.display = 'block';
    } else {
      // 設定を開く
      settingsPanel.style.display = 'block';
      viewerContainer.style.display = 'none';
      // 設定を開いたときに最新のCSSを読み込む
      settings.loadCSS();
    }
  }
}

/**
 * CSS更新イベントを処理
 */
function handleCSSUpdate(event: Event): void {
  const customEvent = event as CustomEvent;
  const css = customEvent.detail?.css;

  if (css !== undefined) {
    viewer.applyCustomCSS(css);
  }
}

// DOMContentLoaded後に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRenderer);
} else {
  initializeRenderer();
}
