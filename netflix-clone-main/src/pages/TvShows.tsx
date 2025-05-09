import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Grid, Tab, Tabs, Chip } from '@mui/material';
import { api } from '../services/api';
import { Movie } from '../services/api';
import FeaturedMovie from '../components/FeaturedMovie';
import MovieCard from '../components/MovieCard';

const TvShows = () => {
  const [shows, setShows] = useState<{
    trending: Movie[];
    popular: Movie[];
    topRated: Movie[];
    sciFi: Movie[];
    drama: Movie[];
  }>({
    trending: [],
    popular: [],
    topRated: [],
    sciFi: [],
    drama: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [currentGenre, setCurrentGenre] = useState('all');

  const genres = [
    { label: 'All', value: 'all' },
    { label: 'Drama', value: 'drama' },
    { label: 'Sci-Fi', value: 'scifi' },
    { label: 'Comedy', value: 'comedy' },
    { label: 'Action', value: 'action' },
  ];

  const tabs = [
    { label: 'Trending', value: 'trending' },
    { label: 'Popular', value: 'popular' },
    { label: 'Top Rated', value: 'topRated' },
  ];

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const [trending, popular, topRated, sciFi, drama] = await Promise.all([
          api.getTrendingTVShows(),
          api.getPopularTVShows(),
          api.getTopRatedTVShows(),
          api.getTVShowsByGenre('scifi'),
          api.getTVShowsByGenre('drama'),
        ]);

        setShows({
          trending,
          popular,
          topRated,
          sciFi,
          drama,
        });
      } catch (err) {
        setError('Failed to load TV shows');
        console.error('Error fetching TV shows:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
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
        <Typography color="error" variant="h5">
          {error}
        </Typography>
      </Box>
    );
  }

  const currentShows = shows[tabs[currentTab].value as keyof typeof shows] || [];
  const filteredShows = currentGenre === 'all' 
    ? currentShows 
    : currentShows.filter(show => show.Genre?.toLowerCase().includes(currentGenre));

  return (
    <Box sx={{ bgcolor: '#141414', minHeight: '100vh', pt: 8 }}>
      {shows.trending[0] && (
        <FeaturedMovie movie={shows.trending[0]} />
      )}

      <Box sx={{ px: { xs: 2, sm: 4 }, mt: -10, position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4 
        }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            TV Shows
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
          {filteredShows.map((show, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={show.id || index}>
              <MovieCard movie={show} />
            </Grid>
          ))}
        </Grid>

        {filteredShows.length === 0 && (
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white', 
              textAlign: 'center', 
              mt: 4,
              opacity: 0.7 
            }}
          >
            No shows found for the selected filters
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TvShows;