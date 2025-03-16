import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, LinearProgress, TextField, Button, Paper } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Import Grid2
import gojo from '../Images/gojo.jpg';
import { Link } from 'react-router-dom'; // Import Link
import Settings from './Settings';
import systeminfo from '../Images/systeminfo.png'
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
                 display: 'flex',
                 backgroundColor: '#30324a',
                 minHeight: '100vh',
                 flexDirection: 'column',
                 position: 'relative',
               }}
             >
               {/* Settings button in top-right corner */}
              
       
               {/* 
                 1) Container with systeminfo as background
                 2) Profile data layered on top (foreground)
               */}
               <Box
                 sx={{
                   position: 'relative',
                   margin: '40px auto 0',
                   width: '512px', // Adjust to match your image's size
                   height: '512px',
                  
                   
                 }}
               >
                 <img
                   alt="System Info"
                   src={systeminfo}
                   style={{
                     position: 'absolute',
                     top: 0,
                     right: '125%',
                     width: 'auto',
                     height: '600px',
                     zIndex: 0
                   }}
                 />
                  <Box
                   sx={{
                     position: 'absolute',
                     top: '13px',   // Adjust to align with top line in the image
                     right: '142%', // Adjust to position text horizontally
                     zIndex: 1,
                     color: '#CFA63D',
                     width: '300px',
                     
                    
                   }}
                 >
                   <Typography sx={{ fontSize: '30px', fontWeight: 'bold',  lineHeight: 1.7}}>
                    STATUS
                   </Typography>
                 </Box>
               
                 {/* -- First Line (e.g. Name / Age) -- */}
         
                 
                  <Box
                   sx={{
                     position: 'absolute',
                     top: '69px',   // Adjust to align with top line in the image
                     right: '142%', // Adjust to position text horizontally
                     zIndex: 1,
                     color: '#CFA63D',
                     width: '300px',
                    
                   }}
                 >
                   <Typography sx={{ fontSize: '19px', fontWeight: 'bold',  lineHeight: 1.7}}>
                     NAME: {profile?.name}<br></br>
                     AGE: {profile?.age} <br></br> 
                     RANK: {profile?.rank}  <br></br>
                     TITLE: {profile?.title} 
                   </Typography>
                   <Box sx={{ position: 'absolute', right: '-60px', top: '-40px',zIndex: 999 }}>
                    <Settings />
                   </Box>
                  
                  <Typography sx={{position: 'absolute', top:'140px', fontSize: '19px', fontWeight: 'bold',  lineHeight: 1.7}}>
                     <br></br>
                     HP: {((profile?.level)*40)} <br></br>
                     FATIGUE: {((profile?.age)*1.013).toFixed(2)}
                    
                   </Typography>
                   <Typography sx={{position: 'absolute', fontSize: '19px', fontWeight: 'bold',  lineHeight: 1.7, top: '250px'}}>
                     <br></br>
                     STR:  {profile?.strength}  
                     <br></br>
                     PERCEPTION: {profile?.perception} 
                     <br></br>
                     DEX:  {profile?.agility} 
       
                   </Typography>
                 </Box>
                 <Box
                   sx={{
                     position: 'absolute',
                     top: '71px',   // Adjust to align with top line in the image
                     right: '105%', // Adjust to position text horizontally
                     zIndex: 1,
                     color: '#CFA63D',
                     width: '300px',
                    
                   }}
                 >
                   <Typography sx={{ fontSize: '19px', fontWeight: 'bold'}}>
                    LV. {profile?.level}<br></br>
                    XP: {profile?.xp}/{Math.floor(profile?.level ** 1.15 * 1000)}
                    <LinearProgress
                     variant="determinate"
                     value={
                       profile?.xp
                         ? (profile.xp / Math.floor(profile.level ** 1.15 * 1000)) * 100
                         : 0
                     }
                     sx={{
                       width: '150px',
                       height: '10px',
                       marginTop: '5px',
                       backgroundColor: 'rgba(0, 0, 0, 0.1)', // Optional: change the track color
                       '& .MuiLinearProgress-bar': {
                         backgroundColor: 'gold', // or use '#FFD700'
                       },
                     }}
                   />
                   </Typography>
                   <Typography sx={{position: 'absolute', fontSize: '19px', fontWeight: 'bold',  lineHeight: 1.7, top: '139px'}}>
                     <br></br>
                     FOCUS:  {((profile?.intelligence)*120)}  
                   </Typography>
                   <Typography sx={{position: 'absolute', fontSize: '19px', fontWeight: 'bold',  lineHeight: 1.7, top: '247px'}}>
                     <br></br>
                     STAMINA:  {profile?.stamina}  
                     <br></br>
                     INT: {profile?.intelligence} 
                     <br></br>
                     AP:  {((profile?.ap)*30)} 
       
       
                   </Typography>
                 </Box>
         
        
              
               </Box>
        </Box>
        <Box sx={{position: 'absolute', width: '622px', height: '500px', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
          <Grid2 container spacing={2} sx={{ height: '100%' }}>
            <Grid2 xs={6}><Link to="/tasks" style={{ textDecoration: 'none' }}><Box sx={{ height: '250px', width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 1, color: '#CFA63D', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #CFA63D' }}}>Tasks</Box></Link></Grid2>
            <Grid2 xs={6}><Link to="/career" style={{ textDecoration: 'none' }}><Box sx={{ height: '250px', width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 1, color: '#CFA63D', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #CFA63D' }}}>Career</Box></Link></Grid2>
            <Grid2 xs={6}><Link to="/achievements" style={{ textDecoration: 'none' }}><Box sx={{ height: '250px', width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 1, color: '#CFA63D', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #CFA63D' }}}>Achievements</Box></Link></Grid2>
            <Grid2 xs={6}><Link to="/about" style={{ textDecoration: 'none' }}><Box sx={{ height: '250px', width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 1, color: '#CFA63D', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #CFA63D' }}}>About me</Box></Link></Grid2>
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
