import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import Cookies from "js-cookie";
import React from "react";
import { Bar } from "react-chartjs-2";
import { IoIosStats } from "react-icons/io";
import Modal from "react-modal";
import '../styles/StatsModal.css';
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
    setHasUpdatedStats,
    setShowResult,
    setShowStatsModal,
    setGameEnded,
  ]);

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
        <button
          className="stats-modal-close"
          onClick={() => setShowStatsModal(false)}
        >
          Close
        </button>
      </Modal>
      {stats.gamesPlayed > 0 && (
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
      )}
    </>
  );
};

export default StatsModal;
