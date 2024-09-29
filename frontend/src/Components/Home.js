import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, LinearProgress  } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Import Grid2
import gojo from '../Images/gojo.jpg';
import { Link } from 'react-router-dom'; // Import Link

/**
 * Home component displays the main page with a grid layout containing four sections.
 *
 * @returns {JSX.Element} - Returns the JSX for the Home component.
 */
function Home() {
  const [profile, setProfile] = useState(null); // Initialize profile as null

  const fetchProfiles = async () => {
    const response = await fetch('http://localhost:5000/api/profile');
    const data = await response.json();
    setProfile(data.length > 0 ? data[0] : null); // Set the first profile if available
  };

  const updateLevelIfNeeded = async () => {
    if (profile) {
      const { xp, max_xp, level } = profile;

      if (xp >= max_xp) {
        // Increment level and update XP
        const newLevel = level + 1;
        const newXP = 0 // Remainder after leveling up

        // Update the database
        await fetch('http://localhost:5000/api/profile/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level: newLevel, xp: newXP }),
        });
        
        // Refresh profile
        fetchProfiles();
      }
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    updateLevelIfNeeded();
  }, [profile]);

  // Destructure profile fields if available
  const { name = '', age = '', level = '', rank = '', title = '', xp = 0, max_xp = 1000*(level**1.15)} = profile || {};

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#30324a',
          minHeight: '100vh',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            padding: '10px',
            height: '250px',
            width: '450px',
            display: 'flex',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            border: 1.3,
            color: '#f2b5d5',
            left: '3%',
            top: '5%',
            borderRadius: '16px',
            flexDirection: 'column', // Ensures content is stacked
          }}
        >
          <img
            alt=""
            style={{
              position: 'absolute', // Position the image absolutely
              top: '10px', // Adjust vertical position
              left: '15px', // Adjust horizontal position
              width: '200px', // Set a fixed width for the image
              height: 'auto', // Maintain aspect ratio
              border: 1,
              borderRadius: '150px',
            }}
            src={gojo}
          />
          <List sx={{ color: '#f2b5d5', padding: 0, left: '20%' }}>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Name: {profile?.name}</Typography>}
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Age: {profile?.age}</Typography>}
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Level: {profile?.level}</Typography>}
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Rank: {profile?.rank}</Typography>}
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Title: {profile?.title}</Typography>}
              />
            </ListItem>
          </List>

          {/* Progress Bar */}
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>
            XP: {profile?.xp}/{Math.floor(profile?.level ** 1.15 * 1000)}
          </Typography>
          <LinearProgress variant="determinate" value={(profile?.xp / Math.floor(profile?.level ** 1.15 * 1000)) * 100} sx={{ width: '100%', height: '10px' }} />
        </Box>

        {/* Outer container Box without visible border */}
        <Box
          sx={{
            width: '622px',     // Outer container width
            height: '500px',    // Outer container height
            border: 'none',     // No outer border
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold'
          }}
        >
          {/* 2x2 Grid layout */}
          <Grid2 container spacing={2} sx={{ height: '100%' }}>
            <Grid2 xs={6}>
              <Link to="/tasks" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    height: '250px',
                    width: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: '#f2b5d5',
                    transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effects
                    '&:hover': {
                      transform: 'scale(1.05)', // Slightly increase size
                      boxShadow: '0 0 10px #f2b5d5', // Glow effect
                    }
                  }}
                >
                  Tasks
                </Box>
              </Link>
            </Grid2>
            <Grid2 xs={6}>
              <Link to="/fitness" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    height: '250px',
                    width: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: '#f2b5d5',
                    transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effects
                    '&:hover': {
                      transform: 'scale(1.05)', // Slightly increase size
                      boxShadow: '0 0 10px #f2b5d5', // Glow effect
                    }
                  }}
                >
                  Fitness
                </Box>
              </Link>
            </Grid2>
            <Grid2 xs={6}>
              <Link to="/achievements" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    height: '250px',
                    width: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: '#f2b5d5',
                    transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effects
                    '&:hover': {
                      transform: 'scale(1.05)', // Slightly increase size
                      boxShadow: '0 0 10px #f2b5d5', // Glow effect
                    }
                  }}
                >
                  Achievements
                </Box>
              </Link>
            </Grid2>
            <Grid2 xs={6}>
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    height: '250px',
                    width: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: '#f2b5d5',
                    transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transition for hover effects
                    '&:hover': {
                      transform: 'scale(1.05)', // Slightly increase size
                      boxShadow: '0 0 10px #f2b5d5', // Glow effect
                    }
                  }}
                >
                  About me
                </Box>
              </Link>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </div>
  );
}

export default Home;
