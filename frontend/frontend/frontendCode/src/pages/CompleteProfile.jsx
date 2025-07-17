import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { connectWallet } from '../utils/wallet';
import { saveUserProfile } from '../api/index'; // ✅ New import

const CompleteProfile = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail') || '';
    const savedUsername = localStorage.getItem('username') || '';
    const savedWallet = localStorage.getItem('walletAddress') || '';
    setEmail(savedEmail);
    setUsername(savedUsername);
    setWalletAddress(savedWallet);
  }, []);

  const handleSave = async () => {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('username', username);
    if (walletAddress) {
      localStorage.setItem('walletAddress', walletAddress);
    }

    try {
      const res = await saveUserProfile({ walletAddress, username, email });
      console.log("Saved to backend:", res);
      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile.");
    }
  };

  const handleSkip = () => {
    console.log('Profile skipped');
    alert('Skipped for now');
  };

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setWalletAddress(address);
      localStorage.setItem('walletAddress', address);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      <Navigation />

      {/* Decorative dots pattern */}
      <div className="absolute bottom-0 left-0 opacity-20">
        <div className="grid grid-cols-8 gap-2 p-8">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <Logo />

            <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
              Complete Your Profile
            </h1>

            <p className="text-gray-400 text-sm uppercase tracking-wider mb-12">
              Confirm your information
            </p>

            <div className="w-full space-y-6">
              {/* Email */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>

              {/* Connect Wallet */}
              <button
                onClick={handleConnectWallet}
                className="w-full py-3 px-6 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>🦊</span>
                <span>
                  {walletAddress
                    ? `Wallet Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                    : 'Connect Wallet'}
                </span>
              </button>

              {/* Save & Continue */}
              <button
                onClick={handleSave}
                className="w-full py-3 px-6 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>✅</span>
                <span>Save & Continue</span>
              </button>

              {/* Skip */}
              <button
                onClick={handleSkip}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
