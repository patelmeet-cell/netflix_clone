import { useState, useEffect } from 'react';
import { api, movieAPI, Movie } from '../services/api';
import { tmdbAPI } from '../services/tmdb';

interface MovieRow {
  title: string;
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

export const useMovies = () => {
  const [movieRows, setMovieRows] = useState<MovieRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // Fetch movies from different categories using the OMDB API
        const [
          netflixOriginals,
          trendingNow,
          topRated,
          actionMovies,
          comedyMovies,
          horrorMovies,
          romanceMovies,
          documentaries,
        ] = await Promise.all([
          api.getNetflixOriginals(),
          api.getTrendingMovies(),
          api.getTopRated(),
          api.getActionMovies(),
          api.getComedyMovies(),
          api.getHorrorMovies(),
          api.getRomanceMovies(),
          api.getDocumentaries(),
        ]);

        // Fetch additional popular movies by search terms
        const popularSearchTerms = ['marvel', 'star wars', 'harry potter', 'lord of the rings', 'disney'];
        const additionalMoviesPromises = popularSearchTerms.map(async term => {
          try {
            const response = await movieAPI.searchMovies(term);
            return {
              term,
              movies: response.Search || []
            };
          } catch (err) {
            console.warn(`Failed to fetch movies for ${term}:`, err);
            return {
              term,
              movies: []
            };
          }
        });

        // Try to fetch some popular movies from TMDB API if available
        let discoverMovies: any[] = [];
        try {
          const tmdbMovies = await tmdbAPI.getPopularMovies();
          if (tmdbMovies && Array.isArray(tmdbMovies.results)) {
            discoverMovies = tmdbMovies.results;
          }
        } catch (err) {
          console.warn('Failed to fetch TMDB movies:', err);
        }

        // Wait for all additional movie promises to resolve
        const additionalMoviesResults = await Promise.all(additionalMoviesPromises);
        
        // Create the base movie rows from our API categories
        const baseRows = [
          {
            title: 'NETFLIX ORIGINALS',
            movies: netflixOriginals,
            loading: false,
            error: null,
          },
          {
            title: 'Trending Now',
            movies: trendingNow,
            loading: false,
            error: null,
          },
          {
            title: 'Top Rated',
            movies: topRated,
            loading: false,
            error: null,
          },
          {
            title: 'Action Movies',
            movies: actionMovies,
            loading: false,
            error: null,
          },
          {
            title: 'Comedy Movies',
            movies: comedyMovies,
            loading: false,
            error: null,
          },
          {
            title: 'Horror Movies',
            movies: horrorMovies,
            loading: false,
            error: null,
          },
          {
            title: 'Romance Movies',
            movies: romanceMovies,
            loading: false,
            error: null,
          },
          {
            title: 'Documentaries',
            movies: documentaries,
            loading: false,
            error: null,
          },
        ];

        // Create rows from additional searches
        const additionalRows = additionalMoviesResults
          .filter(result => result.movies.length > 0)
          .map(result => ({
            title: `${result.term.charAt(0).toUpperCase() + result.term.slice(1)} Movies`,
            movies: result.movies,
            loading: false,
            error: null,
          }));
        
        // Add TMDB movies if available
        const allRows = [...baseRows, ...additionalRows];
        
        if (discoverMovies.length > 0) {
          // Convert TMDB format to match our app's Movie format
          const convertedTmdbMovies = discoverMovies.map(movie => ({
            id: movie.id,
            imdbID: `tmdb-${movie.id}`,
            Title: movie.title,
            Year: movie.release_date ? movie.release_date.substring(0, 4) : '',
            Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'N/A',
            Plot: movie.overview,
            imdbRating: (movie.vote_average / 2).toString(),
            Response: 'True'
          }));
          
          allRows.push({
            title: 'Popular Movies',
            movies: convertedTmdbMovies,
            loading: false,
            error: null,
          });
        }

        setMovieRows(allRows);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { movieRows, loading, error };
};