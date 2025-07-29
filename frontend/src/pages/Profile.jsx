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

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    Object.keys(editForm).forEach(key => {
      localStorage.setItem(key, editForm[key]);
    });

    setUserInfo(prev => ({ ...prev, ...editForm }));
    setIsEditing(false);
    alert('Profile updated successfully!');
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
    setUserInfo(prev => ({ ...prev, walletAddress: '' }));
    alert('Wallet disconnected.');
  };

  const inputClassName = (field) => `
    w-full px-4 py-3 bg-[#f5ebe5] border rounded-lg text-[#2b2d25] placeholder-[#75755c]
    focus:outline-none focus:ring-1 transition-all
    ${errors[field]
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-[#c6c6b6] focus:border-[#cb997e] focus:ring-[#cb997e]'
    }
  `;

  return (
    <div className="min-h-screen bg-[#2b2d25] relative py-12 px-6 flex justify-center">
      <Navigation />
      <div className="w-full max-w-4xl bg-[#f8f2ed] p-8 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Logo />
            <div>
              <h1 className="text-[#6b705c] text-3xl font-bold">Profile</h1>
              <p className="text-[#cb997e] text-sm">Manage your account information</p>
            </div>
          </div>

          {isEditing ? (
            <div className="flex space-x-2">
              <button onClick={handleSave} className="flex items-center space-x-2 px-4 py-2 bg-[#cb997e] text-[#2b2d25] rounded-lg hover:bg-[#b97550]">
                <Save size={16} />
                <span>Save</span>
              </button>
              <button onClick={handleCancel} className="flex items-center space-x-2 px-4 py-2 bg-[#c6c6b6] text-[#2b2d25] rounded-lg hover:bg-[#a5a58d]">
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-4 py-2 bg-[#cb997e] text-[#2b2d25] rounded-lg hover:bg-[#b97550]">
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="bg-[#f5ebe5] border border-[#c6c6b6] rounded-lg p-8 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="space-y-6">
            <h3 className="flex items-center space-x-2 text-[#6b705c] text-lg font-semibold">
              <User className="text-[#a66a42]" size={20} />
              <span>Personal Information</span>
            </h3>

            {['firstName', 'lastName', 'username'].map(field => (
              <div key={field}>
                <label className="block text-[#565a49] text-sm uppercase tracking-wider mb-2">{field.replace(/([A-Z])/g, ' $1')}</label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      placeholder={`Enter ${field}`}
                      value={editForm[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className={inputClassName(field)}
                    />
                    {errors[field] && <p className="text-sm text-red-600 mt-1">{errors[field]}</p>}
                  </>
                ) : (
                  <p className="text-[#2b2d25] text-lg">
                    {field === 'username' ? `@${userInfo[field]}` : userInfo[field] || 'Not provided'}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Contact & Location */}
          <div className="space-y-6">
            <h3 className="flex items-center space-x-2 text-[#6b705c] text-lg font-semibold">
              <Mail className="text-[#a66a42]" size={20} />
              <span>Contact & Location</span>
            </h3>

            {['email', 'city', 'country'].map(field => (
              <div key={field}>
                <label className="block text-[#565a49] text-sm uppercase tracking-wider mb-2">{field}</label>
                {isEditing ? (
                  <>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      placeholder={`Enter ${field}`}
                      value={editForm[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className={inputClassName(field)}
                    />
                    {errors[field] && <p className="text-sm text-red-600 mt-1">{errors[field]}</p>}
                  </>
                ) : (
                  <p className="text-[#2b2d25] text-lg">{userInfo[field] || 'Not provided'}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wallet & Membership */}
        <div className="bg-[#f5ebe5] border border-[#c6c6b6] rounded-lg p-8 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#565a49] text-sm uppercase tracking-wider mb-2">Wallet Address</label>
            {userInfo.walletAddress ? (
              <div className="flex items-center justify-between">
                <p className="text-[#2b2d25] font-mono text-lg">
                  {userInfo.walletAddress.slice(0, 6)}...{userInfo.walletAddress.slice(-4)}
                </p>
                <button onClick={handleDisconnectWallet} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                  Disconnect
                </button>
              </div>
            ) : (
              <p className="text-[#75755c]">No wallet connected</p>
            )}
          </div>

          <div>
            <label className="block text-[#565a49] text-sm uppercase tracking-wider mb-2">Member Since</label>
            <div className="flex items-center space-x-2">
              <Calendar className="text-[#a66a42]" size={16} />
              <p className="text-[#2b2d25] text-lg">{userInfo.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-[#f5ebe5] border border-[#c6c6b6] rounded-lg p-6">
          <h3 className="text-[#6b705c] text-lg font-semibold mb-4">Account Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="px-4 py-3 border border-[#c6c6b6] rounded-lg text-[#565a49] hover:text-[#2b2d25] hover:border-[#a5a58d] transition-all">
              Export Account Data
            </button>
            <button className="px-4 py-3 border border-[#c6c6b6] rounded-lg text-[#565a49] hover:text-[#2b2d25] hover:border-[#a5a58d] transition-all">
              Privacy Settings
            </button>
            <button className="px-4 py-3 border border-red-600 rounded-lg text-red-600 hover:text-red-700 hover:border-red-700 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
