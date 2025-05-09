import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box, useMediaQuery } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MovieDetails from './pages/MovieDetails';
import TvShows from './pages/TvShows';
import Movies from './pages/Movies';
import NewAndPopular from './pages/NewAndPopular';
import MyList from './pages/MyList';
import Search from './pages/Search';
import TestTMDB from './components/TestTMDB';
import PrivateRoute from './components/PrivateRoute';
import './styles/global.css';
import Register from './pages/Register';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e50914',
    },
    background: {
      default: '#141414',
      paper: '#1f1f1f',
    },
  },
  typography: {
    fontFamily: '"Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          '@media (min-width: 600px)': {
            paddingLeft: 24,
            paddingRight: 24,
          },
          '@media (min-width: 900px)': {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          padding: '6px 16px',
          '@media (max-width: 600px)': {
            padding: '4px 12px',
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            padding: 8,
          },
        },
      },
    },
  },
});

function AppContent() {
  const { loading } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={isMobile ? 40 : 48} />
      </Box>
    );
  }

  return (
    <Router>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        <Navbar />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            width: '100%',
            pt: { xs: '56px', sm: '64px' }, // Account for fixed navbar height
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<TestTMDB />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TvShows />} />
            <Route path="/new-and-popular" element={<NewAndPopular />} />
            <Route path="/my-list" element={<PrivateRoute element={<MyList />} />} />
            <Route path="/movie/:id" element={<PrivateRoute element={<MovieDetails />} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;
