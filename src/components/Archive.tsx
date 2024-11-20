import React from 'react';
import Modal from 'react-modal';
import { getCurrentMinuteIndex } from '../utils/timeUtils';
import { imageService } from '../data/imageService'
import { IoMdClose } from 'react-icons/io';

interface ArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArchive: (folderNumber: string) => void;
}

const Archive: React.FC<ArchiveProps> = ({ isOpen, onClose, onSelectArchive }) => {
  const [folders, setFolders] = React.useState<string[]>([])

  React.useEffect(() => {
    const loadFolders = async () => {
      const currentIndex = getCurrentMinuteIndex()
      const allFolders = await imageService.getAllFolders()
      const availableFolders = allFolders.filter(folder => 
        Number(folder) < currentIndex
      )
      setFolders(availableFolders)
    }
    
    loadFolders()
  }, [])
  
  // FOR TESTING PURPOSES: display all folders as archive besides the current one //
  // const folders = React.useMemo(() => {
  //   const currentIndex = getCurrentMinuteIndex().toString();
    
  //   const uniqueFolders = new Set(
  //     files.map(file => file.split('/')[0]).sort((a, b) => Number(a) - Number(b))
  //   );

  //   return Array.from(uniqueFolders).filter(folder => {
  //     return folder !== currentIndex;
  //   });
  // }, []);

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
            Game #{folder}
          </button>
        ))}
      </div>
      <p>Note: Archived movies do not impact your stats and daily streak</p>
    </Modal>
  );
};

export default Archive;