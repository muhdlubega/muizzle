import React from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { getNextGameTime, getCurrentMinuteIndex } from "../utils/timeUtils";
import Cookies from "js-cookie";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosStats } from "react-icons/io";
import { Bar } from "react-chartjs-2";
import { useTour } from "@reactour/tour";
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
import { FaRegCopy, FaSquare } from "react-icons/fa";
import { RiArrowGoBackFill, RiSlideshow3Line } from "react-icons/ri";
import { imageService, Screenshot } from '../data/imageService'

const SITE_URL = window.location.origin;

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
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
  const [screenshots, setScreenshots] = React.useState<Screenshot[]>([])
  const [isLoading, setIsLoading] = React.useState(true);
  const [correctMovieId, setCorrectMovieId] = React.useState<string>("");
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = React.useState(0);
  const [highestIndexReached, setHighestIndexReached] = React.useState(0);
  const [revealedScreenshots, setRevealedScreenshots] = React.useState<
    Screenshot[]
  >([]);
  const [guesses, setGuesses] = React.useState<Guess[]>([]);
  const [hasUpdatedStats, setHasUpdatedStats] = React.useState(false);
  const [guessesLeft, setGuessesLeft] = React.useState(6);
  const [gameStatus, setGameStatus] = React.useState<
    "playing" | "won" | "lost"
  >("playing");
  const [showResult, setShowResult] = React.useState(false);
  const [timeUntilNextGame, setTimeUntilNextGame] = React.useState("");
  const [showStatsModal, setShowStatsModal] = React.useState(false);
  const [gameEnded, setGameEnded] = React.useState(false);
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
  const [savedGameState, setSavedGameState] = React.useState<{
    movie: Movie | null;
    screenshots: Screenshot[];
    currentScreenshotIndex: number;
    highestIndexReached: number;
    revealedScreenshots: Screenshot[];
    guesses: Guess[];
    guessesLeft: number;
    gameStatus: "playing" | "won" | "lost";
    showResult: boolean;
    gameEnded: boolean;
    correctMovieId: string;
    hasUpdatedStats: boolean;
  } | null>(null);

  const { setIsOpen, setCurrentStep } = useTour();

  const handleTourStart = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

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
          toastId: "fetchError",
        };

        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.status) {
            case 404:
              toast.error(
                "Movie not found. Please try again later",
                toastConfig
              );
              break;
            case 401:
              toast.error(
                "API authentication failed. Please try again later",
                toastConfig
              );
              break;
            default:
              toast.error(
                `Error: ${error.response.data.status_message ||
                "Failed to fetch movie data"
                }. Please try again later`,
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

  const preloadImage = React.useCallback((screenshot: Screenshot): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve()
      img.src = screenshot.url
    })
  }, [])

  const preloadImages = React.useCallback(
    async (imageUrls: Screenshot[], indices: number[]) => {
      setIsLoading(true);
      try {
        await Promise.all(
          indices.map((index) =>
            imageUrls[index]
              ? preloadImage(imageUrls[index])
              : Promise.resolve()
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [preloadImage]
  );

  // Logic to preload images only when necessary to not reveal it in the background
  React.useEffect(() => {
    if (screenshots.length > 0) {
      const indicesToLoad = new Set<number>();
      indicesToLoad.add(currentScreenshotIndex);

      if (gameStatus === "won") {
        // Load all screenshots after game ended
        Array.from({ length: 6 }, (_, i) => indicesToLoad.add(i));
      } else {
        // Else only load only up to highest index reached
        for (let i = 0; i <= highestIndexReached; i++) {
          indicesToLoad.add(i);
        }
        revealedScreenshots.forEach((screenshot) => {
          const index = screenshots.indexOf(screenshot);
          if (index !== -1) {
            indicesToLoad.add(index);
          }
        });
      }

      preloadImages(screenshots, Array.from(indicesToLoad));
    }
  }, [
    screenshots,
    currentScreenshotIndex,
    highestIndexReached,
    revealedScreenshots,
    gameStatus,
    preloadImages,
  ]);

  const saveGameState = (state: any) => {
    if (!isArchiveGame) {
      Cookies.set("gameState", JSON.stringify(state), {
        expires: getNextGameTime(),
      });
    }
  };

  const loadMinuteScreenshot = React.useCallback(async () => {
    const minuteIndex = getCurrentMinuteIndex()
    const minuteFolder = `${minuteIndex}`

    const screenshots = await imageService.getScreenshots(minuteFolder)

    if (screenshots.length > 0) {
      setScreenshots(screenshots)
      preloadImages(screenshots, [0])
      setCorrectMovieId(screenshots[0].movieId)
      setIsArchiveGame(false)
      Cookies.set("gameMinute", minuteIndex.toString())
    }
    setGameEnded(false)
  }, [preloadImages])

  const loadArchivedGame = React.useCallback(
    async (folderNumber: string) => {
      // Save current game state before loading archive
      if (!isArchiveGame) {
        const currentGameState = {
          movie,
          screenshots,
          currentScreenshotIndex,
          highestIndexReached,
          revealedScreenshots,
          guesses,
          guessesLeft,
          gameStatus,
          showResult,
          correctMovieId,
          gameEnded,
          hasUpdatedStats,
        };
        setSavedGameState(currentGameState);
      }

      try {
        const archivedScreenshots = await imageService.getScreenshots(folderNumber);

        if (archivedScreenshots.length > 0) {
          // Reset game state for archive game
          setScreenshots(archivedScreenshots);
          preloadImages(archivedScreenshots, [0]);
          setCorrectMovieId(archivedScreenshots[0].movieId);
          setIsArchiveGame(true);
          setGameEnded(false);
          setHasUpdatedStats(false);
          setGuesses([]);
          setGuessesLeft(6);
          setGameStatus("playing");
          setShowResult(false);
          setCurrentScreenshotIndex(0);
          setHighestIndexReached(0);
          setRevealedScreenshots([]);
          setMovie(null);
        }
      } catch (error) {
        console.error('Error loading archived game:', error);
        toast.error("Failed to load archived game", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    },
    [movie, screenshots, currentScreenshotIndex, highestIndexReached,
      revealedScreenshots, guesses, guessesLeft, gameStatus, showResult,
      correctMovieId, gameEnded, hasUpdatedStats, preloadImages]
  );

  const returnToCurrentGame = () => {
    if (savedGameState) {
      setMovie(savedGameState.movie);
      setScreenshots(savedGameState.screenshots);
      setCurrentScreenshotIndex(savedGameState.currentScreenshotIndex);
      setHighestIndexReached(savedGameState.highestIndexReached);
      setRevealedScreenshots(savedGameState.revealedScreenshots);
      setGuesses(savedGameState.guesses);
      setGuessesLeft(savedGameState.guessesLeft);
      setGameStatus(savedGameState.gameStatus);
      setShowResult(savedGameState.showResult);
      setCorrectMovieId(savedGameState.correctMovieId);
      setGameEnded(savedGameState.gameEnded);
      setHasUpdatedStats(savedGameState.hasUpdatedStats);
    } else {
      loadMinuteScreenshot();
    }
    setIsArchiveGame(false);
    setShowStatsModal(false);
    setShowResult(false);
    setSavedGameState(null);
  };

  React.useEffect(() => {
    const savedState = Cookies.get("gameState");
    const savedMinute = Cookies.get("gameMinute");
    const currentMinute = getCurrentMinuteIndex().toString();

    if (savedState && savedMinute === currentMinute) {
      const parsedState = JSON.parse(savedState);

      if (!parsedState.isArchiveGame) {
        setMovie(parsedState.movie);
        setScreenshots(parsedState.screenshots);
        setCurrentScreenshotIndex(parsedState.currentScreenshotIndex);
        setHighestIndexReached(parsedState.highestIndexReached);
        setRevealedScreenshots(parsedState.revealedScreenshots);
        setGuesses(parsedState.guesses);
        setGuessesLeft(parsedState.guessesLeft);
        setGameStatus(parsedState.gameStatus);
        setShowResult(parsedState.showResult);
        setGameEnded(parsedState.gameEnded || false);
        setIsArchiveGame(false);

        if (parsedState.screenshots.length > 0) {
          const firstScreenshot = parsedState.screenshots[0];
          const extractedMovieID = firstScreenshot.split("/")[1].split("-")[0];
          setCorrectMovieId(extractedMovieID);
        }
      } else {
        loadMinuteScreenshot();
      }
    } else {
      loadMinuteScreenshot();
    }
  }, [loadMinuteScreenshot]);

  React.useEffect(() => {
    const checkGameTime = () => {
      const now = new Date();
      const nextGame = getNextGameTime();
      const diff = nextGame.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilNextGame(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
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
    if (movie && !isArchiveGame) {
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
        gameEnded,
        isArchiveGame: false,
      };
      saveGameState(gameState);
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
    gameEnded,
    isArchiveGame,
  ]);

  const handleGuess = async (
    input: string,
    date: Date,
    movieId: number,
  ) => {
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

    const newGuess = {
      title: input,
      date,
      isCorrect: movieId.toString() === correctMovieId,
      movieId,
    };

    setGuesses((prev) => [...prev, newGuess]);

    if (newGuess.isCorrect) {
      // Only fetch movie details when the correct guess is made
      await fetchMovie(correctMovieId);
      setGameStatus("won");
      setGameEnded(true);

      if (!isArchiveGame && savedGameState) {
        setSavedGameState({
          ...savedGameState,
          movie: savedGameState.movie,
          guesses: savedGameState.guesses,
          gameStatus: savedGameState.gameStatus,
          guessesLeft: savedGameState.guessesLeft,
          showResult: savedGameState.showResult,
        });
      }
    } else {
      setGuessesLeft((prev) => {
        const newGuessesLeft = prev - 1;
        if (newGuessesLeft <= 0) {
          // Fetch movie details when player runs out of guesses
          fetchMovie(correctMovieId);
          setGameStatus("lost");
          setGameEnded(true);

          if (!isArchiveGame && savedGameState) {
            setSavedGameState({
              ...savedGameState,
              movie: savedGameState.movie,
              guesses: savedGameState.guesses,
              gameStatus: savedGameState.gameStatus,
              guessesLeft: savedGameState.guessesLeft,
              showResult: savedGameState.showResult,
            });
          }
        } else if (currentScreenshotIndex < screenshots.length - 1) {
          setCurrentScreenshotIndex(highestIndexReached);
          const newIndex = highestIndexReached + 1;
          setCurrentScreenshotIndex(newIndex);
          setHighestIndexReached(newIndex);
          setRevealedScreenshots((prev) => {
            const updatedRevealed = [...prev];
            if (!updatedRevealed.some(screenshot => screenshot.url === screenshots[newIndex]?.url)) {
              updatedRevealed.push(screenshots[newIndex]);
            }
            return updatedRevealed;
          });
        }
        return newGuessesLeft;
      });
    }
  };

  React.useEffect(() => {
    if (gameStatus === "playing") {
      setHasUpdatedStats(false);
    }
  }, [gameStatus]);

  React.useEffect(() => {
    if (
      gameEnded &&
      !hasUpdatedStats &&
      !isArchiveGame
    ) {
      const previousGamesPlayed = parseInt(
        Cookies.get("gamesPlayed") || "0",
        10
      );
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
      setGameEnded(false);
    }
  }, [
    gameEnded,
    gameStatus,
    guesses,
    guessDistribution,
    stats,
    hasUpdatedStats,
    isArchiveGame,
  ]);

  const guessChartData = {
    labels: [
      "1 Guess",
      "2 Guesses",
      "3 Guesses",
      "4 Guesses",
      "5 Guesses",
      "6 Guesses",
    ],
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
    <div className="game">
      <ToastContainer />
      <Archive
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        onSelectArchive={loadArchivedGame}
      />
      {isArchiveGame && (
        <RiArrowGoBackFill
          className="return-button"
          size={32}
          onClick={returnToCurrentGame}
        />
      )}
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
        />
        <button onClick={() => setShowStatsModal(false)}>Close</button>
      </Modal>
      {stats.gamesPlayed > 0 &&
        <>
          {(isArchiveGame || screenshots[0]?.folder !== '1') &&
            <button className="archive-button onboarding05" onClick={() => setShowArchive(true)}>
              Open Archives
            </button>
          }
          <IoIosStats
            size={36}
            color="#FF2247"
            className="stats-button onboarding04"
            onClick={() => setShowStatsModal(true)}
          />
        </>
      }
      <div className="container">
        {isArchiveGame && !isLoading && <div className="archive-badge">Archived Game</div>}
        {isLoading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : (
          <>
            <div className="screenshot">
              <img
                className="screenshot-image onboarding01"
                src={screenshots[currentScreenshotIndex]?.url}
                alt="Movie Screenshot"
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
                        src={screenshots[index]?.url}
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
              <RiSlideshow3Line
                className="tour-button"
                onClick={handleTourStart}
                size={32}
              />
            </div>
          </>
        )}
        <SearchBar onGuess={handleGuess} disabled={gameStatus !== "playing"} />
      </div>
      <div className="result">
        {movie && showResult && gameStatus === "won" && (
          <span className="result-correct">
            <p className="result-title">
              Correct! The movie is{" "}
              <strong>
                {movie?.title || ""} (
                {new Date(movie?.release_date || "").getFullYear()})
              </strong>
            </p>
            {!isArchiveGame && <span className="result-desc">
              <p className="result-text">
                You guessed correctly in {guesses.length}{" "}
                {guesses.length === 1 ? "try!" : "tries!"}
              </p>
              <div className="result-icons">
                <span className="result-boxes">
                  {Array.from({ length: 6 }).map((_, index) => {
                    let color = "gray";

                    if (index < guesses.length) {
                      if (gameStatus === "won" && index === guesses.length - 1) {
                        color = "green";
                      } else {
                        color = "#FF2247";
                      }
                    }

                    return (
                      <FaSquare
                        key={index}
                        color={color}
                        size={25}
                      />
                    );
                  })}
                </span>
                <FaRegCopy className="result-copy" onClick={copyToClipboard} size={20} />
              </div>
            </span>}
          </span>
        )}
        {movie && showResult && gameStatus === "lost" && (
          <span className="result-wrong">
            <p className="result-title">
              Out of guesses! The correct answer was{" "}
              <strong>
                {movie?.title || ''} ({new Date(movie?.release_date || '').getFullYear()})
              </strong>
            </p>
            {!isArchiveGame && <span className="result-desc">
              <p className="result-text">
                You didn't get it this time :(
              </p>
              <div className="result-icons">
                <span className="result-boxes">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <FaSquare
                      key={index}
                      color='red'
                      size={25}
                    />
                  ))}
                </span>
                <FaRegCopy className="result-copy" onClick={copyToClipboard} size={20} />
              </div>
            </span>}
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
              {guess.title} ({new Date(guess.date).getFullYear()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Game;
