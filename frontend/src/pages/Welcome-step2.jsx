import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import {
  Wallet, ArrowLeft, Check, User, Mail, MapPin, Shield
} from 'lucide-react';
import { connectWallet } from '../utils/wallet';
import { walletLogin } from '../api';

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
    const details = {
      email: localStorage.getItem('email') || '',
      username: localStorage.getItem('username') || '',
      firstName: localStorage.getItem('firstName') || '',
      lastName: localStorage.getItem('lastName') || '',
      city: localStorage.getItem('city') || '',
      country: localStorage.getItem('country') || ''
    };
    setUserDetails(details);

    const savedWallet = localStorage.getItem('walletAddress') || '';
    setWalletAddress(savedWallet);

    if (!details.email || !details.firstName) {
      navigate('/welcome-step1');
    }
  }, [navigate]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      if (!address) {
        setIsConnecting(false);
        return;
      }
      setWalletAddress(address);
      localStorage.setItem('walletAddress', address);
      await walletLogin(address);
      navigate('/map');
    } catch (error) {
      console.error('Wallet connection/login failed:', error);
      alert('Failed to connect wallet or login. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
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
    <div className="min-h-screen bg-[#2b2d25] flex items-center justify-center px-4 py-12">
      <Navigation />
      <div className="w-full max-w-lg bg-[#f8f2ed] p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <Logo />

          <h1 className="text-[#6b705c] text-4xl font-bold mb-4 leading-tight">
            Connect Your Wallet
          </h1>

          <p className="text-[#cb997e] text-sm uppercase tracking-wider mb-2">
            Step 2 of 2
          </p>

          <p className="text-[#5f3a26] text-sm mb-8">
            Secure your account with a crypto wallet
          </p>

          {/* Profile Summary */}
          <div className="w-full bg-[#f5ebe5] border border-[#c6c6b6] rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <User className="text-[#a66a42]" size={20} />
              <h3 className="text-[#6b705c] text-lg font-semibold">Your Profile</h3>
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[#565a49] text-sm">Name:</span>
                <span className="text-[#2b2d25] text-sm font-medium">{fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#565a49] text-sm">Username:</span>
                <span className="text-[#2b2d25] text-sm font-medium">@{userDetails.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#565a49] text-sm">Email:</span>
                <span className="text-[#2b2d25] text-sm font-medium">{userDetails.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#565a49] text-sm">Location:</span>
                <span className="text-[#2b2d25] text-sm font-medium">{location}</span>
              </div>
              <div className="border-t border-[#c6c6b6] pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#565a49] text-sm">Wallet:</span>
                  <span
                    className={`text-sm font-medium ${
                      walletAddress ? 'text-green-600' : 'text-[#75755c]'
                    }`}
                  >
                    {walletAddress
                      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                      : 'Not connected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="w-full space-y-6">
            <div className="bg-[#f5ebe5] border border-[#c6c6b6] rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="text-[#cb997e]" size={16} />
                <h4 className="text-[#6b705c] text-sm font-semibold">Why connect a wallet?</h4>
              </div>
              <ul className="text-[#75755c] text-xs space-y-1 text-left">
                <li>• Secure authentication without passwords</li>
                <li>• Access to crypto features and transactions</li>
                <li>• Enhanced security for your account</li>
                <li>• Seamless DeFi integration</li>
              </ul>
            </div>

            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className={`w-full py-4 px-6 font-semibold rounded-lg transition-all flex items-center justify-center space-x-3 ${
                walletAddress
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-[#cb997e] text-[#2b2d25] hover:bg-[#b97550]'
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
                  <Wallet size={20} />
                  <span>Connect with MetaMask</span>
                </>
              )}
            </button>

            <button
              onClick={handleComplete}
              disabled={!walletAddress}
              className={`w-full py-3 px-6 font-semibold rounded-lg transition-colors ${
                walletAddress
                  ? 'bg-white text-[#2b2d25] hover:bg-gray-100'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              Complete Setup & Enter App
            </button>

            <div className="flex space-x-3">
              <button
                onClick={handleBack}
                className="flex-1 py-2 px-4 bg-[#cb997e] text-[#2b2d25] rounded-lg hover:bg-[#b97550] transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button
                onClick={handleSkip}
                className="flex-1 py-2 text-[#75755c] hover:text-[#2b2d25] transition-colors text-sm"
              >
                Skip wallet setup
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-[#75755c] text-sm">
              <Shield size={14} />
              <span>Your data is encrypted and secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep2;
