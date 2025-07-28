import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black font-bold text-sm">CC</span>
          </div>
          <span className="text-white font-medium text-lg">Crypto Connect</span>
        </div>
        <div className="flex items-center space-x-8">
          
          <a href="/map" className="text-gray-400 hover:text-white transition-colors">
            Map
          </a>
          <button 
            onClick={() => navigate('/profile')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Profile
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/Gallery')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Gallery
          </button>
          
        
        </div>
      </div>
    </nav>
  );
};

export default Navigation;