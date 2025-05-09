import { useEffect, useState } from 'react';
import movieAPI, { Movie } from '../services/api';
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent, Rating } from '@mui/material';
import Grid from '@mui/material/Grid';

const TestTMDB = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieAPI.getTopMovies();
        setMovies(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch movies');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Top Rated Movies
      </Typography>
      <Grid 
            container 
            spacing={3}
          >
            {movies.map((movie) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3}
                key={movie.imdbID || String(movie.id)}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={movieAPI.getImageUrl(movie.Poster || '')}
                    alt={movie.Title || ''}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {movie.Title || ''}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {movie.Year || ''} • {movie.Runtime || ''}
                    </Typography>
                    {movie.imdbRating && (
                      <Box display="flex" alignItems="center" mt={1}>
                        <Rating
                          value={parseFloat(movie.imdbRating) / 2}
                          precision={0.5}
                          readOnly
                        />
                        <Typography variant="body2" ml={1}>
                          {movie.imdbRating}/10
                        </Typography>
                      </Box>
                    )}
                    <Typography variant="body2" color="textSecondary" mt={1}>
                      {movie.Genre || ''}
                    </Typography>
                    {movie.Plot && (
                      <Typography variant="body2" mt={1} sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {movie.Plot}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
    </Box>
  );
};

export default TestTMDB;