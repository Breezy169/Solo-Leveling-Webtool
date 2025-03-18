import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import LoginModal from './LoginModal';

function Home() {
  const theme = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);

  const handleLogin = (profileData) => {
    setProfile(profileData);
    setLoggedIn(true);
  };

  return (
    <div>
      {/* Login Modal wird angezeigt, solange nicht eingeloggt */}
      <LoginModal show={!loggedIn} onLogin={handleLogin} />

      {/* Hauptinhalt: Wird nur angezeigt, wenn eingeloggt (ohne Blur und ohne Systeminfo) */}
      {loggedIn && (
        <Box
          sx={{
            backgroundColor: '#252420',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Navigation (4 Vierecke) */}
          
          <Box
            sx={{
              position: 'absolute',
              width: '622px',
              height: '500px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: 'none'
            }}
          >
            <Grid2 container spacing={2} sx={{ height: '100%' }}>
              <Grid2 xs={6}>
                <Link to="/tasks" style={{ textDecoration: 'none' }}>
                  <Box sx={{
                    height: '250px',
                    width: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #CFA63D' }
                  }}>
                    Tasks
                  </Box>
                </Link>
              </Grid2>
              <Grid2 xs={6}>
                <Link to="/Skills" style={{ textDecoration: 'none' }}>
                  <Box sx={{
                    height: '250px',
                    width: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #CFA63D' }
                  }}>
                    Skills
                  </Box>
                </Link>
              </Grid2>
              <Grid2 xs={6}>
                <Link to="/achievements" style={{ textDecoration: 'none' }}>
                  <Box sx={{
                    height: '250px',
                    width: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #CFA63D' }
                  }}>
                    Achievements
                  </Box>
                </Link>
              </Grid2>
              <Grid2 xs={6}>
                <Link to="/about" style={{ textDecoration: 'none' }}>
                  <Box sx={{
                    height: '250px',
                    width: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #CFA63D' }
                  }}>
                    About me
                  </Box>
                </Link>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
        
      )}
      
    </div>
  );
}

export default Home;
