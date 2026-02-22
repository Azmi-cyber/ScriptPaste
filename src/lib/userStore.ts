// User profile store with JSON file persistence
import fs from 'fs';
import path from 'path';

export interface UserProfile {
  email: string;
  name: string;
  image: string; // profile picture base64
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USER_PROFILES_FILE = path.join(DATA_DIR, 'userProfiles.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readProfiles(): Record<string, UserProfile> {
  ensureDataDir();
  try {
    if (fs.existsSync(USER_PROFILES_FILE)) {
      const data = fs.readFileSync(USER_PROFILES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading user profiles:', error);
  }
  return {};
}

function writeProfiles(profiles: Record<string, UserProfile>) {
  ensureDataDir();
  try {
    fs.writeFileSync(USER_PROFILES_FILE, JSON.stringify(profiles, null, 2));
  } catch (error) {
    console.error('Error writing user profiles:', error);
  }
}

export function getUserProfile(email: string): UserProfile | null {
  const profiles = readProfiles();
  return profiles[email] || null;
}

export function saveUserProfile(email: string, name: string, image: string): UserProfile {
  const profiles = readProfiles();
  
  const profile: UserProfile = {
    email,
    name,
    image,
    updatedAt: new Date().toISOString(),
  };
  
  profiles[email] = profile;
  writeProfiles(profiles);
  
  return profile;
}

export function updateUserImage(email: string, image: string): UserProfile | null {
  const profiles = readProfiles();
  
  if (profiles[email]) {
    profiles[email].image = image;
    profiles[email].updatedAt = new Date().toISOString();
    writeProfiles(profiles);
    return profiles[email];
  }
  
  return null;
}

export function deleteUserImage(email: string): boolean {
  const profiles = readProfiles();
  
  if (profiles[email]) {
    profiles[email].image = '';
    profiles[email].updatedAt = new Date().toISOString();
    writeProfiles(profiles);
    return true;
  }
  
  return false;
}
