// Shared data store for scripts
// In production, use a database like PostgreSQL, MongoDB, or Redis

export interface Script {
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

// Use global to persist across hot reloads in development
export function getScriptsStore(): Map<string, Script> {
  if (!(global as any).scripts) {
    (global as any).scripts = new Map();
  }
  return (global as any).scripts;
}

export function setScriptsStore(store: Map<string, Script>) {
  (global as any).scripts = store;
}
