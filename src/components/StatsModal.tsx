import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import Cookies from "js-cookie";
import { Bar } from "react-chartjs-2";
import { IoIosStats } from "react-icons/io";
import Modal from "react-modal";
import "../styles/StatsModal.css";
import { StatsModalProps } from "../types/types";
import ShareStats from "./ShareStats";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);
Modal.setAppElement("#root");

const StatsModal: React.FC<StatsModalProps> = ({
  gameStatus,
  gameEnded,
  guesses,
  guessesLeft,
  hasUpdatedStats,
  isArchiveGame,
  screenshots,
  setGameEnded,
  setHasUpdatedStats,
  setShowArchive,
  setShowResult,
  setShowStatsModal,
  showStatsModal,
  showResult,
}) => {
  const [guessDistribution, setGuessDistribution] = React.useState<number[]>(
    Array(6).fill(0)
  );
  const [stats, setStats] = React.useState({
    gamesPlayed: 0,
    winRate: 0,
    currentStreak: 0,
    maxStreak: 0,
  });

  React.useEffect(() => {
    if (gameStatus === "playing") {
      setHasUpdatedStats(false);
    }
  }, [gameStatus, setHasUpdatedStats]);

  React.useEffect(() => {
    if (gameStatus !== "playing" && !showResult) {
      setTimeout(() => {
        setShowResult(true);
        setShowStatsModal(true);
      }, 500);
    }
  }, [gameStatus, setShowResult, setShowStatsModal, showResult]);

  React.useEffect(() => {
    if (gameEnded && !hasUpdatedStats && !isArchiveGame) {
      const previousStats = JSON.parse(localStorage.getItem("stats") || "{}");
      const previousGamesPlayed = previousStats.gamesPlayed || 0;
      const previousWins = previousStats.wins || 0;

      const gamesPlayed = previousGamesPlayed + 1;
      const wins = gameStatus === "won" ? previousWins + 1 : previousWins;
      const winRate = Math.round((wins / gamesPlayed) * 100);

      const currentStreak =
        gameStatus === "won" ? (stats.currentStreak || 0) + 1 : 0;
      const maxStreak = Math.max(stats.maxStreak || 0, currentStreak);

      const newDistribution = [...guessDistribution];
      if (gameStatus === "won") {
        const guessCount = guesses.length;
        newDistribution[guessCount - 1] += 1;
        setGuessDistribution(newDistribution);
        localStorage.setItem(
          "guessDistribution",
          JSON.stringify(newDistribution)
        );
      }

      const updatedStats = {
        gamesPlayed,
        wins,
        currentStreak,
        maxStreak,
      };

      const consent = Cookies.get("cookieConsent");
      if (consent) localStorage.setItem("stats", JSON.stringify(updatedStats));

      setStats({
        ...updatedStats,
        winRate,
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
    setHasUpdatedStats,
    setShowResult,
    setShowStatsModal,
    setGameEnded,
  ]);

  React.useEffect(() => {
    const savedStats = JSON.parse(localStorage.getItem("stats") || "{}");
    const savedDistribution = JSON.parse(
      localStorage.getItem("guessDistribution") ||
        JSON.stringify(Array(6).fill(0))
    );

    setStats({
      ...savedStats,
      winRate: savedStats.gamesPlayed
        ? Math.round((savedStats.wins / savedStats.gamesPlayed) * 100)
        : 0,
    });
    setGuessDistribution(savedDistribution);
  }, []);

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

  return (
    <>
      <Modal
        isOpen={showStatsModal}
        onRequestClose={() => setShowStatsModal(false)}
        className="stats-modal-content"
        overlayClassName="stats-modal-overlay"
        shouldFocusAfterRender={false}
      >
        <h2>User Statistics</h2>
        {stats.gamesPlayed && stats.gamesPlayed > 0 ? (
          <>
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
          </>
        ) : (
          <>
          <IoIosStats size={320}
          color="#262626" />
            <h3>Play the daily game to see and share your stats here!</h3>
          </>
        )}
        <button
          className="stats-modal-close"
          onClick={() => setShowStatsModal(false)}
        >
          Close
        </button>
      </Modal>
      <>
        {(isArchiveGame || screenshots[0]?.folder !== "1") && (
          <button
            className="archive-button onboarding05"
            onClick={() => setShowArchive(true)}
          >
            Open Archives
          </button>
        )}
        <IoIosStats
          size={36}
          color="#FF2247"
          className="stats-button onboarding04"
          onClick={() => setShowStatsModal(true)}
        />
      </>
    </>
  );
};

export default StatsModal;
