import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, IconButton, Collapse, LinearProgress, Button } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import gojo from '../Images/gojo.jpg';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResetIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add'; // Plus Icon
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useTheme } from '@mui/material/styles';
import Settings from './Settings';
import '../Css/borders.css';
import grandmarshal from '../Images/grand-marshal.png'

// TaskModal-Komponente (wie bisher)
const TaskModal = ({ show, onClose, onSubmit }) => {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [description, setDescription] = useState('');

  const categories = ['Intelligence', 'Strength', 'Agility', 'Durability', 'Skills', 'Projects'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Extreme', 'Special'];

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
      <Box sx={{ backgroundColor: '#30324a', padding: '20px', border: "2px solid #f2b5d5", width: '400px' }}>
        <Typography variant="h6" sx={{ marginBottom: '30px', color: "#f2b5d5" }}>Add new task</Typography>
        <Box sx={{ marginBottom: '30px', color: "#f2b5d5"}}>
          <Typography>Category:</Typography>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="" >Select category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </Box>
        <Box sx={{ marginBottom: '30px', color: "#f2b5d5" }}>
          <Typography>Task Name:</Typography>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} />
        </Box>
        <Box sx={{ marginBottom: '30px', color: "#f2b5d5" }}>
          <Typography>Difficulty:</Typography>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="">Select difficulty</option>
            {difficulties.map((diff, idx) => (
              <option key={idx} value={diff}>{diff}</option>
            ))}
          </select>
        </Box>
        <Box sx={{ marginBottom: '30px',color: "#f2b5d5" }}>
          <Typography>Description:</Typography>
          <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleSubmit} variant="contained" color="#30324a" sx={{color: "#f2b5d5", '&:hover': {
                      border: 0,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 0 10px #f2b5d5',
                      },
                    }}}>Add</Button>
          <Button onClick={onClose} variant="contained" color="#30324a" sx={{ marginLeft: '10px', color: "#f2b5d5", '&:hover': {
                      border: 0,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 0 10px #f2b5d5',
                      },
                    }}}>Cancel</Button>
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

  // API-Aufrufe bleiben unverändert
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

  const getStarRating = (difficulty) => {
    let stars = 0;
    switch (difficulty.toLowerCase()) {
      case 'easy': stars = 1; break;
      case 'medium': stars = 2; break;
      case 'hard': stars = 3; break;
      case 'extreme': stars = 4; break;
      case 'special': stars = 5; break;
      default: stars = 0;
    }
    return stars;
  };

  const imgClassName = [
    profile?.rank === "Knight" && "knight-border",
    profile?.rank === "Elite" && "elite-border",
    profile?.rank === "General" && "general-border",
    profile?.rank === "Marshal" && "marshal-border",
  ].filter(Boolean).join(" ");

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#30324a',
          minHeight: '100vh',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Profil-Panel bleibt unverändert */}
        <Box
          sx={{
            padding: '10px',
            height: '250px',
            width: '450px',
            display: 'flex',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            border: 1.3,
            color: '#f2b5d5',
            left: '3%',
            top: '5%',
            borderRadius: '16px',
            flexDirection: 'column',
          }}
        >
          <img
            
            alt=""
            style={{
              position: 'absolute',
              right: '185px',
              bottom: '18px',
              width: '300px',
              height: 'auto',
              borderRadius: '150px',
              opacity: profile?.rank === "Grand Marshal" ? 100 : 0
            }}
            src={grandmarshal}
          />
          <img
            alt=""
            className={imgClassName}
            style={{
              position: 'absolute',
              top: '55px',
              left: '67px',
              width: '125px',
              height: 'auto',
              borderRadius: '150px',
            }}
            src={gojo}
          />
          <Box sx={{ marginLeft: '410px' }}>
            <Settings />
          </Box>
          <List sx={{ bottom: '10px', color: '#f2b5d5', padding: 0, left: '25%' }}>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Name: {profile?.name}</Typography>} />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Age: {profile?.age}</Typography>} />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Level: {profile?.level}</Typography>} />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Rank: {profile?.rank}</Typography>} />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Title: {profile?.title}</Typography>} />
            </ListItem>
          </List>
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px', marginBottom: '5px' }}>
            XP: {profile?.xp}/{Math.floor(profile?.level ** 1.15 * 1000)}
          </Typography>
          <LinearProgress
            color='secondary'
            variant="determinate"
            value={(profile?.xp / Math.floor(profile?.level ** 1.15 * 1000)) * 100}
            sx={{ width: '100%', height: '10px' }}
          />
        </Box>

        {/* Aufgaben-Bereich */}
        <Box
          sx={{
            position: 'absolute',
            width: '1100px',
            height: '625px',
            display: 'flex',
            fontWeight: 'bold',
            color: '#f2b5d5',
            top: '50px',
            right: '150px',
          }}
        >
          {/* Linke Kategorie-Spalte mit Plus-Button oberhalb der Liste */}
          <Box
            sx={{
              width: '20%',
              padding: '10px',
              borderRight: '1px solid #f2b5d5',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <IconButton
              onClick={() => setIsTaskModalOpen(true)}
              sx={{
                color: '#f2b5d5',
                alignSelf: 'flex-start',
                marginBottom: '10px'
              }}
            >
              <AddIcon />
            </IconButton>
            <List sx={{ color: '#f2b5d5', padding: 0 }}>
              {['Intelligence', 'Strength', 'Agility', 'Durability', 'Skills', 'Projects'].map((category) => (
                <ListItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    cursor: 'pointer',
                    border: selectedCategory === category ? 1 : 'none',
                    boxShadow: selectedCategory === category ? '0 0 10px #f2b5d5' : 'none',
                    '&:hover': {
                      border: 1,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 0 10px #f2b5d5',
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
              color: '#f2b5d5',
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
                color: '#f2b5d5',
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
                  border: 1,
                  padding: '5px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  backgroundColor: task.status === 'done' ? '#5ced73' : null,
                  color: task.status === 'done' ? 'black' : null,
                  border: task.status === 'done' ? '3px solid black' : '1px solid #f2b5d5',
                }}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => setExpandedTask(expandedTask === index ? null : index)}
                >
                  <Typography>{task.name}</Typography>
                  <IconButton>
                    <ExpandMoreIcon sx={{ color: task.status === 'done' ? 'black' : '#f2b5d5' }} />
                  </IconButton>
                </Box>
                <Typography variant="caption" sx={{ color: task.status === 'done' ? 'black' : '#f2b5d5', fontWeight: 'bold' }}>
                  Difficulty: {task.difficulty}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconButton key={i} disableRipple>
                      {i < getStarRating(task.difficulty) ? (
                        <StarIcon sx={{ color: task.status === 'done' ? 'black' : '#f2b5d5', fontSize: '16px' }} />
                      ) : (
                        <StarBorderIcon sx={{ color: task.status === 'done' ? 'black' : '#f2b5d5', fontSize: '16px' }} />
                      )}
                    </IconButton>
                  ))}
                </Box>

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
                        backgroundColor: task.status === 'done' ? theme.palette.success.main : 'green',
                        '&:hover': {
                          boxShadow: task.status !== 'done' ? '0 0 10px rgba(76, 175, 80, 1)' : 'none',
                          transition: 'box-shadow 0.3s ease-in-out',
                        },
                      }}
                      onClick={async () => {
                        await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'done' }),
                        });
                        const xpToAdd = task.xp;
                        let updatedXP = profile?.xp + xpToAdd;
                        let newLevel = profile?.level;
                        let xpNeededForNextLevel = Math.floor(profile?.level ** 1.15 * 1000);
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
                        fetchProfiles();
                        fetchTasks();
                      }}
                    >
                      Done
                    </Button>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Box>
        </Box>

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
                  color: '#f2b5d5',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #f2b5d5' }
                }}>
                  Home
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
                  color: '#f2b5d5',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #f2b5d5' }
                }}>
                  Career
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
                  color: '#f2b5d5',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #f2b5d5' }
                }}>
                  Achievements
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
                  color: '#f2b5d5',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 10px #f2b5d5' }
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
