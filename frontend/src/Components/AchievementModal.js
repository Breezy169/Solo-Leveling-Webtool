import React, { useState } from 'react';
import { Box, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

const AchievementModal = ({ show, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rewardType, setRewardType] = useState('EXP'); // Standard: EXP
  const [rewardValue, setRewardValue] = useState('');

  const handleSubmit = () => {
    if (!name || !description || !rewardValue) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }
    const achievement = {
      name,
      description,
      rewardType,
      reward: rewardType === 'EXP' ? Number(rewardValue) : rewardValue
    };
    onSubmit(achievement);
    setName('');
    setDescription('');
    setRewardValue('');
    setRewardType('EXP');
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
          <textarea
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%' }}
          />
        </Box>
        <Box sx={{ marginBottom: '20px', color: "#CFA63D" }}>
          <Typography>Description:</Typography>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: '100%' }}
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
          </RadioGroup>
        </FormControl>
        {/* Reward Value Eingabe */}
        <Box sx={{ marginBottom: '30px', color: "#CFA63D" }}>
          <Typography>
            {rewardType === 'EXP' ? "EXP Amount:" : "Title:"}
          </Typography>
          {rewardType === 'EXP' ? (
            <input
              type="number"
              value={rewardValue}
              onChange={e => setRewardValue(e.target.value)}
              style={{ width: '100%' }}
            />
          ) : (
            <input
              type="text"
              value={rewardValue}
              onChange={e => setRewardValue(e.target.value)}
              style={{ width: '100%' }}
            />
          )}
        </Box>
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
