import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import step1 from "../assets/step1.jpg";
import step2 from "../assets/step2.jpg";
import step3 from "../assets/step3.jpg";
import step4 from "../assets/step4.jpg";
import "../styles/OnboardingModal.css";
import { OnboardingModalProps } from "../types/types";

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastParagraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsAtBottom(entry.isIntersecting);
        });
      },
      {
        threshold: 0.5,
      }
    );

    const lastParagraph = lastParagraphRef.current;
    if (lastParagraph) {
      observer.observe(lastParagraph);
    }

    return () => {
      if (lastParagraph) {
        observer.unobserve(lastParagraph);
      }
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={undefined}
      shouldFocusAfterRender={false}
      className="onboarding-modal"
      overlayClassName="onboarding-modal-overlay"
    >
      <h2 className="onboarding-header">
        Welcome to <span className="onboarding-title">Muizzle</span>
      </h2>
      <h5 className="onboarding-note">
        ⚠️ Note: This website uses TMDB API which is currently blocked in India.
        Consider using VPN if you are unable to view the movie list
      </h5>
      <div className="onboarding-steps">
        <div className="onboarding-step">
          <img src={step1} alt="onboarding step 1" width={420} />
          <p>
            Everyday at 10am IST a new movie will be displayed. Input your guess
            and select an option to guess the movie title.
          </p>
        </div>
        <div className="onboarding-step">
          <img src={step2} alt="onboarding step 2" width={420} />
          <p>
            For each wrong guess, a new screenshot of the movie will be
            displayed. You have 6 attempts to guess the title.
          </p>
        </div>
        <div className="onboarding-step">
          <img src={step3} alt="onboarding step 3" width={420} />
          <p>
            On winning or losing, your statistics modal will be displayed, where
            you can see your results and share your stats.
          </p>
          <p>
            <strong>Disclaimer:</strong> Stats are stored in your cookies and
            will be reset if cookies are cleared.
          </p>
        </div>
        <div className="onboarding-step">
          <img src={step4} alt="onboarding step 4" width={420} />
          <p ref={lastParagraphRef}>
            Clearing your first game unlocks access to the archive and stats on
            the top right corner. Open the archives to try out previous games.
          </p>
        </div>
        <button className="onboarding-close" onClick={onClose}>
          Let's Go!
        </button>
      </div>
      {!isAtBottom && (
        <p className="scroll-message">Scroll to the bottom to continue</p>
      )}
    </Modal>
  );
};

export default OnboardingModal;
