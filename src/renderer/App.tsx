import React, { useState, useEffect } from 'react';
import MarkdownViewer from './components/MarkdownViewer';
import Settings from './components/Settings';
import { ElectronAPI } from '../preload/preload';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [customCSS, setCustomCSS] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [hasFileLoaded, setHasFileLoaded] = useState<boolean>(false);

  // 初期化: デフォルトファイル読み込み
  useEffect(() => {
    const loadDefaultFile = async () => {
      if (hasFileLoaded) return;

      try {
        const response = await fetch('./gfm.md');
        if (response.ok) {
          const content = await response.text();
          setMarkdown(content);
        }
      } catch (error) {
        console.error('Failed to load gfm.md:', error);
      }
    };

    loadDefaultFile();
  }, [hasFileLoaded]);

  // カスタムCSS読み込み
  useEffect(() => {
    const loadCustomCSS = async () => {
      try {
        const css = await window.electronAPI.getCustomCSS();
        if (css) {
          setCustomCSS(css);
        }
      } catch (error) {
        console.error('Failed to load custom CSS:', error);
      }
    };

    loadCustomCSS();
  }, []);

  // ElectronAPIイベントリスナー
  useEffect(() => {
    // メニューからのファイルを開く
    if (window.electronAPI?.onFileOpen) {
      window.electronAPI.onFileOpen(async () => {
        try {
          const result = await window.electronAPI.selectFile();
          if (result) {
            setMarkdown(result.content);
            setHasFileLoaded(true);
          }
        } catch (error) {
          console.error('File loading error:', error);
        }
      });
    }

    // メニューからの設定画面トグル
    if (window.electronAPI?.onToggleSettings) {
      window.electronAPI.onToggleSettings(() => {
        setShowSettings((prev) => !prev);
      });
    }

    // CLIから渡されたファイルを開く
    if (window.electronAPI?.onFileOpenFromCLI) {
      window.electronAPI.onFileOpenFromCLI((data) => {
        console.log('📋 Loading file from CLI:', data.filePath);
        setMarkdown(data.content);
        setHasFileLoaded(true);
      });
    }
  }, []);

  // ファイルロード
  const handleFileLoad = (content: string) => {
    setMarkdown(content);
    setHasFileLoaded(true);
  };

  // CSS更新
  const handleCSSUpdate = (css: string) => {
    setCustomCSS(css);
  };

  // ドラッグ&ドロップ
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.match(/\.(md|markdown|txt)$/i)) {
      alert('Markdownファイルを選択してください');
      return;
    }

    try {
      const content = await file.text();
      handleFileLoad(content);
    } catch (error) {
      console.error('File reading error:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="app-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <style>{customCSS}</style>

      {showSettings ? (
        <Settings
          onClose={() => setShowSettings(false)}
          onCSSUpdate={handleCSSUpdate}
        />
      ) : (
        <MarkdownViewer markdown={markdown} />
      )}
    </div>
  );
};

export default App;
