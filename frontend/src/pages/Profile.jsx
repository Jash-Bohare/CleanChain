import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { User, Mail, Wallet, Edit3, Save, X, Calendar } from 'lucide-react';

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
  const [editForm, setEditForm] = useState({ ...userInfo });
  const [errors, setErrors] = useState({});

  // Load user data from localStorage on mount
  useEffect(() => {
    const getStored = (key) => localStorage.getItem(key) || '';
    const storedData = {
      email: getStored('email'),
      username: getStored('username'),
      firstName: getStored('firstName'),
      lastName: getStored('lastName'),
      city: getStored('city'),
      country: getStored('country'),
      walletAddress: getStored('walletAddress'),
      joinDate: new Date().toLocaleDateString()
    };

    setUserInfo(storedData);
    setEditForm({
      email: storedData.email,
      username: storedData.username,
      firstName: storedData.firstName,
      lastName: storedData.lastName,
      city: storedData.city,
      country: storedData.country
    });
  }, []);

  // Validate fields before saving
  const validateForm = () => {
    const newErrors = {};

    if (!editForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!editForm.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (editForm.username.length < 3) {
      newErrors.username = 'Min 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(editForm.username)) {
      newErrors.username = 'Only letters, numbers, underscores';
    }

    if (!editForm.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!editForm.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!editForm.city.trim()) newErrors.city = 'City is required';
    if (!editForm.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Save profile
  const handleSave = () => {
    if (!validateForm()) return;

    Object.keys(editForm).forEach(key => {
      localStorage.setItem(key, editForm[key]);
    });

    setUserInfo(prev => ({ ...prev, ...editForm }));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  // Cancel edit
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

  // Disconnect wallet
  const handleDisconnectWallet = () => {
    localStorage.removeItem('walletAddress');
    setUserInfo(prev => ({ ...prev, walletAddress: '' }));
    alert('Wallet disconnected.');
  };

  const inputClassName = (field) => `
    w-full px-4 py-2 bg-[#0d0d0d] border rounded-lg text-white placeholder-gray-500 
    focus:outline-none focus:ring-1 transition-all
    ${errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-white'}
  `;

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative">
      <Navigation />

      <div className="pt-20 px-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Logo />
            <div>
              <h1 className="text-white text-3xl font-bold">Profile</h1>
              <p className="text-gray-400 text-sm">Manage your account information</p>
            </div>
          </div>

          {isEditing ? (
            <div className="flex space-x-2">
              <button onClick={handleSave} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Save size={16} />
                <span>Save</span>
              </button>
              <button onClick={handleCancel} className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100">
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-8 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="space-y-6">
            <h3 className="flex items-center space-x-2 text-white text-lg font-semibold">
              <User className="text-gray-400" size={20} />
              <span>Personal Information</span>
            </h3>

            {['firstName', 'lastName', 'username'].map(field => (
              <div key={field}>
                <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">{field.replace(/([A-Z])/g, ' $1')}</label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      placeholder={`Enter ${field}`}
                      value={editForm[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className={inputClassName(field)}
                    />
                    {errors[field] && <p className="text-sm text-red-400 mt-1">{errors[field]}</p>}
                  </>
                ) : (
                  <p className="text-white text-lg">
                    {field === 'username' ? `@${userInfo[field]}` : userInfo[field] || 'Not provided'}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Contact & Location */}
          <div className="space-y-6">
            <h3 className="flex items-center space-x-2 text-white text-lg font-semibold">
              <Mail className="text-gray-400" size={20} />
              <span>Contact & Location</span>
            </h3>

            {['email', 'city', 'country'].map(field => (
              <div key={field}>
                <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">{field}</label>
                {isEditing ? (
                  <>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      placeholder={`Enter ${field}`}
                      value={editForm[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className={inputClassName(field)}
                    />
                    {errors[field] && <p className="text-sm text-red-400 mt-1">{errors[field]}</p>}
                  </>
                ) : (
                  <p className="text-white text-lg">{userInfo[field] || 'Not provided'}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wallet & Membership */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-8 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">Wallet Address</label>
            {userInfo.walletAddress ? (
              <div className="flex items-center justify-between">
                <p className="text-white font-mono text-lg">
                  {userInfo.walletAddress.slice(0, 6)}...{userInfo.walletAddress.slice(-4)}
                </p>
                <button onClick={handleDisconnectWallet} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                  Disconnect
                </button>
              </div>
            ) : (
              <p className="text-gray-400">No wallet connected</p>
            )}
          </div>

          <div>
            <label className="block text-gray-400 text-sm uppercase tracking-wider mb-2">Member Since</label>
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-400" size={16} />
              <p className="text-white text-lg">{userInfo.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Account Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all">
              Export Account Data
            </button>
            <button className="px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all">
              Privacy Settings
            </button>
            <button className="px-4 py-3 border border-red-700 rounded-lg text-red-400 hover:text-red-300 hover:border-red-600 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
