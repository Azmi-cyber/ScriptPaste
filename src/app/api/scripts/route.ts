import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { v4 as uuidv4 } from 'uuid';
import { getScriptsStore, Script } from '@/lib/store';

export async function GET() {
  const scriptsStore = getScriptsStore();
  const scriptsArray = Array.from(scriptsStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return NextResponse.json({ scripts: scriptsArray });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, code, thumbnail } = body;

    if (!title || !code) {
      return NextResponse.json(
        { error: 'Title and code are required' },
        { status: 400 }
      );
    }

    const scriptsStore = getScriptsStore();
    
    const script: Script = {
      id: uuidv4(),
      title,
      description: description || '',
      code,
      thumbnail: thumbnail || '',
      authorId: session.user?.email || session.user?.name || 'unknown',
      authorName: session.user?.name || 'Unknown User',
      authorImage: session.user?.image || '',
      createdAt: new Date().toISOString(),
      downloads: 0,
    };

    scriptsStore.set(script.id, script);

    return NextResponse.json({ script }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create script' },
      { status: 500 }
    );
  }
}
