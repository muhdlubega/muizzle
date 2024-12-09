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
      <div className="onboarding-steps">
        <div className="onboarding-step">
          <p>
            Everyday at <strong>2pm IST</strong> new movies for the Tamil, Hindi
            and Hollywood categories will be displayed. Switch between the
            different categories via the sidebar icon on the top left corner.
          </p>
        </div>
        <div className="onboarding-step">
          <img src={step1} alt="onboarding step 1" width={420} />
          <p>
            To start the game, input your guess into the searchbar and select an
            option or press submit to select the first option from the list to
            guess the movie title.
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
            On winning or losing, your statistics modal will popup, where you
            can see your results and share your stats.
          </p>
          <p>
            <strong>Disclaimer:</strong> Stats are stored in your local storage
            and will be reset if website data is cleared.
          </p>
        </div>
        <div className="onboarding-step">
          <img src={step4} alt="onboarding step 4" width={420} />
          <p ref={lastParagraphRef}>
            To open your stats modal again click on the icon on the top right
            corner. You'll also be able to access the previous games from the
            'Open Archives' button.
          </p>
          <p>
            <strong>Note:</strong> If you are stuck press on the onboarding icon
            beside the screenshots or open the About us page to learn more.
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
