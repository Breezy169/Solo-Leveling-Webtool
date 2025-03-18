import React, { useState, useContext } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { AuthContext } from '../AuthContext';

const LoginModal = ({ show, onLogin }) => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!name || !password) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/profile?name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const profileData = await response.json();
        if (profileData.length > 0) {
          login(); // Setzt loggedIn auf true
          onLogin(profileData[0]); // Falls du trotzdem die Profildaten lokal benötigst
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

  // Guest-Funktion: Hier wird loggedIn NICHT verändert (bleibt false)
  const handleGuest = () => {
    onLogin({ guest: true, name: "Guest" });
  };

  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
          <Button onClick={handleGuest} variant="contained" color='transparent' sx={{ color: "#CFA63D", mr: 1 }}>
            Continue as Guest
          </Button>
          <Button onClick={handleLogin} variant="contained" color='transparent' sx={{ color: "#CFA63D" }}>
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginModal;
