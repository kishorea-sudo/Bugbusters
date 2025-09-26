import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    joinDate: user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Here you would typically save to your backend/context
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    // You could call an updateUser function from your auth context
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      bio: '',
      joinDate: user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  const getRoleInfo = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'System Administrator',
          color: 'text-purple-600 bg-purple-100',
          description: 'Full system access and management'
        };
      case 'pm':
        return {
          title: 'Project Manager',
          color: 'text-green-600 bg-green-100',
          description: 'Project oversight and coordination'
        };
      case 'member':
        return {
          title: 'Team Member',
          color: 'text-indigo-600 bg-indigo-100',
          description: 'Task execution and collaboration'
        };
      default:
        return {
          title: 'Client',
          color: 'text-blue-600 bg-blue-100',
          description: 'Project tracking and communication'
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="md:col-span-1">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=6366f1&color=fff&size=150`}
                  alt={formData.name}
                  className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="mt-4">
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${roleInfo.color}`}>
                  <User className="w-4 h-4" />
                  <span className="font-medium">{roleInfo.title}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{roleInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{formData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{formData.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{formData.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{formData.location || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Join Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="flex items-center space-x-2 p-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {new Date(formData.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              ) : (
                <div className="p-2">
                  <p className="text-gray-900">{formData.bio || 'No bio provided'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Password</h4>
              <p className="text-sm text-gray-500">Last updated 30 days ago</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Change Password
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;