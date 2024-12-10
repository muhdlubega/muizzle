import axios from "axios";
import { Movie, Results } from "../types/types";
import { toast } from "react-toastify";

const TRAKT_API_BASE_URL = "https://api.trakt.tv";
const CLIENT_ID: string = import.meta.env.VITE_APP_TRAKT_CLIENT_ID;

interface SearchResult {
  movie: {
    ids: {
      tmdb: number;
    };
    title: string;
    year?: string;
  };
}

export const movieService = {
  async getSearch(
    query: string,
    errorCount: number,
    setErrorCount: React.Dispatch<React.SetStateAction<number>>,
    setResults: React.Dispatch<React.SetStateAction<Results[]>>
  ) {
    let controller: AbortController | null = null;

    if (controller) {
      (controller as AbortController).abort();
    }

    controller = new AbortController();
    if (query.length > 2) {
      try {
        const response = await axios.get(`${TRAKT_API_BASE_URL}/search/movie`, {
          params: {
            query: query,
            limit: 5,
          },
          headers: {
            "Content-Type": "application/json",
            "trakt-api-key": CLIENT_ID,
            "trakt-api-version": "2",
          },
          signal: (controller as AbortController).signal,
        });
  
        const transformedResults: Results[] = response.data.map(
          (item: SearchResult) => ({
            id: item.movie.ids.tmdb,
            title: item.movie.title,
            release_date: item.movie.year || "",
          })
        );
  
        setResults(transformedResults);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Search request canceled:", query);
          return;
        }
  
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
        `${TRAKT_API_BASE_URL}/search/tmdb/${id}?type=movie`,
        {
          headers: {
            "Content-Type": "application/json",
            "trakt-api-key": CLIENT_ID,
            "trakt-api-version": "2",
          },
        }
      );

      const movieData: Movie = {
        title: response.data[0].movie.title,
        release_date: response.data[0].movie.year || "",
      };

      setMovie(movieData);
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
              "API authentication failed. Please try again later.",
              toastConfig
            );
            break;
          default:
            toast.error(
              `Error: ${
                error.response.data?.status_message || "Failed to fetch movie data"
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
