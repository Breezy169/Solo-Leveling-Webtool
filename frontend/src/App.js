import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import AboutMe from './Components/AboutMe';
import Tasks from './Components/Tasks';
import Achievements from './Components/Achievements';
import Skills from './Components/Skills';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/about" element={<AboutMe />} />
    </Routes>
  );
}

export default App;
