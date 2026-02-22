# Deploy to Railway

This guide will help you deploy ScriptPaste to Railway.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Google OAuth Credentials**: Get your credentials from [Google Cloud Console](https://console.cloud.google.com)

## Step 1: Prepare Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth credentials:
   - **Authorized Redirect URI**: `https://your-app-name.up.railway.app/api/auth/callback/google`
   - **Authorized JavaScript Origins**: `https://your-app-name.up.railway.app`

## Step 2: Deploy to Railway

### Option A: Deploy from GitHub (Recommended)

1. Push your code to GitHub
2. Go to [Railway Dashboard](https://railway.app/dashboard)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your repository
6. Add the following environment variables:
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
   - `NEXTAUTH_URL`: `https://your-app-name.up.railway.app`
   - `NEXTAUTH_SECRET`: Generate a secure random string (use `openssl rand -base64 32`)
   - `NEXT_PUBLIC_APP_NAME`: `ScriptPaste`
   - `NEXT_PUBLIC_APP_URL`: `https://your-app-name.up.railway.app`

### Option B: Deploy using Railway CLI

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Create a new project:
   ```bash
   railway init
   ```

4. Set environment variables:
   ```bash
   railway variables set GOOGLE_CLIENT_ID=your_client_id
   railway variables set GOOGLE_CLIENT_SECRET=your_client_secret
   railway variables set NEXTAUTH_URL=https://your-app.up.railway.app
   railway variables set NEXTAUTH_SECRET=your_secret
   railway variables set NEXT_PUBLIC_APP_NAME=ScriptPaste
   railway variables set NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
   ```

5. Deploy:
   ```bash
   railway up
   ```

## Step 3: Configure Google OAuth

After deployment, update your Google OAuth credentials with the actual Railway URL:
1. Go to Google Cloud Console
2. Update Authorized Redirect URI to your actual Railway URL
3. Update Authorized JavaScript Origins

## Important Notes

### Data Persistence
- **Scripts**: Stored in-memory (resets on container restart). For production, consider adding a database.
- **Profile Pictures**: Stored in ephemeral filesystem. They will be lost on container restart/deploy. For persistent storage, you would need Railway's persistent disk or a database.

### Custom Domain (Optional)
1. Go to Railway Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update Google OAuth with the new domain

## Troubleshooting

### 500 Error on First Load
- Check that all environment variables are set correctly
- Verify NEXTAUTH_SECRET is set

### Google Login Not Working
- Ensure Authorized Redirect URI matches exactly (include https://)
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct

### Profile Pictures Lost After Restart
- This is expected behavior with ephemeral storage
- For persistent storage, consider using Railway's MySQL or PostgreSQL plugin
