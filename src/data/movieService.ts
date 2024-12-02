import axios from "axios";
import { Movie, Results } from "../types/types";
import { toast } from "react-toastify";

const API_KEY: string = import.meta.env.VITE_APP_TMDB_API_KEY;

export const movieService = {
  async getSearch(
    query: string,
    errorCount: number,
    setErrorCount: React.Dispatch<React.SetStateAction<number>>,
    setResults: React.Dispatch<React.SetStateAction<Results[]>>
  ) {
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&include_adult=false&query=${query}`
        );
        setResults(response.data.results.slice(0, 5));
      } catch (error) {
        console.error("Error fetching search results:", error);
        setErrorCount((prevCount) => prevCount + 1);

        if (errorCount >= 10) {
          toast.error(
            "Seems like the service is unavailable for your region. Please try a different network or consider using VPN.",
            {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: true,
              toastId: "vpnError",
            }
          );
        } else {
          toast.error(
            "We're having trouble connecting to the database currently. Please try again later.",
            {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              toastId: "fetchError",
            }
          );
        }
      }
    } else {
      setResults([]);
    }
  },

  async getMovie(
    id: string,
    setMovie: React.Dispatch<React.SetStateAction<Movie | null>>
  ) {
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
            toast.error("Movie not found. Please try again later", toastConfig);
            break;
          case 401:
            toast.error(
              "API authentication failed. Please try again later",
              toastConfig
            );
            break;
          default:
            toast.error(
              `Error: ${
                error.response.data.status_message ||
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
};
