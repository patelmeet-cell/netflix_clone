import { useRef } from 'react';
import { useMovies } from '../hooks/useMovies';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Button,
  Fade,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import FeaturedMovie from '../components/FeaturedMovie';
import MovieRow from '../components/MovieRow';

const Home = () => {
  const { movieRows, loading, error } = useMovies();
  const theme = useTheme();
  const rowRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scroll = (direction: 'left' | 'right', rowTitle: string) => {
    const row = rowRefs.current[rowTitle];
    if (row) {
      const { scrollLeft, clientWidth } = row;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      row.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Filter out empty rows
  const filteredMovieRows = movieRows.filter(row => row.movies && row.movies.length > 0);
  
  // Select a featured movie from the first non-empty row (preferably Netflix Originals)
  const netflixOriginalsRow = movieRows.find(row => row.title === 'NETFLIX ORIGINALS');
  const featuredMovie = netflixOriginalsRow?.movies?.[0] || filteredMovieRows[0]?.movies?.[0];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#141414',
        }}
      >
        <CircularProgress color="primary" size={60} />
        <Typography variant="h5" color="white" sx={{ mt: 2 }}>
          Loading Netflix Content...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#141414',
          p: 3,
        }}
      >
        <Typography variant="h4" color="error" align="center" gutterBottom>
          {error}
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Refresh Page
        </Button>
      </Box>
    );
  }

  // If we have no movie rows with content, show empty state
  if (filteredMovieRows.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#141414',
          p: 3,
        }}
      >
        <Typography variant="h4" color="white" align="center" gutterBottom>
          No movies available at the moment
        </Typography>
        <Typography variant="body1" color="gray" align="center" sx={{ mb: 3 }}>
          Please check your internet connection or try again later
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#141414', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Featured Movie Banner */}
      {featuredMovie && <FeaturedMovie movie={featuredMovie} />}

      {/* Movie Rows */}
      <Box 
        sx={{ 
          mt: { xs: -5, sm: -8, md: -10 }, 
          position: 'relative', 
          zIndex: 1,
          px: { xs: 1, sm: 2, md: 4 }
        }}
      >
        {filteredMovieRows.map((row, index) => (
          <Fade 
            key={`${row.title}-${index}`}
            in={!loading} 
            timeout={500 + index * 100}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <Box 
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 },
                opacity: loading ? 0 : 1,
                transform: loading ? 'translateY(20px)' : 'translateY(0)',
                transition: 'all 0.5s ease-in-out'
              }}
            >
              {row.error ? (
                <Typography variant="body2" color="error" sx={{ ml: 2, mb: 1 }}>
                  Error loading {row.title}: {row.error}
                </Typography>
              ) : row.movies.length === 0 ? null : (
                <MovieRow
                  title={row.title}
                  movies={row.movies.map((movie, idx) => ({
                    id: movie.id || Number(movie.imdbID?.replace(/\D/g, '')) || idx,
                    title: movie.Title || movie.title || '',
                    overview: movie.Plot || movie.overview || '',
                    poster_path: movie.poster_path || (movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : ''),
                    backdrop_path: movie.backdrop_path || '',
                    release_date: movie.release_date || movie.Released || movie.Year || '',
                    vote_average: movie.vote_average || (movie.imdbRating ? parseFloat(movie.imdbRating) : 0),
                    genre_ids: movie.genre_ids || [],
                  }))}
                  ref={(el) => {
                    rowRefs.current[row.title] = el;
                  }}
                  onScroll={(direction: 'left' | 'right') => scroll(direction, row.title)}
                />
              )}
            </Box>
          </Fade>
        ))}
      </Box>
    </Box>
  );
};

export default Home;