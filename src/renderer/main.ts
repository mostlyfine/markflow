import { ElectronAPI } from '../preload/preload';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

/**
 * レンダラープロセスの初期化
 */
function initializeRenderer(): void {
  const infoElement = document.getElementById('info');
  if (!infoElement) {
    console.error('Info element not found');
    return;
  }

  // Electron APIが利用可能か確認
  if (window.electronAPI) {
    const { platform, versions } = window.electronAPI;
    infoElement.innerHTML = `
      <p><strong>Platform:</strong> ${platform}</p>
      <p><strong>Node:</strong> ${versions.node}</p>
      <p><strong>Chrome:</strong> ${versions.chrome}</p>
      <p><strong>Electron:</strong> ${versions.electron}</p>
    `;
  } else {
    infoElement.innerHTML = '<p>Electron API is not available</p>';
  }
}

// DOMContentLoaded後に初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRenderer);
} else {
  initializeRenderer();
}
