import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getScriptsStore } from '@/lib/store';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const userEmail = session.user?.email || '';
  const userName = session.user?.name || '';
  const isAdmin = userEmail === '200714@gmail.com';

  const scriptsStore = getScriptsStore();
  const script = scriptsStore.get(id);
  
  if (!script) {
    return NextResponse.json({ error: 'Script not found' }, { status: 404 });
  }

  // Check if user is the owner or admin
  const isOwner = script.authorId === userEmail || 
                  script.authorId === userName ||
                  script.authorId === session.user?.email;
  
  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { error: 'You can only delete your own scripts' },
      { status: 403 }
    );
  }

  scriptsStore.delete(id);

  return NextResponse.json({ message: 'Script deleted successfully' });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const scriptsStore = getScriptsStore();
  
  const script = scriptsStore.get(id);
  
  if (!script) {
    return NextResponse.json({ error: 'Script not found' }, { status: 404 });
  }

  return NextResponse.json({ script });
}
