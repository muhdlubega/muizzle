export type GameStatus = "playing" | "won" | "lost";

export interface ArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArchive: (folderNumber: string) => void;
}

export interface Guess {
  title: string;
  date: Date;
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
  release_date: Date;
  id: number;
}

export interface Screenshot {
  folder: string;
  movieId: string;
  index: number;
  url: string;
}

export interface ShareStatsProps {
  gameStatus: string;
  guessesLeft: number;
  currentStreak: number;
  maxStreak: number;
  winRate: number;
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
}

export interface TourContentProps {
  children: JSX.Element;
  isLastStep?: boolean;
}
