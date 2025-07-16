import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import CompleteProfile from './pages/CompleteProfile';
import ConnectWallet from './pages/ConnectWallet'; // new

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0d0d0d]">
        <Routes>
          
          <Route path="/" element={<CompleteProfile />} />
          <Route path="/connect-wallet" element={<ConnectWallet />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
