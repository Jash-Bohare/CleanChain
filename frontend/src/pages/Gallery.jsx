import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { ChevronUp, ChevronDown, MapPin, Calendar, Filter, Search, Grid, List } from 'lucide-react';

const Gallery = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [places, setPlaces] = useState([
    {
      id: 1,
      name: 'Central Park',
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 245,
      downvotes: 12,
      uploadedBy: 'alex_explorer',
      uploadDate: '2024-01-15',
      category: 'parks'
    },
    {
      id: 2,
      name: 'Golden Gate Bridge',
      location: 'San Francisco, CA',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 189,
      downvotes: 8,
      uploadedBy: 'sarah_photos',
      uploadDate: '2024-01-14',
      category: 'landmarks'
    },
    {
      id: 3,
      name: 'Times Square',
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 312,
      downvotes: 23,
      uploadedBy: 'mike_city',
      uploadDate: '2024-01-13',
      category: 'urban'
    },
    {
      id: 4,
      name: 'Yosemite Valley',
      location: 'California, USA',
      image: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 156,
      downvotes: 5,
      uploadedBy: 'nature_lover',
      uploadDate: '2024-01-12',
      category: 'nature'
    },
    {
      id: 5,
      name: 'Brooklyn Bridge',
      location: 'New York, NY',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 98,
      downvotes: 3,
      uploadedBy: 'brooklyn_walker',
      uploadDate: '2024-01-11',
      category: 'landmarks'
    },
    {
      id: 6,
      name: 'Santorini Sunset',
      location: 'Santorini, Greece',
      image: 'https://images.pexels.com/photos/161815/santorini-travel-vacation-europe-161815.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 427,
      downvotes: 18,
      uploadedBy: 'greek_islands',
      uploadDate: '2024-01-10',
      category: 'travel'
    },
    {
      id: 7,
      name: 'Tokyo Tower',
      location: 'Tokyo, Japan',
      image: 'https://images.pexels.com/photos/2070485/pexels-photo-2070485.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 203,
      downvotes: 9,
      uploadedBy: 'tokyo_nights',
      uploadDate: '2024-01-09',
      category: 'landmarks'
    },
    {
      id: 8,
      name: 'Grand Canyon',
      location: 'Arizona, USA',
      image: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 334,
      downvotes: 14,
      uploadedBy: 'canyon_explorer',
      uploadDate: '2024-01-08',
      category: 'nature'
    }
  ]);

  const [userVotes, setUserVotes] = useState({});

  const categories = [
    { value: 'all', label: 'All Places' },
    { value: 'landmarks', label: 'Landmarks' },
    { value: 'nature', label: 'Nature' },
    { value: 'urban', label: 'Urban' },
    { value: 'parks', label: 'Parks' },
    { value: 'travel', label: 'Travel' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'upvotes', label: 'Most Upvoted' },
    { value: 'controversial', label: 'Most Controversial' }
  ];

  const handleVote = (placeId, voteType) => {
    const currentVote = userVotes[placeId];
    let newVote = null;

    if (currentVote === voteType) {
      // Remove vote if clicking the same button
      newVote = null;
    } else {
      // Set new vote
      newVote = voteType;
    }

    setUserVotes(prev => ({
      ...prev,
      [placeId]: newVote
    }));

    // Update place votes
    setPlaces(prev => prev.map(place => {
      if (place.id === placeId) {
        let upvotes = place.upvotes;
        let downvotes = place.downvotes;

        // Remove previous vote effect
        if (currentVote === 'up') upvotes--;
        if (currentVote === 'down') downvotes--;

        // Add new vote effect
        if (newVote === 'up') upvotes++;
        if (newVote === 'down') downvotes++;

        return { ...place, upvotes, downvotes };
      }
      return place;
    }));
  };

  const filteredAndSortedPlaces = places
    .filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           place.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || place.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case 'popular':
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        case 'upvotes':
          return b.upvotes - a.upvotes;
        case 'controversial':
          return (b.downvotes / Math.max(b.upvotes, 1)) - (a.downvotes / Math.max(a.upvotes, 1));
        default:
          return 0;
      }
    });

  const PlaceCard = ({ place }) => {
    const userVote = userVotes[place.id];
    const netVotes = place.upvotes - place.downvotes;

    return (
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 hover:shadow-lg transition-all group">
        <div className="relative">
          <img 
            src={place.image} 
            alt={place.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-white text-sm font-medium">+{netVotes}</span>
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
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-400" size={14} />
              <span className="text-gray-400 text-sm">
                {new Date(place.uploadDate).toLocaleDateString()}
              </span>
            </div>
            <span className="text-gray-400 text-sm">@{place.uploadedBy}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleVote(place.id, 'up')}
                className={`p-2 rounded-lg transition-all ${
                  userVote === 'up' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <ChevronUp size={16} />
              </button>
              <span className="text-white text-sm font-medium w-8 text-center">
                {place.upvotes}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleVote(place.id, 'down')}
                className={`p-2 rounded-lg transition-all ${
                  userVote === 'down' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <ChevronDown size={16} />
              </button>
              <span className="text-white text-sm font-medium w-8 text-center">
                {place.downvotes}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative">
      <Navigation />
      
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Logo />
            <div>
              <h1 className="text-white text-3xl font-bold">Gallery</h1>
              <p className="text-gray-400 text-sm">
                Discover and vote on amazing places
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-black' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-black' 
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search places..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400" size={16} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white appearance-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white appearance-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center">
              <span className="text-gray-400 text-sm">
                {filteredAndSortedPlaces.length} places found
              </span>
            </div>
          </div>
        </div>

        {/* Places Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredAndSortedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {filteredAndSortedPlaces.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">No places found</h3>
            <p className="text-gray-400 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;