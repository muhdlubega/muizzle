import React from 'react';
import { FaFilm } from 'react-icons/fa';
import '../styles/Sidebar.css'

interface SidebarProps {
  onLanguageChange: (language: 'tamil' | 'hindi') => void;
  currentLanguage: 'tamil' | 'hindi';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onLanguageChange, 
  currentLanguage 
}) => {
  return (
    <div className="language-sidebar">
      <button 
        className={`language-button ${currentLanguage === 'tamil' ? 'active' : ''}`}
        onClick={() => onLanguageChange('tamil')}
      >
        <FaFilm /> Tamil
      </button>
      <button 
        className={`language-button ${currentLanguage === 'hindi' ? 'active' : ''}`}
        onClick={() => onLanguageChange('hindi')}
      >
        <FaFilm /> Hindi
      </button>
    </div>
  );
};

export default Sidebar;