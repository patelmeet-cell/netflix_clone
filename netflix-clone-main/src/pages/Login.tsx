import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const NetflixLogo = () => (
  <Box
    component={RouterLink}
    to="/"
    sx={{
      height: { xs: 32, sm: 45 },
      transition: 'transform 0.2s ease, opacity 0.2s ease',
      '&:hover': {
        transform: 'scale(1.05)',
        opacity: 0.95,
      },
      '& svg': {
        height: '100%',
        width: 'auto',
        fill: '#e50914',
      },
    }}
  >
    <svg viewBox="0 0 111 30" aria-hidden="true" focusable="false">
      <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z" />
    </svg>
  </Box>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.9) 100%)',
        backgroundImage: 'url(/netflix-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
          zIndex: 1,
        },
      }}
    >
      <Box
        component="header"
        sx={{
          width: '100%',
          p: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <NetflixLogo />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            background: 'rgba(20,20,20,0.92)',
            borderRadius: 2,
            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.7)',
            p: { xs: 3, sm: 5 },
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            mt: 6,
            mb: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: 'white',
              mb: 4,
              fontWeight: 700,
              letterSpacing: 1,
              textAlign: 'center',
            }}
          >
            Sign In
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              variant="filled"
              label="Email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 2,
                backgroundColor: '#333',
                borderRadius: '4px',
                '& .MuiFilledInput-root': {
                  backgroundColor: '#333',
                  '&:hover': { backgroundColor: '#444' },
                  '&.Mui-focused': { backgroundColor: '#444' },
                },
                '& .MuiInputLabel-root': { color: '#8c8c8c' },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <TextField
              fullWidth
              variant="filled"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 2,
                backgroundColor: '#333',
                borderRadius: '4px',
                '& .MuiFilledInput-root': {
                  backgroundColor: '#333',
                  '&:hover': { backgroundColor: '#444' },
                  '&.Mui-focused': { backgroundColor: '#444' },
                },
                '& .MuiInputLabel-root': { color: '#8c8c8c' },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                backgroundColor: '#e50914',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: 1,
                boxShadow: '0 2px 8px 0 rgba(229,9,20,0.15)',
                '&:hover': { backgroundColor: '#f40612' },
                textTransform: 'none',
              }}
            >
              Sign In
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{ color: '#b3b3b3', '&.Mui-checked': { color: '#b3b3b3' } }}
                  />
                }
                label={<span style={{ color: '#b3b3b3', fontSize: 14 }}>Remember me</span>}
              />
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{ color: '#b3b3b3', fontSize: 14, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Need help?
              </Link>
            </Box>
            <Box sx={{ mt: 4, color: '#737373', textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                New to Netflix?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{ color: 'white', textDecoration: 'none', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign up now
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '13px' }}>
                This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
                <Link
                  href="#"
                  sx={{ color: '#0071eb', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Learn more
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        component="footer"
        sx={{
          width: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.75)',
          color: '#737373',
          p: 3,
          mt: 'auto',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          Questions? Call +91-7096589655
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;