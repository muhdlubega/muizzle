export type GameStatus = "playing" | "won" | "lost";

export type Language = "tamil" | "hindi" | "english";

export interface ArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArchive: (folderNumber: string) => void;
}

export interface GameProps {
  isRootLoading: boolean;
  setIsRootLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isFadingOut: boolean;
  setIsFadingOut: React.Dispatch<React.SetStateAction<boolean>>;
  movie: Movie | null;
  setMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  screenshots: Screenshot[];
  setScreenshots: React.Dispatch<React.SetStateAction<Screenshot[]>>;
  guesses: Guess[];
  setGuesses: React.Dispatch<React.SetStateAction<Guess[]>>;
  hasUpdatedStats: boolean | undefined;
  setHasUpdatedStats: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  guessesLeft: number;
  setGuessesLeft: React.Dispatch<React.SetStateAction<number>>;
  gameStatus: GameStatus;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  showResult: boolean;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
  currentScreenshotIndex: number;
  setCurrentScreenshotIndex: React.Dispatch<React.SetStateAction<number>>;
  highestIndexReached: number;
  setHighestIndexReached: React.Dispatch<React.SetStateAction<number>>;
  revealedScreenshots: Screenshot[];
  setRevealedScreenshots: React.Dispatch<React.SetStateAction<Screenshot[]>>;
  gameEnded: boolean;
  setGameEnded: React.Dispatch<React.SetStateAction<boolean>>;
  isArchiveGame: boolean;
  setIsArchiveGame: React.Dispatch<React.SetStateAction<boolean>>;
  correctMovieId: string;
  setCorrectMovieId: React.Dispatch<React.SetStateAction<string>>;
}

export interface Guess {
  title: string;
  date: number;
  isCorrect: boolean | null;
  movieId: number;
}

export interface Movie {
  title: string;
  release_date: string;
}

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Results {
  title: string;
  release_date: number;
  id: number;
}

export interface ResultsProps {
  gameStatus: GameStatus;
  guesses: Guess[];
  isArchiveGame: boolean;
  movie: Movie | null;
  screenshots: Screenshot[];
  showResult: boolean;
}

export interface Screenshot {
  folder: string;
  movieId: string;
  index: number;
  url: string;
  language?: Language;
}

export interface ScreenshotsProps {
  currentScreenshotIndex: number;
  gameStatus: GameStatus;
  highestIndexReached: number;
  screenshots: Screenshot[];
  setCurrentScreenshotIndex: React.Dispatch<React.SetStateAction<number>>;
  timeUntilNextGame: string;
  revealedScreenshots: Screenshot[];
}

export interface ShareStatsProps {
  gameStatus: string;
  guessesLeft: number;
  currentStreak: number;
  maxStreak: number;
  winRate: number;
}

export interface SidebarProps {
  onLanguageChange: (language: Language) => void;
  currentLanguage: Language;
}

export interface StateProps {
  movie: Movie | null;
  currentScreenshotIndex: number;
  highestIndexReached: number;
  revealedScreenshots: Screenshot[];
  guesses: Guess[];
  guessesLeft: number;
  gameStatus: GameStatus;
  showResult: boolean;
  gameEnded: boolean;
  correctMovieId?: string;
  hasUpdatedStats?: boolean;
  language?: Language;
}

export interface StatsModalProps {
  gameEnded: boolean;
  gameStatus: GameStatus;
  guesses: Guess[];
  guessesLeft: number;
  hasUpdatedStats?: boolean;
  isArchiveGame: boolean;
  language: Language;
  screenshots: Screenshot[];
  showResult: boolean;
  showStatsModal: boolean;
  setGameEnded: React.Dispatch<React.SetStateAction<boolean>>;
  setHasUpdatedStats: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setShowArchive: React.Dispatch<React.SetStateAction<boolean>>;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStatsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TourContentProps {
  children: JSX.Element;
  isLastStep?: boolean;
}
