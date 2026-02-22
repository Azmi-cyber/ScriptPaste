# ScriptPaste - Roblox Script Sharing Platform

A modern platform for uploading, sharing, and discovering Roblox scripts. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Google OAuth + Admin Login
- 📜 **Script Management**: Upload, browse, and delete Roblox scripts
- 🖼️ **Thumbnail Support**: Add custom thumbnails to your scripts
- 👨‍💼 **Admin Panel**: Special admin account to manage all scripts
- 🎨 **Modern UI**: Beautiful dark theme with glass morphism effects
- 🚀 **Vercel Ready**: Deploy easily to Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ScriptPaste
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Edit .env.local file
# You'll need to create a Google OAuth project
# https://console.cloud.google.com/apis/credentials

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Admin Credentials

- **Username**: `200714`
- **Password**: `200714`

**Important**: Keep these credentials secure and change the password for production use.

## User Roles

### Admin
- Can delete any script
- Can upload scripts
- Can upload thumbnails
- Full access to all features

### Regular Users
- Can upload their own scripts
- Can upload thumbnails
- Can delete their own scripts
- Cannot delete other users' scripts

## Deployment to Vercel

1. Push your code to GitHub
2. Import the project to Vercel
3. Configure environment variables in Vercel dashboard:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL` (your Vercel URL)
   - `NEXTAUTH_SECRET`
4. Deploy!

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: In-memory (for demo, use a database in production)

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth routes
│   │   └── scripts/      # Scripts CRUD
│   ├── auth/signin/      # Custom sign-in page
│   ├── scripts/          # Scripts listing & detail
│   ├── upload/          # Upload page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
├── lib/                 # Utility functions
└── types/               # TypeScript declarations
```

## License

MIT
