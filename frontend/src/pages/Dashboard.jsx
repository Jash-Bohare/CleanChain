import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { Coins, MapPin, Heart, Users, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getUserLocations, getUserProfile, getWalletBalance, uploadAfterImage } from '../api';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    tokens: 0
  });
  const [walletBalances, setWalletBalances] = useState({
    ethBalance: 0,
    tokenBalance: 0
  });
  const [animatedTokens, setAnimatedTokens] = useState(0);
  const [claimedPlaces, setClaimedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(null);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        await loadDashboardData();
      } catch (err) {
        console.error('Error initializing dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, []);

  const animateTokenCounter = (targetTokens) => {
    const duration = 2000;
    const steps = 60;
    const increment = targetTokens / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, targetTokens);
      setAnimatedTokens(Math.floor(current));
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedTokens(targetTokens);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  };

  const getStatusIcon = (status, cleaned, rewarded, verified) => {
    if (verified) {
      return <CheckCircle className="text-green-500" size={16} />;
    } else if (cleaned && rewarded) {
      return <CheckCircle className="text-green-500" size={16} />;
    } else if (cleaned && !rewarded) {
      return <Clock className="text-blue-500" size={16} />;
    } else if (status === 'photo_uploaded') {
      return <Clock className="text-purple-500" size={16} />;
    } else if (status === 'claimed') {
      return <Clock className="text-yellow-500" size={16} />;
    } else {
      return <AlertCircle className="text-red-500" size={16} />;
    }
  };

  const getStatusText = (status, cleaned, rewarded, verified) => {
    if (verified) return 'Verified';
    if (cleaned && rewarded) return 'Rewarded';
    if (cleaned && !rewarded) return 'Cleaned';
    if (status === 'photo_uploaded') return 'Photo Uploaded';
    if (status === 'claimed') return 'Claimed';
    return 'Unknown';
  };

  const getStatusColor = (status, cleaned, rewarded, verified) => {
    if (verified) return 'text-green-500';
    if (cleaned && rewarded) return 'text-green-500';
    if (cleaned && !rewarded) return 'text-blue-500';
    if (status === 'photo_uploaded') return 'text-purple-500';
    if (status === 'claimed') return 'text-yellow-500';
    return 'text-red-500';
  };

  const calculateStats = () => {
    const totalPlacesClaimed = claimedPlaces.length;
    const totalCleaned = claimedPlaces.filter(place => place.cleaned || place.verified).length;
    const totalVerified = claimedPlaces.filter(place => place.verified).length;
    const totalRewarded = claimedPlaces.filter(place => place.rewarded).length;
    const totalUpvotes = claimedPlaces.reduce((sum, place) => {
      const votes = place.votes || [];
      return sum + votes.filter(v => v.voteType === 'up').length;
    }, 0);

    return {
      totalPlacesClaimed,
      totalCleaned,
      totalVerified,
      totalRewarded,
      totalUpvotes
    };
  };

  const handleImageUpload = async (locationId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(locationId);
      await uploadAfterImage(locationId, file);
      await loadDashboardData();
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(null);
    }
  };

  const loadDashboardData = async () => {
    try {
      const walletAddress = localStorage.getItem('walletAddress');
      
      if (!walletAddress) {
        setError('No wallet connected');
        return;
      }

      const [profileData, locationsData] = await Promise.all([
        getUserProfile(walletAddress),
        getUserLocations(walletAddress)
      ]);

      let balanceData = { tokenBalance: 0, ethBalance: 0 };
      try {
        balanceData = await getWalletBalance(walletAddress);
      } catch {
        balanceData = { 
          tokenBalance: profileData.userData?.tokens || 0,
          ethBalance: 0
        };
      }

      setUserInfo({
        username: profileData.userData?.username || 'Explorer',
        email: profileData.userData?.email || '',
        tokens: balanceData.tokenBalance || 0
      });

      setWalletBalances({
        ethBalance: balanceData.ethBalance || 0,
        tokenBalance: balanceData.tokenBalance || 0
      });

      setClaimedPlaces(locationsData.locations || []);
      animateTokenCounter(balanceData.tokenBalance || 0);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2b2d25] flex items-center justify-center">
        <div className="text-[#f8f2ed] text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2b2d25] flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2b2d25] relative">
      <Navigation />
      
      <div className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Logo />
            <div>
              <h1 className="text-[#6b705c] text-3xl font-bold">Dashboard</h1>
              <p className="text-[#cb997e] text-sm">
                Welcome back, @{userInfo.username}
              </p>
            </div>
          </div>
          
          <div className="bg-[#f8f2ed] p-4 rounded-lg shadow-xl text-center">
            <p className="text-[#565a49] text-xs uppercase tracking-wider">Wallet Balance</p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <span className="text-[#6b705c] font-semibold">
                  {walletBalances.ethBalance.toFixed(4)} Sepolia ETH
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Coins className="text-[#a66a42]" size={20} />
                <span className="text-[#6b705c] font-semibold">
                  {animatedTokens.toLocaleString()} ECO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#f8f2ed] rounded-lg p-6 shadow-lg">
            <p className="text-[#75755c] text-sm">Total Claimed</p>
            <p className="text-[#2b2d25] text-2xl font-bold">{stats.totalPlacesClaimed}</p>
          </div>
          <div className="bg-[#f8f2ed] rounded-lg p-6 shadow-lg">
            <p className="text-[#75755c] text-sm">Total Cleaned</p>
            <p className="text-[#2b2d25] text-2xl font-bold">{stats.totalCleaned}</p>
          </div>
          <div className="bg-[#f8f2ed] rounded-lg p-6 shadow-lg">
            <p className="text-[#75755c] text-sm">Total Verified</p>
            <p className="text-[#2b2d25] text-2xl font-bold">{stats.totalVerified}</p>
          </div>
          <div className="bg-[#f8f2ed] rounded-lg p-6 shadow-lg">
            <p className="text-[#75755c] text-sm">Total Rewarded</p>
            <p className="text-[#2b2d25] text-2xl font-bold">{stats.totalRewarded}</p>
          </div>
        </div>

        {/* User Locations */}
        <div>
          <h2 className="text-[#6b705c] text-2xl font-bold mb-4">Your Locations</h2>
          {claimedPlaces.length === 0 ? (
            <div className="bg-[#f8f2ed] rounded-lg shadow-lg p-12 text-center">
              <MapPin className="text-[#a66a42] mx-auto mb-4" size={48} />
              <p className="text-[#75755c] text-lg">No locations yet</p>
              <p className="text-[#565a49] text-sm mt-2">Start by claiming a location on the map!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {claimedPlaces.map((place) => (
                <div key={place.id} className="bg-[#f8f2ed] rounded-lg shadow-lg overflow-hidden">
                  <img 
                    src={place.beforePhotoUrl || 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                    alt={place.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-[#2b2d25] font-semibold mb-2">
                      {place.name}
                    </h3>
                    <p className="text-[#75755c] text-sm mb-2">
                      <MapPin className="inline mr-1" size={14} />
                      {place.lat?.toFixed(4)}, {place.lng?.toFixed(4)}
                    </p>
                    <p className="text-[#75755c] text-sm mb-2">
                      <Calendar className="inline mr-1" size={14} />
                      {place.claimedAt ? new Date(place.claimedAt).toLocaleDateString() : 'Unknown date'}
                    </p>
                    {place.rewardTokens && (
                      <p className="text-[#a66a42] text-sm font-medium mb-2">
                        <Coins className="inline mr-1" size={14} />
                        Reward: {place.rewardTokens} ECO tokens
                      </p>
                    )}
                    {place.status === 'claimed' && (
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(place.id, e)}
                          className="hidden"
                          disabled={uploadingImage === place.id}
                        />
                        <div className="w-full bg-[#cb997e] hover:bg-[#b97550] text-[#2b2d25] text-center py-2 rounded-lg transition-colors cursor-pointer">
                          {uploadingImage === place.id ? 'Uploading...' : 'Upload After Photo'}
                        </div>
                      </label>
                    )}
                    {place.afterPhotoUrl && (
                      <div className="mt-3">
                        <p className="text-xs text-[#75755c] mb-1">After Photo:</p>
                        <img 
                          src={place.afterPhotoUrl} 
                          alt="After cleanup" 
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
