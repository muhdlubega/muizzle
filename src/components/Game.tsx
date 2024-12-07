import Cookies from "js-cookie";
import React, { useCallback } from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import spinner from "../assets/spinner.svg";
import { imageService } from "../data/imageService";
import { movieService } from "../data/movieService";
import {
  GameStatus,
  Guess,
  Language,
  Movie,
  Screenshot,
  StateProps,
} from "../types/types";
import { getCurrentGameIndex, getNextGameTime } from "../utils/timeUtils";
import Archive from "./Archive";
import { Loader } from "./Loader";
import OnboardingModal from "./OnboardingModal";
import Results from "./Results";
import SearchBar from "./SearchBar";
import StatsModal from "./StatsModal";
import Screenshots from "./Screenshot";
import "../styles/Game.css";
import Sidebar from "./Sidebar";

const Game = () => {
  const [movie, setMovie] = React.useState<Movie | null>(null);
  const [screenshots, setScreenshots] = React.useState<Screenshot[]>([]);
  const [isRootLoading, setIsRootLoading] = React.useState(true);
  const [isFadingOut, setIsFadingOut] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [correctMovieId, setCorrectMovieId] = React.useState<string>("");
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = React.useState(0);
  const [highestIndexReached, setHighestIndexReached] = React.useState(0);
  const [revealedScreenshots, setRevealedScreenshots] = React.useState<
    Screenshot[]
  >([]);
  const [guesses, setGuesses] = React.useState<Guess[]>([]);
  const [hasUpdatedStats, setHasUpdatedStats] = React.useState<
    boolean | undefined
  >(false);
  const [guessesLeft, setGuessesLeft] = React.useState(6);
  const [gameStatus, setGameStatus] = React.useState<GameStatus>("playing");
  const [showResult, setShowResult] = React.useState(false);
  const [timeUntilNextGame, setTimeUntilNextGame] = React.useState("");
  const [showStatsModal, setShowStatsModal] = React.useState(false);
  const [gameEnded, setGameEnded] = React.useState(false);
  const [showArchive, setShowArchive] = React.useState(false);
  const [isArchiveGame, setIsArchiveGame] = React.useState(false);
  const [savedGameState, setSavedGameState] = React.useState<StateProps | null>(
    null
  );
  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);
  const [language, setLanguage] = React.useState<Language>("tamil");

  const handleLanguageChange = useCallback(
    async (selectedLanguage: Language) => {
      // Reset game state when changing language
      setLanguage(selectedLanguage);
      setIsRootLoading(true);
      setIsFadingOut(false);
      setMovie(null);
      setScreenshots([]);
      setGuesses([]);
      setGuessesLeft(6);
      setGameStatus("playing");
      setShowResult(false);
      setCurrentScreenshotIndex(0);
      setHighestIndexReached(0);
      setRevealedScreenshots([]);
      setHasUpdatedStats(false);
      setIsArchiveGame(false);

      const currentGameIndex = getCurrentGameIndex().toString();

      try {
        const savedState = Cookies.get(`gameState_${selectedLanguage}`);
        const savedGameIndex = Cookies.get(`gameIndex_${selectedLanguage}`);

        if (savedState && savedGameIndex === currentGameIndex) {
          const parsedState = JSON.parse(savedState);
          const loadedScreenshots = await imageService.getScreenshots(
            currentGameIndex,
            selectedLanguage
          );

          if (loadedScreenshots.length > 0) {
            setScreenshots(loadedScreenshots);
            setCorrectMovieId(loadedScreenshots[0].movieId);
            setCurrentScreenshotIndex(parsedState.currentScreenshotIndex);
            setHighestIndexReached(parsedState.highestIndexReached);

            const newRevealedScreenshots = parsedState.revealedScreenshots
              .map((revealed: Screenshot) =>
                loadedScreenshots.find(
                  (s) =>
                    s.movieId === revealed.movieId && s.index === revealed.index
                )
              )
              .filter(Boolean);

            setRevealedScreenshots(newRevealedScreenshots);
            setGuesses(parsedState.guesses);
            setGuessesLeft(parsedState.guessesLeft);
            setGameStatus(parsedState.gameStatus);
            setShowResult(parsedState.showResult);
            setGameEnded(parsedState.gameEnded || false);
          }
        } else {
          const loadedScreenshots = await imageService.getScreenshots(
            currentGameIndex,
            selectedLanguage
          );
          console.log(loadedScreenshots)

          if (loadedScreenshots.length > 0) {
            setScreenshots(loadedScreenshots);
            setCorrectMovieId(loadedScreenshots[0].movieId);
          }
        }
      } catch (error) {
        console.error(`Error loading screenshots for ${selectedLanguage}:`, error);
        toast.error(`Failed to load screenshots for ${selectedLanguage}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setTimeout(() => setIsFadingOut(true), 500);
        setTimeout(() => setIsRootLoading(false), 1500);
      }
    },
    []
  );

  React.useEffect(() => {
    const hasSeenOnboarding = Cookies.get("hasSeenOnboarding");

    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    const consent = Cookies.get("cookieConsent");

    setIsOnboardingOpen(false);
    if (consent) Cookies.set("hasSeenOnboarding", "true", { expires: 365 });
  };

  const preloadImage = React.useCallback(
    (screenshot: Screenshot): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = screenshot.url;
      });
    },
    []
  );

  const preloadImages = React.useCallback(
    async (imageUrls: Screenshot[], indices: number[]) => {
      if (imageUrls.length === 0) return;

      setIsLoading(true);
      try {
        await Promise.all(
          indices
            .filter((index) => index < imageUrls.length)
            .map((index) => preloadImage(imageUrls[index]))
        );
      } catch (error) {
        console.error("Error preloading images:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [preloadImage]
  );

  // Logic to preload images only when necessary to not reveal it in the background
  React.useEffect(() => {
    const controller = new AbortController();

    const loadImages = async () => {
      if (screenshots.length === 0) return;

      const indicesToLoad = new Set<number>();
      indicesToLoad.add(currentScreenshotIndex);

      if (gameStatus === "won") {
        // Load all screenshots after game ended
        Array.from({ length: 6 }, (_, i) => indicesToLoad.add(i));
      } else {
        // Load up to highest index reached
        for (let i = 0; i <= highestIndexReached; i++) {
          indicesToLoad.add(i);
        }
        revealedScreenshots.forEach((screenshot) => {
          const index = screenshots.findIndex(
            (s) =>
              s.movieId === screenshot.movieId && s.index === screenshot.index
          );
          if (index !== -1) {
            indicesToLoad.add(index);
          }
        });
      }

      await preloadImages(screenshots, Array.from(indicesToLoad));
    };

    loadImages();

    return () => {
      controller.abort();
    };
  }, [
    screenshots,
    currentScreenshotIndex,
    highestIndexReached,
    revealedScreenshots,
    gameStatus,
    preloadImages,
  ]);

  const saveGameState = useCallback(
    (state: StateProps) => {
      if (!isArchiveGame) {
        const consent = Cookies.get("cookieConsent");
        const stateToSave = {
          movie: state.movie,
          currentScreenshotIndex: state.currentScreenshotIndex,
          highestIndexReached: state.highestIndexReached,
          revealedScreenshots: state.revealedScreenshots.map(
            (s: Screenshot) => ({
              movieId: s.movieId,
              index: s.index,
            })
          ),
          guesses: state.guesses,
          guessesLeft: state.guessesLeft,
          gameStatus: state.gameStatus,
          showResult: state.showResult,
          gameEnded: state.gameEnded,
          isArchiveGame: false,
        };

        if (consent) {
          Cookies.set(`gameState_${language}`, JSON.stringify(stateToSave), {
            expires: getNextGameTime(),
          });
          Cookies.set(`gameIndex_${language}`, getCurrentGameIndex().toString());
        }
      }
    },
    [isArchiveGame, language]
  );

  const loadGameScreenshot = React.useCallback(async () => {
    const gameIndex = getCurrentGameIndex();
    const gameFolder = `${gameIndex}`;

    try {
      const screenshots = await imageService.getScreenshots(gameFolder, language);

      if (screenshots.length > 0) {
        setScreenshots(screenshots);
        preloadImages(screenshots, [0]);
        setCorrectMovieId(screenshots[0].movieId);
        setIsArchiveGame(false);
        Cookies.set("gameIndex", gameIndex.toString());
      }
      setGameEnded(false);
    } catch (error) {
      console.error("Error loading screenshots:", error);
      toast.error("Failed to load screenshots", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setTimeout(() => setIsFadingOut(true), 500);
      setTimeout(() => setIsRootLoading(false), 1500);
    }
  }, [preloadImages]);

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
        const archivedScreenshots = await imageService.getScreenshots(
          folderNumber, language
        );

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
        console.error("Error loading archived game:", error);
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
    [
      isArchiveGame,
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
      preloadImages,
    ]
  );

  const returnToCurrentGame = async () => {
    if (savedGameState) {
      const currentGame = getCurrentGameIndex().toString();
      const currentScreenshots = await imageService.getScreenshots(currentGame, language);

      setMovie(savedGameState.movie);
      setScreenshots(currentScreenshots);
      setCurrentScreenshotIndex(savedGameState.currentScreenshotIndex);
      setHighestIndexReached(savedGameState.highestIndexReached);

      const newRevealedScreenshots = savedGameState.revealedScreenshots
        .map((revealed) =>
          currentScreenshots.find(
            (s) => s.movieId === revealed.movieId && s.index === revealed.index
          )
        )
        .filter(
          (screenshot): screenshot is Screenshot => screenshot !== undefined
        );

      setRevealedScreenshots(newRevealedScreenshots);
      setGuesses(savedGameState.guesses);
      setGuessesLeft(savedGameState.guessesLeft);
      setGameStatus(savedGameState.gameStatus);
      setShowResult(savedGameState.showResult);
      setCorrectMovieId(currentScreenshots[0]?.movieId || "");
      setGameEnded(savedGameState.gameEnded);
      setHasUpdatedStats(savedGameState.hasUpdatedStats);
    } else {
      await loadGameScreenshot();
    }
    setIsArchiveGame(false);
    setShowStatsModal(false);
    setShowResult(false);
    setSavedGameState(null);
  };

  React.useEffect(() => {
    const loadGame = async () => {
      const currentGame = getCurrentGameIndex().toString();
      const savedState = Cookies.get(`gameState_${language}`);
      const savedGameIndex = Cookies.get(`gameIndex_${language}`);

      try {
        if (savedState && savedGameIndex === currentGame) {
          const parsedState = JSON.parse(savedState);

          if (!parsedState.isArchiveGame) {
            try {
              const currentScreenshots = await imageService.getScreenshots(
                savedGameIndex,
                language
              );

              setMovie(parsedState.movie);
              setScreenshots(currentScreenshots);
              setCurrentScreenshotIndex(parsedState.currentScreenshotIndex);
              setHighestIndexReached(parsedState.highestIndexReached);

              const newRevealedScreenshots = parsedState.revealedScreenshots
                .map((revealed: Screenshot) =>
                  currentScreenshots.find(
                    (s) =>
                      s.movieId === revealed.movieId &&
                      s.index === revealed.index
                  )
                )
                .filter(Boolean);

              setRevealedScreenshots(newRevealedScreenshots);
              setGuesses(parsedState.guesses);
              setGuessesLeft(parsedState.guessesLeft);
              setGameStatus(parsedState.gameStatus);
              setShowResult(parsedState.showResult);
              setGameEnded(parsedState.gameEnded || false);
              setIsArchiveGame(false);

              if (currentScreenshots.length > 0) {
                setCorrectMovieId(currentScreenshots[0].movieId);
              }
            } catch (error) {
              console.error("Error loading screenshots:", error);
              await loadGameScreenshot();
            } finally {
              setTimeout(() => setIsFadingOut(true), 500);
              setTimeout(() => setIsRootLoading(false), 1500);
            }
          } else {
            await loadGameScreenshot();
          }
        } else {
          await loadGameScreenshot();
        }
      } catch (error) {
        console.error("Error loading game state:", error);
        await loadGameScreenshot();
      }
    };

    loadGame();
  }, [loadGameScreenshot, language]);

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

      const newGameIndex = getCurrentGameIndex();
      if (newGameIndex !== parseInt(Cookies.get("gameIndex") || "0")) {
        Cookies.remove("gameState");
        Cookies.remove("gameIndex");
        loadGameScreenshot();

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
  }, [loadGameScreenshot]);

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
    saveGameState,
  ]);

  const handleGuess = async (input: string, date: number, movieId: number) => {
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
      await movieService.getMovie(correctMovieId, setMovie);
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
          movieService.getMovie(correctMovieId, setMovie);
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
            if (
              !updatedRevealed.some(
                (screenshot) => screenshot.url === screenshots[newIndex]?.url
              )
            ) {
              updatedRevealed.push(screenshots[newIndex]);
            }
            return updatedRevealed;
          });
        }
        return newGuessesLeft;
      });
    }
  };

  if (isRootLoading) {
    return (
      <div className={`main-loader ${isFadingOut ? "fade-out" : ""}`}>
        <p className={`main-title ${isFadingOut ? "fade-down" : ""}`}>
          <img width={120} src={spinner} alt="Loading spinner" />
          Muizzle
        </p>
      </div>
    );
  }

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
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />
      <StatsModal
        language={language}
        gameStatus={gameStatus}
        gameEnded={gameEnded}
        guesses={guesses}
        guessesLeft={guessesLeft}
        hasUpdatedStats={hasUpdatedStats}
        isArchiveGame={isArchiveGame}
        screenshots={screenshots}
        setGameEnded={setGameEnded}
        setHasUpdatedStats={setHasUpdatedStats}
        setShowArchive={setShowArchive}
        setShowResult={setShowResult}
        setShowStatsModal={setShowStatsModal}
        showStatsModal={showStatsModal}
        showResult={showResult}
      />
      <div className="container">
        {isArchiveGame && !isLoading && (
          <div className="archive-badge">Archived Game</div>
        )}
        {isLoading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : (
          <Screenshots
            currentScreenshotIndex={currentScreenshotIndex}
            gameStatus={gameStatus}
            highestIndexReached={highestIndexReached}
            screenshots={screenshots}
            setCurrentScreenshotIndex={setCurrentScreenshotIndex}
            timeUntilNextGame={timeUntilNextGame}
            revealedScreenshots={revealedScreenshots}
          />
        )}
        <SearchBar onGuess={handleGuess} disabled={gameStatus !== "playing"} />
      </div>
      <Results
        gameStatus={gameStatus}
        guesses={guesses}
        isArchiveGame={isArchiveGame}
        movie={movie}
        screenshots={screenshots}
        showResult={showResult}
      />
      <Sidebar
        onLanguageChange={handleLanguageChange}
        currentLanguage={language}
      />
    </div>
  );
};

export default Game;
