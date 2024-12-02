import { useEffect, useState } from "react";
import { AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";
import "./App.css";
import Game from "./components/Game";
import Navbar from "./components/Navbar";
import PrivacyModal from "./components/PrivacyModal";

function App() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

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
        onClose={() => setShowDetailsModal(false)}
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
