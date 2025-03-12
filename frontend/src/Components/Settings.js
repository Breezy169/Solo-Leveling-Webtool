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
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';

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
  const [success, setSuccess] = useState(false);
  const timer = React.useRef(undefined);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [loading, setLoading] = useState(false);

  // New state for profile picture
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  const fetchProfiles = async () => {
    const response = await fetch('http://localhost:5000/api/profile');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setProfile(data.length > 0 ? data[0] : null);
  };

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  useEffect(() => {
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
        // Save both title and profile picture if needed
        await handleSave();
        if (selectedProfilePicture) {
          await handleSaveProfilePicture();
        }
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/titles');
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
    if (!profile) {
      console.log('No profile found');
      return;
    }
    // Update the profile title and other info
    try {
      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: profile.id,
          title: selectedTitle ? selectedTitle.title : profile.title,
          level: profile.level,
          xp: profile.xp,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile title');
      }
      fetchProfiles();
      window.location.reload();
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  // New handler for profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  // New handler to upload the profile picture
  const handleSaveProfilePicture = async () => {
    if (!selectedProfilePicture || !profile) {
      console.log('No profile picture selected or no profile found');
      return;
    }
    const formData = new FormData();
    formData.append("profileId", profile.id);
    formData.append("profilePicture", selectedProfilePicture);

    try {
      const response = await fetch("http://localhost:5000/api/profile/upload-picture", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }
      // Refresh profile data after successful upload
      fetchProfiles();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment >
      <SettingsIcon cursor="pointer" variant="outlined" onClick={handleClickOpen}/>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, color: "#f2b5d5"}} id="customized-dialog-title">
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
          <Typography variant="subtitle1" color="inherit" marginBottom="10px" sx={{color: "#f2b5d5"}}>
             
              Change Title

          </Typography>
          <Autocomplete
            options={titles.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            onChange={(event, newValue) => {
              setSelectedTitle(newValue);
            }}
            sx={{ width: 520 }}
            renderInput={(params) => (
              <TextField {...params} label="Select a title" />
            )}
          />
          {/* New section for changing profile picture */}
          
        </DialogContent>
  
      </BootstrapDialog>
    </React.Fragment>
  );
}
