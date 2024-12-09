import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import Navbar from "./components/Navbar";
import { FaEnvelope, FaInfoCircle, FaShieldAlt } from "react-icons/fa";
import { Language } from "./types/types";

function App({ language }: { language: Language }) {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const lang = searchParams.get("lang");
    if (!lang) {
      const defaultLang = localStorage.getItem("preferredLanguage") || "tamil";
      const langParam =
        defaultLang === "tamil" ? "TA" : defaultLang === "hindi" ? "HI" : "EN";
      navigate(`/?lang=${langParam}`, { replace: true });
    }
  }, [searchParams, navigate]);

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
      <Navbar language={language} />
      <Game preferredLanguage={language} />
      <div className="spacer"></div>
      <div className="footer-container">
        <div className="footer">
          <a
            className="footer-button"
            onClick={() =>
              navigate(`/privacy?lang=${searchParams.get("lang")}`)
            }
          >
            <span className="footer-icon-text">
              <FaShieldAlt className="footer-icon" />
              <span className="footer-text">Privacy Policy</span>
            </span>
          </a>
          |
          <a
            className="footer-button"
            onClick={() => navigate(`/about?lang=${searchParams.get("lang")}`)}
          >
            <span className="footer-icon-text">
              <FaInfoCircle className="footer-icon" />
              <span className="footer-text">About Us</span>
            </span>
          </a>
          |
          <a
            className="footer-button"
            onClick={() =>
              navigate(`/contact?lang=${searchParams.get("lang")}`)
            }
          >
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
            For better experience, please accept the cookies. Learn more in our{" "}
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
