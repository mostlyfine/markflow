import React from 'react';

interface FileLoaderProps {
  onFileLoad: (content: string) => void;
}

const FileLoader: React.FC<FileLoaderProps> = ({ onFileLoad }) => {
  const handleSelectFile = async () => {
    try {
      const result = await window.electronAPI.selectFile();
      if (result) {
        onFileLoad(result.content);
      }
    } catch (error) {
      console.error('File loading error:', error);
      alert('ファイルの読み込みに失敗しました');
    }
  };

  return (
    <div className="file-loader">
      <button onClick={handleSelectFile}>ファイルを開く</button>
    </div>
  );
};

export default FileLoader;
