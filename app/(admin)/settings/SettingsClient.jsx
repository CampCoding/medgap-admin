

"use client"; import React, { useState } from 'react';
import { Settings, Users, Clock, Shield, Check, Edit2, Save, X } from 'lucide-react';

const SystemSettingsClient = () => {
  const [examDuration, setExamDuration] = useState(60);
  const [teacherRegistration, setTeacherRegistration] = useState('Yes');
  const [editingRole, setEditingRole] = useState(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const roles = [
    { id: 1, name: 'Admin', permissions: 'Full Access', color: 'bg-red-50 border-red-200 text-red-800' },
    { id: 2, name: 'Teacher', permissions: 'Create Exams, Manage Questions', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { id: 3, name: 'Student', permissions: 'Take Exams, View Reports', color: 'bg-green-50 border-green-200 text-green-800' }
  ];

  const handleSavePreferences = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleEditRole = (roleId) => {
    setEditingRole(editingRole === roleId ? null : roleId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 my-3">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          </div>
          <p className="text-gray-600">Configure system preferences and manage user permissions</p>
        </div>

        {/* Save Notification */}
        {showSaveNotification && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">General Preferences</h2>
            </div>

            <div className="space-y-6">
              {/* Exam Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Default Exam Duration (minutes)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="30"
                    max="180"
                    step="15"
                    value={examDuration}
                    onChange={(e) => setExamDuration(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 min-w-[80px] text-center">
                    <span className="text-blue-800 font-semibold">{examDuration}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30 min</span>
                  <span>180 min</span>
                </div>
              </div>

              {/* Teacher Registration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Allow Teacher Registration
                </label>
                <div className="flex gap-3">
                  {['Yes', 'No', 'Admin Approval Required'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setTeacherRegistration(option)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                        teacherRegistration === option
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleSavePreferences}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>

          {/* User Roles & Permissions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">User Roles & Permissions</h2>
            </div>

            <div className="space-y-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`border rounded-xl p-4 transition-all duration-200 ${role.color} hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5" />
                        <span className="font-semibold text-lg">{role.name}</span>
                      </div>
                      <p className="text-sm opacity-80">{role.permissions}</p>
                      
                      {editingRole === role.id && (
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">Role Name</label>
                            <input
                              type="text"
                              defaultValue={role.name}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Permissions</label>
                            <textarea
                              defaultValue={role.permissions}
                              rows="2"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1">
                              <Check className="w-3 h-3" />
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingRole(null)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-xs py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleEditRole(role.id)}
                      className="ml-4 p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add New Role Button */}
              {/* <button className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Add New Role
              </button> */}
            </div>
          </div>
        </div>

        {/* Additional Settings Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Security Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Configure authentication and security policies</p>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">Configure →</button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Backup Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Manage automated backups and data retention</p>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm">Configure →</button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Control data privacy and user consent options</p>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">Configure →</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default SystemSettingsClient;