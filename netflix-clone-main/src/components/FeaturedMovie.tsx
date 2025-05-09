import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { PlayArrow, Info } from '@mui/icons-material';

interface Movie {
  id?: number;
  title?: string;
  Title?: string;
  overview?: string;
  Plot?: string;
  backdrop_path?: string;
  Poster?: string;
  vote_average?: number;
  imdbRating?: string;
}

interface FeaturedMovieProps {
  movie: Movie;
}

const FeaturedMovie: React.FC<FeaturedMovieProps> = ({ movie }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setIsLoaded(true);
  }, [movie]);

  const handlePlayClick = () => {
    navigate(`/watch/${movie.id}`);
  };

  const handleMoreInfoClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const title = movie.title || movie.Title || '';
  const description = movie.overview || movie.Plot || '';
  const image = movie.backdrop_path ? 
    `https://image.tmdb.org/t/p/original${movie.backdrop_path}` :
    movie.Poster || '';
  const rating = movie.vote_average || 
    (movie.imdbRating ? parseFloat(movie.imdbRating) * 10 : 0);

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '80vh', sm: '85vh', md: '95vh' },
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: {
            xs: 'linear-gradient(0deg, #141414 0%, rgba(20,20,20,0.7) 50%, rgba(20,20,20,0.4) 100%)',
            md: 'linear-gradient(0deg, #141414 0%, transparent 50%)',
          },
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
          transition: 'transform 0.6s ease-out',
          filter: 'brightness(0.8)',
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          pb: { xs: 4, sm: 6, md: 10 },
          pt: { xs: '35%', sm: '30%', md: '20%' },
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Fade in={isLoaded} timeout={1000}>
          <Box>
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: {
                  xs: 'clamp(2rem, 8vw, 2.5rem)',
                  sm: 'clamp(2.5rem, 8vw, 3.5rem)',
                  md: 'clamp(3.5rem, 8vw, 4rem)',
                },
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                mb: { xs: 1, sm: 2, md: 3 },
                maxWidth: { xs: '100%', sm: '80%', md: '60%' },
                wordWrap: 'break-word',
              }}
            >
              {title}
            </Typography>

            {description && (
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  mb: { xs: 2, sm: 3, md: 4 },
                  maxWidth: { xs: '100%', sm: '75%', md: '50%' },
                  display: '-webkit-box',
                  WebkitLineClamp: { xs: 3, sm: 3, md: 4 },
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                    md: '1.1rem',
                  },
                  lineHeight: 1.5,
                }}
              >
                {description}
              </Typography>
            )}

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
                onClick={handlePlayClick}
                sx={{
                  bgcolor: 'white',
                  color: 'black',
                  px: { xs: 2, sm: 3, md: 6 },
                  py: { xs: 0.5, sm: 0.8, md: 1 },
                  fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1.1rem' },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.75)',
                  },
                  textTransform: 'none',
                  flexGrow: { xs: 1, sm: 0 },
                  minWidth: { xs: 'auto', sm: '120px' },
                }}
              >
                Play
              </Button>
              <Button
                variant="contained"
                startIcon={<Info />}
                onClick={handleMoreInfoClick}
                sx={{
                  bgcolor: 'rgba(109, 109, 110, 0.7)',
                  color: 'white',
                  px: { xs: 2, sm: 3, md: 6 },
                  py: { xs: 0.5, sm: 0.8, md: 1 },
                  fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1.1rem' },
                  '&:hover': {
                    bgcolor: 'rgba(109, 109, 110, 0.4)',
                  },
                  textTransform: 'none',
                  flexGrow: { xs: 1, sm: 0 },
                  minWidth: { xs: 'auto', sm: '120px' },
                }}
              >
                More Info
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Rating Badge */}
        {rating > 0 && (
          <Fade in={isLoaded} timeout={1500}>
            <Box
              sx={{
                position: 'absolute',
                right: { xs: 8, sm: 16, md: 32 },
                top: { xs: '30%', sm: '35%', md: '30%' },
                zIndex: 2,
                bgcolor: 'rgba(0,0,0,0.7)',
                color: rating >= 7 ? '#46d369' : 'white',
                p: { xs: 0.5, sm: 1 },
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                }}
              >
                {Math.round(rating * 10)}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
              >
                Match
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default FeaturedMovie;