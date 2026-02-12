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

  // Prevent window-level scrolling to avoid double scrollbars; restore on unmount
  useEffect(() => {
    const { documentElement, body } = document;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    documentElement.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      documentElement.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const applyLoadedContent = useCallback(
    (content: string, filePath: string | null = null) => {
      setMarkdown(content);
      setCurrentFilePath(filePath);
      setHasFileLoaded(true);
      hasFileLoadedRef.current = true;
      setScrollToken((prev) => prev + 1);
    },
    []
  );

  // Load the default welcome file on first boot
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

  // Load persisted custom CSS
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

  // Update document title when the current file changes
  useEffect(() => {
    if (currentFilePath) {
      console.log('📌 Current file:', currentFilePath);
      document.title = `MarkFlow - ${currentFilePath.split('/').pop()}`;
    } else {
      document.title = 'MarkFlow';
    }
  }, [currentFilePath]);

  // Reset scroll position whenever markdown content changes
  useEffect(() => {
    if (!hasFileLoaded) return;

    const timer = window.setTimeout(() => {
      resetScrollPosition();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasFileLoaded, scrollToken, resetScrollPosition]);

  // Wire up Electron bridge listeners
  useEffect(() => {
    const disposers: Array<() => void> = [];

    // Open files via the application menu
    if (window.electronAPI?.onFileOpen) {
      const disposer = window.electronAPI.onFileOpen(async () => {
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
      if (disposer) disposers.push(disposer);
    }

    // Reload files from the application menu
    if (window.electronAPI?.onFileReload) {
      const disposer = window.electronAPI.onFileReload(async () => {
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
      if (disposer) disposers.push(disposer);
    }

    // Toggle the settings panel from the menu
    if (window.electronAPI?.onToggleSettings) {
      const disposer = window.electronAPI.onToggleSettings(() => {
        setShowSettings((prev) => !prev);
      });
      if (disposer) disposers.push(disposer);
    }

    // Load files provided via CLI
    if (window.electronAPI?.onFileOpenFromCLI) {
      const disposer = window.electronAPI.onFileOpenFromCLI((data) => {
        console.log('📋 Loading file from CLI:', data.filePath);
        applyLoadedContent(data.content, data.filePath);
      });
      if (disposer) disposers.push(disposer);
    }

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [applyLoadedContent]);

  // Load newly selected file content
  const handleFileLoad = (content: string) => {
    applyLoadedContent(content, null);
  };

  // Update CSS when settings is saved
  const handleCSSUpdate = (css: string) => {
    setCustomCSS(css);
  };

  // Handle drag and drop file loading
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.match(/\.(md|markdown|txt)$/i)) {
      alert('Please select a Markdown file');
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
      <style>{!showSettings ? customCSS : ''}</style>

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
