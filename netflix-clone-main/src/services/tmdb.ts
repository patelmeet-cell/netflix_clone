import axios from 'axios';

// TMDB API Configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'fb6a1d3f38c3d97f67df6d5c16b767bf'; // Use your actual API key

// Create axios instance for TMDB API
const tmdbAxios = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY
  }
});

// Define TMDB movie interface
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

// Define TMDB TV Show interface
export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBResponse {
  results: TMDBMovie[];
  page: number;
  total_results: number;
  total_pages: number;
}

export interface TMDBTVResponse {
  results: TMDBTVShow[];
  page: number;
  total_results: number;
  total_pages: number;
}

class TmdbAPI {
  // Movie methods
  async getPopularMovies(page: number = 1): Promise<TMDBResponse> {
    try {
      const response = await tmdbAxios.get('/movie/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies from TMDB:', error);
      return { results: [], page: 1, total_results: 0, total_pages: 0 };
    }
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse> {
    try {
      const response = await tmdbAxios.get('/movie/top_rated', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies from TMDB:', error);
      return { results: [], page: 1, total_results: 0, total_pages: 0 };
    }
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse> {
    try {
      const response = await tmdbAxios.get(`/trending/movie/${timeWindow}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies from TMDB:', error);
      return { results: [], page: 1, total_results: 0, total_pages: 0 };
    }
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse> {
    try {
      const response = await tmdbAxios.get('/discover/movie', {
        params: {
          with_genres: genreId,
          sort_by: 'popularity.desc',
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching movies by genre ${genreId} from TMDB:`, error);
      return { results: [], page: 1, total_results: 0, total_pages: 0 };
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
    try {
      const response = await tmdbAxios.get('/search/movie', {
        params: {
          query,
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies on TMDB:', error);
      return { results: [], page: 1, total_results: 0, total_pages: 0 };
    }
  }

  // TV Show methods
  async getPopularTVShows(page: number = 1): Promise<TMDBTVResponse> {
    try {
      const response = await tmdbAxios.get('/tv/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows from TMDB:', error);
      return { results: [], page: 1, total_results: 0, total_pages: 0 };
    }
  }

  async getTopRatedTVShows(page: number = 1): Promise<TMDBTVResponse> {
    try {
      const response = await tmdbAxios.get('/tv/top_rated', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated TV shows from TMDB:', error);
      return { results: [], page: 1, total_results: 0, total_pages: 0 };
    }
  }

  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBTVResponse> {
    try {
      const response = await tmdbAxios.get(`/trending/tv/${timeWindow}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending TV shows from TMDB:', error);
      return { results: [], page: 1, total_results: 0, total_pages: 0 };
    }
  }

  async getTVShowsByGenre(genreId: number, page: number = 1): Promise<TMDBTVResponse> {
    try {
      const response = await tmdbAxios.get('/discover/tv', {
        params: {
          with_genres: genreId,
          sort_by: 'popularity.desc',
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching TV shows by genre ${genreId} from TMDB:`, error);
      return { results: [], page: 1, total_results: 0, total_pages: 0 };
    }
  }

  async searchTVShows(query: string, page: number = 1): Promise<TMDBTVResponse> {
    try {
      const response = await tmdbAxios.get('/search/tv', {
        params: {
          query,
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching TV shows on TMDB:', error);
      return { results: [], page: 1, total_results: 0, total_pages: 0 };
    }
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) {
      return '/placeholder-movie.jpg';
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  // Common genre IDs for reference
  getGenres() {
    return {
      action: 28,
      adventure: 12,
      animation: 16,
      comedy: 35,
      crime: 80,
      documentary: 99,
      drama: 18,
      family: 10751,
      fantasy: 14,
      history: 36,
      horror: 27,
      music: 10402,
      mystery: 9648,
      romance: 10749,
      scienceFiction: 878,
      tvMovie: 10770,
      thriller: 53,
      war: 10752,
      western: 37
    };
  }

  // TV Show genre IDs
  getTVGenres() {
    return {
      action: 10759,
      adventure: 10759,
      animation: 16,
      comedy: 35,
      crime: 80,
      documentary: 99,
      drama: 18,
      family: 10751,
      kids: 10762,
      mystery: 9648,
      news: 10763,
      reality: 10764,
      sciFi: 10765,
      fantasy: 10765,
      soap: 10766,
      talk: 10767,
      war: 10768,
      politics: 10768,
      western: 37
    };
  }
}

export const tmdbAPI = new TmdbAPI();