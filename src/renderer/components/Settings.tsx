import React, { useState, useEffect } from 'react';

interface SettingsProps {
  onClose: () => void;
  onCSSUpdate: (css: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose, onCSSUpdate }) => {
  const [css, setCSS] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const loadCSS = async () => {
      try {
        const customCSS = await window.electronAPI.getCustomCSS();
        setCSS(customCSS || '');
      } catch (error) {
        console.error('Failed to load CSS:', error);
      }
    };

    loadCSS();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await window.electronAPI.setCustomCSS(css);
      if (success) {
        onCSSUpdate(css);
        alert('設定を保存しました');
      } else {
        alert('設定の保存に失敗しました');
      }
    } catch (error) {
      console.error('Failed to save CSS:', error);
      alert('設定の保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="settings-panel" className="settings-panel">
      <div className="settings-header">
        <h2>設定</h2>
      </div>

      <p>Markdownビューアに適用するカスタムCSSを編集できます。</p>

      <div className="settings-section">
        <h3>カスタムCSS</h3>
        <textarea
          value={css}
          onChange={(e) => setCSS(e.target.value)}
          placeholder="カスタムCSSを入力してください..."
          rows={20}
        />
      </div>

      <div className="settings-actions">
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
        <button className="btn-close" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default Settings;
