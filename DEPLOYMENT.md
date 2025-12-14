# Deployment Guide

## Quick Start

This application uses Supabase as the backend, so you only need to deploy the frontend.

## Step 1: Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for project to be ready (2-3 minutes)

2. **Run Database Scripts**
   - Go to SQL Editor in Supabase dashboard
   - Run `supabase/schema.sql` first
   - Then run `supabase/rls_policies.sql`
   - Finally run `supabase/cleanup_job.sql`

3. **Create Admin User**
   - Go to Authentication > Users
   - Click "Add user"
   - Create user with email and password
   - This will be your admin login

4. **Get API Keys**
   - Go to Settings > API
   - Copy your Project URL
   - Copy your anon/public key

## Step 2: Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   - Copy `env.example` to `.env`
   - Add your Supabase URL and anon key

3. **Test Locally**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:5173
   - Test admin login
   - Add some test data

## Step 3: Deploy Frontend

### Option A: Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Option B: Netlify

1. Push code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Site settings

### Option C: Any Static Host

1. Build the project:
   ```bash
   npm run build
   ```
2. Upload the `dist` folder to your hosting service
3. Configure environment variables if supported

## Step 4: Verify Deployment

1. Visit your deployed site
2. Check dashboard loads data
3. Test admin login
4. Verify calculator works
5. Test adding/editing data as admin

## Important Notes

- **No Backend Server Needed**: Supabase handles all backend functionality
- **Environment Variables**: Must be set in your hosting platform
- **RLS Policies**: Ensure they're correctly applied in Supabase
- **Auto-cleanup**: Runs automatically on Supabase (no action needed)

## Troubleshooting

### Data Not Loading
- Check Supabase project is active
- Verify RLS policies allow SELECT
- Check browser console for errors
- Verify environment variables are set

### Admin Can't Login
- Verify user exists in Supabase Auth
- Check RLS policies allow authenticated users to INSERT/UPDATE/DELETE
- Try resetting password in Supabase dashboard

### Auto-delete Not Working
- Check pg_cron extension is enabled
- Verify cleanup job is scheduled
- Check Supabase logs for errors

