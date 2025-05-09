import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await signup(email, password);
      navigate('/browse');
  } catch (error) {
      setError('Failed to create an account');
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
        background: 'linear-gradient(120deg, #141414 60%, #181818 100%)',
        backgroundImage: 'url(/netflix-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Box
        component="header"
        sx={{
          width: '100%',
          p: { xs: 2, sm: 3 },
          background: 'rgba(0,0,0,0.7)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/netflix-logo.png"
          alt="Netflix"
          style={{ width: '167px', height: 'auto' }}
        />
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
            Sign Up
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
              label="Email"
              type="email"
              required
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
              required
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
            <TextField
              fullWidth
              variant="filled"
              type="password"
              label="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Sign Up
            </Button>
            <Box sx={{ color: '#737373', textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{ color: 'white', textDecoration: 'none', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign in now
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

export default Register;