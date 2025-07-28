import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Map', path: '/map', action: () => navigate('/map') },
    { name: 'Profile', path: '/profile', action: () => navigate('/profile') },
    { name: 'Dashboard', path: '/dashboard', action: () => navigate('/dashboard') },
    { name: 'Gallery', path: '/Gallery', action: () => navigate('/Gallery') }
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 p-4 sm:p-6">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black font-bold text-xs sm:text-sm">CC</span>
          </div>
          <span className="text-white font-medium text-sm sm:text-lg">Crypto Connect</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="text-gray-400 hover:text-white transition-colors text-sm lg:text-base"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#1a1a1a] border-t border-gray-700 shadow-lg">
          <div className="flex flex-col space-y-1 p-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.action();
                  closeMenu();
                }}
                className="text-left text-gray-400 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-gray-800 text-sm"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;