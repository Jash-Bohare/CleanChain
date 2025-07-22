import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { User, Mail, Wallet, Edit3, Save, X, MapPin, Calendar } from 'lucide-react';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    walletAddress: '',
    joinDate: new Date().toLocaleDateString()
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    city: '',
    country: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load user data from localStorage
    const savedEmail = localStorage.getItem('email') || '';
    const savedUsername = localStorage.getItem('username') || '';
    const savedFirstName = localStorage.getItem('firstName') || '';
    const savedLastName = localStorage.getItem('lastName') || '';
    const savedCity = localStorage.getItem('city') || '';
    const savedCountry = localStorage.getItem('country') || '';
    const savedWallet = localStorage.getItem('walletAddress') || '';
    
    setUserInfo({
      email: savedEmail,
      username: savedUsername,
      firstName: savedFirstName,
      lastName: savedLastName,
      city: savedCity,
      country: savedCountry,
      walletAddress: savedWallet,
      joinDate: new Date().toLocaleDateString()
    });
    
    setEditForm({
      email: savedEmail,
      username: savedUsername,
      firstName: savedFirstName,
      lastName: savedLastName,
      city: savedCity,
      country: savedCountry
    });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!editForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Username validation
    if (!editForm.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (editForm.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(editForm.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    // First name validation
    if (!editForm.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (editForm.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    // Last name validation
    if (!editForm.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (editForm.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    // City validation
    if (!editForm.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    // Country validation
    if (!editForm.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      // Update localStorage
      Object.keys(editForm).forEach(key => {
        localStorage.setItem(key, editForm[key]);
      });
      
      // Update state
      setUserInfo(prev => ({
        ...prev,
        ...editForm
      }));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  const handleCancel = () => {
    setEditForm({
      email: userInfo.email,
      username: userInfo.username,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      city: userInfo.city,
      country: userInfo.country
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleDisconnectWallet = () => {
    localStorage.removeItem('walletAddress');
    setUserInfo(prev => ({
      ...prev,
      walletAddress: ''
    }));
    alert('Wallet disconnected');
  };

  const inputClassName = (fieldName) => `
    w-full px-4 py-2 bg-[#0d0d0d] border rounded-lg text-white placeholder-gray-500 
    focus:outline-none focus:ring-1 transition-all
    ${errors[fieldName] 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-700 focus:border-white focus:ring-white'
    }
  `;

  const fullName = `${userInfo.firstName} ${userInfo.lastName}`.trim();
  const location = `${userInfo.city}, ${userInfo.country}`.trim();

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative">
      <Navigation />
      
      {/* Main content */}
      <div className="pt-20 px-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Logo />
            <div>
              <h1 className="text-white text-3xl font-bold">Profile</h1>
              <p className="text-gray-400 text-sm">Manage your account information</p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-8 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="text-gray-400" size={20} />
                <h3 className="text-white text-lg font-semibold">Personal Information</h3>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  First Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      className={inputClassName('firstName')}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-red-400 text-sm">{errors.firstName}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-white text-lg">{userInfo.firstName || 'Not provided'}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Last Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      className={inputClassName('lastName')}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-red-400 text-sm">{errors.lastName}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-white text-lg">{userInfo.lastName || 'Not provided'}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Username
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Enter username"
                      className={inputClassName('username')}
                    />
                    {errors.username && (
                      <p className="mt-1 text-red-400 text-sm">{errors.username}</p>
                    )}
                    <p className="mt-1 text-gray-500 text-xs">Only letters, numbers, and underscores allowed</p>
                  </div>
                ) : (
                  <p className="text-white text-lg">@{userInfo.username || 'Not provided'}</p>
                )}
              </div>
            </div>

            {/* Contact & Location Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="text-gray-400" size={20} />
                <h3 className="text-white text-lg font-semibold">Contact & Location</h3>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className={inputClassName('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-white text-lg">{userInfo.email || 'Not provided'}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  City
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                      className={inputClassName('city')}
                    />
                    {errors.city && (
                      <p className="mt-1 text-red-400 text-sm">{errors.city}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-white text-lg">{userInfo.city || 'Not provided'}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                  Country
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Enter country"
                      className={inputClassName('country')}
                    />
                    {errors.country && (
                      <p className="mt-1 text-red-400 text-sm">{errors.country}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-white text-lg">{userInfo.country || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-8 mb-6">
          <div className="flex items-center space-x-2 mb-6">
            <Wallet className="text-gray-400" size={20} />
            <h3 className="text-white text-lg font-semibold">Account Information</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Address */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                Wallet Address
              </label>
              {userInfo.walletAddress ? (
                <div className="flex items-center justify-between">
                  <p className="text-white text-lg font-mono">
                    {userInfo.walletAddress.slice(0, 6)}...{userInfo.walletAddress.slice(-4)}
                  </p>
                  <button
                    onClick={handleDisconnectWallet}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">No wallet connected</p>
              )}
            </div>

            {/* Join Date */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                Member Since
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="text-gray-400" size={16} />
                <p className="text-white text-lg">{userInfo.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Account Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all text-center">
              Export Account Data
            </button>
            <button className="px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all text-center">
              Privacy Settings
            </button>
            <button className="px-4 py-3 bg-[#0d0d0d] border border-red-700 rounded-lg text-red-400 hover:text-red-300 hover:border-red-600 transition-all text-center">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;