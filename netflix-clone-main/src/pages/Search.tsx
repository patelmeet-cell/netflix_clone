import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardActionArea,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { movieAPI, Movie as OmdbMovie } from '../services/api';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<OmdbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10; // OMDB API returns 10 results per page

  // Extract search query and page from URL parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');
    const page = queryParams.get('page');
    
    if (query) {
      setSearchQuery(query);
      setCurrentPage(page ? parseInt(page) : 1);
      performSearch(query, page ? parseInt(page) : 1);
    }
  }, [location.search]);

  // Function to perform the search using OMDB API
  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setMovies([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await movieAPI.searchMovies(query, page);
      
      if (response.Response === 'True' && response.Search) {
        setMovies(response.Search);
        setTotalResults(response.totalResults ? parseInt(response.totalResults) : 0);
      } else {
        setMovies([]);
        setTotalResults(0);
        if (response.Error) {
          setError(response.Error);
        }
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to search movies. Please try again.');
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage(1); // Reset to page 1 on new search
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&page=1`);
    }
  };

  // Handle page change
  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&page=${page}`);
  };

  // Handle movie selection
  const handleMovieClick = (movie: OmdbMovie) => {
    if (movie.imdbID) {
      navigate(`/movie/${movie.imdbID}`);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setMovies([]);
    setTotalResults(0);
    navigate('/search');
  };

  // Calculate total pages
  const totalPages = Math.min(Math.ceil(totalResults / resultsPerPage), 100); // OMDB API limits to 100 pages

  return (
    <Box sx={{ bgcolor: '#141414', minHeight: '100vh', pt: 4, pb: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4
        }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            Search Results
          </Typography>
          
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: 'flex',
              flexGrow: 1,
              maxWidth: { xs: '100%', sm: '500px' },
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClearSearch}
                      sx={{ color: 'white' }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                }
              }}
            />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '50vh' 
          }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : error ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6 
          }}>
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          </Box>
        ) : movies.length > 0 ? (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                {searchQuery}
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', opacity: 0.7 }}>
                {totalResults} {totalResults === 1 ? 'result' : 'results'} found for "{searchQuery}"
              </Typography>
            </Box>
            
            <Card 
              elevation={0} 
              sx={{ 
                bgcolor: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 4
              }}
            >
              <List sx={{ py: 0 }}>
                {movies.map((movie, index) => (
                  <React.Fragment key={movie.imdbID}>
                    <ListItem 
                      component={CardActionArea}
                      onClick={() => handleMovieClick(movie)}
                      sx={{ 
                        py: 1.5,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                            {movie.Title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {movie.Year}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < movies.length - 1 && (
                      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Card>
            
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                '& .MuiPaginationItem-root': {
                  color: 'white',
                },
                '& .Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                }
              }}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                  color="standard"
                  showFirstButton 
                  showLastButton
                />
              </Box>
            )}
          </>
        ) : searchQuery ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6 
          }}>
            <Typography color="white" variant="h6" sx={{ opacity: 0.7 }}>
              No results found for "{searchQuery}"
            </Typography>
            <Typography color="white" variant="body2" sx={{ mt: 2, opacity: 0.5 }}>
              Try searching for a different term or check your spelling
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6 
          }}>
            <Typography color="white" variant="h6" sx={{ opacity: 0.7 }}>
              Enter a search term to find movies
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Search;