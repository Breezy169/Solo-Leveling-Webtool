import React, { useState } from 'react';

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
    if (!difficulties.map(diff => diff.toLowerCase()).includes(difficulty.toLowerCase())) {
      alert("Difficulty muss 'easy', 'medium', 'hard', 'extreme' oder 'special' sein.");
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
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2 style={{ color: '#f2b5d5' }}>Task hinzufügen</h2>
        <div style={modalStyles.field}>
          <label style={modalStyles.label}>Category:</label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            style={modalStyles.input}
          >
            <option value="">Kategorie wählen</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div style={modalStyles.field}>
          <label style={modalStyles.label}>Task Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            style={modalStyles.input}
          />
        </div>
        <div style={modalStyles.field}>
          <label style={modalStyles.label}>Difficulty:</label>
          <select 
            value={difficulty} 
            onChange={e => setDifficulty(e.target.value)}
            style={modalStyles.input}
          >
            <option value="">Difficulty wählen</option>
            {difficulties.map((diff, idx) => (
              <option key={idx} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
        <div style={modalStyles.field}>
          <label style={modalStyles.label}>Description:</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            style={modalStyles.input}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleSubmit} style={modalStyles.button}>Task hinzufügen</button>
          <button onClick={onClose} style={{ ...modalStyles.button, marginLeft: '10px' }}>Abbrechen</button>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#30324a',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    border: '1px solid #f2b5d5',
  },
  field: {
    marginBottom: '10px'
  },
  label: {
    color: '#f2b5d5',
    display: 'block',
    marginBottom: '4px'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #f2b5d5',
    backgroundColor: '#30324a',
    color: '#f2b5d5'
  },
  button: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #f2b5d5',
    backgroundColor: '#30324a',
    color: '#f2b5d5',
    cursor: 'pointer'
  }
};

const TaskManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTask = async (task) => {
    try {
      const response = await fetch('/api/addTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Task erfolgreich hinzugefügt! XP: ${data.xp}`);
      } else {
        alert('Fehler beim Hinzufügen des Tasks.');
      }
    } catch (error) {
      console.error('Fehler:', error);
      alert('Ein Fehler ist aufgetreten.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      
      <button onClick={() => setIsModalOpen(true)}>Task hinzufügen</button>
      <TaskModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
};

export default TaskManager;
