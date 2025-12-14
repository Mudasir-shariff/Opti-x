# Silk Market Price Tracking System

A production-ready full-stack web application for tracking daily cocoon and silk prices in the silk market. Built with React.js, Tailwind CSS, and Supabase (PostgreSQL + Auth + RLS).

## 🚀 Features

- **Public Dashboard**: View all cocoon rates and silk prices (read-only)
- **Admin Panel**: Supabase Auth-protected admin interface for managing price data
- **Location-wise Statistics**: View aggregated data by fixed locations
- **Interactive Charts**: Monthly price trends with dynamic graph type switching (MAX/AVG/MIN)
- **Calculator Page**: Frontend-only profit/loss calculator
- **Auto-cleanup**: Data automatically deleted after 22 hours via Supabase cron
- **Row Level Security**: Secure data access with RLS policies
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🛠️ Tech Stack

### Frontend
- React.js 18 (Vite)
- Tailwind CSS
- Chart.js / React-Chartjs-2
- React Router DOM
- Supabase JS Client

### Backend/Database
- Supabase (PostgreSQL)
- Supabase Auth
- Row Level Security (RLS)
- pg_cron for auto-cleanup

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free tier works)

## 🏗️ Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from Settings > API

### 2. Set Up Database

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the SQL files in this order:
   - `supabase/schema.sql` - Creates tables and enums
   - `supabase/rls_policies.sql` - Sets up Row Level Security
   - `supabase/cleanup_job.sql` - Sets up 22-hour auto-delete job

### 3. Configure Environment Variables

1. Copy `frontend/env.example` to `frontend/.env`
2. Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Install Dependencies

```bash
cd frontend
npm install
```

### 5. Create Admin User

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user" and create an admin account
3. Use this email/password to login to the admin panel

### 6. Start Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## 📍 Fixed Locations

### Cocoon Locations (Only these allowed)
- Sidlaghatta
- Ramanagar
- Kollegal

### Silk Locations (Only these allowed)
- Sidlaghatta
- Ramanagar
- Kollegal
- Bangalore

Admin must select locations from dropdown menus only.

## 🗄️ Database Schema

### cocoon_rates
- `id` (uuid, primary key)
- `location` (enum: cocoon_location)
- `date` (timestamp)
- `max_price` (numeric)
- `avg_price` (numeric)
- `min_price` (numeric)
- `quantity` (numeric)
- `created_at` (timestamp)

### silk_prices
- `id` (uuid, primary key)
- `location` (enum: silk_location)
- `price` (numeric)
- `date` (timestamp)
- `created_at` (timestamp)

## 🔐 Security

### Row Level Security (RLS)
- **Public users**: SELECT only (read-only)
- **Authenticated admin users**: INSERT, UPDATE, DELETE

### Admin Access
- Admin routes are protected by Supabase Auth
- Only authenticated users can access `/admin`
- Modify RLS policies in `supabase/rls_policies.sql` to restrict to specific emails

## ⏱️ Auto-Delete Feature

All cocoon and silk data is automatically deleted after 22 hours using Supabase's pg_cron extension. The cleanup job runs every hour and removes data older than 22 hours.

To modify the cleanup schedule, edit `supabase/cleanup_job.sql`.

## 📊 Dashboard Features

### Cocoon Section
- Location-wise cards showing:
  - Maximum price
  - Average price
  - Minimum price
  - Total quantity
  - Number of lots

### Silk Section
- Location-wise price cards
- Latest price per location

### Graph Section
- Monthly cocoon price trends
- Toggle between MAX, AVG, and MIN prices
- Shows data for all three cocoon locations

## 🧮 Calculator Page (/calci)

- **Route**: `/calci`
- **Frontend-only**: No Supabase connection
- **Features**:
  - Profit/loss calculation
  - Input validation
  - Notifications
  - Reset functionality
  - Print results
  - Help dialog

## 🎨 UI/UX

- Professional market-grade design
- Mobile-first responsive layout
- Smooth transitions and animations
- Clean typography and spacing
- Modern card-based UI

## 📁 Project Structure

```
Silk/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin form components
│   │   │   ├── CocoonRateCards.jsx
│   │   │   ├── SilkPriceSection.jsx
│   │   │   └── PriceGraph.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── Calculator.jsx
│   │   ├── services/
│   │   │   └── supabase.js     # Supabase client & helpers
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state management
│   │   ├── utils/
│   │   │   └── constants.js    # Fixed location constants
│   │   └── App.jsx
│   └── .env
│
├── supabase/
│   ├── schema.sql              # Database schema
│   ├── rls_policies.sql        # Row Level Security policies
│   └── cleanup_job.sql         # Auto-delete cron job
│
└── README.md
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service

3. Set environment variables in your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Supabase Setup

- Database schema and RLS policies are already set up
- Cleanup job runs automatically on Supabase
- No additional backend deployment needed

## 🔧 Troubleshooting

### Database Connection Issues
- Verify Supabase URL and anon key in `.env`
- Check Supabase project is active
- Verify RLS policies are applied

### Admin Login Issues
- Ensure user exists in Supabase Auth
- Check RLS policies allow authenticated users to INSERT/UPDATE/DELETE

### Data Not Showing
- Check if data exists in Supabase tables
- Verify RLS policies allow SELECT for public users
- Check browser console for errors

### Auto-delete Not Working
- Verify pg_cron extension is enabled
- Check cleanup job is scheduled: `SELECT * FROM cron.job;`
- Manually test: `SELECT delete_old_cocoon_rates();`

## 📝 Notes

- **No dummy data**: All data comes from Supabase
- **No hardcoded prices**: All prices are from database
- **Fixed locations**: Only predefined locations are allowed
- **Calculator is frontend-only**: No Supabase connection
- **22-hour auto-delete**: Data is automatically cleaned up

## 📄 License

ISC

## 👤 Author

Built for Silk Market Price Tracking System
