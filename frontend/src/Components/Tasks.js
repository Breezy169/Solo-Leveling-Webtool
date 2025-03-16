import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, IconButton, Collapse, LinearProgress, Button } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResetIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import Settings from './Settings';
import '../Css/borders.css';
import systeminfo from '../Images/systeminfo.png';

// TaskModal-Komponente (wie bisher)
const TaskModal = ({ show, onClose, onSubmit }) => {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [description, setDescription] = useState('');

  const categorys = ['Intelligence', 'Strength', 'Agility', 'Durability', 'Skills', 'Projects'];
  const difficulties = ['E-Rank', 'D-Rank', 'C-Rank', 'B-Rank', 'A-Rank', 'S-Rank'];

  const handleSubmit = () => {
    if (!category || !name || !difficulty || !description) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }
    const task = {
      category,
      name,
      difficulty,
      description: 'Description: ' + description,
    };
    onSubmit(task);
    setCategory('');
    setName('');
    setDifficulty('');
    setDescription('');
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
        <Typography variant="h6" sx={{ marginBottom: '30px', color: "#CFA63D" }}>Add new task</Typography>
        <Box sx={{ marginBottom: '30px', color: "#CFA63D"}}>
          <Typography>Category:</Typography>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Select category</option>
            {categorys.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </Box>
        <Box sx={{ marginBottom: '30px', color: "#CFA63D" }}>
          <Typography>Task Name:</Typography>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} />
        </Box>
        <Box sx={{ marginBottom: '30px', color: "#CFA63D" }}>
          <Typography>Difficulty:</Typography>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="">Select difficulty</option>
            {difficulties.map((diff, idx) => (
              <option key={idx} value={diff}>{diff}</option>
            ))}
          </select>
        </Box>
        <Box sx={{ marginBottom: '30px', color: "#CFA63D" }}>
          <Typography>Description:</Typography>
          <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleSubmit} variant="contained" color="transparent" sx={{ color: "#CFA63D", '&:hover': { transform: 'scale(1.02)', boxShadow: '0 0 10px #CFA63D' } }}>
            Add
          </Button>
          <Button onClick={onClose} variant="transpare" color="transparent" sx={{ marginLeft: '10px', color: "#CFA63D", '&:hover': { transform: 'scale(1.02)', boxShadow: '0 0 10px #CFA63D' } }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

function Tasks() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState();
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // API-Aufrufe
  const fetchProfiles = async () => {
    const response = await fetch('http://localhost:5000/api/profile');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    setProfile(data.length > 0 ? data[0] : null);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const filteredTasks = data.filter(task => task.category === selectedCategory);
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchTasks();
      setExpandedTask(null);
    }
  }, [selectedCategory]);

  const handleReset = () => {
    fetchTasks();
    setExpandedTask(null);
  };

  const handleAddTask = async (task) => {
    try {
      const response = await fetch('http://localhost:5000/api/addTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Task erfolgreich hinzugefügt! XP: ${data.xp}`);
        fetchTasks();
      } else {
        alert('Fehler beim Hinzufügen des Tasks.');
      }
    } catch (error) {
      console.error('Fehler:', error);
      alert('Ein Fehler ist aufgetreten.');
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
        {/* Systeminfo und Profilanzeige */}
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
              NAME: {profile?.name}<br />
              AGE: {profile?.age} <br />
              RANK: {profile?.rank}  <br />
              TITLE: {profile?.title}
            </Typography>
            <Box sx={{ position: 'absolute', right: '-60px', top: '-40px', zIndex: 999 }}>
              <Settings />
            </Box>
            <Typography sx={{ position: 'absolute', top: '140px', fontSize: '19px', fontWeight: 'bold', lineHeight: 1.7 }}>
              <br />
              HP: {profile ? profile.level * 40 : 0} <br />
              FATIGUE: {profile ? (profile.age * 1.013).toFixed(2) + "%" : ""}
            </Typography>
            <Typography sx={{ position: 'absolute', fontSize: '19px', fontWeight: 'bold', lineHeight: 1.7, top: '250px' }}>
              <br />
              STR: {profile?.strength} <br />
              PERCEPTION: {profile?.perception} <br />
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
              LV. {profile?.level}<br />
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
              <br />
              FOCUS: {profile ? ((profile.intelligence + profile.perception) / 20).toFixed(2) + "%" : ""}
            </Typography>
            <Typography sx={{ position: 'absolute', fontSize: '19px', fontWeight: 'bold', lineHeight: 1.7, top: '247px' }}>
              <br />
              STAMINA: {profile?.stamina} <br />
              INT: {profile?.intelligence} <br />
              AP: {profile ? profile.ap * 30 : 0}
            </Typography>
          </Box>
        </Box>

        {/* Aufgaben-Bereich */}
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
          {/* Linke Kategorie-Spalte */}
          <Box
            sx={{
              width: '20%',
              padding: '10px',
              borderRight: '1px solid #CFA63D',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <IconButton
              onClick={() => setIsTaskModalOpen(true)}
              sx={{
                color: '#CFA63D',
                alignSelf: 'flex-start',
                marginBottom: '10px'
              }}
            >
              <AddIcon />
            </IconButton>
            <List sx={{ color: '#CFA63D', padding: 0 }}>
              {['Intelligence', 'Strength', 'Agility', 'Durability', 'Skills', 'Projects'].map((category) => (
                <ListItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    cursor: 'pointer',
                    border: selectedCategory === category ? 1 : 'none',
                    boxShadow: selectedCategory === category ? '0 0 10px #CFA63D' : 'none',
                    '&:hover': {
                      border: 1,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 0 10px #CFA63D',
                      },
                    },
                  }}
                >
                  <ListItemText primary={<Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>{category}</Typography>} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Rechte Aufgaben-Spalte */}
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

            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              {selectedCategory}
            </Typography>
            {tasks.map((task, index) => (
              <Box
                key={task.id}
                sx={{
                  border: task.status === 'done' ? '3px solid black' : '1px solid #CFA63D',
                  padding: '5px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  backgroundColor: task.status === 'done' ? 'transparent' : null,
                  position: 'relative'
                }}
              >
                {/* Inhalt, der bei abgeschlossener Aufgabe geblurrt wird */}
                <Box sx={{ filter: task.status === 'done' ? 'blur(3px)' : 'none' }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => setExpandedTask(expandedTask === index ? null : index)}
                  >
                    <Typography>{task.name}</Typography>
                    <IconButton>
                      <ExpandMoreIcon sx={{ color: task.status === 'done' ? 'black' : '#CFA63D' }} />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" sx={{ color: task.status === 'done' ? 'black' : '#CFA63D', fontWeight: 'bold' }}>
                    Difficulty: {task.difficulty} <br />
                    Reward: {task.category + ": " + "+" + task.value} <br />
                    Status: {task.status === 'done' ? 'completed' : 'not completed'}
                  </Typography>
                  <Collapse in={expandedTask === index}>
                    <Box sx={{ padding: '10px' }} theme={theme}>
                      <Typography>{task.description}</Typography>
                      <Typography sx={{ marginTop: '2px' }}>Exp: {task.xp}</Typography>
                      <Button
                        disabled={task.status === 'done'}
                        variant="contained"
                        color="success"
                        sx={{
                          marginTop: '18px',
                          color: task.status !== 'done' ? '#CFA63D' : null,
                          backgroundColor: task.status === 'done' ? theme.palette.success.main : 'transparent',
                          '&:hover': {
                            boxShadow: task.status !== 'done' ? '0 0 10px #CFA63D' : 'none',
                            transition: 'box-shadow 0.3s ease-in-out',
                          },
                        }}
                        onClick={async () => {
                          // Task als erledigt markieren
                          await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'done' }),
                          });
                          
                          // Update XP und Level wie bisher
                          const xpToAdd = task.xp;
                          let updatedXP = (profile?.xp || 0) + xpToAdd;
                          let newLevel = profile?.level || 1;
                          let xpNeededForNextLevel = Math.floor(profile?.level ** 1.15 * 1000);
                          while (updatedXP >= xpNeededForNextLevel) {
                            newLevel++;
                            updatedXP -= xpNeededForNextLevel;
                            xpNeededForNextLevel = Math.floor(newLevel ** 1.15 * 1000);
                          }
                        
                          // Hole den Reward (Task.reward wird als value gespeichert)
                          let reward = task.value; 
                          let category = task.category;
                        
                          // Erstelle ein Objekt mit den aktuellen Statuswerten (Fallback auf 0, falls undefined)
                          const updatedStatus = {
                            strength: profile?.strength || 0,
                            agility: profile?.agility || 0,
                            stamina: profile?.stamina || 0,
                            intelligence: profile?.intelligence || 0,
                            perception: profile?.perception || 0,
                            ap: profile?.ap || 0,
                          };
                        
                          // Passe das jeweilige Statusattribut an, abhängig von der Task-Kategorie
                          if (category === 'Intelligence') {
                            updatedStatus.intelligence += reward;
                          } else if (category === 'Strength') {
                            updatedStatus.strength += reward;
                          } else if (category === 'Agility') {
                            updatedStatus.agility += reward;
                          } else if (category === 'Durability') {
                            updatedStatus.stamina += reward;
                          } else if (category === 'Projects') {
                            updatedStatus.perception += reward;
                          } else if (category === 'Skills') {
                            updatedStatus.ap += reward;
                          }
                        
                          // Sende alle sechs Werte an den Status-Update-Endpoint
                          await fetch('http://localhost:5000/api/profile/update_status', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedStatus),
                          });
                        
                          // Update XP und Level im Profil
                          await fetch('http://localhost:5000/api/profile/update', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ level: newLevel, xp: updatedXP }),
                          });
                          
                          fetchProfiles();
                          fetchTasks();
                        }}
                      >
                        Done
                      </Button>
                    </Box>
                  </Collapse>
                </Box>
                {/* Overlay: Angepasste Darstellung bei abgeschlossener Aufgabe */}
                {task.status === 'done' && (
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
                      {task.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                      REWARD: {task.category + ": " + "+" + task.value}
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
              <Link to="/home" style={{ textDecoration: 'none' }}>
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
                  Home
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
                  color: '#CFA63D',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #CFA63D' }
                }}>
                  Achievements
                </Box>
              </Link>
            </Grid2>
            <Grid2 xs={6}>
              <Link to="/career" style={{ textDecoration: 'none' }}>
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
                  Career
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

      <TaskModal
        show={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
}

export default Tasks;
