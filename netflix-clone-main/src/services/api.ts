import axios from 'axios';

// Using HTTPS instead of HTTP
const OMDB_BASE_URL = 'https://www.omdbapi.com';
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || '2817519b';

export interface Movie {
  // TMDB fields
  id?: number;
  title?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  
  // OMDB fields
  imdbID?: string;
  Title?: string;
  Year?: string;
  Type?: string;
  Poster?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Plot?: string;
  imdbRating?: string;
  BoxOffice?: string;
  Actors?: string;
  Awards?: string;
  Language?: string;
  Country?: string;
  Response?: string;
  Error?: string;
  Ratings?: Array<{
    Source: string;
    Value: string;
  }>;
}

export interface SearchResponse {
  Search?: Movie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

class MovieAPI {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: OMDB_BASE_URL,
      params: {
        apikey: OMDB_API_KEY
      }
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        // Check if the OMDB API returned an error
        if (response.data.Response === 'False') {
          throw new Error(response.data.Error || 'Failed to fetch data from OMDB');
        }
        return response;
      },
      (error) => {
        if (error.response) {
          console.error('OMDB API Error:', {
            status: error.response.status,
            data: error.response.data
          });
          throw new Error(`API Error: ${error.response.data.Error || error.message}`);
        }
        throw error;
      }
    );
  }

  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    if (!query) {
      throw new Error('Search query is required');
    }

    try {
      const response = await this.api.get('/', {
        params: {
          s: query,
          type: 'movie',
          page: Math.max(1, Math.min(100, page)) // Ensure page is between 1 and 100
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  async getMovieDetails(imdbId: string): Promise<Movie> {
    if (!imdbId) {
      throw new Error('IMDB ID is required');
    }

    try {
      const response = await this.api.get('/', {
        params: {
          i: imdbId,
          plot: 'full'
        },
        timeout: 5000 // Add timeout to prevent long-hanging requests
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      
      // Return a fallback movie object with error info to prevent UI from breaking
      return {
        imdbID: imdbId,
        Title: 'Movie information unavailable',
        Year: '',
        Poster: 'N/A',
        Plot: 'Unable to load movie details. Please try again later.',
        Genre: '',
        imdbRating: '0',
        Error: error instanceof Error ? error.message : 'Unknown error',
        Response: 'False'
      };
    }
  }

  async getTopMovies(): Promise<Movie[]> {
    try {
      // Since OMDB doesn't have a direct endpoint for top movies,
      // we'll fetch some popular movies by their IMDb IDs
      const topMovieIds = [
        'tt0111161', // The Shawshank Redemption
        'tt0068646', // The Godfather
        'tt0468569', // The Dark Knight
        'tt0071562', // The Godfather: Part II
        'tt0050083', // 12 Angry Men
        'tt0108052', // Schindler's List
        'tt0167260', // The Lord of the Rings: The Return of the King
        'tt0110912'  // Pulp Fiction
      ];

      const moviePromises = topMovieIds.map(id => this.getMovieDetails(id));
      // Using Promise.allSettled instead of Promise.all to handle individual failures
      const results = await Promise.allSettled(moviePromises);
      
      // Filter only fulfilled promises and valid responses
      const movies = results
        .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(movie => movie && movie.Title); // Ensure we have valid movie objects
      
      return movies;
    } catch (error) {
      console.error('Error fetching top movies:', error);
      // Return a minimal set of fallback movies to prevent UI from breaking
      return [
        {
          Title: 'The Shawshank Redemption',
          imdbID: 'tt0111161',
          Year: '1994',
          Poster: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
          Plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          imdbRating: '9.3',
          Response: 'True'
        },
        {
          Title: 'The Godfather',
          imdbID: 'tt0068646',
          Year: '1972',
          Poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
          Plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
          imdbRating: '9.2',
          Response: 'True'
        }
      ];
    }
  }

  async getMoviesByGenre(genre: string): Promise<Movie[]> {
    if (!genre) {
      throw new Error('Genre is required');
    }

    try {
      // For genres, we'll use predefined lists of top movies in each genre
      const genreMovies: { [key: string]: string[] } = {
        action: ['tt0468569', 'tt0167260', 'tt0137523', 'tt0172495'],
        drama: ['tt0111161', 'tt0068646', 'tt0050083', 'tt0108052'],
        comedy: ['tt0110912', 'tt0107290', 'tt0118715', 'tt0116282'],
        scifi: ['tt0133093', 'tt0816692', 'tt0082971', 'tt0088763'],
        horror: ['tt0081505', 'tt0078748', 'tt0070047', 'tt0054215']
      };

      const movieIds = genreMovies[genre.toLowerCase()] || [];
      if (movieIds.length === 0) {
        // If genre not found in our predefined lists, return an empty array
        // instead of making additional API calls that might fail
        return [];
      }

      const moviePromises = movieIds.map(id => this.getMovieDetails(id));
      const results = await Promise.allSettled(moviePromises);
      
      // Filter only fulfilled promises and valid responses
      const movies = results
        .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(movie => movie && movie.Title); // Ensure we have valid movie objects
      
      return movies;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      // Return a simple fallback movie array to prevent UI from breaking
      return [{
        Title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Movie`,
        imdbID: 'tt0000000',
        Year: '2023',
        Poster: 'N/A',
        Plot: 'Movie information temporarily unavailable.',
        imdbRating: '7.0',
        Genre: genre,
        Response: 'True'
      }];
    }
  }

  getImageUrl(posterUrl: string): string {
    if (!posterUrl || posterUrl === 'N/A') {
      return '/placeholder-movie.jpg';
    }
    return posterUrl;
  }
}

export const movieAPI = new MovieAPI();

// Add TV show-specific methods
class TVShowAPI {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: OMDB_BASE_URL,
      params: {
        apikey: OMDB_API_KEY
      }
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        // Check if the OMDB API returned an error
        if (response.data.Response === 'False') {
          throw new Error(response.data.Error || 'Failed to fetch data from OMDB');
        }
        return response;
      },
      (error) => {
        if (error.response) {
          console.error('OMDB API Error:', {
            status: error.response.status,
            data: error.response.data
          });
          throw new Error(`API Error: ${error.response.data.Error || error.message}`);
        }
        throw error;
      }
    );
  }

  async searchTVShows(query: string, page: number = 1): Promise<SearchResponse> {
    if (!query) {
      throw new Error('Search query is required');
    }

    try {
      const response = await this.api.get('/', {
        params: {
          s: query,
          type: 'series', // Use 'series' type specifically for TV shows
          page: Math.max(1, Math.min(100, page))
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching TV shows:', error);
      throw error;
    }
  }

  async getTVShowDetails(imdbId: string): Promise<Movie> {
    if (!imdbId) {
      throw new Error('IMDB ID is required');
    }

    try {
      const response = await this.api.get('/', {
        params: {
          i: imdbId,
          plot: 'full',
          type: 'series'
        },
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      return {
        imdbID: imdbId,
        Title: 'TV Show information unavailable',
        Year: '',
        Poster: 'N/A',
        Plot: 'Unable to load TV show details. Please try again later.',
        Genre: '',
        imdbRating: '0',
        Error: error instanceof Error ? error.message : 'Unknown error',
        Response: 'False'
      };
    }
  }

  async getPopularTVShows(): Promise<Movie[]> {
    try {
      // Top-rated TV shows by IMDB ID
      const popularShowIds = [
        'tt0944947', // Game of Thrones
        'tt0903747', // Breaking Bad
        'tt0108778', // Friends
        'tt0098904', // Seinfeld
        'tt0141842', // The Sopranos
        'tt7366338', // Chernobyl
        'tt0386676', // The Office
        'tt2442560'  // Peaky Blinders
      ];

      const showPromises = popularShowIds.map(id => this.getTVShowDetails(id));
      const results = await Promise.allSettled(showPromises);
      
      const shows = results
        .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(show => show && show.Title);
      
      return shows;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      return [{
        Title: 'Popular TV Show',
        imdbID: 'tt0000000',
        Year: '2023',
        Poster: 'N/A',
        Plot: 'TV show information temporarily unavailable.',
        imdbRating: '8.5',
        Response: 'True'
      }];
    }
  }

  async getTrendingTVShows(): Promise<Movie[]> {
    try {
      // Trending/recent hit shows by IMDB ID
      const trendingShowIds = [
        'tt7335184', // The Handmaid's Tale
        'tt8111088', // The Mandalorian
        'tt1190634', // The Boys
        'tt5180504', // The Witcher
        'tt2356777', // True Detective
        'tt8420184', // The Queen's Gambit
        'tt9174558', // Loki
        'tt1844624'  // American Horror Story
      ];

      const showPromises = trendingShowIds.map(id => this.getTVShowDetails(id));
      const results = await Promise.allSettled(showPromises);
      
      const shows = results
        .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(show => show && show.Title);
      
      return shows;
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      return [{
        Title: 'Trending TV Show',
        imdbID: 'tt0000000',
        Year: '2023',
        Poster: 'N/A',
        Plot: 'TV show information temporarily unavailable.',
        imdbRating: '8.7',
        Response: 'True'
      }];
    }
  }

  async getTopRatedTVShows(): Promise<Movie[]> {
    try {
      // Critically acclaimed/top-rated shows by IMDB ID
      const topRatedShowIds = [
        'tt0903747', // Breaking Bad (9.5)
        'tt7366338', // Chernobyl (9.4)
        'tt0795176', // Planet Earth (9.4)
        'tt0185906', // Band of Brothers (9.4)
        'tt0944947', // Game of Thrones (9.3)
        'tt1475582', // Sherlock (9.1)
        'tt0306414', // The Wire (9.3)
        'tt7920978'  // This Is Us (8.7)
      ];

      const showPromises = topRatedShowIds.map(id => this.getTVShowDetails(id));
      const results = await Promise.allSettled(showPromises);
      
      const shows = results
        .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(show => show && show.Title);
      
      return shows;
    } catch (error) {
      console.error('Error fetching top-rated TV shows:', error);
      return [{
        Title: 'Top-Rated TV Show',
        imdbID: 'tt0000000',
        Year: '2023',
        Poster: 'N/A',
        Plot: 'TV show information temporarily unavailable.',
        imdbRating: '9.2',
        Response: 'True'
      }];
    }
  }

  async getTVShowsByGenre(genre: string): Promise<Movie[]> {
    if (!genre) {
      throw new Error('Genre is required');
    }

    try {
      // Predefined lists of top shows in each genre
      const genreShows: { [key: string]: string[] } = {
        drama: ['tt0944947', 'tt0903747', 'tt0141842', 'tt7366338'], // Game of Thrones, Breaking Bad, Sopranos, Chernobyl
        comedy: ['tt0108778', 'tt0098904', 'tt0386676', 'tt0472954'], // Friends, Seinfeld, The Office, It's Always Sunny
        action: ['tt2442560', 'tt0455275', 'tt4574334', 'tt0804484'], // Peaky Blinders, Prison Break, Stranger Things, Vikings
        scifi: ['tt0407362', 'tt0112178', 'tt0460681', 'tt0118480'], // Battlestar Galactica, Sliders, Supernatural, Stargate SG-1
        crime: ['tt0903747', 'tt2442560', 'tt0455275', 'tt0303461']  // Breaking Bad, Peaky Blinders, Prison Break, Firefly
      };

      const showIds = genreShows[genre.toLowerCase()] || [];
      if (showIds.length === 0) {
        return [];
      }

      const showPromises = showIds.map(id => this.getTVShowDetails(id));
      const results = await Promise.allSettled(showPromises);
      
      const shows = results
        .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(show => show && show.Title);
      
      return shows;
    } catch (error) {
      console.error('Error fetching TV shows by genre:', error);
      return [{
        Title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} TV Show`,
        imdbID: 'tt0000000',
        Year: '2023',
        Poster: 'N/A',
        Plot: 'TV show information temporarily unavailable.',
        imdbRating: '7.5',
        Genre: genre,
        Response: 'True'
      }];
    }
  }
}

export const tvShowAPI = new TVShowAPI();

// Export the api object with all the methods needed by the application
export const api = {
  // Movie methods
  getNetflixOriginals: async (): Promise<Movie[]> => {
    return movieAPI.getMoviesByGenre('drama');
  },
  getTrendingMovies: async (): Promise<Movie[]> => {
    return movieAPI.getTopMovies();
  },
  getTopRated: async (): Promise<Movie[]> => {
    return movieAPI.getTopMovies();
  },
  getActionMovies: async (): Promise<Movie[]> => {
    return movieAPI.getMoviesByGenre('action');
  },
  getComedyMovies: async (): Promise<Movie[]> => {
    return movieAPI.getMoviesByGenre('comedy');
  },
  getHorrorMovies: async (): Promise<Movie[]> => {
    return movieAPI.getMoviesByGenre('horror');
  },
  getRomanceMovies: async (): Promise<Movie[]> => {
    const romanceMovies = [
      'tt0338013', // Eternal Sunshine
      'tt0332280', // The Notebook
      'tt0100405', // Pretty Woman
      'tt0118799', // Life is Beautiful
    ];
    
    try {
      const moviePromises = romanceMovies.map(id => movieAPI.getMovieDetails(id));
      const results = await Promise.allSettled(moviePromises);
      
      // Filter only fulfilled promises and valid responses
      const movies = results
        .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(movie => movie && movie.Title);
      
      return movies;
    } catch (error) {
      console.error('Error fetching romance movies:', error);
      return [{
        Title: 'Romance Movie',
        imdbID: 'tt0000000',
        Year: '2023',
        Poster: 'N/A',
        Plot: 'Movie information temporarily unavailable.',
        imdbRating: '7.0',
        Genre: 'Romance',
        Response: 'True'
      }];
    }
  },
  getDocumentaries: async (): Promise<Movie[]> => {
    const documentaries = [
      'tt1663202', // The Imposter
      'tt1772925', // Jiro Dreams of Sushi
      'tt2125608', // The Act of Killing
      'tt1949969', // Blackfish
    ];
    
    try {
      const moviePromises = documentaries.map(id => movieAPI.getMovieDetails(id));
      const results = await Promise.allSettled(moviePromises);
      
      // Filter only fulfilled promises and valid responses
      const movies = results
        .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(movie => movie && movie.Title);
      
      return movies;
    } catch (error) {
      console.error('Error fetching documentaries:', error);
      return [{
        Title: 'Documentary',
        imdbID: 'tt0000000',
        Year: '2023',
        Poster: 'N/A',
        Plot: 'Movie information temporarily unavailable.',
        imdbRating: '7.5',
        Genre: 'Documentary',
        Response: 'True'
      }];
    }
  },
  
  // TV Show methods
  getTrendingTVShows: async (): Promise<Movie[]> => {
    return tvShowAPI.getTrendingTVShows();
  },
  getPopularTVShows: async (): Promise<Movie[]> => {
    return tvShowAPI.getPopularTVShows();
  },
  getTopRatedTVShows: async (): Promise<Movie[]> => {
    return tvShowAPI.getTopRatedTVShows();
  },
  getTVShowsByGenre: async (genre: string): Promise<Movie[]> => {
    return tvShowAPI.getTVShowsByGenre(genre);
  }
};

export default movieAPI;