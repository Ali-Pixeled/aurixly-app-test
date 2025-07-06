import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { User, Mail, Calendar, Shield, LogOut, Edit, Save, X } from 'lucide-react';

export function Profile() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  if (!currentUser) return null;

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      name: editForm.name,
      email: editForm.email,
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const profileStats = [
    {
      label: 'Member Since',
      value: currentUser.createdAt.toLocaleDateString(),
      icon: Calendar,
    },
    {
      label: 'Total Invested',
      value: `$${currentUser.totalInvested.toFixed(2)}`,
      icon: User,
    },
    {
      label: 'Total Earned',
      value: `$${currentUser.totalEarned.toFixed(2)}`,
      icon: User,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <p className="text-gray-600 mt-2">Manage your account settings</p>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{currentUser.name}</h3>
            <p className="text-indigo-100">{currentUser.email}</p>
            {currentUser.isAdmin && (
              <div className="flex items-center space-x-2 mt-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Administrator</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-colors"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {profileStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 rounded-lg p-3">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
            >
              <Edit className="h-4 w-4" />
              <span className="text-sm">Edit</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">{currentUser.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium text-gray-900">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">{currentUser.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Keep your account secure by using a strong password and never sharing your login credentials.
          </p>
        </div>
      </div>
    </div>
  );
}