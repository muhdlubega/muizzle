import React from "react";
import { useOnClickOutside } from "usehooks-ts";
import { movieService } from "../data/movieService";
import "../styles/SearchBar.css";
import { Results } from "../types/types";
import { debounce } from "../utils/debounce";

const SearchBar = ({
  onGuess,
  disabled,
}: {
  onGuess: (input: string, date: number, movieId: number) => void;
  disabled: boolean;
}) => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Results[]>([]);
  const [errorCount, setErrorCount] = React.useState(0);
  const searchRef = React.useRef(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useOnClickOutside(searchRef, () => {
    setResults([]);
  });

  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        await movieService.getSearch(
          searchQuery,
          errorCount,
          setErrorCount,
          setResults
        );
      }, 0),
    [errorCount, setErrorCount, setResults]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSelectMovie = (title: string, date: number, movieId: number) => {
    onGuess(title, date, movieId);
    setQuery("");
    setResults([]);
    setErrorCount(0);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelectMovie(
        results[0].title,
        results[0].release_date,
        results[0].id
      );
    } else {
      setResults([]);
    }
    inputRef.current?.focus();
  };

  return (
    <div className="searchbar onboarding03" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          ref={inputRef}
          className="searchbar-input"
          disabled={disabled}
          placeholder="Guess the movie title..."
          value={query}
          onChange={handleInputChange}
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
              {movie.title} ({movie.release_date})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
