import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import Settings from './Settings';
import systeminfo from '../Images/systeminfo.png';
import systeminfopurple2 from '../Images/systeminfopurple2.png';
import { ProfileContext } from './ProfileContext';

function Skills() {
  const { profile, refreshProfile } = useContext(ProfileContext)
  const [skills, setSkills] = useState([]);



  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setSkills(data);
      await refreshProfile();
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  let imgClasses = [];
  if (skills) {
    switch (skills.level) {
      case "2":
        imgClasses.push("burning-border");
        break;
      case "3":
        imgClasses.push("super-border");
        break;
      // weitere Fälle können hier hinzugefügt werden
      default:
        break;
    }
  
    // Zusätzliche Bedingung, z.B. basierend auf Level
    if (skills.level > 5) {
      imgClasses.push("high-level-border");
    }
  }
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#252420',
          minHeight: '100vh',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Profil- und Systeminfo-Anzeige */}
        <Box
          sx={{
            position: 'relative',
            margin: '40px auto 0',
            width: '512px',
            height: '512px',
          }}
        >
          <img
            alt="System Info"
            src={profile?.level >= 25 ? systeminfopurple2 : systeminfo}
            style={{
              position: 'absolute',
              top: 0,
              right: '125%',
              width: 'auto',
              height: '600px',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '13px',
              right: '142%',
              zIndex: 1,
              color: profile?.level >= 25 ? '#CF9FFF'  : '#CFA63D',
              width: '300px',
            }}
          >
            <Typography sx={{ fontSize: '30px', fontWeight: 'bold', lineHeight: 1.7 }}>
              STATUS
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '69px',
              right: '142%',
              zIndex: 1,
              color: profile?.level >= 25 ? '#CF9FFF'  : '#CFA63D',
              width: '300px',
            }}
          >
            <Typography sx={{ fontSize: '19px', fontWeight: 'bold', lineHeight: 1.7 }}>
              NAME: {profile?.name}
              <br />
              AGE: {profile?.age}
              <br />
              RANK: {profile?.rank}
              <br />
              TITLE: {profile?.title}
            </Typography>
             {profile?.loggedIn === 'yes' && (
                <Box sx={{ position: 'absolute', right: '-60px', top: '-40px', zIndex: 999 }}>
                  <Settings />
                </Box>
              )}
            <Typography
              sx={{
                position: 'absolute',
                top: '140px',
                fontSize: '19px',
                fontWeight: 'bold',
                lineHeight: 1.7,
              }}
            >
              <br />
              HP: {profile ? profile.level * 40 : 0}
              <br />
              FATIGUE: {profile ? (profile.age * 1.013).toFixed(2) + "%" : ""}
            </Typography>
            <Typography
              sx={{
                position: 'absolute',
                fontSize: '19px',
                fontWeight: 'bold',
                lineHeight: 1.7,
                top: '250px',
              }}
            >
              <br />
              STR: {profile?.strength}
              <br />
              PERCEPTION: {profile?.perception}
              <br />
              DEX: {profile?.agility}
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '71px',
              right: '105%',
              zIndex: 1,
              color: profile?.level >= 25 ? '#CF9FFF'  : '#CFA63D',
              width: '300px',
            }}
          >
            <Typography sx={{ fontSize: '19px', fontWeight: 'bold' }}>
              LV. {profile?.level}
              <br />
              XP: {profile?.xp}/{profile ? Math.floor(profile.level ** 1.15 * 1000) : 0}
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
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: profile?.level >= 25 ? ' #CF9FFF'  : ' #CFA63D',
                  },
                }}
              />
            </Typography>
            <Typography
              sx={{
                position: 'absolute',
                fontSize: '19px',
                fontWeight: 'bold',
                lineHeight: 1.7,
                top: '139px',
              }}
            >
              <br />
              FOCUS: {profile ? ((profile.intelligence + profile.perception) / 20).toFixed(2) + "%" : ""}
            </Typography>
            <Typography
              sx={{
                position: 'absolute',
                fontSize: '19px',
                fontWeight: 'bold',
                lineHeight: 1.7,
                top: '247px',
              }}
            >
              <br />
              STAMINA: {profile?.stamina}
              <br />
              INT: {profile?.intelligence}
              <br />
              AP: {profile ? profile.ap * 30 : 0}
            </Typography>
          </Box>
        </Box>

        {/* Skills-Bereich: Nur Skills anzeigen */}
        <Box
          sx={{
            position: 'absolute',
            width: '1100px',
            height: '625px',
            padding: '20px',
            overflowY: 'scroll',
            color: profile?.level >= 25 ? '#CF9FFF'  : '#CFA63D',
            top: '50px',
            right: '150px',
          }}
        >
           <Typography sx={{ marginBottom: '10px', fontSize: '20px' }}>UNLOCKED SKILLS </Typography>
          {skills.map((skill) => (
            <Box
              key={skill[0]}
              sx={{
                marginTop: '40px',
                marginBottom: '10px',
                border: profile?.level >= 25 ? '1px solid #CF9FFF'  : '1px solid #CFA63D',
                padding: '5px',
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: '10px',  color: 'CF9FFF' }}>
                Skill: {skill?.name}
              </Typography>
              <Typography>Lv. {skill?.level < 5 ? skill?.level : "Max."}</Typography>
              <Typography>Cost: Focus -{(skill?.cost/1000).toFixed(2)+"%"}</Typography>
              <Typography>Description: {skill?.description}</Typography>
            </Box>
          ))}
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
                    color: profile?.level >= 25 ? '#CF9FFF'  : '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)',  boxShadow: profile?.level >= 25 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D' },
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
                    color: profile?.level >= 25 ? '#CF9FFF'  : '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)',  boxShadow: profile?.level >= 25 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D' },
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
                     boxShadow: profile?.level >= 25 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D',
                    color: profile?.level >= 25 ? '#CF9FFF'  : '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)',  boxShadow: profile?.level >= 25 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D' },
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
                    color: profile?.level >= 25 ? '#CF9FFF'  : '#CFA63D',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'scale(1.05)',  boxShadow: profile?.level >= 25 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D' },
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

export default Skills;
