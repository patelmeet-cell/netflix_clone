import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Tab, Tabs, Container } from '@mui/material';
import { TrendingUp, Star, CalendarToday, Schedule } from '@mui/icons-material';
import { movieAPI, Movie } from '../services/api';
import FeaturedMovie from '../components/FeaturedMovie';
import MovieCard from '../components/MovieCard';

const NewAndPopular = () => {
  const [content, setContent] = useState<{
    trending: Movie[];
    topRated: Movie[];
    upcoming: Movie[];
    newReleases: Movie[];
  }>({
    trending: [],
    topRated: [],
    upcoming: [],
    newReleases: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  const tabs = [
    { label: 'Trending Now', value: 'trending', icon: <TrendingUp /> },
    { label: 'Top Rated', value: 'topRated', icon: <Star /> },
    { label: 'Upcoming', value: 'upcoming', icon: <CalendarToday /> },
    { label: 'New Releases', value: 'newReleases', icon: <Schedule /> },
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [trending, topRated, upcoming, newReleases] = await Promise.all([
          movieAPI.getTopMovies(),
          movieAPI.getMoviesByGenre('drama'),
          movieAPI.getMoviesByGenre('action'),
          movieAPI.getMoviesByGenre('scifi'),
        ]);

        setContent({
          trending,
          topRated,
          upcoming,
          newReleases,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content';
        console.error('Error fetching content:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
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

  const currentSelection = content[tabs[currentTab].value as keyof typeof content];
  const featuredContent = currentSelection[0];

  return (
    <Box sx={{ bgcolor: '#141414', minHeight: '100vh' }}>
      {featuredContent && (
        <FeaturedMovie movie={featuredContent} />
      )}

      <Container maxWidth="xl" sx={{ mt: -10, position: 'relative', zIndex: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
            New & Popular
          </Typography>

          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 3,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-selected': {
                  color: 'white',
                },
                minHeight: 72,
              },
              '& .MuiTabs-indicator': {
                bgcolor: 'primary.main',
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab 
                key={tab.value}
                label={
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    {tab.icon}
                    {tab.label}
                  </Box>
                }
              />
            ))}
          </Tabs>

          <Grid container spacing={2}>
            {currentSelection.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id || item.imdbID || index}>
                <MovieCard 
                  movie={item}
                  showRank={tabs[currentTab].value === 'trending' || tabs[currentTab].value === 'topRated'}
                  rank={index + 1}
                />
              </Grid>
            ))}
          </Grid>

          {currentSelection.length === 0 && (
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                textAlign: 'center', 
                mt: 4,
                opacity: 0.7 
              }}
            >
              No content available in this category
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default NewAndPopular;