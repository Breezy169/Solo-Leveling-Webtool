import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField, Select, MenuItem, InputLabel } from '@mui/material';

const AchievementModal = ({ show, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rewardType, setRewardType] = useState('EXP'); // Standard: EXP
  const [rewardValue, setRewardValue] = useState('');
  
  // Felder für den Reward-Typ "Skill" (manuelle Eingabe)
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('1'); // Standardmäßig 1
  const [skillCost, setSkillCost] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  
  // Neues Feld: Increase Skill Level (ja/nein)
  const [increaseLevel, setIncreaseLevel] = useState("nein");

  // State für die Liste der Skills aus der skills.db (wird für Dropdown genutzt)
  const [skillsList, setSkillsList] = useState([]);
  // Neuer State für die ausgewählte Skill-ID (Dropdown)
  const [selectedSkillId, setSelectedSkillId] = useState('');

  // Wenn Reward-Typ "Skill" gewählt ist, lade die Skills aus der API
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
  }, [rewardType]);

  // Setze automatisch den ersten Skill als Standard, wenn Increase Level auf "ja" steht
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
        // Finde den Skill anhand der ausgewählten ID (als Zahl vergleichen)
        const selectedSkill = skillsList.find(skill => skill.id === Number(selectedSkillId));
        if (!selectedSkill) {
          alert("Ausgewählter Skill nicht gefunden.");
          return;
        }
        reward = {
          id: selectedSkill.id,
          name: selectedSkill.name,
          level: selectedSkill.level,  // aktueller Level aus der DB
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
      // Wichtig: Verwende CamelCase, da das Backend so erwartet wird.
      increaseLevel: rewardType === 'Skill' ? increaseLevel : 'nein'
    };
    onSubmit(achievement);
    // Felder zurücksetzen
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
      <Box sx={{ backgroundColor: '#252420', padding: '20px', border: "2px solid #CFA63D", width: '400px' }}>
        <Typography variant="h6" sx={{ marginBottom: '30px', color: "#CFA63D" }}>Add new achievement</Typography>
        <Box sx={{ marginBottom: '20px', color: "#CFA63D" }}>
          <Typography>Name:</Typography>
          <TextField
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Box>
        <Box sx={{ marginBottom: '20px', color: "#CFA63D" }}>
          <Typography>Description:</Typography>
          <TextField
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
        </Box>
        {/* Reward Type Auswahl */}
        <FormControl component="fieldset" sx={{ marginBottom: '20px', color: "#CFA63D" }}>
          <FormLabel component="legend" sx={{ color: "#CFA63D" }}>Reward Type</FormLabel>
          <RadioGroup
            row
            value={rewardType}
            onChange={e => setRewardType(e.target.value)}
          >
            <FormControlLabel value="EXP" control={<Radio sx={{ color: "#CFA63D" }} />} label="EXP" />
            <FormControlLabel value="Title" control={<Radio sx={{ color: "#CFA63D" }} />} label="Title" />
            <FormControlLabel value="Skill" control={<Radio sx={{ color: "#CFA63D" }} />} label="Skill" />
          </RadioGroup>
        </FormControl>
        {/* Reward Value Eingabe */}
        {rewardType === 'EXP' && (
          <Box sx={{ marginBottom: '30px', color: "#CFA63D" }}>
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
          <Box sx={{ marginBottom: '30px', color: "#CFA63D" }}>
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
          <Box sx={{ marginBottom: '30px', color: "#CFA63D" }}>
            <Typography>Skill Details:</Typography>
            <FormControl component="fieldset" sx={{ marginBottom: '20px', color: "#CFA63D" }}>
              <FormLabel component="legend" sx={{ color: "#CFA63D" }}>Increase Skill Level?</FormLabel>
              <RadioGroup
                row
                value={increaseLevel}
                onChange={e => setIncreaseLevel(e.target.value)}
              >
                <FormControlLabel value="ja" control={<Radio sx={{ color: "#CFA63D" }} />} label="Ja" />
                <FormControlLabel value="nein" control={<Radio sx={{ color: "#CFA63D" }} />} label="Nein" />
              </RadioGroup>
            </FormControl>
            {increaseLevel === 'ja' ? (
              // Dropdown aus skills.db anzeigen – hier verwenden wir selectedSkillId
              <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                <InputLabel id="skill-select-label" sx={{ color: "#CFA63D" }}>Select Skill</InputLabel>
                <Select
                  labelId="skill-select-label"
                  id="skill-select"
                  value={selectedSkillId}
                  label="Select Skill"
                  onChange={(e) => {
                    console.log("Selected skill id:", e.target.value);
                    setSelectedSkillId(e.target.value);
                  }}
                  sx={{ color: "#CFA63D", borderColor: "#CFA63D" }}
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
              // Manuelle Eingabefelder für Skill-Daten
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="transparent"
            sx={{
              color: "#CFA63D",
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 0 10px #CFA63D'
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
              color: "#CFA63D",
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 0 10px #CFA63D'
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
