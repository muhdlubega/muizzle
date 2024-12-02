import { useEffect, useState } from "react";
import { AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import Navbar from "./components/Navbar";
import PrivacyModal from "./components/PrivacyModal";

function App({ showPrivacyModal = false }: { showPrivacyModal?: boolean }) {
  const [showDetailsModal, setShowDetailsModal] = useState(showPrivacyModal);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/privacy") {
      setShowDetailsModal(true);
    }
  }, [location]);

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    if (location.pathname === "/privacy") {
      navigate("/");
    }
  };

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowCookieBanner(false);
  };

  return (
    <div className="app">
      <Navbar />
      <Game />
      <div className="spacer"></div>
      <div className="footer-container">
        <div className="footer">
          <a
            className="footer-button"
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={() => setShowDetailsModal(true)}
          >
            <span className="footer-icon-text">
              <AiOutlineInfoCircle className="footer-icon" />
              <span className="footer-text">Privacy Policy and TOS</span>
            </span>
          </a>
          |
          <a
            href="mailto:muizzle.me@gmail.com?subject=Contact%20Muizzle&body=Hi%20Muizzle%20Team,"
            className="footer-button"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="footer-icon-text">
              <AiOutlineMail className="footer-icon" />
              <span className="footer-text">Contact Us</span>
            </span>
          </a>
          |
          <a
            className="trakt-api"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Powered by Trakt API
          </a>
        </div>
      </div>
      <PrivacyModal
        isOpen={showDetailsModal}
        onClose={handleCloseModal}
      />

      {/* GDPR Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="cookie-banner">
          <p>
            This website uses cookies to ensure you get the best experience.
            Learn more in our{" "}
            <span
              className="cookie-link"
              onClick={() => setShowDetailsModal(true)}
            >
              Privacy Policy
            </span>
            .
          </p>
          <button className="cookie-button" onClick={handleAcceptCookies}>
            Accept Cookies
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
