import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Collapse, LinearProgress, Button } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResetIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import Settings from './Settings';
import '../Css/borders.css';
import systeminfo from '../Images/systeminfo.png';
import { useTheme } from '@mui/material/styles';
import AchievementModal from './AchievementModal.js';

function Achievements() {
  const theme = useTheme();
  const [achievements, setAchievements] = useState([]);
  const [expandedAchievement, setExpandedAchievement] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  // Filter: "all" = active (not completed), "completed" = done
  const [selectedAchievementFilter, setSelectedAchievementFilter] = useState('all');
  const [skills, setSkills] = useState([]);

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProfile(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/achievements');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchAchievements();
    fetchSkills();
  }, []);

  const handleReset = () => {
    fetchAchievements();
    setExpandedAchievement(null);
  };

  const handleAddAchievement = async (achievement) => {
    try {
      const response = await fetch('http://localhost:5000/api/addachievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievement)
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Achievement erfolgreich hinzugefügt!`);
        fetchAchievements();
      } else {
        alert('Fehler beim Hinzufügen des Achievements.');
      }
    } catch (error) {
      console.error('Fehler:', error);
      alert('Ein Fehler ist aufgetreten.');
    }
  };

  // Helper function to display reward information
  const getRewardDisplay = (achievement) => {
    if (achievement.rewardType === 'EXP') {
      return `EXP: ${achievement.reward}`;
    } else if (achievement.rewardType === 'Title') {
      return `Title: ${achievement.reward}`;
    } else if (achievement.rewardType === 'Skill') {
      let skillObj;
      if (achievement.reward && typeof achievement.reward === 'object' && achievement.reward.name) {
        skillObj = achievement.reward;
      } else {
        try {
          skillObj = JSON.parse(achievement.reward);
        } catch (error) {
          return `Skill: ${achievement.reward}`;
        }
      }
      if (achievement.increaseLevel && achievement.increaseLevel.toLowerCase() === 'ja') {
        return `Reward: ${skillObj.name} Lv. ${parseInt(skillObj.level, 10) + 1}`;
      } else {
        return `Skill: ${skillObj.name}`;
      }
    } else {
      return `Reward: ${achievement.reward}`;
    }
  };

  // Filter achievements based on the selected filter
  const filteredAchievements = achievements.filter(achievement => {
    if (selectedAchievementFilter === 'all') {
      return achievement.status !== 'done';
    } else if (selectedAchievementFilter === 'completed') {
      return achievement.status === 'done';
    }
    return true;
  });

  // New handler to increment achievement progress.
  // When progress reaches max_progress, the achievement is marked as done
  // and the reward logic (EXP, Title, Skill) is processed similar to tasks.
  const handleIncrementAchievement = async (achievement) => {
    try {
      const response = await fetch('http://localhost:5000/api/update_achievement_progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievement_id: achievement.id, progress: achievement.progress, increment: 1 })
      });
      const result = await response.json();
      if (response.ok) {
        // If the response message indicates the achievement is completed, process reward logic
        if (result.message && result.message.toLowerCase().includes("completed")) {
          alert("Achievement completed!");
          // Process reward logic
          if (achievement.rewardType === 'EXP' || (!achievement.rewardType && !isNaN(Number(achievement.reward)))) {
            const xpToAdd = Number(achievement.reward);
            let updatedXP = (profile?.xp || 0) + xpToAdd;
            let newLevel = profile?.level || 1;
            let xpNeededForNextLevel = Math.floor(newLevel ** 1.15 * 1000);
            while (updatedXP >= xpNeededForNextLevel) {
              newLevel++;
              updatedXP -= xpNeededForNextLevel;
              xpNeededForNextLevel = Math.floor(newLevel ** 1.15 * 1000);
            }
            await fetch('http://localhost:5000/api/profile/update', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ level: newLevel, xp: updatedXP }),
            });
          } else if (achievement.rewardType === 'Title') {
            await fetch('http://localhost:5000/api/addtitle', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: achievement.reward }),
            });
            window.alert(`Congratulations, you have unlocked\n${achievement.reward}`);
          } else if (achievement.rewardType === 'Skill') {
            if (achievement.increaseLevel && achievement.increaseLevel.toLowerCase() === 'ja') {
              let rewardObj = achievement.reward;
              if (typeof rewardObj === "string") {
                try {
                  rewardObj = JSON.parse(rewardObj);
                } catch (error) {
                  console.error("Fehler beim Parsen des Skill-Rewards:", error);
                  rewardObj = {};
                }
              }
              if (!rewardObj.id || !rewardObj.level) {
                window.alert("Fehlende Skill-Daten (id oder level).");
                return;
              }
              // Here you may want to verify that the skill is not already at max level
              await fetch('http://localhost:5000/api/update_skill_level', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skill_id: rewardObj.id, level: rewardObj.level }),
              });
              window.alert('Skill-Level erfolgreich erhöht!');
            } else {
              await fetch('http://localhost:5000/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(achievement.reward),
              });
              window.alert('Skill erfolgreich hinzugefügt!');
            }
          }
          fetchProfiles();
        }
        fetchAchievements();
      } else {
        alert("Fehler beim Aktualisieren des Fortschritts: " + result.error);
      }
    } catch (error) {
      console.error("Error updating achievement progress:", error);
    }
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
        }}
      >
        {/* Profile and System Info Display */}
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
              top: '13px',
              right: '142%',
              zIndex: 1,
              color: '#CFA63D',
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
              color: '#CFA63D',
              width: '300px',
            }}
          >
            <Typography sx={{ fontSize: '19px', fontWeight: 'bold', lineHeight: 1.7 }}>
              NAME: {profile?.name}<br/>
              AGE: {profile?.age} <br/>
              RANK: {profile?.rank}  <br/>
              TITLE: {profile?.title}
            </Typography>
            <Box sx={{ position: 'absolute', right: '-60px', top: '-40px', zIndex: 999 }}>
              <Settings />
            </Box>
            <Typography sx={{ position: 'absolute', top: '140px', fontSize: '19px', fontWeight: 'bold', lineHeight: 1.7 }}>
              <br/>
              HP: {profile ? profile.level * 40 : 0} <br/>
              FATIGUE: {profile ? (profile.age * 1.013).toFixed(2) + "%" : ""}
            </Typography>
            <Typography sx={{ position: 'absolute', fontSize: '19px', fontWeight: 'bold', lineHeight: 1.7, top: '250px' }}>
              <br/>
              STR: {profile?.strength} <br/>
              PERCEPTION: {profile?.perception} <br/>
              DEX: {profile?.agility}
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '71px',
              right: '105%',
              zIndex: 1,
              color: '#CFA63D',
              width: '300px',
            }}
          >
            <Typography sx={{ fontSize: '19px', fontWeight: 'bold' }}>
              LV. {profile?.level}<br/>
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
                    backgroundColor: 'gold',
                  },
                }}
              />
            </Typography>
            <Typography sx={{ position: 'absolute', fontSize: '19px', fontWeight: 'bold', lineHeight: 1.7, top: '139px' }}>
              <br/>
              FOCUS: {profile ? ((profile.intelligence + profile.perception) / 20).toFixed(2) + "%" : ""}
            </Typography>
            <Typography sx={{ position: 'absolute', fontSize: '19px', fontWeight: 'bold', lineHeight: 1.7, top: '247px' }}>
              <br/>
              STAMINA: {profile?.stamina} <br/>
              INT: {profile?.intelligence} <br/>
              AP: {profile ? profile.ap * 30 : 0}
            </Typography>
          </Box>
        </Box>

        {/* Achievements Section */}
        <Box
          sx={{
            position: 'absolute',
            width: '1100px',
            height: '625px',
            display: 'flex',
            fontWeight: 'bold',
            color: '#CFA63D',
            top: '50px',
            right: '150px',
          }}
        >
          {/* Left Column: Filter Options & Add Button */}
          <Box
            sx={{
              width: '20%',
              padding: '10px',
              borderRight: '1px solid #CFA63D',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <IconButton
              onClick={() => setIsAchievementModalOpen(true)}
              sx={{ color: '#CFA63D', marginBottom: '10px', left: '60px' }}
            >
              <AddIcon />
            </IconButton>
            <Box sx={{ width: '100%', marginTop: '20px' }}>
              <Typography
                onClick={() => setSelectedAchievementFilter('all')}
                sx={{
                  fontWeight: 'bold',
                  fontSize: '22px',
                  cursor: 'pointer',
                  border: selectedAchievementFilter === 'all' ? 1 : 'none',
                  boxShadow: selectedAchievementFilter === 'all' ? '0 0 10px #CFA63D' : 'none',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 0 10px #CFA63D',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                    boxShadow: '0 0 5px #CFA63D',
                  },
                  textAlign: 'center',
                  padding: '5px',
                }}
              >
                All Achievements
              </Typography>
              <Typography
                onClick={() => setSelectedAchievementFilter('completed')}
                sx={{
                  fontWeight: 'bold',
                  fontSize: '22px',
                  cursor: 'pointer',
                  border: selectedAchievementFilter === 'completed' ? 1 : 'none',
                  boxShadow: selectedAchievementFilter === 'completed' ? '0 0 10px #CFA63D' : 'none',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 0 10px #CFA63D',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                    boxShadow: '0 0 5px #CFA63D',
                  },
                  textAlign: 'center',
                  padding: '5px',
                  marginTop: '10px'
                }}
              >
                Completed Achievements
              </Typography>
            </Box>
          </Box>

          {/* Right Column: Achievements List */}
          <Box
            sx={{
              width: '100%',
              padding: '20px',
              overflowY: 'scroll',
              height: '100%',
              color: '#CFA63D',
              position: 'relative',
            }}
          >
            <IconButton
              onClick={handleReset}
              sx={{
                border: 1,
                position: 'absolute',
                top: '5px',
                right: '10px',
                color: '#CFA63D',
              }}
            >
              <ResetIcon />
            </IconButton>

            {filteredAchievements.map((achievement, index) => (
              <Box
                key={achievement.id}
                sx={{
                  position: 'relative',
                  marginTop: '40px',
                  marginBottom: '10px',
                  border: achievement.status === 'done' ? '3px solid black' : '1px solid #CFA63D',
                  padding: '5px'
                }}
              >
                {/* Inner content which is blurred if done */}
                <Box sx={{ filter: achievement.status === 'done' ? 'blur(3px)' : 'none' }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => setExpandedAchievement(expandedAchievement === index ? null : index)}
                  >
                    <Typography>{achievement.name}</Typography>
                    <Box>
                      {/* Plus-Button to increment achievement progress */}
                      <IconButton
                        onClick={() => handleIncrementAchievement(achievement)}
                        disabled={achievement.progress >= achievement.max_progress}
                        sx={{ color: achievement.status === 'done' ? 'black' : '#CFA63D' }}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton onClick={() => setExpandedAchievement(expandedAchievement === index ? null : index)}>
                        <ExpandMoreIcon sx={{ color: achievement.status === 'done' ? 'black' : '#CFA63D' }} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: achievement.status === 'done' ? 'black' : '#CFA63D', fontWeight: 'bold' }}>
                    {achievement.description} <br/>
                    {getRewardDisplay(achievement)} <br/>
                    Status: {achievement.status === 'done' ? 'completed' : 'not completed'} <br/>
                    Progress: {achievement.progress}/{achievement.max_progress}
                  </Typography>
            
                </Box>
                {/* Overlay for completed achievements */}
                {achievement.status === 'done' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                      padding: '10px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      color: '#fff'
                    }}
                  >
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', mt: 1 }}>
                      COMPLETED:
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                      {achievement.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold'}}>
                      {getRewardDisplay(achievement).replace(/^(EXP: |Title: |Skill: )/, '')}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
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
              <Link to="/Tasks" style={{ textDecoration: 'none' }}>
                <Box sx={{
                  height: '50px',
                  width: '150px',
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
              <Link to="/achievements" style={{ textDecoration: 'none' }}>
                <Box sx={{
                  height: '50px',
                  width: '150px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: 1,
                  boxShadow: '0 0 10px #CFA63D',
                  color: '#CFA63D',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #CFA63D' }
                }}>
                  Achievements
                </Box>
              </Link>
            </Grid2>
            <Grid2 xs={6}>
              <Link to="/Skills" style={{ textDecoration: 'none' }}>
                <Box sx={{
                  height: '50px',
                  width: '150px',
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
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <Box sx={{
                  height: '50px',
                  width: '150px',
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

      <AchievementModal
        show={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        onSubmit={handleAddAchievement}
      />
    </div>
  );
}

export default Achievements;
