'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ScriptCard from '@/components/ScriptCard';

interface Script {
  id: string;
  title: string;
  description: string;
  code: string;
  thumbnail: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  createdAt: string;
  downloads: number;
}

export default function Home() {
  const { data: session } = useSession();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scripts')
      .then(res => res.json())
      .then(data => {
        setScripts(data.scripts || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Share Your</span>
              <br />
              <span className="text-white">Roblox Scripts</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Upload, share, and discover amazing Roblox scripts. Build faster with community-created solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link
                  href="/upload"
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg animate-pulse-glow"
                >
                  Upload Script
                </Link>
              ) : (
                <Link
                  href="/api/auth/signin"
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              )}
              <Link
                href="/scripts"
                className="px-8 py-4 glass hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/20"
              >
                Browse Scripts
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Scripts', value: scripts.length.toString() + '+' },
              { label: 'Developers', value: '100+' },
              { label: 'Downloads', value: '500+' },
              { label: 'Active Users', value: '50+' },
            ].map((stat, index) => (
              <div key={index} className="glass rounded-xl p-6 text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scripts Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Latest Scripts</h2>
            <Link href="/scripts" className="text-primary-400 hover:text-primary-300 transition-colors">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass rounded-xl p-6 animate-pulse">
                  <div className="h-40 bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : scripts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scripts.slice(0, 6).map((script) => (
                <ScriptCard key={script.id} script={script} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass rounded-xl">
              <div className="text-6xl mb-4">📜</div>
              <h3 className="text-xl font-semibold text-white mb-2">No scripts yet</h3>
              <p className="text-gray-400 mb-4">Be the first to share your Roblox script!</p>
              {session && (
                <Link
                  href="/upload"
                  className="inline-block px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Upload Script
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why ScriptPaste?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Easy Deployment',
                description: 'Deploy your scripts instantly with Vercel integration',
              },
              {
                icon: '🔒',
                title: 'Secure Storage',
                description: 'Your scripts are safely stored and versioned',
              },
              {
                icon: '🌐',
                title: 'Community Driven',
                description: 'Share and discover scripts from developers worldwide',
              },
            ].map((feature, index) => (
              <div key={index} className="glass rounded-xl p-8 text-center hover:bg-white/10 transition-colors">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
