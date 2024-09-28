import { Box, List, ListItem, ListItemText, Typography, IconButton, Collapse, LinearProgress, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import gojo from '../Images/gojo.jpg';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import icon for expanding
import ResetIcon from '@mui/icons-material/Refresh'; // Import reset icon
import { useTheme } from '@mui/material/styles'; // Import useTheme

// Create a theme

function Tasks() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState();
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [profile, setProfile] = useState(null); // Initialize profile as null

  const fetchProfiles = async () => {
    const response = await fetch('http://localhost:5000/api/profile'); // API endpoint
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);
    setProfile(data.length > 0 ? data[0] : null); // Set the first profile if available
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks'); // API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Filter tasks based on the selected category
      const filteredTasks = data.filter(task => task.category === selectedCategory); // Use 'category' instead of 'Category'
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
      setExpandedTask(null); // Fetch tasks when category is selected or changed
    }
  }, [selectedCategory]);

  const handleReset = () => {
    fetchTasks();
    setExpandedTask(null);
  };

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
            flexDirection: 'column', // Ensures content is stacked
          }}
        >
          <img
            alt=""
            style={{
              position: 'absolute', // Position the image absolutely
              top: '10px', // Adjust vertical position
              left: '15px', // Adjust horizontal position
              width: '200px', // Set a fixed width for the image
              height: 'auto', // Maintain aspect ratio
              border: 1,
              borderRadius: '150px',
            }}
            src={gojo}
          />
          <List sx={{ color: '#f2b5d5', padding: 0, left: '20%' }}>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Name: {profile?.name}</Typography>}
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Age: {profile?.age}</Typography>}
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Level: {profile?.level}</Typography>}
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Rank: {profile?.rank}</Typography>}
              />
            </ListItem>
            <ListItem sx={{ padding: '2px 0' }}>
              <ListItemText
                primary={<Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Title: {profile?.title}</Typography>}
              />
            </ListItem>
          </List>

          {/* Progress Bar */}
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>
            XP: {profile?.xp}/{Math.floor(profile?.level ** 1.15 * 1000)}
          </Typography>
          <LinearProgress variant="determinate" value={(profile?.xp / Math.floor(profile?.level ** 1.15 * 1000)) * 100} sx={{ width: '100%', height: '10px' }} />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            width: '1100px',
            height: '625px',
            border: 'none',
            display: 'flex',
            fontWeight: 'bold',
            color: '#f2b5d5',
            top: '50px',
            right: '150px',
          }}
        >
          <Box
            sx={{
              width: '20%',
              padding: '10px',
              borderRight: '1px solid #f2b5d5',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <List sx={{ color: '#f2b5d5', padding: 0 }}>
              {['Intelligence', 'Strength', 'Agility', 'Durability', 'Skills', 'Projects'].map((category) => (
                <ListItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      border: 1,
                      color: '#f2b5d5',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 0 10px #f2b5d5',
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>{category}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box
            sx={{
              width: '100%',
              padding: '10px',
              overflowY: 'scroll',
              height: '100%',
              color: '#f2b5d5',
              position: 'relative',
            }}
          >
            <IconButton
              onClick={handleReset} // Reset and fetch tasks when clicked
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
                key={task.id} // Use task.id for unique keys
                sx={{
                  border: 1,
                  padding: '5px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                }}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => setExpandedTask(expandedTask === index ? null : index)}
                >
                  <Typography>{task.name}</Typography>
                  <IconButton>
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                {/* Display the difficulty of the task */}
                <Typography variant="caption" sx={{ color: '#f2b5d5', fontWeight: 'bold' }}>
                  Difficulty: {task.difficulty}
                </Typography>

                <Collapse in={expandedTask === index}>
                  <Box sx={{ padding: '10px' }} theme={theme}>
                    <Typography>{task.description}</Typography>
                    <Typography sx={{marginTop:'2px'}}> Exp: {task.xp} </Typography>
                    <Button
                      disabled={task.status === 'done'}
                      opacity = "0.1"
                      variant="contained"
                      color="success"
                      sx={{marginTop: '18px',
                        color: task.status === 'done' ? 'white' : 'black', // Set text color based on status
                        backgroundColor: task.status === 'done' ? theme.palette.success.main : 'green', // Maintain normal background color
                        '&.Mui-disabled': {
                          color: 'green', // Change text color to grey when disabled
                          border: 1,
                         
                        },
                        '&:hover': {
                          boxShadow: task.status !== 'done' ? '0 0 10px rgba(76, 175, 80, 1)' : 'none', // Glow effect on hover
                          transition: 'box-shadow 0.3s ease-in-out', // Smooth transition for the glow effect
                        },
                      }}
                      onClick={async () => {

                        // Update task status to 'done'
                        await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'done' }),
                        });                   

                        // Calculate the XP and possibly update level
                        const xpToAdd = task.xp;
                        let updatedXP = profile?.xp + xpToAdd;
                        let newLevel = profile?.level;                    

                        // Check if leveling up is required
                        if (updatedXP >= Math.floor(profile?.level**1.15*1000)) {
                          newLevel = profile?.level + 1;
                          updatedXP = 0; // Reset XP after leveling up
                        }                   

                        // Always send both level and xp values in the request
                        await fetch('http://localhost:5000/api/profile/update', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ level: newLevel, xp: updatedXP }), // Include both level and xp
                        });                   

                        // Refresh the profile and tasks
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
      </Box>
    </div>
  );
}

export default Tasks;
