import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField, Select, MenuItem, InputLabel } from '@mui/material';

const AchievementModal = ({ show, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rewardType, setRewardType] = useState('EXP'); // Standard: EXP
  const [rewardValue, setRewardValue] = useState('');
  
  // Fields for Reward-Type "Skill"
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('1'); // Default level 1
  const [skillCost, setSkillCost] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  
  // New field: Increase Skill Level (ja/nein)
  const [increaseLevel, setIncreaseLevel] = useState("nein");

  // State for skills list from skills.db (for dropdown)
  const [skillsList, setSkillsList] = useState([]);
  // New state for the selected skill ID (dropdown)
  const [selectedSkillId, setSelectedSkillId] = useState('');

  // NEW: State for achievement progress fields
  const [progress, setProgress] = useState('0');      // Initial progress (default 0)
  const [maxProgress, setMaxProgress] = useState('100'); // Maximum progress (default 100)
  
  const [profile, setProfile] = useState(null);

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
  // When Reward-Type "Skill" is chosen, load the skills from the API
  useEffect(() => {
    if (rewardType === 'Skill') {
      fetch('http://localhost:5000/api/skills')
        .then(response => response.json())
        .then(data => {
          console.log("Fetched skills:", data);
          setSkillsList(data);
        })
        .catch(error => console.error('Error fetching skills:', error));
    }
    fetchProfiles();

  }, [rewardType]);

  // Automatically set the first skill as default if Increase Level is "ja"
  useEffect(() => {
    if (increaseLevel === 'ja' && skillsList.length > 0 && !selectedSkillId) {
      setSelectedSkillId(String(skillsList[0].id));
    }
  }, [increaseLevel, skillsList, selectedSkillId]);

  const handleSubmit = () => {
    if (!name || !description) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }
    let reward;
    if (rewardType === 'EXP') {
      if (!rewardValue) {
        alert("Bitte den EXP-Betrag angeben.");
        return;
      }
      reward = Number(rewardValue);
    } else if (rewardType === 'Title') {
      if (!rewardValue) {
        alert("Bitte den Title angeben.");
        return;
      }
      reward = rewardValue;
    } else if (rewardType === 'Skill') {
      if (increaseLevel === 'ja') {
        if (!selectedSkillId) {
          alert("Bitte einen Skill auswählen.");
          return;
        }
        // Find the skill by selected ID (comparing as number)
        const selectedSkill = skillsList.find(skill => skill.id === Number(selectedSkillId));
        if (!selectedSkill) {
          alert("Ausgewählter Skill nicht gefunden.");
          return;
        }
        reward = {
          id: selectedSkill.id,
          name: selectedSkill.name,
          level: selectedSkill.level,  // current level from DB
        };
      } else {
        if (!skillName || !skillLevel || !skillCost || !skillDescription) {
          alert("Bitte alle Skill-Felder ausfüllen.");
          return;
        }
        reward = {
          name: skillName,
          level: Number(skillLevel),
          cost: Number(skillCost),
          description: skillDescription,
        };
      }
    }
    const achievement = {
      name,
      description,
      rewardType,
      reward,
      // Include progress fields in CamelCase as expected by the backend
      progress: Number(progress),
      max_progress: Number(maxProgress),
      increaseLevel: rewardType === 'Skill' ? increaseLevel : 'nein'
    };
    onSubmit(achievement);
    // Reset fields
    setName('');
    setDescription('');
    setRewardValue('');
    setRewardType('EXP');
    setSkillName('');
    setSkillLevel('1');
    setSkillCost('');
    setSkillDescription('');
    setIncreaseLevel("nein");
    setSelectedSkillId('');
    setProgress('0');
    setMaxProgress('100');
    onClose();
  };

  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
      <Box sx={{ backgroundColor: '#252420', padding: '20px', border: profile?.level >= 15 ? '2px solid #CF9FFF'  : '2px solid #CFA63D', width: '400px' }}>
        <Typography variant="h6" sx={{ marginBottom: '30px', color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>Add new achievement</Typography>
        <Box sx={{ marginBottom: '20px', color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>
          <Typography>Name:</Typography>
          <TextField
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Box>
        <Box sx={{ marginBottom: '20px', color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>
          <Typography>Description:</Typography>
          <TextField
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Box>
        {/* Reward Type Selection */}
        <FormControl component="fieldset" sx={{ marginBottom: '20px', color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>
          <FormLabel component="legend" sx={{ color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>Reward Type</FormLabel>
          <RadioGroup
            row
            value={rewardType}
            onChange={e => setRewardType(e.target.value)}
          >
            <FormControlLabel value="EXP" control={<Radio sx={{ color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }} />} label="EXP" />
            <FormControlLabel value="Title" control={<Radio sx={{ color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }} />} label="Title" />
            <FormControlLabel value="Skill" control={<Radio sx={{ color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }} />} label="Skill" />
          </RadioGroup>
        </FormControl>
        {/* Reward Value Input */}
        {rewardType === 'EXP' && (
          <Box sx={{ marginBottom: '30px', color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>
            <Typography>EXP Amount:</Typography>
            <TextField
              type="number"
              value={rewardValue}
              onChange={e => setRewardValue(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Box>
        )}
        {rewardType === 'Title' && (
          <Box sx={{ marginBottom: '30px', color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>
            <Typography>Title:</Typography>
            <TextField
              type="text"
              value={rewardValue}
              onChange={e => setRewardValue(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Box>
        )}
        {rewardType === 'Skill' && (
          <Box sx={{ marginBottom: '30px', color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>
            <Typography>Skill Details:</Typography>
            <FormControl component="fieldset" sx={{ marginBottom: '20px', color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>
              <FormLabel component="legend" sx={{ color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>Increase Skill Level?</FormLabel>
              <RadioGroup
                row
                value={increaseLevel}
                onChange={e => setIncreaseLevel(e.target.value)}
              >
                <FormControlLabel value="ja" control={<Radio sx={{ color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }} />} label="Ja" />
                <FormControlLabel value="nein" control={<Radio sx={{ color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }} />} label="Nein" />
              </RadioGroup>
            </FormControl>
            {increaseLevel === 'ja' ? (
              <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                <InputLabel id="skill-select-label" sx={{ color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>Select Skill</InputLabel>
                <Select
                  labelId="skill-select-label"
                  id="skill-select"
                  value={selectedSkillId}
                  label="Select Skill"
                  onChange={(e) => {
                    console.log("Selected skill id:", e.target.value);
                    setSelectedSkillId(e.target.value);
                  }}
                  sx={{ color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D', bordercolor: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}
                  MenuProps={{
                    disablePortal: true,
                    PaperProps: {
                      style: { zIndex: 3000 },
                    },
                  }}
                >
                  {skillsList.map(skill => (
                    <MenuItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <>
                <TextField
                  label="Skill Name"
                  value={skillName}
                  onChange={e => setSkillName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ marginBottom: '10px' }}
                />
                <TextField
                  label="Level"
                  type="number"
                  value={skillLevel}
                  onChange={e => setSkillLevel(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ marginBottom: '10px' }}
                />
                <TextField
                  label="Cost"
                  type="number"
                  value={skillCost}
                  onChange={e => setSkillCost(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ marginBottom: '10px' }}
                />
                <TextField
                  label="Skill Description"
                  value={skillDescription}
                  onChange={e => setSkillDescription(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ marginBottom: '10px' }}
                />
              </>
            )}
          </Box>
        )}
        {/* New Achievement Progress Fields */}
        <Box sx={{ marginBottom: '30px', color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D' }}>
          <Typography>Max Progress (default 100):</Typography>
          <TextField
            type="number"
            value={maxProgress}
            onChange={e => setMaxProgress(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="transparent"
            sx={{
              color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: profile?.level >= 15 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D'
              }
            }}
          >
            Add
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            color="transparent"
            sx={{
              marginLeft: '10px',
              color: profile?.level >= 15 ? '#CF9FFF'  : '#CFA63D',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: profile?.level >= 15 ? '0 0 10px #CF9FFF'  : '0 0 10px #CFA63D'
              }
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AchievementModal;
