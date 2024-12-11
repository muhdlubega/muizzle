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
import { useNavigate, useSearchParams } from "react-router-dom";

const Sidebar: React.FC<SidebarProps> = ({
  onLanguageChange,
  currentLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    const langParam =
      language === "tamil"
        ? "TA"
        : language === "hindi"
        ? "HI"
        : language === "english"
        ? "EN"
        : "EA";
    navigate(`/?lang=${langParam}`);
    toggleSidebar();
  };

  const navigateToPage = (path: string) => {
    const langParam =
      currentLanguage === "tamil"
        ? "TA"
        : currentLanguage === "hindi"
        ? "HI"
        : currentLanguage === "english"
        ? "EN"
        : "EA";
    navigate(`${path}?lang=${langParam}`);
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
                searchParams.get("lang") === "TA" ? "active" : ""
              }`}
              onClick={() => handleLanguageChange("tamil")}
            >
              <FaFilm /> Kollywood (TA)
            </button>
            <button
              className={`language-button ${
                searchParams.get("lang") === "HI" ? "active" : ""
              }`}
              onClick={() => handleLanguageChange("hindi")}
            >
              <FaFilm /> Bollywood (HI)
            </button>
            <button
              className={`language-button ${
                searchParams.get("lang") === "EN" ? "active" : ""
              }`}
              onClick={() => handleLanguageChange("english")}
            >
              <FaFilm /> Hollywood (EN)
            </button>
            <button
              className={`language-button ${
                searchParams.get("lang") === "EA" ? "active" : ""
              }`}
              onClick={() => handleLanguageChange("eastasian")}
            >
              <FaFilm /> East Asian (KO/JP/CN)
            </button>

            <a
              onClick={() => navigateToPage("/privacy")}
              className="sidebar-link"
            >
              <FaShieldAlt /> Privacy Policy
            </a>
            <a
              onClick={() => navigateToPage("/about")}
              className="sidebar-link"
            >
              <FaInfoCircle /> About Us
            </a>
            <a
              onClick={() => navigateToPage("/contact")}
              className="sidebar-link"
            >
              <FaEnvelope /> Contact
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
