import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getUserProfile, saveUserProfile, updateUserImage, deleteUserImage } from '@/lib/userStore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  // If email is provided as query param, get that user's profile (public)
  // Otherwise, get current logged in user's profile
  let targetEmail = email;
  
  if (!targetEmail) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    targetEmail = session.user.email;
  }

  try {
    const profile = getUserProfile(targetEmail);
    // Only return the image, not the full profile (for privacy)
    return NextResponse.json({ image: profile?.image || null });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { image } = body;

    if (image) {
      // Save or update profile image
      const profile = saveUserProfile(
        session.user.email,
        session.user.name || 'Unknown',
        image
      );
      return NextResponse.json({ profile });
    } else {
      // Delete profile image
      deleteUserImage(session.user.email);
      return NextResponse.json({ success: true, profile: null });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
