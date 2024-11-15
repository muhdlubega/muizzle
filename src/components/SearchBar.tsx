import React from "react";
import axios from "axios";
import { useOnClickOutside } from "usehooks-ts";

interface Results {
  title: string;
  release_date: Date;
  id: number;
}

const SearchBar = ({
  onGuess,
  disabled,
}: {
  onGuess: (
    input: string,
    date: Date,
    movieId: number,
    guessCount: number
  ) => void;
  disabled: boolean;
}) => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Results[]>([]);
  const searchRef = React.useRef(null);
  const [guessCount, setGuessCount] = React.useState(0);

  useOnClickOutside(searchRef, () => {
    setResults([]);
  });

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const API_KEY: string = import.meta.env.VITE_APP_TMDB_API_KEY;
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&include_adult=false&query=${e.target.value}`
        );
        setResults(response.data.results.slice(0, 5));
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelectMovie = (title: string, date: Date, movieId: number) => {
    setGuessCount((prevCount) => prevCount + 1);
    onGuess(title, date, movieId, guessCount + 1);
    setQuery("");
    setResults([]);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelectMovie(
        results[0].title,
        results[0].release_date,
        results[0].id
      );
    }
  };

  return (
    <div className="searchbar" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="searchbar-input"
          disabled={disabled}
          placeholder="Guess the movie title..."
          value={query}
          onChange={handleSearch}
        />
        <button
          type="submit"
          className="submit-button"
          disabled={disabled || results.length === 0}
        >
          Submit
        </button>
      </form>
      {results.length > 0 && (
        <ul className="results-list">
          {results.map((movie) => (
            <li
              key={movie.id}
              onClick={() =>
                handleSelectMovie(movie.title, movie.release_date, movie.id)
              }
            >
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
