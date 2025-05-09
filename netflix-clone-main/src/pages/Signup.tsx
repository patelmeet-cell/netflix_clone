import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      await signup(email, password);
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create an account';
      setError(errorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #141414 60%, #181818 100%)',
      backgroundImage: 'url(/netflix-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Box
        sx={{
          background: 'rgba(20,20,20,0.92)',
          borderRadius: 2,
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.7)',
          p: { xs: 3, sm: 5 },
          width: '100%',
          maxWidth: 400,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }}>
          Sign up
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            variant="filled"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
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
            variant="filled"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password-confirm"
            label="Confirm Password"
            type="password"
            id="password-confirm"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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
            variant="filled"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
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
            Sign Up
          </Button>
          <Box sx={{ color: '#737373', textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: 'white', textDecoration: 'none', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;