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
      }
    } catch (error) {
      console.error('Failed to save CSS:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
    onClose();
  };

  return (
    <div id="settings-panel" className="settings-panel">
      <div className="settings-header">
        <h2>Settings</h2>
      </div>

      <p>Edit the custom CSS applied to the Markdown preview.</p>

      <div className="settings-section">
        <h3>Custom CSS</h3>
        <textarea
          value={css}
          onChange={(e) => setCSS(e.target.value)}
          placeholder="// Custom css example:
body {
  font-size: 16px;
  background-color: #f0f0f0;
}"
          rows={20}
        />
      </div>

      <div className="settings-actions">
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button className="btn-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Settings;
