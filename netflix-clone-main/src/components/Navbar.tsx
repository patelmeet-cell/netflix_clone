import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
  alpha,
  InputBase,
  ClickAwayListener,
  Fade,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown,
  Close as CloseIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const NetflixLogo = () => (
  <Box
    component={RouterLink}
    to="/"
    sx={{
      height: { xs: 20, sm: 24, md: 32 },
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

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Focus the search input when search is opened
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'TV Shows', path: '/tv-shows' },
    { text: 'Movies', path: '/movies' },
    { text: 'New & Popular', path: '/new' },
    { text: 'My List', path: '/my-list' },
  ];

  const drawer = (
    <Box sx={{ 
      bgcolor: '#141414', 
      height: '100%', 
      color: 'white',
      pt: 2,
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        px: 2,
        mb: 2,
      }}>
        <NetflixLogo />
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* Mobile search */}
      <Box 
        component="form" 
        onSubmit={handleSearchSubmit}
        sx={{ 
          px: 2, 
          mb: 2,
          display: 'flex',
          gap: 1,
        }}
      >
        <InputBase
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: 1,
            px: 2,
            py: 0.5,
            color: 'white',
            flexGrow: 1,
          }}
        />
        <IconButton 
          type="submit" 
          sx={{ color: 'white' }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
      
      <List>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem
              key={item.text}
              disablePadding
            >
              <Button
                component={RouterLink}
                to={item.path}
                onClick={handleDrawerToggle}
                fullWidth
                sx={{
                  py: 2,
                  px: 3,
                  color: 'white',
                  justifyContent: 'flex-start',
                  backgroundColor: isSelected ? alpha('#fff', 0.08) : 'transparent',
                  '&:hover': {
                    backgroundColor: isSelected ? alpha('#fff', 0.12) : alpha('#fff', 0.04),
                  },
                }}
              >
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: isSelected ? 700 : 400,
                    }
                  }}
                />
              </Button>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: isScrolled
            ? 'rgba(20, 20, 20, 0.95)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.7) 10%, transparent)',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              {!searchOpen && (
                <>
                  <Box sx={{ mr: { xs: 1, sm: 3 } }}>
                    <NetflixLogo />
                  </Box>

                  {!isMobile && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {menuItems.map((item) => (
                        <Button
                          key={item.text}
                          component={RouterLink}
                          to={item.path}
                          sx={{
                            color: 'white',
                            fontSize: '0.9rem',
                            textTransform: 'none',
                            opacity: location.pathname === item.path ? 1 : 0.7,
                            '&:hover': { opacity: 1 },
                            fontWeight: location.pathname === item.path ? 700 : 400,
                          }}
                        >
                          {item.text}
                        </Button>
                      ))}
                    </Box>
                  )}
                </>
              )}
              
              {searchOpen && (
                <ClickAwayListener onClickAway={handleSearchToggle}>
                  <Fade in={searchOpen}>
                    <Box
                      component="form"
                      onSubmit={handleSearchSubmit}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'transparent',
                        border: '1px solid rgba(255,255,255,0.5)',
                        borderRadius: 1,
                        px: 2,
                        flexGrow: 1,
                        maxWidth: { xs: '100%', sm: '300px' },
                      }}
                    >
                      <SearchIcon sx={{ color: 'white', mr: 1 }} />
                      <InputBase
                        placeholder="Titles, people, genres"
                        inputRef={searchInputRef}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                          color: 'white',
                          flexGrow: 1,
                          fontSize: '0.9rem',
                          '& .MuiInputBase-input': {
                            py: 1,
                          },
                        }}
                      />
                      {searchQuery && (
                        <IconButton
                          size="small"
                          onClick={() => setSearchQuery('')}
                          sx={{ color: 'white', p: 0.5 }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Fade>
                </ClickAwayListener>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              {!isMobile && (
                <>
                  <IconButton 
                    sx={{ 
                      color: 'white',
                      opacity: searchOpen ? 1 : 0.7,
                      '&:hover': { opacity: 1 },
                    }}
                    onClick={handleSearchToggle}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                  <IconButton 
                    sx={{ 
                      color: 'white',
                      opacity: 0.7,
                      '&:hover': { opacity: 1 },
                    }}
                    aria-label="notifications"
                  >
                    <NotificationsIcon />
                  </IconButton>
                </>
              )}

              <Box
                onClick={handleMenu}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: '#e50914',
                    fontSize: '0.875rem',
                  }}
                >
                  {currentUser?.email?.[0].toUpperCase()}
                </Avatar>
                <ArrowDropDown sx={{ color: 'white' }} />
              </Box>

              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  '& .MuiPaper-root': {
                    bgcolor: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    minWidth: 200,
                    mt: 1.5,
                  },
                }}
              >
                <MenuItem
                  onClick={handleClose}
                  sx={{
                    color: 'white',
                    py: 1.5,
                    opacity: 0.7,
                    '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: 'white',
                    py: 1.5,
                    opacity: 0.7,
                    '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Add spacing to prevent content from hiding under the navbar */}
      <Toolbar />
    </>
  );
};

export default Navbar;