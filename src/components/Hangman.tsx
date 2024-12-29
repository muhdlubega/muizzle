import React, { useState } from 'react';
import axios from 'axios';

const TRAKT_API_KEY = import.meta.env.VITE_APP_TRAKT_CLIENT_ID;
const TRAKT_BASE_URL = 'https://api.trakt.tv/movies';

interface MovieData {
    title: string;
    genres: string[];
    year: number;
  }
  
  interface GameState {
    displayedTitle: string;
    remainingTries: number;
    guessedLetters: string[];
    gameOver: boolean;
    message?: string;
    success?: boolean;
  }  

const fetchMovieData = async (slug: string): Promise<MovieData | null> => {
    try {
      const response = await axios.get<MovieData>(`${TRAKT_BASE_URL}/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
          'trakt-api-key': TRAKT_API_KEY,
          'trakt-api-version': '2',
        },
      });
      const data = response.data;
      return {
        title: data.title,
        genres: data.genres || [],
        year: data.year,
      };
    } catch (error) {
      console.error('Error fetching movie data:', error);
      return null;
    }
  };

const MovieHangman: React.FC = () => {
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [input, setInput] = useState<string>('');

  const initializeGame = async (movieId: string) => {
    const data = await fetchMovieData(movieId);
    if (data) {
      const initialState: GameState = {
        displayedTitle: data.title.replace(/\S/g, '_ '),
        remainingTries: 6,
        guessedLetters: [],
        gameOver: false,
      };
      setMovieData(data);
      setGameState(initialState);
    } else {
      console.error('Could not start game: Movie data unavailable.');
    }
  };

  const guessLetter = (letter: string) => {
    if (!gameState || gameState.gameOver) return;

    letter = letter.toUpperCase();

    if (gameState.guessedLetters.includes(letter)) {
      setGameState({ ...gameState, message: `You already guessed '${letter}'.` });
      return;
    }

    const updatedGuessedLetters = [...gameState.guessedLetters, letter];

    if (movieData?.title.toUpperCase().includes(letter)) {
      let updatedTitle = '';
      for (let i = 0; i < movieData.title.length; i++) {
        if (movieData.title[i].toUpperCase() === letter) {
          updatedTitle += letter + ' ';
        } else if (gameState.displayedTitle[i * 2] !== '_') {
          updatedTitle += gameState.displayedTitle[i * 2] + ' ';
        } else {
          updatedTitle += '_ ';
        }
      }

      const isComplete = !updatedTitle.includes('_');
      setGameState({
        ...gameState,
        displayedTitle: updatedTitle.trim(),
        guessedLetters: updatedGuessedLetters,
        gameOver: isComplete,
        message: isComplete ? 'You guessed the movie! 🎉' : `Good guess! The letter '${letter}' is in the title.`,
        success: isComplete,
      });
    } else {
      const remainingTries = gameState.remainingTries - 1;
      setGameState({
        ...gameState,
        guessedLetters: updatedGuessedLetters,
        remainingTries,
        gameOver: remainingTries <= 0,
        message: remainingTries <= 0
          ? `No more tries left! The movie was: ${movieData?.title}`
          : `Wrong guess! The letter '${letter}' is not in the title.`,
      });
    }
  };

  const guessFullTitle = (guess: string) => {
    if (!gameState || gameState.gameOver || !movieData) return;

    if (guess.toUpperCase() === movieData.title.toUpperCase()) {
      setGameState({
        ...gameState,
        displayedTitle: movieData.title,
        gameOver: true,
        message: 'You guessed the movie! 🎉',
        success: true,
      });
    } else {
      const remainingTries = gameState.remainingTries - 1;
      setGameState({
        ...gameState,
        remainingTries,
        gameOver: remainingTries <= 0,
        message: remainingTries <= 0
          ? `No more tries left! The movie was: ${movieData.title}`
          : 'Wrong guess! Try again.',
      });
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleLetterGuess = () => {
    if (input.length === 1) {
      guessLetter(input);
    } else {
      guessFullTitle(input);
    }
    setInput('');
  };

  return (
    <div>
      <h1>Movie Hangman</h1>
      {!movieData && <button onClick={() => initializeGame('the-matrix')}>Start Game</button>} 
      {movieData && gameState && (
        <div>
          <p><strong>Genre:</strong> {movieData.genres.join(', ')}</p>
          <p><strong>Year:</strong> {movieData.year}</p>
          <p><strong>Movie:</strong> {gameState.displayedTitle}</p>
          <p><strong>Remaining Tries:</strong> {gameState.remainingTries}</p>
          <p><strong>Message:</strong> {gameState.message}</p>
          <input
            type="text"
            value={input}
            onChange={handleInput}
            maxLength={50}
            placeholder="Guess a letter or the full title"
          />
          <button onClick={handleLetterGuess}>Guess</button>
        </div>
      )}
    </div>
  );
};

export default MovieHangman;
