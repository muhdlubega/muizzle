import React from 'react';
import Modal from 'react-modal';
import { files } from '../data/screenshots';
import { getCurrentMinuteIndex } from '../utils/timeUtils';

interface ArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArchive: (folderNumber: string) => void;
}

const Archive: React.FC<ArchiveProps> = ({ isOpen, onClose, onSelectArchive }) => {
  const folders = React.useMemo(() => {
    const currentIndex = getCurrentMinuteIndex();
    
    const uniqueFolders = new Set(
      files.map(file => file.split('/')[0])
    );

    return Array.from(uniqueFolders)
      .map(Number)
      .filter(folder => folder < currentIndex)
      .sort((a, b) => b - a)
      .map(String);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="archive-modal-content"
      overlayClassName="archive-modal-overlay"
    >
      <div className="archive-header">
        <h2>Try out one of the previous movies here</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="archive-grid">
        {folders.map((folder) => (
          <button
            key={folder}
            className="archive-item"
            onClick={() => {
              onSelectArchive(folder);
              onClose();
            }}
          >
            Game #{folder}
          </button>
        ))}
      </div>
      <p>Note: Archived movies do not impact your stats and daily streak</p>
    </Modal>
  );
};

export default Archive;