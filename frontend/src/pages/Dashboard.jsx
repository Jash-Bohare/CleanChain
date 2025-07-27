import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { Coins, TrendingUp, MapPin, Heart, Users, Calendar, ChevronUp } from 'lucide-react';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    firstName: '',
    lastName: ''
  });
  const [tokens, setTokens] = useState(2850);
  const [animatedTokens, setAnimatedTokens] = useState(0);
  const [claimedPlaces, setClaimedPlaces] = useState([
    {
      id: 1,
      name: 'Central Park',
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 245,
      claimedDate: '2024-01-15',
      tokensEarned: 150
    },
    {
      id: 2,
      name: 'Golden Gate Bridge',
      location: 'San Francisco, CA',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 189,
      claimedDate: '2024-01-10',
      tokensEarned: 120
    },
    {
      id: 3,
      name: 'Times Square',
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 312,
      claimedDate: '2024-01-08',
      tokensEarned: 200
    },
    {
      id: 4,
      name: 'Statue of Liberty',
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/356808/pexels-photo-356808.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 156,
      claimedDate: '2024-01-05',
      tokensEarned: 100
    },
    {
      id: 5,
      name: 'Brooklyn Bridge',
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 98,
      claimedDate: '2024-01-03',
      tokensEarned: 80
    }
  ]);

  useEffect(() => {
    // Load user data
    const username = localStorage.getItem('username') || 'Explorer';
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    
    setUserInfo({ username, firstName, lastName });

    // Animate token counter
    const duration = 2000;
    const steps = 60;
    const increment = tokens / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, tokens);
      setAnimatedTokens(Math.floor(current));
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedTokens(tokens);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [tokens]);

  const stats = {
    totalPlacesClaimed: claimedPlaces.length,
    totalUpvotes: claimedPlaces.reduce((sum, place) => sum + place.upvotes, 0),
    tokensThisMonth: 650,
    rank: '#1,247'
  };

  const fullName = `${userInfo.firstName} ${userInfo.lastName}`.trim();

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
                Welcome back, {fullName || `@${userInfo.username}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm uppercase tracking-wider">Total Balance</p>
              <div className="flex items-center space-x-2">
                <Coins className="text-yellow-500" size={24} />
                <span className="text-white text-2xl font-bold">
                  {animatedTokens.toLocaleString()}
                </span>
                <span className="text-yellow-500 text-sm font-medium">TOKENS</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {claimedPlaces.map((place) => (
              <div key={place.id} className="bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 hover:shadow-lg transition-all group">
                <div className="relative">
                  <img 
                    src={place.image} 
                    alt={place.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                    <ChevronUp className="text-green-400" size={14} />
                    <span className="text-white text-sm font-medium">{place.upvotes}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-yellow-600/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                    <Coins size={12} className="text-white" />
                    <span className="text-white text-xs font-medium">+{place.tokensEarned}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {place.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="text-gray-400" size={14} />
                    <span className="text-gray-400 text-sm">{place.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-400" size={14} />
                    <span className="text-gray-400 text-sm">
                      {new Date(place.claimedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;