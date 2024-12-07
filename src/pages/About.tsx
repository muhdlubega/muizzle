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

const About = ({ language }: { language: Language }) => {
    const navigate = useNavigate()

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
                    Welcome to <span className="about-title">Muizzle</span>, a unique movie guessing game designed to provide an entertaining and
                    engaging experience for movie enthusiasts.
                </p>
                <h2 style={{ color: "#FF2247" }}>How to play:</h2>
                <div className="about-steps">
                    <div className="about-step">
                        <img src={step1} alt="about step 1" />
                        <p>
                            Everyday at 10am IST a new movie will be displayed. Input your guess
                            and select an option to guess the movie title.
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
                            On winning or losing, your statistics modal will be displayed, where
                            you can see your results and share your stats.
                        </p>
                        <p>
                            <strong>Disclaimer:</strong> Stats are stored in your local storage and
                            will be reset if website data is cleared.
                        </p>
                    </div>
                    <div className="about-step">
                        <img src={step4} alt="about step 4" />
                        <p>
                            Clearing your first game unlocks access to the archive and stats on
                            the top right corner. Open the archives to try out previous games.
                        </p>
                    </div>
                </div>
                <button className="about-close" onClick={() => navigate('/')}>
                    Return to Homepage
                </button>
            </div>
        </div>
    );
};

export default About;
