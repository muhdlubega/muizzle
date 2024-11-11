import React from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import { files } from "../data/screenshots";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { getNextGameTime, getCurrentMinuteIndex } from "../utils/timeUtils";
import Cookies from "js-cookie";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosStats } from "react-icons/io";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Archive from "./Archive";
import { Loader } from "./Loader";
import ShareStats from "./ShareStats";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
Modal.setAppElement("#root");

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
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = React.useState(0);
  const [highestIndexReached, setHighestIndexReached] = React.useState(0);
  const [revealedScreenshots, setRevealedScreenshots] = React.useState<string[]>([]);
  const [guesses, setGuesses] = React.useState<Guess[]>([]);
  const [hasUpdatedStats, setHasUpdatedStats] = React.useState(false);
  const [guessesLeft, setGuessesLeft] = React.useState(6);
  const [gameStatus, setGameStatus] = React.useState("playing");
  const [showResult, setShowResult] = React.useState(false);
  const [timeUntilNextGame, setTimeUntilNextGame] = React.useState("");
  const [showStatsModal, setShowStatsModal] = React.useState(false);
  const [showArchive, setShowArchive] = React.useState(false);
  const [isArchiveGame, setIsArchiveGame] = React.useState(false);
  const [stats, setStats] = React.useState({
    gamesPlayed: 0,
    winRate: 0,
    currentStreak: 0,
    maxStreak: 0,
  });
  const [guessDistribution, setGuessDistribution] = React.useState<number[]>(
    Array(6).fill(0)
  );

  const API_KEY: string = import.meta.env.VITE_APP_TMDB_API_KEY;
  const fetchMovie = React.useCallback(
    async (id: string) => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        setMovie(response.data);
      } catch (error) {
        const toastConfig = {
          position: "bottom-right" as const,
          autoClose: 8000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark" as const,
          toastId: 'fetchError',
        };

        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.status) {
            case 404:
              toast.error("Movie not found. Please try again later", toastConfig);
              break;
            case 401:
              toast.error("API authentication failed. Please try again later", toastConfig);
              break;
            default:
              toast.error(
                `Error: ${error.response.data.status_message || 'Failed to fetch movie data'}. Please try again later`,
                toastConfig
              );
          }
        } else {
          toast.error(
            "Failed to connect to the movie database. Please try again later",
            toastConfig
          );
        }
      }
    },
    [API_KEY]
  );

  const preloadImages = React.useCallback((imageUrls: string[]) => {
    setIsLoading(true);
    let loadedImages = 0;
    const totalImages = imageUrls.length;

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = `/screenshots/${url}`;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          setIsLoading(false);
        }
      };
    });
  }, []);

  const loadMinuteScreenshot = React.useCallback(() => {
    const minuteIndex = getCurrentMinuteIndex();
    const minuteFolder = `${minuteIndex}`;
    const minuteScreenshots = files.filter((file) =>
      file.startsWith(`${minuteFolder}/`)
    );

    if (minuteScreenshots.length > 0) {
      const firstScreenshot = minuteScreenshots[0];
      const extractedMovieID = firstScreenshot.split("/")[1].split("-")[0];

      setScreenshots(minuteScreenshots);
      preloadImages(minuteScreenshots);
      fetchMovie(extractedMovieID);
      setIsArchiveGame(false);
      Cookies.set("gameMinute", minuteIndex.toString());
    }
  }, [fetchMovie, preloadImages]);

  const loadArchivedGame = React.useCallback((folderNumber: string) => {
    const archivedScreenshots = files.filter((file) =>
      file.startsWith(`${folderNumber}/`)
    );

    if (archivedScreenshots.length > 0) {
      const firstScreenshot = archivedScreenshots[0];
      const extractedMovieID = firstScreenshot.split("/")[1].split("-")[0];

      setScreenshots(archivedScreenshots);
      preloadImages(archivedScreenshots);
      fetchMovie(extractedMovieID);
      setIsArchiveGame(true);

      setGuesses([]);
      setGuessesLeft(6);
      setGameStatus("playing");
      setShowResult(false);
      setCurrentScreenshotIndex(0);
      setHighestIndexReached(0);
      setRevealedScreenshots([]);
    }
  }, [fetchMovie, preloadImages]);

  React.useEffect(() => {
    const savedState = Cookies.get("gameState");
    const savedMinute = Cookies.get("gameMinute");
    const currentMinute = getCurrentMinuteIndex().toString();

    if (savedState && savedMinute === currentMinute) {
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
      loadMinuteScreenshot();
    }
  }, [loadMinuteScreenshot]);

  React.useEffect(() => {
    const checkGameTime = () => {
      const now = new Date();
      const nextGame = getNextGameTime();
      const diff = nextGame.getTime() - now.getTime();

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilNextGame(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );

      const newMinuteIndex = getCurrentMinuteIndex();
      if (newMinuteIndex !== parseInt(Cookies.get("gameMinute") || "0")) {
        Cookies.remove("gameState");
        Cookies.remove("gameMinute");
        loadMinuteScreenshot();

        setGuesses([]);
        setGuessesLeft(6);
        setGameStatus("playing");
        setShowResult(false);
        setCurrentScreenshotIndex(0);
        setHighestIndexReached(0);
        setRevealedScreenshots([]);
        setHasUpdatedStats(false);
        setIsArchiveGame(false);
      }
    };

    checkGameTime();
    const timer = setInterval(checkGameTime, 1000);
    return () => clearInterval(timer);
  }, [loadMinuteScreenshot]);

  React.useEffect(() => {
    const savedStats = {
      gamesPlayed: parseInt(Cookies.get("gamesPlayed") || "0", 10),
      wins: parseInt(Cookies.get("wins") || "0", 10),
      currentStreak: parseInt(Cookies.get("currentStreak") || "0", 10),
      maxStreak: parseInt(Cookies.get("maxStreak") || "0", 10),
    };

    const savedDistribution = JSON.parse(
      Cookies.get("guessDistribution") || JSON.stringify(Array(6).fill(0))
    );

    setStats({
      ...savedStats,
      winRate: savedStats.gamesPlayed
        ? Math.round((savedStats.wins / savedStats.gamesPlayed) * 100)
        : 0,
    });
    setGuessDistribution(savedDistribution);
  }, []);

  React.useEffect(() => {
    if (gameStatus !== "playing" && !showResult) {
      setTimeout(() => {
        setShowResult(true);
        setShowStatsModal(true);
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
        expires: getNextGameTime()
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

  const handleGuess = (input: string, date: Date, movieId: number, guessCount: number) => {
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

    if (!isArchiveGame && gameStatus === "won") {
      const newDistribution = [...guessDistribution];
      newDistribution[guessCount - 1] += 1;
      setGuessDistribution(newDistribution);
      Cookies.set("guessDistribution", JSON.stringify(newDistribution));
    }
  };

  React.useEffect(() => {
    if (gameStatus === "playing") {
      setHasUpdatedStats(false);
    }
  }, [gameStatus]);

  React.useEffect(() => {
    if ((gameStatus === "won" || gameStatus === "lost") && !hasUpdatedStats && !isArchiveGame) {
      const previousGamesPlayed = parseInt(Cookies.get("gamesPlayed") || "0", 10);
      const previousWins = parseInt(Cookies.get("wins") || "0", 10);

      const gamesPlayed = previousGamesPlayed + 1;
      const wins = gameStatus === "won" ? previousWins + 1 : previousWins;
      const winRate = Math.round((wins / gamesPlayed) * 100);

      const currentStreak = gameStatus === "won" ? stats.currentStreak + 1 : 0;
      const maxStreak = Math.max(stats.maxStreak, currentStreak);

      const newDistribution = [...guessDistribution];
      if (gameStatus === "won") {
        const guessCount = guesses.length;
        newDistribution[guessCount - 1] += 1;
        setGuessDistribution(newDistribution);
        Cookies.set("guessDistribution", JSON.stringify(newDistribution));
      }

      Cookies.set("gamesPlayed", gamesPlayed.toString());
      Cookies.set("wins", wins.toString());
      Cookies.set("currentStreak", currentStreak.toString());
      Cookies.set("maxStreak", maxStreak.toString());

      setStats({
        gamesPlayed,
        winRate,
        currentStreak,
        maxStreak,
      });

      setHasUpdatedStats(true);
      setShowResult(true);
      setShowStatsModal(true);
    }
  }, [gameStatus, guesses, guessDistribution, stats, hasUpdatedStats, isArchiveGame]);

  const guessChartData = {
    labels: ["1 Guess", "2 Guesses", "3 Guesses", "4 Guesses", "5 Guesses", "6 Guesses"],
    datasets: [
      {
        label: "Games Solved",
        data: guessDistribution,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const guessChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        display: false,
      },
    },
  };

  const handleThumbnailClick = (index: React.SetStateAction<number>) => {
    setCurrentScreenshotIndex(index);
  };

  return (
    <div className="game">
      <ToastContainer />
      <Archive
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        onSelectArchive={loadArchivedGame}
      />
      <Modal
        isOpen={showStatsModal}
        onRequestClose={() => setShowStatsModal(false)}
        className="stats-modal-content"
        overlayClassName="stats-modal-overlay"
      >
        <h2>User Statistics</h2>
        <ul>
          <li>Games Played: {stats.gamesPlayed}</li>
          <li>Win Rate: {stats.winRate}%</li>
          <li>Current Streak: {stats.currentStreak}</li>
          <li>Max Streak: {stats.maxStreak}</li>
        </ul>
        <div className="guess-distribution-chart">
          <strong>Guess Distribution</strong>
          <Bar data={guessChartData} options={guessChartOptions} />
        </div>
        <ShareStats
    gameStatus={gameStatus}
    guessesLeft={guessesLeft}
    currentStreak={stats.currentStreak}
    maxStreak={stats.maxStreak}
    winRate={stats.winRate}
    currentMinuteIndex={getCurrentMinuteIndex()}
  />
        <button onClick={() => setShowStatsModal(false)}>Close</button>
      </Modal>
      <button
        className="archive-button"
        onClick={() => setShowArchive(true)}
      >Open Archives</button>
      <IoIosStats
        size={36}
        color="#FF2247"
        className="stats-button"
        onClick={() => setShowStatsModal(true)} />
      <div className="container">
        {isArchiveGame && (
          <div className="archive-badge">
            Archived Game
          </div>
        )}
        {isLoading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : (
          <>
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
                        className={`thumbnail-image ${index === currentScreenshotIndex ? "active" : ""
                          }`}
                        onClick={() => handleThumbnailClick(index)}
                      />
                    ) : (
                      <div className="empty-box"></div>
                    )}
                  </div>
                ))}
            </div></>
        )}
        <SearchBar onGuess={handleGuess} disabled={gameStatus !== "playing"} />
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
      <div className="next-game">
        <p>Next movie in</p>
        <div className="countdown">{timeUntilNextGame}</div>
      </div>
    </div>
  );
};

export default Game;
