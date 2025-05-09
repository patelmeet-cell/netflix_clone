import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Tab, Tabs, Chip, useTheme, Container } from '@mui/material';
import { movieAPI, Movie } from '../services/api';
import FeaturedMovie from '../components/FeaturedMovie';
import MovieCard from '../components/MovieCard';

const Movies = () => {
  const [movies, setMovies] = useState<{
    featured: Movie[];
    action: Movie[];
    drama: Movie[];
    comedy: Movie[];
    scifi: Movie[];
  }>({
    featured: [],
    action: [],
    drama: [],
    comedy: [],
    scifi: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [currentGenre, setCurrentGenre] = useState('all');
  const theme = useTheme();

  const genres = [
    { label: 'All', value: 'all' },
    { label: 'Action', value: 'action' },
    { label: 'Drama', value: 'drama' },
    { label: 'Comedy', value: 'comedy' },
    { label: 'Sci-Fi', value: 'scifi' },
  ];

  const tabs = [
    { label: 'Popular', value: 'featured' },
    { label: 'New Releases', value: 'action' },
    { label: 'Must Watch', value: 'drama' },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [featured, action, drama, comedy, scifi] = await Promise.all([
          movieAPI.getTopMovies(),
          movieAPI.getMoviesByGenre('action'),
          movieAPI.getMoviesByGenre('drama'),
          movieAPI.getMoviesByGenre('comedy'),
          movieAPI.getMoviesByGenre('scifi'),
        ]);

        setMovies({
          featured,
          action,
          drama,
          comedy,
          scifi,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch movies';
        console.error('Error fetching movies:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleGenreChange = (genre: string) => {
    setCurrentGenre(genre);
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#141414',
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#141414',
      }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  const currentMovies = movies[tabs[currentTab].value as keyof typeof movies] || [];
  const filteredMovies = currentGenre === 'all'
    ? currentMovies
    : currentMovies.filter(movie => movie.Genre?.toLowerCase().includes(currentGenre));

  const featuredMovie = movies.featured[0];

  return (
    <Box sx={{ bgcolor: '#141414', minHeight: '100vh' }}>
      {featuredMovie && (
        <FeaturedMovie movie={featuredMovie} />
      )}

      <Container maxWidth="xl" sx={{ mt: -10, position: 'relative', zIndex: 2 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4
        }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            Movies
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {genres.map((genre) => (
              <Chip
                key={genre.value}
                label={genre.label}
                onClick={() => handleGenreChange(genre.value)}
                sx={{
                  bgcolor: currentGenre === genre.value ? 'primary.main' : 'rgba(255,255,255,0.08)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: currentGenre === genre.value ? 'primary.dark' : 'rgba(255,255,255,0.12)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.7)',
              '&.Mui-selected': {
                color: 'white',
              },
            },
            '& .MuiTabs-indicator': {
              bgcolor: 'primary.main',
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} />
          ))}
        </Tabs>

        <Grid container spacing={2}>
          {filteredMovies.map((movie, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id || movie.imdbID || index}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>

        {filteredMovies.length === 0 && (
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              textAlign: 'center',
              mt: 4,
              opacity: 0.7
            }}
          >
            No movies found for the selected filters
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default Movies;