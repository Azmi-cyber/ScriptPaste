'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile image from server
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      // First try to get from server (current user's profile)
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.image) {
            setProfileImage(data.image);
          }
        })
        .catch(() => {
          // Fallback to localStorage if server fails
          const savedImage = localStorage.getItem(`profile_image_${session.user?.email}`);
          if (savedImage) {
            setProfileImage(savedImage);
          }
        });
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass rounded-2xl p-8 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-gray-400 mb-6">You need to sign in to view your profile.</p>
          <button
            onClick={() => signIn('google')}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setMessage('Image size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        setMessage('Image loaded. Click Save to apply changes.');
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileImage = async () => {
    if (!profileImage || !session?.user?.email) return;
    
    setSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: profileImage }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfileImage(data.profile.image);
        
        // Also save to localStorage as backup
        localStorage.setItem(`profile_image_${session.user.email}`, data.profile.image);
        
        // Update session
        update({ image: data.profile.image });
        
        setMessage('Profile picture saved successfully! (Synced to server)');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      // Fallback to localStorage if server fails
      localStorage.setItem(`profile_image_${session.user.email}`, profileImage);
      update({ image: profileImage });
      setMessage('Profile picture saved! (Local only - server unavailable)');
    } finally {
      setSaving(false);
    }
  };

  const removeProfileImage = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: '' }),
      });

      if (res.ok) {
        setProfileImage('');
        localStorage.removeItem(`profile_image_${session.user.email}`);
        update({ image: null });
        setMessage('Profile picture removed!');
      } else {
        throw new Error('Failed to remove');
      }
    } catch (error) {
      setProfileImage('');
      localStorage.removeItem(`profile_image_${session.user.email}`);
      update({ image: null });
      setMessage('Profile picture removed (Local only)');
    } finally {
      setSaving(false);
    }
  };

  // Determine which image to display
  const displayImage = profileImage || session.user?.image;
  const isUsingCustomImage = !!profileImage;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Profile</h1>
          <p className="text-gray-400">Manage your account settings</p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-6">
          {message && (
            <div className={`px-4 py-3 rounded-lg ${message.includes('success') || message.includes('saved') || message.includes('removed') ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
              {message}
            </div>
          )}

          {/* Profile Picture Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Profile Picture {saving && '(Saving...)'}
            </label>
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center border-4 border-primary-500">
                    <span className="text-white text-4xl font-bold">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                {isUsingCustomImage && (
                  <button
                    onClick={removeProfileImage}
                    disabled={saving}
                    className="absolute -top-2 -right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    title="Remove custom image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {isUsingCustomImage ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profileImage && (
                  <button
                    type="button"
                    onClick={saveProfileImage}
                    disabled={saving}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-2">PNG, JPG, GIF (max 2MB) • Saved to server</p>
            </div>
          </div>

          {/* User Info */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Name</span>
                <span className="text-white font-medium">{session.user?.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Email</span>
                <span className="text-white font-medium">{session.user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400">Signed in with</span>
                <span className="text-white font-medium">Google</span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="pt-4">
            <button
              onClick={() => router.back()}
              className="w-full px-6 py-3 glass hover:bg-white/10 text-white rounded-xl font-semibold transition-colors border border-white/20"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
