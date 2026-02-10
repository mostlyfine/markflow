import { ElectronAPI } from '../preload/preload';
import { MarkdownViewer } from './components/MarkdownViewer';
import './styles/default.css';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

/**
 * レンダラープロセスの初期化
 */
function initializeRenderer(): void {
  // MarkdownViewerの初期化
  const viewer = new MarkdownViewer('markdown-viewer');

  // サンプルMarkdownを表示
  const sampleMarkdown = `
# Markdown Viewer

## Phase 2: GFMレンダリング完了

### 機能

- **GFMテーブル**対応
- **タスクリスト**対応
- ~~取り消し線~~対応
- 自動リンク: https://github.com

### サンプルテーブル

| 機能 | 状態 | 備考 |
|:-----|:----:|-----:|
| テーブル | ✓ | 完了 |
| タスクリスト | ✓ | 完了 |
| 自動リンク | ✓ | 完了 |

### タスクリスト

- [x] Phase 1: 基盤セットアップ
- [x] Phase 2: GFMレンダリング
- [ ] Phase 3: ファイル操作
- [ ] Phase 4: UI/UX強化

### コードブロック

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

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

// DOMContentLoaded後に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRenderer);
} else {
  initializeRenderer();
}
