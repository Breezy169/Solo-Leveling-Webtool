import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import Box from '@mui/material/Box';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#30324a',
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function Settings() {
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef(undefined);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null); // State to hold the selected title
  const [loading, setLoading] = useState(false); // State to handle loading

  const fetchProfiles = async () => {
    const response = await fetch('http://localhost:5000/api/profile'); // API endpoint
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);
    setProfile(data.length > 0 ? data[0] : null); // Set the first profile if available
  };

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = setTimeout(async () => {
        setSuccess(true);
        setLoading(false);
        await handleSave();
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/titles'); // Replace with your API endpoint
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);




  const titles = options.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });


  useEffect(() => {
    fetchProfiles();
  }, []);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!selectedTitle || !profile){
        console.log('No profile found')
        return;
    } 
         // Ensure there is a selected title and profile

    try {
      // Update the profile title in the backend
      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: profile.id, // Include the profile id
          title: selectedTitle.title, // Send the new title
          level: profile.level, // Include level
          xp: profile.xp,      // Include XP
        }),
      });

      if (!response.ok) {
        console.log("error")
        throw new Error('Failed to update profile title');
      }

      fetchProfiles();
      window.location.reload();  // Add this line
    } catch (error) {
      console.error('Error updating title:', error);
    } 
  };


  
  return (
    <React.Fragment>
      <SettingsIcon cursor="pointer" variant="outlined" onClick={handleClickOpen} />
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Account Settings
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Autocomplete
            options={titles.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            onChange={(event, newValue) => {
              setSelectedTitle(newValue); // Set the selected title in state
            }}
            sx={{ width: 520 }} // Set appropriate width for the Autocomplete
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a title"

              />
            )}
          />
        </DialogContent>
        <DialogActions>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ m: 1, position: 'relative' }}>
                <Fab
                  aria-label="save"
                  color="primary"
                  sx={buttonSx}
                  onClick={handleButtonClick}
                >
                  {success ? <CheckIcon /> : <SaveIcon />}
                </Fab>
                {loading && (
                  <CircularProgress
                    size={68}
                    sx={{
                      color: green[500],
                      position: 'absolute',
                      top: -6,
                      left: -6,
                      zIndex: 1,
                    }}
                  />
                )}
                
              
              </Box>
              
            </Box>  

        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}

