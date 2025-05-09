import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  Rating,
  CircularProgress,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { movieAPI, Movie } from '../services/api';
import { PlayArrow, Info, ArrowBack } from '@mui/icons-material';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('Movie ID is required');
        const data = await movieAPI.getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch movie details';
        console.error('Error fetching movie details:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#141414',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#141414',
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography color="error" variant="h6" gutterBottom>
          {error || 'Movie not found'}
        </Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ color: 'white', mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const rating = movie.imdbRating ? parseFloat(movie.imdbRating) / 2 : 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#141414' }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', sm: '70vh', md: '80vh' },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(20,20,20,0.1) 0%, rgba(20,20,20,0.8) 60%, #141414 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }
        }}
      >
        <Box
          component="img"
          src={movieAPI.getImageUrl(movie.Poster)}
          alt={movie.Title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.7)',
          }}
        />

        <Container 
          sx={{ 
            height: '100%',
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            pb: { xs: 3, sm: 4, md: 6 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{
              position: 'absolute',
              top: { xs: 16, sm: 24 },
              left: { xs: 16, sm: 24 },
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            Back
          </Button>

          <Fade in timeout={1000}>
            <Box>
              <Typography 
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: {
                    xs: 'clamp(1.5rem, 6vw, 2rem)',
                    sm: 'clamp(2rem, 6vw, 2.5rem)',
                    md: 'clamp(2.5rem, 6vw, 3rem)',
                  },
                  mb: { xs: 1, sm: 2 },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {movie.Title}
              </Typography>

              <Box 
                sx={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: { xs: 1, sm: 2 },
                  mb: { xs: 2, sm: 3 },
                  alignItems: 'center',
                }}
              >
                {rating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating 
                      value={rating} 
                      precision={0.5} 
                      readOnly 
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ color: '#fff' }}
                    />
                    <Typography 
                      variant="body2" 
                      color="white"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      ({movie.imdbRating}/10)
                    </Typography>
                  </Box>
                )}
                <Typography 
                  variant="body2" 
                  color="white"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {movie.Runtime}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="white"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {movie.Released}
                </Typography>
              </Box>

              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: { xs: 1, sm: 2 },
                  }}
                >
                  {movie.Genre?.split(',').map((genre) => (
                    <Chip
                      key={genre}
                      label={genre.trim()}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box 
                sx={{ 
                  display: 'flex',
                  gap: { xs: 1, sm: 2 },
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  sx={{
                    bgcolor: 'white',
                    color: 'black',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    flexGrow: { xs: 1, sm: 0 },
                  }}
                >
                  Play
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Info />}
                  sx={{
                    bgcolor: 'rgba(109, 109, 110, 0.7)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.5)' },
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    flexGrow: { xs: 1, sm: 0 },
                  }}
                >
                  More Info
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container 
        sx={{ 
          mt: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography 
                variant="h6" 
                color="white" 
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                About {movie.Title}
              </Typography>
              <Typography 
                variant="body1" 
                color="gray"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.6,
                }}
              >
                {movie.Plot}
              </Typography>
            </Box>
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="body1" 
                color="gray"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                <strong>Director:</strong> {movie.Director}
              </Typography>
              <Typography 
                variant="body1" 
                color="gray"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                <strong>Cast:</strong> {movie.Actors}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              {movie.Awards && (
                <>
                  <Typography 
                    variant="h6" 
                    color="white" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                  >
                    Awards
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="gray"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    {movie.Awards}
                  </Typography>
                </>
              )}
            </Box>
            {movie.BoxOffice && (
              <Box>
                <Typography 
                  variant="h6" 
                  color="white" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                >
                  Box Office
                </Typography>
                <Typography 
                  variant="body1" 
                  color="gray"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  {movie.BoxOffice}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetails;