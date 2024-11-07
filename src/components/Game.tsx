import React from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import { files } from "../data/screenshots";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { getNextGameTime, getCurrentDay } from "../utils/timeUtils";

interface Movie {
  title: string;
  release_date: string;
}

interface Guess {
  title: string;
  date: Date;
  isCorrect: boolean | null;
  movieId: number;
}

const Game = () => {
  const [movie, setMovie] = React.useState<Movie | null>(null);
  const [screenshots, setScreenshots] = React.useState<string[]>([]);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = React.useState(0);
  const [highestIndexReached, setHighestIndexReached] = React.useState(0);
  const [revealedScreenshots, setRevealedScreenshots] = React.useState<string[]>([]);
  const [guesses, setGuesses] = React.useState<Guess[]>([]);
  const [guessesLeft, setGuessesLeft] = React.useState(6);
  const [gameStatus, setGameStatus] = React.useState("playing");
  const [showResult, setShowResult] = React.useState(false);
  const [timeUntilNextGame, setTimeUntilNextGame] = React.useState("");
  const [currentDay, setCurrentDay] = React.useState(getCurrentDay());

  const API_KEY: string = import.meta.env.VITE_APP_TMDB_API_KEY;
  const fetchMovie = React.useCallback(
    async (id: string) => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    },
    [API_KEY]
  );

  const loadDailyScreenshot = React.useCallback(() => {
    const day = getCurrentDay();
    const dayFolder = `${day}`;
    const dailyScreenshots = files.filter((file) =>
      file.startsWith(`${dayFolder}/`)
    );
    const firstScreenshot = dailyScreenshots[0];
    const extractedMovieID = firstScreenshot.split("/")[1].split("-")[0];

    setScreenshots(dailyScreenshots);
    fetchMovie(extractedMovieID);
    Cookies.set("gameDay", day.toString());
  }, [fetchMovie]);

  React.useEffect(() => {
    const savedState = Cookies.get("gameState");
    const savedDay = Cookies.get("gameDay");

    if (savedState && savedDay === currentDay.toString()) {
      const parsedState = JSON.parse(savedState);
      setMovie(parsedState.movie);
      setScreenshots(parsedState.screenshots);
      setCurrentScreenshotIndex(parsedState.currentScreenshotIndex);
      setHighestIndexReached(parsedState.highestIndexReached);
      setRevealedScreenshots(parsedState.revealedScreenshots);
      setGuesses(parsedState.guesses);
      setGuessesLeft(parsedState.guessesLeft);
      setGameStatus(parsedState.gameStatus);
      setShowResult(parsedState.showResult);
    } else {
      loadDailyScreenshot();
    }
  }, [currentDay, loadDailyScreenshot]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextGame = getNextGameTime() ;
      const diff = nextGame.getTime() - now.getTime();

      if (diff <= 0) {
        setCurrentDay(getCurrentDay());
        Cookies.remove("gameState");
        Cookies.remove("gameDay");
        loadDailyScreenshot();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeUntilNextGame(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loadDailyScreenshot]);

  React.useEffect(() => {
    if (gameStatus !== "playing" && !showResult) {
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  }, [gameStatus, showResult]);

  React.useEffect(() => {
    if (movie) {
      const gameState = {
        movie,
        screenshots,
        currentScreenshotIndex,
        highestIndexReached,
        revealedScreenshots,
        guesses,
        guessesLeft,
        gameStatus,
        showResult,
      };
      Cookies.set("gameState", JSON.stringify(gameState), {
        expires: new Date(getNextGameTime()),
      });
    }
  }, [
    movie,
    screenshots,
    currentScreenshotIndex,
    highestIndexReached,
    revealedScreenshots,
    guesses,
    guessesLeft,
    gameStatus,
    showResult,
  ]);

  const handleGuess = (input: string, date: Date, movieId: number) => {
    if (guesses.some((guess) => guess.movieId === movieId)) {
      toast.error("You already guessed this movie!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const isCorrect =
      movie && input.toLowerCase() === movie.title.toLowerCase();
    setGuesses([
      ...guesses,
      {
        title: input,
        date,
        isCorrect,
        movieId,
      },
    ]);

    if (isCorrect) {
      setGameStatus("won");
    } else {
      setGuessesLeft((prev) => prev - 1);

      if (guessesLeft - 1 <= 0) {
        setGameStatus("lost");
      } else if (currentScreenshotIndex < screenshots.length - 1) {
        setCurrentScreenshotIndex(highestIndexReached);
        const newIndex = highestIndexReached + 1;
        setCurrentScreenshotIndex(newIndex);
        setHighestIndexReached(newIndex);
        setRevealedScreenshots((prev) => {
          const updatedRevealed = [...prev];
          if (!updatedRevealed.includes(screenshots[newIndex])) {
            updatedRevealed.push(screenshots[newIndex]);
          }
          return updatedRevealed;
        });
      }
    }
  };

  const handleThumbnailClick = (index: React.SetStateAction<number>) => {
    setCurrentScreenshotIndex(index);
  };

  return (
    <div className="game">
      <ToastContainer />
      <div className="container">
        <div className="screenshot">
          <img
            className="screenshot-image"
            src={`/screenshots/${screenshots[currentScreenshotIndex]}`}
            alt="Movie Screenshot"
          />
        </div>
        <div className="screenshot-thumbnails">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="thumbnail-box">
                {gameStatus === "won" ||
                index <= highestIndexReached ||
                revealedScreenshots.includes(screenshots[index]) ? (
                  <img
                    src={`/screenshots/${screenshots[index]}`}
                    alt={`Screenshot ${index + 1}`}
                    className={`thumbnail-image ${
                      index === currentScreenshotIndex ? "active" : ""
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ) : (
                  <div className="empty-box"></div>
                )}
              </div>
            ))}
        </div>
        <SearchBar onGuess={handleGuess} disabled={gameStatus !== "playing"} />
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
              {guess.title} ({new Date(guess.date).getFullYear()})
            </li>
          ))}
        </ul>
      </div>
      <div className="result">
        {movie && showResult && gameStatus === "won" && (
          <p className="result-correct">
            Correct! The movie is{" "}
            <strong>
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </strong>
          </p>
        )}
        {movie && showResult && gameStatus === "lost" && (
          <p className="result-wrong">
            Out of guesses! The correct answer was{" "}
            <strong>
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </strong>
          </p>
        )}
      </div>
      {(gameStatus === "won" || gameStatus === "lost") && (
        <div className="next-game">
          <p>Next movie in</p>
          <div className="countdown">{timeUntilNextGame}</div>
        </div>
      )}
    </div>
  );
};

export default Game;
