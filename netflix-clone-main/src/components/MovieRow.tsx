import React, { useState, useRef, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardMedia,
  Fade,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  PlayArrow,
  Add,
  ThumbUpOffAlt,
  KeyboardArrowDown,
  BrokenImage,
} from '@mui/icons-material';

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onScroll?: (direction: 'left' | 'right') => void;
}

const MovieRow = forwardRef<HTMLDivElement, MovieRowProps>(({ title, movies, onScroll }, ref) => {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [loadError, setLoadError] = useState<Record<number, boolean>>({});

  const getBaseUrlForImage = (url: string | undefined): string => {
    if (!url) return '';
    // Check if the URL already has a protocol
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it's a TMDB path
    if (url.startsWith('/')) {
      return `https://image.tmdb.org/t/p/w500${url}`;
    }
    return url;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rowRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!rowRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !rowRef.current) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    rowRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !rowRef.current) return;
    const x = e.touches[0].pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    rowRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleMovieClick = (movieId: number) => {
    if (!isDragging) {
      navigate(`/movie/${movieId}`);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (onScroll) {
      onScroll(direction);
    } else if (rowRef.current) {
      const scrollAmount = direction === 'left' ? 
        -rowRef.current.offsetWidth : 
        rowRef.current.offsetWidth;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Calculate card width based on screen size
  const getCardWidth = () => {
    if (isMobile) return 140;
    if (isTablet) return 180;
    return 220;
  };

  const handleImageError = (movieId: number) => {
    setLoadError(prev => ({ ...prev, [movieId]: true }));
  };

  return (
    <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, position: 'relative' }}>
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          mb: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 3 },
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          '&:hover .navigation-button': {
            opacity: 1,
          },
        }}
      >
        {!isMobile && (
          <>
            <IconButton
              className="navigation-button"
              onClick={() => handleScroll('left')}
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(20, 20, 20, 0.7)',
                color: 'white',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(20, 20, 20, 0.9)',
                },
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <NavigateBefore sx={{ fontSize: { sm: 30, md: 40 } }} />
            </IconButton>
            <IconButton
              className="navigation-button"
              onClick={() => handleScroll('right')}
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(20, 20, 20, 0.7)',
                color: 'white',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(20, 20, 20, 0.9)',
                },
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <NavigateNext sx={{ fontSize: { sm: 30, md: 40 } }} />
            </IconButton>
          </>
        )}

        <Box
          ref={(node: HTMLDivElement | null) => {
            // Handle both refs
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            rowRef.current = node;
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            px: { xs: 1, sm: 2, md: 3 },
            gap: { xs: 1, sm: 1.5, md: 2 },
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {movies.map((movie) => (
            <Card
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)}
              onMouseEnter={() => !isMobile && setHoveredMovie(movie.id)}
              onMouseLeave={() => !isMobile && setHoveredMovie(null)}
              sx={{
                flexShrink: 0,
                width: getCardWidth(),
                bgcolor: 'transparent',
                boxShadow: 'none',
                scrollSnapAlign: 'start',
                position: 'relative',
                transition: 'transform 0.3s ease',
                transform: hoveredMovie === movie.id && !isMobile ? 'scale(1.1)' : 'scale(1)',
                zIndex: hoveredMovie === movie.id ? 2 : 1,
              }}
            >
              {loadError[movie.id] || !movie.poster_path ? (
                <Box
                  sx={{
                    height: { xs: '200px', sm: '260px', md: '300px' },
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#333',
                    color: '#aaa',
                  }}
                >
                  <BrokenImage sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="caption" align="center" sx={{ px: 1 }}>
                    {movie.title || 'No Title'}
                  </Typography>
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  image={getBaseUrlForImage(movie.poster_path)}
                  alt={movie.title}
                  onError={() => handleImageError(movie.id)}
                  sx={{
                    height: { xs: '200px', sm: '260px', md: '300px' },
                    borderRadius: '4px',
                    objectFit: 'cover',
                  }}
                />
              )}

              <Fade in={hoveredMovie === movie.id && !isMobile}>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: '#181818',
                    borderRadius: '0 0 4px 4px',
                    p: 1.5,
                    transform: 'translateY(0)',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    {[
                      { icon: <PlayArrow />, primary: true, tooltip: 'Play' },
                      { icon: <Add />, primary: false, tooltip: 'Add to My List' },
                      { icon: <ThumbUpOffAlt />, primary: false, tooltip: 'Rate' },
                      { icon: <KeyboardArrowDown />, primary: false, alignRight: true, tooltip: 'More Info' },
                    ].map((button, index) => (
                      <Tooltip key={index} title={button.tooltip} arrow>
                        <IconButton
                          size="small"
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
                          }}
                        >
                          {React.cloneElement(button.icon, {
                            sx: { color: button.primary ? 'black' : 'white' },
                          })}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      mb: 0.5,
                    }}
                  >
                    {movie.title}
                  </Typography>
                  {movie.vote_average !== undefined && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: movie.vote_average >= 7 ? '#46d369' : 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {Math.round(movie.vote_average * 10)}% Match
                    </Typography>
                  )}
                  {movie.release_date && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'white',
                        display: 'block'
                      }}
                    >
                      {new Date(movie.release_date).getFullYear()}
                    </Typography>
                  )}
                </Box>
              </Fade>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
});

export default MovieRow;