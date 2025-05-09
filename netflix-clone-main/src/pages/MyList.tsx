import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  SelectChangeEvent,
} from '@mui/material';
import { ViewList, ViewModule, Delete as DeleteIcon } from '@mui/icons-material';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Movie } from '../types/movie';

type SortOption = 'dateAdded' | 'title' | 'rating';
type ViewMode = 'grid' | 'list';

const MyList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    fetchMyList();
  }, []);

  const fetchMyList = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, 'userLists'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const movieList: Movie[] = [];
      querySnapshot.forEach((doc) => {
        movieList.push({ id: doc.id, ...doc.data() } as Movie);
      });

      setMovies(movieList);
      setError(null);
    } catch (err) {
      setError('Failed to fetch your list');
      console.error('Error fetching list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromList = async (movieId: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await deleteDoc(doc(db, 'userLists', movieId));
      setMovies((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (err) {
      console.error('Error removing movie:', err);
      setError('Failed to remove movie from list');
    }
  };

  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSortBy(event.target.value as SortOption);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => prev === 'grid' ? 'list' : 'grid');
  };

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'rating':
        return (b.vote_average || 0) - (a.vote_average || 0);
      case 'dateAdded':
      default:
        // If dateAdded property exists, use it; otherwise use release_date as fallback
        const dateA = (a as any).dateAdded 
          ? new Date((a as any).dateAdded).getTime() 
          : new Date(a.release_date || '').getTime();
        const dateB = (b as any).dateAdded 
          ? new Date((b as any).dateAdded).getTime() 
          : new Date(b.release_date || '').getTime();
        return dateB - dateA;
    }
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{ bgcolor: '#141414' }}
      >
        <CircularProgress sx={{ color: 'red' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{ bgcolor: '#141414' }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#141414', minHeight: '100vh', pt: 10 }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4 
        }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            My List
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' }
          }}>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 120,
                bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiSelect-select': {
                  color: 'white',
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.23)',
                },
              }}
            >
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="dateAdded">Date Added</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}>
              <IconButton 
                onClick={toggleViewMode}
                sx={{ color: 'white' }}
              >
                {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {movies.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mt: 8,
              color: 'white',
            }}
          >
            <Typography variant="h6">
              Your list is empty
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.7)">
              Add some movies and TV shows to keep track of what you want to watch
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={viewMode === 'grid' ? 2 : 1}>
            {sortedMovies.map((movie) => (
              <Grid 
                item 
                xs={12} 
                sm={viewMode === 'grid' ? 6 : 12} 
                md={viewMode === 'grid' ? 4 : 12} 
                lg={viewMode === 'grid' ? 3 : 12} 
                key={movie.id}
              >
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: viewMode === 'grid' ? '150%' : '0',
                    height: viewMode === 'grid' ? 'auto' : '150px',
                    display: viewMode === 'grid' ? 'block' : 'flex',
                    '&:hover .overlay': {
                      opacity: 1,
                    },
                    bgcolor: '#1f1f1f',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.jpg'}
                    alt={movie.title}
                    sx={{
                      position: viewMode === 'grid' ? 'absolute' : 'relative',
                      top: 0,
                      left: 0,
                      width: viewMode === 'grid' ? '100%' : '100px',
                      height: viewMode === 'grid' ? '100%' : '100%',
                      objectFit: 'cover',
                      borderRadius: viewMode === 'grid' ? 1 : '4px 0 0 4px',
                    }}
                  />
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      opacity: viewMode === 'grid' ? 0 : 0.7,
                      transition: 'opacity 0.3s',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white' }}>{movie.title}</Typography>
                    <IconButton
                      onClick={() => handleRemoveFromList(movie.id.toString())}
                      sx={{
                        alignSelf: 'flex-end',
                        color: 'white',
                        '&:hover': {
                          color: 'error.main',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  {viewMode === 'list' && (
                    <Box 
                      sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        p: 2,
                        ml: '100px',
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white' }}>{movie.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                          {movie.overview ? `${movie.overview.substring(0, 100)}...` : 'No description available'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton
                          onClick={() => handleRemoveFromList(movie.id.toString())}
                          sx={{
                            color: 'rgba(255,255,255,0.7)',
                            '&:hover': {
                              color: 'error.main',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}

          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyList;