'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

interface ScriptCardProps {
  script: Script;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
}

export default function ScriptCard({ script, showDelete = false, onDelete }: ScriptCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [customAuthorImage, setCustomAuthorImage] = useState<string>('');

  // Check for custom profile image from server
  useEffect(() => {
    if (script.authorId) {
      fetch(`/api/user/profile?email=${encodeURIComponent(script.authorId)}`)
        .then(res => res.json())
        .then(data => {
          if (data.image) {
            setCustomAuthorImage(data.image);
          }
        })
        .catch(() => {
          // Fallback to localStorage
          const savedImage = localStorage.getItem(`profile_image_${script.authorId}`);
          if (savedImage) {
            setCustomAuthorImage(savedImage);
          }
        });
    }
  }, [script.authorId]);

  // Determine which image to show
  const displayAuthorImage = customAuthorImage || script.authorImage;

  const isOwner = session?.user?.email === script.authorId;
  const isAdmin = session?.user?.email === '200714@gmail.com';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this script?')) return;
    
    const res = await fetch(`/api/scripts/${script.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      if (onDelete) {
        onDelete(script.id);
      } else {
        router.refresh();
      }
    }
  };

  return (
    <div className="glass rounded-xl overflow-hidden hover:bg-white/10 transition-all transform hover:scale-[1.02] group">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-primary-500/20 to-purple-500/20 overflow-hidden">
        {script.thumbnail ? (
          <img 
            src={script.thumbnail} 
            alt={script.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <Link
              href={`/scripts/${script.id}`}
              className="flex-1 px-3 py-2 bg-primary-500/80 hover:bg-primary-500 text-white text-sm rounded-lg text-center transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 truncate">{script.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{script.description}</p>
        
        {/* Author */}
        <div className="flex items-center justify-between">
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
            <span className="text-gray-400 text-sm">{script.authorName}</span>
          </div>
          
          {/* Delete Button */}
          {(isOwner || isAdmin) && showDelete && (
            <button
              onClick={handleDelete}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
              title={isAdmin ? "Delete (Admin)" : "Delete"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Date */}
        <div className="mt-2 text-xs text-gray-500">
          {new Date(script.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
}
