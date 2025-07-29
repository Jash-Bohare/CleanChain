import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { ArrowRight, User, Mail, MapPin } from 'lucide-react';

import { connectWallet } from '../utils/wallet';
import { updateUserProfile, walletLogin } from '../api';

const WelcomeStep1 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    city: '',
    country: ''
  });

  const [errors, setErrors] = useState({});
  const [connectingWallet, setConnectingWallet] = useState(false);

  // Prefill data from localStorage instead of redirecting
  useEffect(() => {
    const savedData = {
      email: localStorage.getItem('email') || '',
      username: localStorage.getItem('username') || '',
      firstName: localStorage.getItem('firstName') || '',
      lastName: localStorage.getItem('lastName') || '',
      city: localStorage.getItem('city') || '',
      country: localStorage.getItem('country') || ''
    };
    setFormData(savedData);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Only letters, numbers, and underscores allowed';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setConnectingWallet(true);

    const walletAddress = await connectWallet();
    if (!walletAddress) {
      alert('Please connect your wallet to continue.');
      setConnectingWallet(false);
      return;
    }

    try {
      const res = await walletLogin(walletAddress);
      if (!res?.isNewUser) {
        localStorage.setItem('walletAddress', walletAddress);
        localStorage.setItem('onboardingComplete', 'true');
        navigate('/welcomestep2');
        return;
      }
    } catch (err) {
      console.error('walletLogin error:', err);
      alert('Something went wrong during wallet login.');
      setConnectingWallet(false);
      return;
    }

    const profileData = {
      ...formData,
      walletAddress
    };

    try {
      const updateRes = await updateUserProfile(profileData);
      if (updateRes?.message === 'Profile updated successfully') {
        Object.keys(formData).forEach((key) =>
          localStorage.setItem(key, formData[key])
        );
        localStorage.setItem('walletAddress', walletAddress);
        navigate('/welcomestep2');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('updateUserProfile error:', err);
      alert('An error occurred. Please try again later.');
    }

    setConnectingWallet(false);
  };

  const inputClassName = (fieldName) => `
    w-full px-4 py-3 bg-[#f5ebe5] border rounded-lg text-[#2b2d25] placeholder-[#75755c]
    focus:outline-none focus:ring-1 transition-all
    ${errors[fieldName]
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-[#c6c6b6] focus:border-[#cb997e] focus:ring-[#cb997e]'
    }
  `;

  return (
    <div className="min-h-screen bg-[#2b2d25] flex items-center justify-center px-4 py-12">
      <Navigation />
      <div className="w-full max-w-lg bg-[#f8f2ed] p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <Logo />

          <h1 className="text-[#6b705c] text-4xl font-bold mb-4 leading-tight">
            Join Crypto Connect
          </h1>

          <p className="text-[#cb997e] text-sm uppercase tracking-wider mb-2">
            Step 1 of 2
          </p>

          <p className="text-[#5f3a26] text-sm mb-8">
            Tell us about yourself to get started
          </p>

          <div className="w-full space-y-6">
            {/* Personal Info */}
            <div className="text-left">
              <div className="flex items-center space-x-2 mb-4">
                <User className="text-[#a66a42]" size={20} />
                <h3 className="text-[#6b705c] text-lg font-semibold">Personal Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[#565a49] text-sm font-medium mb-2 uppercase tracking-wider">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    className={inputClassName('firstName')}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-red-600 text-sm">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#565a49] text-sm font-medium mb-2 uppercase tracking-wider">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    className={inputClassName('lastName')}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-red-600 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[#565a49] text-sm font-medium mb-2 uppercase tracking-wider">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="johndoe123"
                  className={inputClassName('username')}
                />
                {errors.username && (
                  <p className="mt-1 text-red-600 text-sm">{errors.username}</p>
                )}
                <p className="mt-1 text-[#75755c] text-xs">Only letters, numbers, and underscores allowed</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-left">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="text-[#a66a42]" size={20} />
                <h3 className="text-[#6b705c] text-lg font-semibold">Contact Information</h3>
              </div>

              <div className="mb-4">
                <label className="block text-[#565a49] text-sm font-medium mb-2 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                  className={inputClassName('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-red-600 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Location Info */}
            <div className="text-left">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="text-[#a66a42]" size={20} />
                <h3 className="text-[#6b705c] text-lg font-semibold">Location</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#565a49] text-sm font-medium mb-2 uppercase tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                    className={inputClassName('city')}
                  />
                  {errors.city && (
                    <p className="mt-1 text-red-600 text-sm">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#565a49] text-sm font-medium mb-2 uppercase tracking-wider">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="United States"
                    className={inputClassName('country')}
                  />
                  {errors.country && (
                    <p className="mt-1 text-red-600 text-sm">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleNext}
              disabled={connectingWallet}
              className="w-full py-3 px-6 bg-[#cb997e] text-[#2b2d25] font-semibold rounded-lg hover:bg-[#b97550] transition-colors flex items-center justify-center space-x-2 mt-8"
            >
              <span>{connectingWallet ? 'Connecting Wallet...' : 'Continue to Wallet Setup'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep1;
