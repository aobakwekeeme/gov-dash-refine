import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Save, Upload, User, Mail, Phone, UserCheck } from 'lucide-react';

const ProfileManagement: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          avatar_url: profileData.avatar_url,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 1MB)
    const maxSize = 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 1MB');
      return;
    }

    try {
      setLoading(true);

      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setProfileData({ ...profileData, avatar_url: data.publicUrl });
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-teal-600 hover:text-teal-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileData.avatar_url ? (
                    <img
                      src={profileData.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-teal-600 text-white rounded-full p-2 cursor-pointer hover:bg-teal-700">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Click the upload icon to change your profile picture (max 1MB)</p>
            </div>

            {/* Account Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-teal-600" />
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile?.role || 'customer'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 capitalize"
                  />
                  <p className="text-xs text-gray-500 mt-1">Role is assigned by administrators</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-teal-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Account Creation Date */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Account Created:</span>
                    <p className="text-gray-600">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <p className="text-gray-600">
                      {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleSave}
                disabled={loading || !profileData.full_name}
                className="w-full flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;