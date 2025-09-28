import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Collapse } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function AboutMe() {
  // Zustand für den expandierten Inhalt
  const [expandedAboutMe, setExpandedAboutMe] = useState(false);
  const [profile, setProfile] = useState(null);

  const [expandedBox1, setExpandedBox1] = useState(false);
  const [expandedBox2, setExpandedBox2] = useState(false);
  const [expandedBox3, setExpandedBox3] = useState(false);

  // Toggle-Funktionen
  const toggleExpandedAboutMe = () => setExpandedAboutMe(prev => !prev);
  const toggleExpandedBox1 = () => setExpandedBox1(prev => !prev);
  const fetchProfiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProfile(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };



  useEffect(() => {
    fetchProfiles();
  }, []);
  // Toggle-Funktion
  const toggleExpanded = () => {
    setExpandedAboutMe(prev => !prev);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#252420',
          minHeight: '100vh',
          flexDirection: 'column',
          position: 'relative',
          alignItems: 'center',
          alignContent: 'center'
        }}
      >
        {/* Container, der das Expand-Icon und den erweiterten Inhalt enthält */}
        <Box
          sx={{
            width: '550px',
            borderBottom: profile?.level >= 25 ? '1px solid #CF9FFF'  :  '1px solid #CFA63D',
            color: profile?.level >= 25 ? '#CF9FFF'  :  '#CFA63D',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            paddingTop: '20px'
          }}
        >
          {/* Header mit Expand-Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50px',
            }}
          >
            <Typography variant="h6">Ich bin...</Typography>
            <IconButton onClick={toggleExpanded}>
              <ExpandMoreIcon sx={{ color: profile?.level >= 25 ? '#CF9FFF'  :  '#CFA63D' }} />
            </IconButton>
          </Box>
          {/* Erweiterter Inhalt, der sich smooth einblendet */}
          
          <Collapse in={expandedAboutMe} timeout="auto" unmountOnExit>
            <Box
              sx={{
                padding: '20px',
              }}
            >
              <Typography variant="body1">
                Bartu. <br></br>
                Ich bin 23 Jahre alt und komme ursprünglich aus der Türkei. Meine Geschichte geht auf 2011, als ich zum ersten Mal nach Deutschland mit der Absicht "ab jetzt lebe ich hier" umgezogen bin. 
              </Typography>
            </Box>
          </Collapse>
        </Box>

        <Box
          sx={{
            width: '550px',
            borderBottom: profile?.level >= 25 ? '1px solid #CF9FFF'  :  '1px solid #CFA63D',
            color: profile?.level >= 25 ? '#CF9FFF'  :  '#CFA63D',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            paddingTop: '50px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50px',
            }}
          >
            <Typography variant="h6">Box 1 Titel</Typography>
            <IconButton onClick={toggleExpandedBox1}>
              <ExpandMoreIcon sx={{ color: '#CFA63D' }} />
            </IconButton>
          </Box>
          <Collapse in={expandedBox1} timeout="auto" unmountOnExit>
            <Box sx={{ padding: '20px' }}>
              <Typography variant="body1">
                Inhalt der ersten zusätzlichen Box. Hier kannst du weitere Informationen anzeigen.
              </Typography>
            </Box>
          </Collapse>
        </Box>
        {/* Navigation */}
        <Box
          sx={{
            width: '722px',
            height: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: '800px',
            left: '20px',
            zIndex: 1000,
          }}
        >
          <Grid2 container spacing={2} sx={{ height: '100%' }}>
            <Grid2 xs={6}>
              <Link to="/tasks" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    height: '50px',
                    width: '150px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: profile?.level >= 25 ? '#CF9FFF'  :  '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: profile?.level >= 25 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D' },
                  }}
                >
                  Tasks
                </Box>
              </Link>
            </Grid2>
            <Grid2 xs={6}>
              <Link to="/achievements" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    height: '50px',
                    width: '150px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: profile?.level >= 25 ? '#CF9FFF'  :  '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: profile?.level >= 25 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D' },
                  }}
                >
                  Achievements
                </Box>
              </Link>
            </Grid2>
            <Grid2 xs={6}>
              <Link to="/skills" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    height: '50px',
                    width: '150px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    color: profile?.level >= 25 ? '#CF9FFF'  :  '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: profile?.level >= 25 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D' },
                  }}
                >
                  Skills
                </Box>
              </Link>
            </Grid2>
            <Grid2 xs={6}>
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    height: '50px',
                    width: '150px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: 1,
                    boxShadow: profile?.level >= 25 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D',
                    color: profile?.level >= 25 ? '#CF9FFF'  :  '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: profile?.level >= 25 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D' },
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

export default AboutMe;
