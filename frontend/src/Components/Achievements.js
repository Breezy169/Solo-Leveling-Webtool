import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Import Grid2
import gojo from '../Images/gojo.jpg';
import { Link } from 'react-router-dom'; // Import Link
import yuji from '../Images/yuji.jpg'; 
import ayanokoji from '../Images/ayanokoji.jpg';

/**
 * Home component displays the main page with a grid layout containing four sections.
 *
 * @returns {JSX.Element} - Returns the JSX for the Home component.
 */
function Achievements() {
  const [profile, setProfile] = useState(null); // Initialize profile as null

  const fetchProfiles = async () => {
    const response = await fetch('http://localhost:5000/api/profile');
    const data = await response.json();
    // Assuming you want to display the first profile, adjust accordingly
    setProfile(data.length > 0 ? data[0] : null); // Set the first profile if available
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Destructure profile fields if available
  const { name = '', age = '', level = '', rank = '', title = '' } = profile || {};

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#30324a',
          minHeight: '100vh',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            padding: '10px',
            height: '150px',
            width: '250px',
            display: 'flex',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            border: 1.3,
            color: '#f2b5d5',
            left: '3%',
            top: '5%',
            borderRadius: '8px',
            flexDirection: 'column', // Ensures content is stacked
          }}
        >
          <img
            alt=""
            style={{
              position: 'absolute', // Position the image absolutely
              top: '25px', // Adjust vertical position
              left: '25px', // Adjust horizontal position
              width: '120px', // Set a fixed width for the image
              height: 'auto', // Maintain aspect ratio
              border: 1,
              borderRadius: '150px',
            }}
            src={gojo}
          />
          <List sx={{ color: '#f2b5d5', padding: 0, left: '20%' }}> {/* Remove default padding */}
            <ListItem sx={{ padding: '2px 0' }}> {/* Adjust item padding */}
              <ListItemText
                primary={<Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>Name: {name}</Typography>} // Bold text
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>Age: {age}</Typography>} // Bold text
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>Level: {level}</Typography>} // Bold text
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>Rank: {rank}</Typography>} // Bold text
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>Title: {title}</Typography>} // Bold text
              />
            </ListItem>
            
          </List>
        </Box>
        {/* Outer container Box without visible border */}
        <Box
          sx={{
            width: '419px',     // Outer container width
            height: '300px',    // Outer container height
            border: 'none',     // No outer border
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center', 
            fontWeight: 'bold'
          }}
        >
          {/* 2x2 Grid layout */}
          <Grid2 container spacing={2} sx={{ height: '100%'}}>
            <Grid2 xs={6}>
            <Link to="/tasks" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  height: '150px',
                  width: '200px',
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
              <Link to="/career" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    height: '150px',
                    width: '200px',
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
                  Career
                </Box>
              </Link>
            </Grid2>
            <Grid2 xs={6}>
              <Link to="/achievements" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    height: '150px',
                    width: '200px',
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
                    height: '150px',
                    width: '200px',
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

export default Achievements;
