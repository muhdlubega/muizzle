import { useEffect, useState } from "react";
import { AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import Navbar from "./components/Navbar";
import { CgProfile } from "react-icons/cg";

function App() {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const navigate = useNavigate();

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
            onClick={() => navigate('/about')}
          >
            <span className="footer-icon-text">
              <CgProfile className="footer-icon" />
              <span className="footer-text">About Us</span>
            </span>
          </a>
          |
          <a
            className="footer-button"
            onClick={() => navigate('/privacy')}
          >
            <span className="footer-icon-text">
              <AiOutlineInfoCircle className="footer-icon" />
              <span className="footer-text">Privacy Policy</span>
            </span>
          </a>
          |
          <a
            className="footer-button"
            onClick={() => navigate('/contact')}
          >
            <span className="footer-icon-text">
              <AiOutlineMail className="footer-icon" />
              <span className="footer-text">Contact</span>
            </span>
          </a>
        </div>
      </div>

      {/* GDPR Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="cookie-banner">
          <p>
            This website uses cookies to ensure you get the best experience.
            Learn more in our{" "}
            <span
              className="cookie-link"
              onClick={() => navigate('/privacy')}
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
