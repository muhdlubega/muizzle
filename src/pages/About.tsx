import { useNavigate } from "react-router-dom";
import step1 from "../assets/step1.jpg";
import step2 from "../assets/step2.jpg";
import step3 from "../assets/step3.jpg";
import step4 from "../assets/step4.jpg";
import "../styles/About.css";
import Navbar from "../components/Navbar";

const About = () => {
    const navigate = useNavigate()

    return (
        <div>
            <Navbar />
            <div className="about">
                <h2 className="about-header">
                    Welcome to <span className="about-title">Muizzle</span>, a unique movie guessing game designed to provide an entertaining and
                    engaging experience for movie enthusiasts.
                </h2>
                <h3 className="about-header">How to play:</h3>
                <div className="about-steps">
                    <div className="about-step">
                        <img src={step1} alt="about step 1"/>
                        <p>
                            Everyday at 10am IST a new movie will be displayed. Input your guess
                            and select an option to guess the movie title.
                        </p>
                    </div>
                    <div className="about-step">
                        <img src={step2} alt="about step 2"/>
                        <p>
                            For each wrong guess, a new screenshot of the movie will be
                            displayed. You have 6 attempts to guess the title.
                        </p>
                    </div>
                    <div className="about-step">
                        <img src={step3} alt="about step 3"/>
                        <p>
                            On winning or losing, your statistics modal will be displayed, where
                            you can see your results and share your stats.
                        </p>
                        <p>
                            <strong>Disclaimer:</strong> Stats are stored in your cookies and
                            will be reset if cookies are cleared.
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
