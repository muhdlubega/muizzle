import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import Navbar from "./components/Navbar";
import { FaEnvelope, FaInfoCircle, FaShieldAlt } from "react-icons/fa";

function App() {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const consent = Cookies.get("cookieConsent");
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    Cookies.set("cookieConsent", "true", { expires: 365 });
    setShowCookieBanner(false);
  };

  return (
    <div className="app">
      <Navbar />
      <Game />
      <div className="spacer"></div>
      <div className="footer-container">
        <div className="footer">
          <a className="footer-button" onClick={() => navigate("/privacy")}>
            <span className="footer-icon-text">
              <FaShieldAlt className="footer-icon" />
              <span className="footer-text">Privacy Policy</span>
            </span>
          </a>
          |
          <a className="footer-button" onClick={() => navigate("/about")}>
            <span className="footer-icon-text">
              <FaInfoCircle className="footer-icon" />
              <span className="footer-text">About Us</span>
            </span>
          </a>
          |
          <a className="footer-button" onClick={() => navigate("/contact")}>
            <span className="footer-icon-text">
              <FaEnvelope className="footer-icon" />
              <span className="footer-text">Contact</span>
            </span>
          </a>
        </div>
      </div>

      {/* GDPR Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="cookie-banner">
          <p>
            For better experience and ensuring that your stats are updated,
            please accept the cookies. Learn more in our{" "}
            <span className="cookie-link" onClick={() => navigate("/privacy")}>
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
