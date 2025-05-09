import axios from 'axios';
import { Movie } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const movieService = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const fetchMovies = async (category: string): Promise<Movie[]> => {
  try {
    let endpoint = '';
    
    switch (category) {
      case 'trending':
        endpoint = '/trending/movie/week';
        break;
      case 'top_rated':
        endpoint = '/movie/top_rated';
        break;
      case 'action':
        endpoint = '/discover/movie';
        return (await movieService.get(endpoint, {
          params: { with_genres: 28 },
        })).data.results;
      case 'comedy':
        endpoint = '/discover/movie';
        return (await movieService.get(endpoint, {
          params: { with_genres: 35 },
        })).data.results;
      default:
        endpoint = '/movie/popular';
    }

    const response = await movieService.get(endpoint);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await movieService.get('/search/movie', {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (id: number): Promise<Movie | null> => {
  try {
    const response = await movieService.get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}; 