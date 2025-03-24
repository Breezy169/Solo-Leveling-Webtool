import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';

const LoginModal = ({ show, onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  
  // API-Aufrufe
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

  const handleLogin = async () => {
    if (!name || !password) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/profile?name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.ok) {
        const profileData = await response.json();
        if (profileData.length > 0) {
          // Erfolgreicher Login: loggedIn wird auf "yes" gesetzt
          const userProfile = { ...profileData[0], loggedIn: "yes" };
          onLogin(userProfile);
        } else {
          alert("Login fehlgeschlagen. Überprüfe deinen Namen und Passwort.");
        }
      } else {
        alert("Login fehlgeschlagen. Überprüfe deinen Namen und Passwort.");
      }
    } catch (error) {
      console.error("Fehler beim Login:", error);
      alert("Fehler beim Login. Bitte versuche es erneut.");
    }
  };

  // Guest-Funktion: Ruft den /api/profile/update_login-Endpoint auf, der loggedIn auf "no" setzt
  const handleGuest = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/update_login', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Falls später Payload benötigt wird, anpassen
      });
      if (response.ok) {
        await response.json();
        // Statt nur fetchProfiles() aufzurufen, informiere die Parent-Komponente:
        onLogin({ loggedIn: "no", name: "Guest" });
      } else {
        alert('Fehler beim Aktualisieren des Login-Status.');
      }
    } catch (error) {
      console.error('Fehler:', error);
      alert('Ein Fehler ist aufgetreten.');
    }
  };
  

  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 2000,
      }}
    >
      <Box sx={{ backgroundColor: '#252420', padding: '20px', border: '2px solid #CFA63D', width: '400px' }}>
        <Typography variant="h6" sx={{ mb: 3, color: "#CFA63D" }}>Login</Typography>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleGuest} variant="contained" sx={{ color: "#CFA63D", mr: 1 }}>
            Continue as Guest
          </Button>
          <Button onClick={handleLogin} variant="contained" sx={{ color: "#CFA63D" }}>
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginModal;
