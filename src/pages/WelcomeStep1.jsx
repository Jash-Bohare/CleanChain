import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';
import { ArrowRight, User, Mail, MapPin } from 'lucide-react';

const WelcomeStep1 = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    city: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Redirect if profile already exists
  useEffect(() => {
    const userProfileExists =
      localStorage.getItem('email') &&
      localStorage.getItem('username') &&
      localStorage.getItem('firstName') &&
      localStorage.getItem('lastName') &&
      localStorage.getItem('city') &&
      localStorage.getItem('country');

    if (userProfileExists) {
      navigate('/map '); // Change to your main route
    }
  }, [navigate]);

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
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      Object.keys(formData).forEach(key => {
        localStorage.setItem(key, formData[key]);
      });
      navigate('/welcome-step2');
    }
  };

  const inputClassName = (fieldName) => `
    w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 
    focus:outline-none focus:ring-1 transition-all
    ${errors[fieldName] 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-700 focus:border-white focus:ring-white'
    }
  `;

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      <Navigation />

      <div className="absolute bottom-0 left-0 opacity-20">
        <div className="grid grid-cols-8 gap-2 p-8">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-lg">
          <div className="flex flex-col items-center text-center">
            <Logo />

            <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
              Join Crypto Connect
            </h1>

            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Step 1 of 2
            </p>

            <p className="text-gray-400 text-sm mb-8">
              Tell us about yourself to get started
            </p>

            <div className="w-full space-y-6">
              <div className="text-left">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="text-gray-400" size={20} />
                  <h3 className="text-white text-lg font-semibold">Personal Information</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
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
                      <p className="mt-1 text-red-400 text-sm">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
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
                      <p className="mt-1 text-red-400 text-sm">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
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
                    <p className="mt-1 text-red-400 text-sm">{errors.username}</p>
                  )}
                  <p className="mt-1 text-gray-500 text-xs">Only letters, numbers, and underscores allowed</p>
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="text-gray-400" size={20} />
                  <h3 className="text-white text-lg font-semibold">Contact Information</h3>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
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
                    <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="text-gray-400" size={20} />
                  <h3 className="text-white text-lg font-semibold">Location</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
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
                      <p className="mt-1 text-red-400 text-sm">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
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
                      <p className="mt-1 text-red-400 text-sm">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 px-6 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 mt-8"
              >
                <span>Continue to Wallet Setup</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                <button className="hover:text-white transition-colors">Already have an account?</button>
                <span>•</span>
                <button className="hover:text-white transition-colors">Need help?</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep1;
