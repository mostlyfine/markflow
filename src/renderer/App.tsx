import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [scrollToken, setScrollToken] = useState<number>(0);
  const hasFileLoadedRef = useRef<boolean>(false);
  const appContainerRef = useRef<HTMLDivElement | null>(null);

  const resetScrollPosition = useCallback(() => {
    const container = appContainerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const applyLoadedContent = useCallback(
    (content: string, filePath: string | null = null) => {
      setMarkdown(content);
      setCurrentFilePath(filePath);
      setHasFileLoaded(true);
      hasFileLoadedRef.current = true;
      setScrollToken((prev) => prev + 1);
    },
    [],
  );

  // 初期化: デフォルトファイル読み込み
  useEffect(() => {
    const loadDefaultFile = async () => {
      if (hasFileLoadedRef.current) return;

      try {
        const response = await fetch('./welcome.md');
        if (response.ok) {
          const content = await response.text();
          if (!hasFileLoadedRef.current) {
            applyLoadedContent(content, null);
            console.log('📄 Loaded default file (welcome.md)');
          }
        }
      } catch (error) {
        console.error('Failed to load welcome.md:', error);
      }
    };

    loadDefaultFile();
  }, [applyLoadedContent]);

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

  // 現在のファイルパスの変更を監視
  useEffect(() => {
    if (currentFilePath) {
      console.log('📌 Current file:', currentFilePath);
      document.title = `MarkFlow - ${currentFilePath.split('/').pop()}`;
    } else {
      document.title = 'MarkFlow';
    }
  }, [currentFilePath]);

  // markdownの変更を監視してスクロール位置をリセット
  useEffect(() => {
    if (!hasFileLoaded) return;

    const timer = window.setTimeout(() => {
      resetScrollPosition();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasFileLoaded, scrollToken, resetScrollPosition]);

  // ElectronAPIイベントリスナー
  useEffect(() => {
    // メニューからのファイルを開く
    if (window.electronAPI?.onFileOpen) {
      window.electronAPI.onFileOpen(async () => {
        try {
          const result = await window.electronAPI.selectFile();
          if (result) {
            applyLoadedContent(result.content, result.filePath);
            console.log('📂 File opened:', result.filePath);
          }
        } catch (error) {
          console.error('File loading error:', error);
        }
      });
    }

    // メニューからのファイル再読み込み
    if (window.electronAPI?.onFileReload) {
      window.electronAPI.onFileReload(async () => {
        try {
          const result = await window.electronAPI.reloadFile();
          if (result) {
            applyLoadedContent(result.content, result.filePath);
            console.log('🔄 File reloaded:', result.filePath);
          } else {
            console.log('No file to reload');
          }
        } catch (error) {
          console.error('File reload error:', error);
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
        applyLoadedContent(data.content, data.filePath);
      });
    }
  }, [applyLoadedContent]);

  // ファイルロード
  const handleFileLoad = (content: string) => {
    applyLoadedContent(content, null);
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
      ref={appContainerRef}
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
