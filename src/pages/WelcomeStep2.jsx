import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { Wallet, ArrowLeft, Check, User, Mail, MapPin, Shield } from 'lucide-react';

const WelcomeStep2 = () => {
  const [userDetails, setUserDetails] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    city: '',
    country: ''
  });
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from localStorage
    const details = {
      email: localStorage.getItem('email') || '',
      username: localStorage.getItem('username') || '',
      firstName: localStorage.getItem('firstName') || '',
      lastName: localStorage.getItem('lastName') || '',
      city: localStorage.getItem('city') || '',
      country: localStorage.getItem('country') || ''
    };
    
    setUserDetails(details);
    
    // Load existing wallet if any
    const savedWallet = localStorage.getItem('walletAddress') || '';
    setWalletAddress(savedWallet);

    // Redirect if no user data
    if (!details.email || !details.firstName) {
      navigate('/welcome-step1');
    }
  }, [navigate]);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          localStorage.setItem('walletAddress', address);
        }
      } else {
        alert('MetaMask is not installed. Please install MetaMask to connect your wallet.');
        window.open('https://metamask.io/download/', '_blank');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        alert('Wallet connection was rejected. Please try again.');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleComplete = () => {
    // Save completion status
    localStorage.setItem('onboardingComplete', 'true');
    
    // Navigate to main app
    navigate('/map');
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingComplete', 'true');
    navigate('/map');
  };

  const handleBack = () => {
    navigate('/welcome-step1');
  };

  const fullName = `${userDetails.firstName} ${userDetails.lastName}`.trim();
  const location = `${userDetails.city}, ${userDetails.country}`.trim();

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
      <div className="flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-lg">
          <div className="flex flex-col items-center text-center">
            <Logo />
            
            <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
              Connect Your Wallet
            </h1>
            
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Step 2 of 2
            </p>
            
            <p className="text-gray-400 text-sm mb-8">
              Secure your account with a crypto wallet
            </p>

            {/* User Details Summary Card */}
            <div className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <User className="text-gray-400" size={20} />
                <h3 className="text-white text-lg font-semibold">Your Profile</h3>
              </div>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Name:</span>
                  <span className="text-white text-sm font-medium">{fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Username:</span>
                  <span className="text-white text-sm font-medium">@{userDetails.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Email:</span>
                  <span className="text-white text-sm font-medium">{userDetails.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Location:</span>
                  <span className="text-white text-sm font-medium">{location}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Wallet:</span>
                    <span className={`text-sm font-medium ${walletAddress ? 'text-green-400' : 'text-gray-400'}`}>
                      {walletAddress 
                        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                        : 'Not connected'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Connection Section */}
            <div className="w-full space-y-6">
              {/* Why Connect Wallet Info */}
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="text-blue-400" size={16} />
                  <h4 className="text-white text-sm font-semibold">Why connect a wallet?</h4>
                </div>
                <ul className="text-gray-400 text-xs space-y-1 text-left">
                  <li>• Secure authentication without passwords</li>
                  <li>• Access to crypto features and transactions</li>
                  <li>• Enhanced security for your account</li>
                  <li>• Seamless DeFi integration</li>
                </ul>
              </div>

              {/* Connect Wallet Button */}
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className={`w-full py-4 px-6 font-semibold rounded-lg transition-all flex items-center justify-center space-x-3 ${
                  walletAddress
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600'
                }`}
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    <span>Connecting to MetaMask...</span>
                  </>
                ) : walletAddress ? (
                  <>
                    <Check size={20} />
                    <span>Wallet Connected Successfully</span>
                  </>
                ) : (
                  <>
                    <img 
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEyIiBoZWlnaHQ9IjE4OSIgdmlld0JveD0iMCAwIDIxMiAxODkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xXzIpIj4KPHBhdGggZD0iTTQwLjc0IDAgTDEyNi42NiA2NS4yNyBMMTQ0LjgxIDI3LjEyIEw0MC43NCAwWiIgZmlsbD0iI0UxNzcyNiIvPgo8cGF0aCBkPSJNMTcxLjI2IDAgTDg1LjM0IDY1LjI3IEw2Ny4xOSAyNy4xMiBMMTcxLjI2IDBaIiBmaWxsPSIjRTE3NzI2Ii8+CjxwYXRoIGQ9Ik0xNDQuODEgMTM2LjczIEwxMjYuNjYgMTIzLjczIEw4NS4zNCAxMjMuNzMgTDY3LjE5IDEzNi43MyBMNDAuNzQgMTg5IEwxNzEuMjYgMTg5IEwxNDQuODEgMTM2LjczWiIgZmlsbD0iI0UxNzcyNiIvPgo8cGF0aCBkPSJNODUuMzQgNjUuMjcgTDEyNi42NiA2NS4yNyBMMTQ0LjgxIDI3LjEyIEw2Ny4xOSAyNy4xMiBMODUuMzQgNjUuMjdaIiBmaWxsPSIjRTI3NjI1Ii8+CjxwYXRoIGQ9Ik04NS4zNCAxMjMuNzMgTDEyNi42NiAxMjMuNzMgTDE0NC44MSAxMzYuNzMgTDY3LjE5IDEzNi43MyBMODUuMzQgMTIzLjczWiIgZmlsbD0iI0UyNzYyNSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzFfMiI+CjxyZWN0IHdpZHRoPSIyMTIiIGhlaWdodD0iMTg5IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo="
                      alt="MetaMask"
                      className="w-5 h-5"
                    />
                    <span>Connect with MetaMask</span>
                  </>
                )}
              </button>

              {/* Complete Setup Button */}
              <button
                onClick={handleComplete}
                disabled={!walletAddress}
                className={`w-full py-3 px-6 font-semibold rounded-lg transition-colors ${
                  walletAddress
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Complete Setup & Enter App
              </button>

              {/* Navigation Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                
                <button
                  onClick={handleSkip}
                  className="flex-1 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Skip wallet setup
                </button>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                <Shield size={14} />
                <span>Your data is encrypted and secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep2;