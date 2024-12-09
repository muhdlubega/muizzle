import React from 'react';
import { IoMdClose } from 'react-icons/io';
import Modal from 'react-modal';
import { imageService } from '../data/imageService';
import '../styles/Archive.css';
import { ArchiveProps } from '../types/types';
import { getCurrentGameIndex } from '../utils/timeUtils';

const Archive: React.FC<ArchiveProps> = ({ isOpen, onClose, onSelectArchive }) => {
  const [folders, setFolders] = React.useState<string[]>([])

  React.useEffect(() => {
    const loadFolders = async () => {
      const currentIndex = getCurrentGameIndex()
      const allFolders = await imageService.getAllFolders()
      const availableFolders = allFolders.filter(folder => 
        Number(folder) < currentIndex
      )
      setFolders(availableFolders)
    }
    
    loadFolders()
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="archive-modal-content"
      overlayClassName="archive-modal-overlay"
    >
      <div className="archive-header">
        <h3 className='archive-title'>Try out one of the previous movies here</h3>
        <IoMdClose className="close-button" onClick={onClose} />
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
            <p className='archive-text'>#{folder}</p>
          </button>
        ))}
      </div>
      <p className='archive-note'>Note: Archived movies do not impact your stats and daily streak</p>
    </Modal>
  );
};

export default Archive;