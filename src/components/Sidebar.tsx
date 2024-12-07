import React, { useState } from "react";
import {
  FaBars,
  FaFilm,
  FaInfoCircle,
  FaEnvelope,
  FaShieldAlt,
} from "react-icons/fa";
import "../styles/Sidebar.css";
import { Language, SidebarProps } from "../types/types";

const Sidebar: React.FC<SidebarProps> = ({
  onLanguageChange,
  currentLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleSidebar = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  const handleLanguageChange = (language: Language) => {
    onLanguageChange(language);
    toggleSidebar();
  };

  return (
    <>
      <FaBars className="sidebar-toggle-button" onClick={toggleSidebar} />

      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}>
          <div
            className={`language-sidebar ${
              isClosing ? "slide-out" : "slide-in"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="sidebar-title">Muizzle</p>

            <button
              className={`language-button ${
                currentLanguage === "tamil" ? "active" : ""
              }`}
              onClick={() => handleLanguageChange("tamil")}
            >
              <FaFilm /> Tamil
            </button>
            <button
              className={`language-button ${
                currentLanguage === "hindi" ? "active" : ""
              }`}
              onClick={() => handleLanguageChange("hindi")}
            >
              <FaFilm /> Hindi
            </button>
            <button
              className={`language-button ${
                currentLanguage === "english" ? "active" : ""
              }`}
              onClick={() => handleLanguageChange("english")}
            >
              <FaFilm /> Hollywood
            </button>

            <a href="/privacy" className="sidebar-link">
              <FaShieldAlt /> Privacy Policy
            </a>
            <a href="/about" className="sidebar-link">
              <FaInfoCircle /> About Us
            </a>
            <a href="/contact" className="sidebar-link">
              <FaEnvelope /> Contact
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
