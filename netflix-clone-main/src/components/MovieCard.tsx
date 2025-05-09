import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow,
  Add,
  ThumbUpOffAlt,
  KeyboardArrowDown,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import { Movie as OmdbMovie } from '../services/api';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path?: string;
    vote_average: number;
    genre_ids?: number[];
    release_date?: string;
  };
  omdbMovie?: OmdbMovie;
  delay?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, omdbMovie, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isTapped, setIsTapped] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isMobile) {
      if (!isTapped) {
        setIsTapped(true);
      } else {
        handleMovieClick();
      }
    }
  };

  const handleMovieClick = () => {
    // If we have an OMDB movie, navigate with imdbID
    if (omdbMovie?.imdbID) {
      navigate(`/movie/${omdbMovie.imdbID}`);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  const handleBlur = () => {
    setIsTapped(false);
  };

  // Determine which image to use - support both TMDB and OMDB poster formats
  const getPosterUrl = () => {
    if (omdbMovie?.Poster && omdbMovie.Poster !== 'N/A') {
      return omdbMovie.Poster;
    } else if (movie.poster_path?.startsWith('http')) {
      return movie.poster_path;
    } else if (movie.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    } else {
      return '/placeholder-movie.jpg';
    }
  };

  // Get the movie title from OMDB or TMDB
  const getMovieTitle = () => {
    return omdbMovie?.Title || movie.title;
  };

  // Get the movie description from OMDB or TMDB
  const getMovieOverview = () => {
    return omdbMovie?.Plot || movie.overview;
  };

  // Get release year
  const getReleaseYear = () => {
    if (omdbMovie?.Year) {
      return omdbMovie.Year;
    } else if (movie.release_date) {
      return movie.release_date.substring(0, 4);
    }
    return '';
  };

  // Get rating match percentage
  const getRatingMatch = () => {
    if (omdbMovie?.imdbRating) {
      return Math.round(parseFloat(omdbMovie.imdbRating) * 10);
    } else {
      return Math.round(movie.vote_average * 10);
    }
  };

  return (
    <Grow in timeout={300 + delay}>
      <Card
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onClick={isMobile ? handleTap : handleMovieClick}
        onTouchStart={handleTap}
        onBlur={handleBlur}
        tabIndex={0}
        sx={{
          position: 'relative',
          bgcolor: 'transparent',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          transform: (isHovered || isTapped) && !isMobile ? 'scale(1.1)' : 'scale(1)',
          zIndex: (isHovered || isTapped) ? 2 : 1,
          '&:hover': {
            cursor: 'pointer',
          },
          '@media (hover: none)': {
            '&:active': {
              transform: 'scale(0.98)',
            },
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            paddingTop: '150%',
            borderRadius: '4px',
            overflow: 'hidden',
            bgcolor: '#141414',
          }}
        >
          <Box
            component="img"
            src={getPosterUrl()}
            alt={getMovieTitle()}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
            }}
          />

          <Fade in={(isHovered || isTapped) && !isMobile} timeout={300}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: '#141414',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '56.25%',
                  bgcolor: '#000',
                }}
              >
                <Box
                  component="img"
                  src={getPosterUrl()}
                  alt={getMovieTitle()}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    sx={{
                      bgcolor: 'rgba(42, 42, 42, 0.6)',
                      borderWidth: 2,
                      borderStyle: 'solid',
                      borderColor: 'white',
                      '&:hover': { bgcolor: 'rgba(42, 42, 42, 0.8)' },
                      padding: { xs: '4px', sm: '6px' },
                    }}
                  >
                    {isMuted ? (
                      <VolumeOff sx={{ color: 'white', fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                    ) : (
                      <VolumeUp sx={{ color: 'white', fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <CardContent 
                sx={{ 
                  flexGrow: 1, 
                  p: { xs: 1, sm: 1.5 },
                  '&:last-child': { pb: { xs: 1, sm: 1.5 } },
                }}
              >
                <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                  {[
                    { icon: <PlayArrow />, primary: true },
                    { icon: <Add />, primary: false },
                    { icon: <ThumbUpOffAlt />, primary: false },
                    { icon: <KeyboardArrowDown />, primary: false, alignRight: true },
                  ].map((button, index) => (
                    <IconButton
                      key={index}
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        ...(button.alignRight && { marginLeft: 'auto' }),
                        ...(button.primary
                          ? {
                              bgcolor: 'white',
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.75)' },
                            }
                          : {
                              border: '2px solid #666',
                              '&:hover': { border: '2px solid white' },
                            }),
                        padding: { xs: '4px', sm: '6px' },
                      }}
                    >
                      {React.cloneElement(button.icon, {
                        sx: { 
                          color: button.primary ? 'black' : 'white',
                          fontSize: { xs: '1rem', sm: '1.25rem' },
                        },
                      })}
                    </IconButton>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'white',
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      fontWeight: 'bold',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {getMovieTitle()}
                  </Typography>
                  
                  {getReleaseYear() && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'gray',
                        ml: 1,
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      }}
                    >
                      ({getReleaseYear()})
                    </Typography>
                  )}
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    color: getRatingMatch() >= 70 ? '#46d369' : 'white',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  }}
                >
                  {getRatingMatch()}% Match
                </Typography>

                <Typography
                  variant="caption"
                  color="gray"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mt: 0.5,
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    lineHeight: 1.3,
                  }}
                >
                  {getMovieOverview()}
                </Typography>
              </CardContent>
            </Box>
          </Fade>
        </Box>
      </Card>
    </Grow>
  );
};

export default MovieCard;