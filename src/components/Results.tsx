import React from "react";
import { FaRegCopy, FaSquare } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/Results.css";
import { ResultsProps } from "../types/types";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

const SITE_URL = window.location.origin;

const Results: React.FC<ResultsProps> = ({
  gameStatus,
  guesses,
  isArchiveGame,
  language,
  screenshots,
  showResult,
}) => {
  const savedState = localStorage.getItem(`gameState_${language}`);

  const generateShareText = () => {
    const gameNumber = screenshots[0]?.folder || "0";

    if (gameStatus === "won") {
      const wrongGuesses = "🟥".repeat(guesses.length - 1);
      const correctGuess = "🟩";
      const remainingSquares = "⬜".repeat(6 - guesses.length);
      return `Muizzle #${gameNumber}\n${wrongGuesses}${correctGuess}${remainingSquares}\nPlay now at: ${SITE_URL}`;
    } else {
      const redSquares = "🟥".repeat(6);
      return `Muizzle #${gameNumber}\n${redSquares}\nPlay now at: ${SITE_URL}`;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      toast.success("Stats copied to clipboard!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: "copyToClipboard",
      });
    } catch (error) {
      toast.error(`Error ${error}. Failed to copy stats to clipboard`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <div className="result">
        {savedState && showResult && gameStatus === "won" && (
          <span className="result-correct">
            <p className="result-title">
              Correct! The movie is{" "}
              <strong>
                {JSON.parse(savedState).movie.title || ""} (
                {JSON.parse(savedState).movie.release_date || ""})
              </strong>
            </p>
            {!isArchiveGame && (
              <span className="result-desc">
                <p className="result-text">
                  You guessed correctly in {guesses.length}{" "}
                  {guesses.length === 1 ? "try!" : "tries!"}
                </p>
                <div className="result-icons">
                  <span className="result-boxes">
                    {Array.from({ length: 6 }).map((_, index) => {
                      let color = "gray";

                      if (index < guesses.length) {
                        if (
                          gameStatus === "won" &&
                          index === guesses.length - 1
                        ) {
                          color = "green";
                        } else {
                          color = "#FF2247";
                        }
                      }

                      return <FaSquare key={index} color={color} size={25} />;
                    })}
                  </span>
                  <FaRegCopy
                    className="result-copy"
                    onClick={copyToClipboard}
                    size={20}
                  />
                </div>
              </span>
            )}
          </span>
        )}
        {savedState && showResult && gameStatus === "lost" && (
          <span className="result-wrong">
            <p className="result-title">
              Out of guesses! The correct answer was{" "}
              <strong>
                {JSON.parse(savedState).movie.title || ""} (
                {JSON.parse(savedState).movie.release_date || ""})
              </strong>
            </p>
            {!isArchiveGame && (
              <span className="result-desc">
                <p className="result-text">You didn't get it this time :(</p>
                <div className="result-icons">
                  <span className="result-boxes">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <FaSquare key={index} color="red" size={25} />
                    ))}
                  </span>
                  <FaRegCopy
                    className="result-copy"
                    onClick={copyToClipboard}
                    size={20}
                  />
                </div>
              </span>
            )}
          </span>
        )}
      </div>
      <div className="guesses">
        <ul className="guesses-list">
          {guesses.map((guess, index) => (
            <li
              className="guesses-item"
              key={index}
              style={{
                color: guess.isCorrect ? "green" : "#FF2247",
              }}
            >
              {guess.isCorrect ? (
                <HiCheckCircle size={24} />
              ) : (
                <HiXCircle size={24} />
              )}
              {guess.title} ({guess.date})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Results;
