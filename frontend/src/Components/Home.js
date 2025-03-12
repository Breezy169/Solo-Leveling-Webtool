import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, LinearProgress, TextField, Button, Paper } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Import Grid2
import gojo from '../Images/gojo.jpg';
import { Link } from 'react-router-dom'; // Import Link
import Settings from './Settings';
function Home() {
  const [profile, setProfile] = useState(null); // Initialize profile as null
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  // const [loginData, setLoginData] = useState({ username: '', password: '' }); // State for login form data

  const fetchProfiles = async () => {
    const response = await fetch('http://localhost:5000/api/profile');
    const data = await response.json();
    setProfile(data.length > 0 ? data[0] : null); // Set the first profile if available
  };


  const updateLevelIfNeeded = async () => {
    if (profile) {
      const { xp, max_xp, level } = profile;
      if (xp >= max_xp) {
        const newLevel = level + 1;
        const newXP = 0;
        await fetch('http://localhost:5000/api/profile/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level: newLevel, xp: newXP }),
        });
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

  // const handleLoginChange = (e) => {
  //   const { name, value } = e.target;
  //   setLoginData((prevData) => ({ ...prevData, [name]: value }));
  // };

  // const handleLoginSubmit = async (e) => {
  //   e.preventDefault();
  //   const response = await fetch('http://localhost:5000/api/login');
  //   const data = await response.json();
  //   setLoginData(data)
  //   if (loginData.username === 'user' && loginData.password === 'password') {
  //     setIsLoggedIn(true);
  //   } else {
  //     alert('Invalid credentials');
  //   }
  // };



  return (
    <div>
      {/* Blur the background if not logged in */}
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
              top: '30px', // Adjust vertical position
              left: '25px', // Adjust horizontal position
              width: '200px', // Set a fixed width for the image
              height: 'auto', // Maintain aspect ratio
              border: 1,
              borderRadius: '150px',
            }}
            src={gojo}
          />
          <Box sx={{ marginLeft: '410px'}}>
            <Settings />
          </Box>
          <List sx={{bottom: '10px', color: '#f2b5d5', padding: 0, left: '15%' }}>
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
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px',  marginBottom: '5px' }}>
            XP: {profile?.xp}/{Math.floor(profile?.level ** 1.15 * 1000)}
          </Typography>
          <LinearProgress color='secondary' variant="determinate" value={(profile?.xp / Math.floor(profile?.level ** 1.15 * 1000)) * 100} sx={{ width: '100%', height: '10px' }} />
         
        </Box>
        <Box sx={{ width: '622px', height: '500px', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
          <Grid2 container spacing={2} sx={{ height: '100%' }}>
            <Grid2 xs={6}><Link to="/tasks" style={{ textDecoration: 'none' }}><Box sx={{ height: '250px', width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 1, color: '#f2b5d5', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #f2b5d5' }}}>Tasks</Box></Link></Grid2>
            <Grid2 xs={6}><Link to="/career" style={{ textDecoration: 'none' }}><Box sx={{ height: '250px', width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 1, color: '#f2b5d5', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #f2b5d5' }}}>Career</Box></Link></Grid2>
            <Grid2 xs={6}><Link to="/achievements" style={{ textDecoration: 'none' }}><Box sx={{ height: '250px', width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 1, color: '#f2b5d5', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #f2b5d5' }}}>Achievements</Box></Link></Grid2>
            <Grid2 xs={6}><Link to="/about" style={{ textDecoration: 'none' }}><Box sx={{ height: '250px', width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 1, color: '#f2b5d5', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #f2b5d5' }}}>About me</Box></Link></Grid2>
          </Grid2>
        </Box>
      </Box>

      {/* Login screen */}
      {/* {!isLoggedIn && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            opacity: 0.7 // Semi-transparent overlay
          }}
        >
          <Paper sx={{ padding: '20px', borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ marginBottom: '10px' }}>Login</Typography>
            <form onSubmit={handleLoginSubmit}>
              <TextField
                name="username"
                label="Username"
                variant="outlined"
                fullWidth
                value={loginData.username}
                onChange={handleLoginChange}
                sx={{ marginBottom: '10px' }}
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={loginData.password}
                onChange={handleLoginChange}
                sx={{ marginBottom: '20px' }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
            </form>
          </Paper>
        </Box> 
      )}*/}
    </div>
  );
}

export default Home;
