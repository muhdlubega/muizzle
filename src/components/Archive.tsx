import React from "react";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import { imageService } from "../data/imageService";
import "../styles/Archive.css";
import { ArchiveProps, Language } from "../types/types";
import { getCurrentGameIndex } from "../utils/timeUtils";

const languageMapping: Record<Language, string> = {
  tamil: "Kollywood",
  hindi: "Bollywood",
  english: "Hollywood",
  eastasian: "Far East",
};

const Archive: React.FC<ArchiveProps> = ({
  language,
  isOpen,
  onClose,
  onSelectArchive,
}) => {
  const [folders, setFolders] = React.useState<string[]>([]);
  const languageText = languageMapping[language];

  React.useEffect(() => {
    const loadFolders = async () => {
      const currentIndex = getCurrentGameIndex();
      const allFolders = await imageService.getAllFolders();
      const availableFolders = allFolders.filter(
        (folder) => Number(folder) < currentIndex
      );
      setFolders(availableFolders);
    };

    loadFolders();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="archive-modal-content"
      overlayClassName="archive-modal-overlay"
    >
      <div className="archive-header">
        <h3 className="archive-shadow">Archives</h3>
        <h3 className="archive-title">
          Try out one of the previous {languageText} movies
        </h3>
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
            <p className="archive-text">#{folder}</p>
          </button>
        ))}
      </div>
      <p className="archive-note">
        Note: Archived movies do not impact your stats and daily streak
      </p>
    </Modal>
  );
};

export default Archive;
