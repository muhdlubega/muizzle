import { useNavigate } from "react-router-dom";
import step1 from "../assets/step1.jpg";
import step2 from "../assets/step2.jpg";
import step3 from "../assets/step3.jpg";
import step4 from "../assets/step4.jpg";
import "../styles/About.css";
import Navbar from "../components/Navbar";
import { Language } from "../types/types";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import kollywood from "../assets/kollywood.jpg";

const About = ({ language }: { language: Language }) => {
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
      <div className="about">
        <p className="about-header">
          Welcome to <span className="about-title">Muizzle</span>, a unique
          movie guessing game designed to provide an entertaining and engaging
          experience for movie enthusiasts.
          <br />
          <br /> Everyday at <strong>2pm IST</strong> new movies for the Tamil,
          Hindi and Hollywood categories will be displayed. Switch between the
          different categories via the sidebar icon on the top left corner.
        </p>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1748896712033823"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1748896712033823"
          data-ad-slot="4565463408"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        <h2 style={{ color: "#FF2247" }}>How to play:</h2>
        <div className="about-steps">
          <div className="about-step">
            <img src={step1} alt="about step 1" />
            <p>
              To start the game, input your guess into the searchbar and select
              an option or press submit to select the first option from the list
              to guess the movie title.
            </p>
          </div>
          <div className="about-step">
            <img src={step2} alt="about step 2" />
            <p>
              For each wrong guess, a new screenshot of the movie will be
              displayed. You have 6 attempts to guess the title.
            </p>
          </div>
          <div className="about-step">
            <img src={step3} alt="about step 3" />
            <p>
              On winning or losing, your statistics modal will popup, where you
              can see your results and share your stats. Stats are stored in
              your local storage and will be reset if website data is cleared.
            </p>
          </div>
          <div className="about-step">
            <img src={step4} alt="about step 4" />
            <p>
              To open your stats modal again click on the icon on the top right
              corner. You'll also be able to access the previous games from the
              'Open Archives' button. You can also press the onboarding icon
              beside the screenshots to learn more.
            </p>
          </div>
        </div>
        <div className="partner">
          <h2 style={{ color: "#FF2247" }}>Partnered with:</h2>
          <img
            className="partner-logo"
            src={kollywood}
            alt="kollywood-logo"
            onClick={() =>
              window.open("https://www.reddit.com/r/kollywood/", "_blank")
            }
          />
        </div>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1748896712033823"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1748896712033823"
          data-ad-slot="4565463408"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        <button className="about-close" onClick={() => navigate("/")}>
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default About;
