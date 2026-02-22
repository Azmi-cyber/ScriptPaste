'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function ScriptDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [customAuthorImage, setCustomAuthorImage] = useState<string>('');

  useEffect(() => {
    fetch(`/api/scripts/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.script) {
          setScript(data.script);
          // Check for custom profile image from server
          fetch(`/api/user/profile?email=${encodeURIComponent(data.script.authorId)}`)
            .then(res => res.json())
            .then(profileData => {
              if (profileData.image) {
                setCustomAuthorImage(profileData.image);
              }
            })
            .catch(() => {
              // Fallback to localStorage
              const savedImage = localStorage.getItem(`profile_image_${data.script.authorId}`);
              if (savedImage) {
                setCustomAuthorImage(savedImage);
              }
            });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.id]);

  // Determine which author image to show
  const displayAuthorImage = customAuthorImage || script?.authorImage || '';

  const handleCopy = () => {
    if (script?.code) {
      navigator.clipboard.writeText(script.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this script?')) return;
    
    const res = await fetch(`/api/scripts/${script?.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      router.push('/scripts');
    }
  };

  const isOwner = session?.user?.email === script?.authorId || 
                 session?.user?.name === script?.authorId;
  const isAdmin = session?.user?.email === '200714@gmail.com';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass rounded-2xl p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-4">Script Not Found</h2>
          <Link href="/scripts" className="text-primary-400 hover:text-primary-300">
            ← Back to Scripts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/scripts" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Scripts
        </Link>

        {/* Header */}
        <div className="glass rounded-2xl overflow-hidden mb-6">
          {/* Thumbnail */}
          {script.thumbnail && (
            <div className="h-64 md:h-80 relative">
              <img 
                src={script.thumbnail} 
                alt={script.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{script.title}</h1>
                <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    {displayAuthorImage ? (
                      <img 
                        src={displayAuthorImage} 
                        alt={script.authorName}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xs">{script.authorName?.charAt(0)}</span>
                      </div>
                    )}
                    <span>{script.authorName}</span>
                  </div>
                  <span>•</span>
                  <span>{new Date(script.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                {script.description && (
                  <p className="text-gray-300">{script.description}</p>
                )}
              </div>

              {/* Actions */}
              {(isOwner || isAdmin) && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors border border-red-500/30 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Code Section */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Script Code</h2>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-primary-500/20 hover:bg-primary-500/40 text-primary-400 rounded-lg transition-colors border border-primary-500/30 flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Code
                </>
              )}
            </button>
          </div>
          <div className="p-6 bg-dark-950 overflow-x-auto">
            <pre className="code-preview text-gray-300 whitespace-pre-wrap break-words">
              {script.code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
