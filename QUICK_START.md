# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v16+) installed
- ✅ npm or yarn package manager
- ✅ **No database server needed!** SQLite is file-based.

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# (Optional) Create .env file from example
# Windows:
copy env.example .env
# Linux/Mac:
cp env.example .env

# The .env file is optional - defaults work fine!
# You can customize:
# - ADMIN_PASSWORD: Your desired admin password (default: Silk@8123)

# Start the server
npm start
```

**That's it!** The database will be automatically created in `backend/data/silk_market.db` with sample data on first run.

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Access the Application

1. **Public Dashboard**: Open `http://localhost:5173` in your browser
2. **Admin Panel**: Click "Admin Login" and enter the admin password (default: `Silk@8123`)

## Sample Data

The database is automatically populated with sample data on first run:
- Cocoon rates for Karnataka, Tamil Nadu, and West Bengal
- Silk prices for the same locations

You can view this data immediately on the dashboard!

## Testing the Application

### Add New Data (via Admin Panel)

1. Login as admin
2. Go to "Cocoon Rates" tab
3. Fill in the form:
   - Location: Karnataka
   - Date: Today's date
   - Max Price: 450
   - Avg Price: 420
   - Min Price: 400
   - Quantity: 1500
4. Click "Add Cocoon Rate"

5. Go to "Silk Prices" tab
6. Fill in the form:
   - Location: Karnataka
   - Price: 3500
   - Date: Today's date
7. Click "Add Silk Price"

### Verify Data

- Check the dashboard to see your data displayed
- View the graph section and switch between price types
- Test editing and deleting records in the admin panel

## Troubleshooting

### Backend won't start
- Ensure port 5000 is not in use
- Check that Node.js is installed: `node --version`
- Verify all dependencies are installed: `npm install`

### Frontend won't start
- Check if port 5173 is not in use
- Verify all dependencies are installed (`npm install`)

### Database issues
- The database is automatically created - no setup needed!
- If you encounter issues, delete `backend/data/silk_market.db` and restart the server
- Ensure the `backend/data` directory has write permissions

### CORS errors
- Ensure backend `.env` has correct `FRONTEND_URL` (or use default)
- Check both servers are running

## Default Credentials

- **Admin Password**: `Silk@8123` (change in `.env` file)

## Database Location

The SQLite database file is stored at:
- `backend/data/silk_market.db`

You can:
- Backup: Copy this file
- Reset: Delete this file and restart the server
- View: Use any SQLite browser tool (like DB Browser for SQLite)

## Next Steps

- Customize the admin password in `backend/.env`
- Add more sample data via the admin panel
- Customize the UI colors in `frontend/tailwind.config.js`
- Deploy to production (see README.md for production considerations)
