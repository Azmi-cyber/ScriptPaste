'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [customProfileImage, setCustomProfileImage] = useState<string>('');

  // Check for custom profile image from server
  useEffect(() => {
    if (session?.user?.email) {
      // Get current user's profile
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.image) {
            setCustomProfileImage(data.image);
          }
        })
        .catch(() => {
          // Fallback to localStorage
          const savedImage = localStorage.getItem(`profile_image_${session.user.email}`);
          if (savedImage) {
            setCustomProfileImage(savedImage);
          }
        });
    }
  }, [session]);

  // Determine which profile image to show
  const profileImage = customProfileImage || session?.user?.image || '';

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-lg flex items-center justify-center animate-pulse-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">ScriptPaste</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/scripts" className="text-gray-300 hover:text-white transition-colors">
              Scripts
            </Link>
            
            {session ? (
              <>
                <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">
                  Upload
                </Link>
                <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
                  Profile
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt={session.user?.name || 'User'} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {session.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-300 text-sm">{session.user?.name}</span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors border border-red-500/30"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Sign In with Google
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-gray-300 hover:text-white py-2">
              Home
            </Link>
            <Link href="/scripts" className="block text-gray-300 hover:text-white py-2">
              Scripts
            </Link>
            
            {session ? (
              <>
                <Link href="/upload" className="block text-gray-300 hover:text-white py-2">
                  Upload
                </Link>
                <Link href="/profile" className="block text-gray-300 hover:text-white py-2">
                  Profile
                </Link>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt={session.user?.name || 'User'} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {session.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-300 text-sm">{session.user?.name}</span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors border border-red-500/30"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="w-full px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-lg transition-all"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
