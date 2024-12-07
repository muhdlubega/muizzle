import React from 'react';
import { FaFilm } from 'react-icons/fa';
import '../styles/Sidebar.css'
import { Language } from '../types/types';

interface SidebarProps {
  onLanguageChange: (language: Language) => void;
  currentLanguage: Language;
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
      <button 
        className={`language-button ${currentLanguage === 'english' ? 'active' : ''}`}
        onClick={() => onLanguageChange('english')}
      >
        <FaFilm /> Hollywood
      </button>
    </div>
  );
};

export default Sidebar;