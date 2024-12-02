import { useTour } from "@reactour/tour";
import React from "react";
import { RiSlideshow3Line } from "react-icons/ri";
import "../styles/Screenshots.css";
import { ScreenshotsProps } from "../types/types";

const Screenshots: React.FC<ScreenshotsProps> = ({
  currentScreenshotIndex,
  gameStatus,
  highestIndexReached,
  screenshots,
  setCurrentScreenshotIndex,
  timeUntilNextGame,
  revealedScreenshots,
}) => {
  const { setIsOpen, setCurrentStep } = useTour();

  const handleTourStart = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const handleThumbnailClick = (index: React.SetStateAction<number>) => {
    setCurrentScreenshotIndex(index);
  };

  return (
    <>
      <div className="screenshot">
        <img
          className="screenshot-image onboarding01"
          src={screenshots[currentScreenshotIndex]?.url || ""}
          alt="Movie Screenshot"
          onError={(e) => {
            console.error(
              "Error loading image:",
              screenshots[currentScreenshotIndex]?.url
            );
            e.currentTarget.onerror = null;
          }}
        />
      </div>

      <div className="next-game">
        <p>Next movie releasing in</p>
        <div className="countdown">{timeUntilNextGame}</div>
      </div>
      <div className="screenshot-thumbnails onboarding02">
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="thumbnail-box">
              {gameStatus === "won" ||
              gameStatus === "lost" ||
              index <= highestIndexReached ||
              revealedScreenshots.some(
                (revealed) => revealed.url === screenshots[index]?.url
              ) ? (
                <img
                  src={screenshots[index]?.url || ""}
                  alt={`Screenshot ${index + 1}`}
                  className={`thumbnail-image ${
                    index === currentScreenshotIndex ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                  onError={(e) => {
                    console.error(
                      "Error loading thumbnail:",
                      screenshots[index]?.url
                    );
                    e.currentTarget.onerror = null;
                  }}
                />
              ) : (
                <div className="empty-box"></div>
              )}
            </div>
          ))}
        <RiSlideshow3Line
          className="tour-button"
          onClick={handleTourStart}
          size={32}
        />
      </div>
    </>
  );
};

export default Screenshots;
