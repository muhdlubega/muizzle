import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Privacy.css";
import { Language } from "../types/types";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";

const Privacy = ({ language }: { language: Language }) => {
  const navigate = useNavigate();
  const handleLanguageChange = (language: Language) => {
    localStorage.setItem("preferredLanguage", language);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Sidebar
        onLanguageChange={handleLanguageChange}
        currentLanguage={language}
      />
      <Navbar language={language} />
      <div className="privacy">
        <h2 style={{ color: "#FF2247" }}>
          Privacy Policy and Terms of Service
        </h2>
        <h4>
          Welcome to{" "}
          <strong
            style={{ fontFamily: "Lobster", color: "#FF2247", fontSize: 24 }}
          >
            Muizzle
          </strong>
          , a unique movie guessing game designed to provide an entertaining and
          engaging experience for movie enthusiasts. This document explains the
          policies and procedures regarding how we collect, use, store, and
          protect the data associated with your gameplay. By playing Muizzle,
          you acknowledge and accept the terms outlined in this Privacy Policy
          and Terms of Service. Our commitment is to ensure your data remains
          safe, secure, and used solely to enhance your experience.
        </h4>
        <br />
        <span>
          <strong style={{ color: "#FF2247" }}>
            2. Data Collection and Cookies:
          </strong>{" "}
          Muizzle relies on local storage to optimize your gaming experience,
          store your progress, and maintain game-related statistics. Local
          storage are small data files stored in your browser, and Muizzle only
          uses functional cookies—specifically designed to enhance the
          onboarding process. These cookies saves the condition whether you have
          completed the onboarding process to ensure instructions are clear for
          first-time users.{" "}
          <p>
            The purpose of these data storage is to ensure seamless gameplay and
            allow you to resume where you left off or analyze how your guesses
            have improved over time. These functional cookies are designed with
            simplicity and user-centricity in mind, ensuring that your data
            stays local and is used only to enhance your experience.
          </p>
        </span>
        <br />
        <span>
          <strong style={{ color: "#FF2247" }}>3. Data Privacy:</strong> At
          Muizzle, we prioritize your privacy. All game-related data is stored
          locally in your browser, meaning that no personal identifying
          information is transmitted to or stored on external servers. The data
          collected through the locla storage is completely anonymized, focusing
          solely on gameplay statistics without tying any data back to
          individual users.{" "}
          <p>
            Daily game states, which save your progress during a session,
            automatically expire when the next game begins. This ensures
            short-term convenience while maintaining your privacy.
          </p>
        </span>
        <br />
        <span>
          <strong style={{ color: "#FF2247" }}>4. Third-Party Services:</strong>{" "}
          Muizzle utilizes a limited set of third-party services to provide
          certain features. For instance, screenshots taken during the game are
          securely stored in Cloudflare R2 Cloud Storage, a reliable and
          privacy-focused cloud platform. These screenshots are accessible only
          via dynamically generated URLs that are secured with time-limited
          access tokens, ensuring that the links expire after one hour. This
          approach minimizes the risk of unauthorized access and maintains the
          confidentiality of the images.
          <p>
            In addition, Muizzle uses the Trakt TV API to power its movie search
            functionality and retrieve metadata for gameplay. These API queries
            are entirely non-personalized, meaning no identifiable information
            is included in the requests. This ensures that your interactions
            with third-party services remain anonymous and focused solely on
            delivering a smooth gaming experience.
          </p>
        </span>
        <br />
        <span>
          <strong style={{ color: "#FF2247" }}>5. Data Security:</strong>{" "}
          Muizzle employs robust security measures to safeguard the data
          associated with gameplay. Screenshots taken during the game are stored
          in a private bucket within Cloudflare R2, which requires authenticated
          and time-limited credentials to access. The filenames for these
          screenshots are intentionally limited to basic identifiers, such as
          the movie ID and screenshot index, avoiding any personal or sensitive
          information.{" "}
          <p>
            Access to stored screenshots is further controlled through
            authenticated service calls, with temporary signed URLs ensuring
            that only authorized users can retrieve them. Each game session
            dynamically generates a list of relevant screenshots, ensuring that
            no unauthorized parties can access or reuse previous game data.
            These measures provide multiple layers of security, keeping your
            data protected at all times.
          </p>
        </span>
        <br />
        <span>
          <strong style={{ color: "#FF2247" }}>6. User Consent:</strong> By
          playing Muizzle, you consent to the use of local storage to enhance
          gameplay and store your game progress. This consent allows us to
          provide a seamless and enjoyable gaming experience without requiring
          additional permissions or intrusive data collection methods.
          <p>
            If, at any point, you wish to reset your game data or opt out of
            these features, you can simply clear your browser cache and website
            data. Doing so will erase all locally stored data, including your
            game progress, statistics, and saved states, allowing you to start
            fresh without any retained information.
          </p>
        </span>
        <br />
        <p>
          <strong style={{ color: "#FF2247" }}>7. Security:</strong> Muizzle is
          designed with a local-first approach to data storage, meaning all
          information is stored directly in your browser rather than on external
          servers. This ensures that your data remains under your control and
          minimizes potential security risks. Additionally, Muizzle does not
          collect or store sensitive personal information and does not employ
          external tracking or analytics services. These choices reflect our
          commitment to providing a secure and private gaming environment.
        </p>
        <br />
        <p>
          <strong style={{ color: "#FF2247" }}>
            8. Changes to Privacy Policy:
          </strong>{" "}
          From time to time, we may update this Privacy Policy and Terms of
          Service to reflect changes in the game or to improve our data
          practices. Any updates will take effect immediately upon publication.
          We encourage you to review this document periodically to stay informed
          about how your data is managed and protected.
        </p>
        <br />
        <p>
          <strong style={{ color: "#FF2247" }}>9. Disclaimer:</strong> Muizzle
          is provided on an "as is" basis, meaning there are no warranties or
          guarantees regarding the availability or performance of the game.
          While we strive to maintain a seamless and enjoyable experience,
          certain factors—such as clearing your website data result in the loss
          of game data. By using Muizzle, you acknowledge and accept this
          possibility, as well as the overall terms outlined in this document.
        </p>
        <p>
          <strong>Last Updated On:</strong> 09/12/2024
        </p>
        <br />
        <button className="privacy-close" onClick={() => navigate("/")}>
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default Privacy;
