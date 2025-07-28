import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { Coins, TrendingUp, MapPin, Heart, Users, Calendar, ChevronUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getUserLocations, getUserProfile, getWalletBalance, getTokenBalance, uploadAfterImage } from '../api';

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

  const getStatusIcon = (status, cleaned, rewarded) => {
    if (cleaned && rewarded) {
      return <CheckCircle className="text-green-400" size={16} />;
    } else if (cleaned && !rewarded) {
      return <Clock className="text-blue-400" size={16} />;
    } else if (status === 'photo_uploaded') {
      return <Clock className="text-purple-400" size={16} />;
    } else if (status === 'claimed') {
      return <Clock className="text-yellow-400" size={16} />;
    } else {
      return <AlertCircle className="text-red-400" size={16} />;
    }
  };

  const getStatusText = (status, cleaned, rewarded) => {
    if (cleaned && rewarded) {
      return 'Rewarded';
    } else if (cleaned && !rewarded) {
      return 'Cleaned';
    } else if (status === 'photo_uploaded') {
      return 'Photo Uploaded';
    } else if (status === 'claimed') {
      return 'Claimed';
    } else {
      return 'Unknown';
    }
  };

  const getStatusColor = (status, cleaned, rewarded) => {
    if (cleaned && rewarded) {
      return 'text-green-400';
    } else if (cleaned && !rewarded) {
      return 'text-blue-400';
    } else if (status === 'photo_uploaded') {
      return 'text-purple-400';
    } else if (status === 'claimed') {
      return 'text-yellow-400';
    } else {
      return 'text-red-400';
    }
  };

  const calculateStats = () => {
    const totalPlacesClaimed = claimedPlaces.length;
    const totalCleaned = claimedPlaces.filter(place => place.cleaned).length;
    const totalUpvotes = claimedPlaces.reduce((sum, place) => {
      const votes = place.votes || [];
      return sum + votes.filter(v => v.voteType === 'up').length;
    }, 0);
    const tokensThisMonth = claimedPlaces
      .filter(place => place.cleaned && place.rewarded)
      .reduce((sum, place) => sum + (place.rewardTokens || 10), 0);

    return {
      totalPlacesClaimed,
      totalCleaned,
      totalUpvotes,
      tokensThisMonth
    };
  };

  const handleImageUpload = async (locationId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(locationId);
      await uploadAfterImage(locationId, file);
      
      // Refresh the locations data
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

      // Fetch user profile, locations, and wallet balance in parallel
      const [profileData, locationsData] = await Promise.all([
        getUserProfile(walletAddress),
        getUserLocations(walletAddress)
      ]);

      // Try to fetch wallet balance, but don't fail if it doesn't work
      let balanceData = { tokenBalance: 0, ethBalance: 0 };
      try {
        balanceData = await getWalletBalance(walletAddress);
      } catch (balanceError) {
        console.warn('Could not fetch wallet balance:', balanceError);
        // Use Firestore tokens as fallback
        balanceData = { 
          tokenBalance: profileData.userData?.tokens || 0,
          ethBalance: 0
        };
      }

      // Set user info and wallet balances
      setUserInfo({
        username: profileData.userData?.username || 'Explorer',
        email: profileData.userData?.email || '',
        tokens: balanceData.tokenBalance || 0
      });

      setWalletBalances({
        ethBalance: balanceData.ethBalance || 0,
        tokenBalance: balanceData.tokenBalance || 0
      });

      // Set claimed places
      setClaimedPlaces(locationsData.locations || []);

      // Animate token counter
      animateTokenCounter(balanceData.tokenBalance || 0);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-white text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative">
      <Navigation />
      
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Logo />
            <div>
              <h1 className="text-white text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-400 text-sm">
                Welcome back, @{userInfo.username}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-gray-400 text-sm uppercase tracking-wider">ETH Balance</p>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Ξ</span>
                </div>
                <span className="text-white text-2xl font-bold">
                  {walletBalances.ethBalance.toFixed(4)}
                </span>
                <span className="text-blue-400 text-sm font-medium">ETH</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-gray-400 text-sm uppercase tracking-wider">ECO Tokens</p>
              <div className="flex items-center space-x-2">
                <Coins className="text-yellow-500" size={24} />
                <span className="text-white text-2xl font-bold">
                  {animatedTokens.toLocaleString()}
                </span>
                <span className="text-yellow-500 text-sm font-medium">ECO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Claimed</p>
                <p className="text-white text-2xl font-bold">{stats.totalPlacesClaimed}</p>
              </div>
              <MapPin className="text-blue-400" size={24} />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Cleaned</p>
                <p className="text-white text-2xl font-bold">{stats.totalCleaned}</p>
              </div>
              <CheckCircle className="text-green-400" size={24} />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Upvotes</p>
                <p className="text-white text-2xl font-bold">{stats.totalUpvotes}</p>
              </div>
              <Heart className="text-red-400" size={24} />
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tokens This Month</p>
                <p className="text-white text-2xl font-bold">{stats.tokensThisMonth}</p>
              </div>
              <TrendingUp className="text-yellow-400" size={24} />
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">ETH Balance</p>
                <p className="text-white text-2xl font-bold">{walletBalances.ethBalance.toFixed(4)}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">Ξ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Claimed Places Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold">Your Claimed Places</h2>
            <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
              View All
            </button>
          </div>

          {claimedPlaces.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-400 text-lg">No places claimed yet</p>
              <p className="text-gray-500 text-sm mt-2">Start by claiming a location on the map!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {claimedPlaces.map((place) => (
                <div key={place.id} className="bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 hover:shadow-lg transition-all group">
                  <div className="relative">
                    <img 
                      src={place.beforePhotoUrl || 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                      alt={place.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                      {getStatusIcon(place.status, place.cleaned, place.rewarded)}
                      <span className={`text-sm font-medium ${getStatusColor(place.status, place.cleaned, place.rewarded)}`}>
                        {getStatusText(place.status, place.cleaned, place.rewarded)}
                      </span>
                    </div>
                    {place.rewarded && (
                      <div className="absolute bottom-3 left-3 bg-yellow-600/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                        <Coins size={12} className="text-white" />
                        <span className="text-white text-xs font-medium">+{place.rewardTokens || 10}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                      {place.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="text-gray-400" size={14} />
                      <span className="text-gray-400 text-sm">
                        {place.lat?.toFixed(4)}, {place.lng?.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar className="text-gray-400" size={14} />
                      <span className="text-gray-400 text-sm">
                        {place.claimedAt ? new Date(place.claimedAt).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                    
                    {/* Upload button for claimed locations */}
                    {place.status === 'claimed' && (
                      <div className="mt-3">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(place.id, e)}
                            className="hidden"
                            disabled={uploadingImage === place.id}
                          />
                          <div className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                            {uploadingImage === place.id ? 'Uploading...' : 'Upload After Photo'}
                          </div>
                        </label>
                      </div>
                    )}

                    {/* Show after photo if uploaded */}
                    {place.afterPhotoUrl && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-2">After Photo:</p>
                        <img 
                          src={place.afterPhotoUrl} 
                          alt="After cleanup" 
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {place.cleaned && place.cleanedBy && (
                      <div className="mt-2 text-xs text-green-400">
                        Cleaned by: {place.cleanedBy.slice(0, 6)}...{place.cleanedBy.slice(-4)}
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