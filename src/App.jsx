import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeStep1 from './pages/WelcomeStep1';
import WelcomeStep2 from './pages/WelcomeStep2';
import MapView from './pages/MapView';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0d0d0d]">
        <Routes>
          <Route path="/" element={<WelcomeStep1 />} />
          <Route path="/welcome-step1" element={<WelcomeStep1 />} />
          <Route path="/welcome-step2" element={<WelcomeStep2 />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;