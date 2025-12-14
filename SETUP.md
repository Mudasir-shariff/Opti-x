# Setup Instructions - Fix All Errors

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all required packages including `better-sqlite3`.

## Step 2: Start Backend Server

```bash
# Make sure you're in the backend directory
cd backend
npm start
```

You should see:
```
Database file created/opened at: [path]
Database initialized successfully
Cocoon rates: 6 records
Silk prices: 6 records
Database connected successfully
Server is running on port 5000
```

If you see errors about missing packages, run `npm install` again.

## Step 3: Install Frontend Dependencies

Open a **new terminal window**:

```bash
cd frontend
npm install
```

## Step 4: Start Frontend Server

```bash
# Make sure you're in the frontend directory
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Step 5: Access the Application

1. Open your browser and go to: `http://localhost:5173`
2. The dashboard should load with sample data
3. If you see an error, check:
   - Backend is running on port 5000
   - Frontend is running on port 5173
   - Check browser console (F12) for detailed errors

## Common Issues and Fixes

### Issue: "Cannot find package 'better-sqlite3'"
**Fix:** Run `npm install` in the backend directory

### Issue: "Cannot connect to backend server"
**Fix:** 
1. Make sure backend is running: `cd backend && npm start`
2. Check if port 5000 is available
3. Verify backend started without errors

### Issue: "Port 5000 already in use"
**Fix:** 
1. Find and stop the process using port 5000
2. Or change PORT in `backend/.env` file

### Issue: "Port 5173 already in use"
**Fix:**
1. Find and stop the process using port 5173
2. Or change port in `frontend/vite.config.js`

### Issue: Database errors
**Fix:**
1. Delete `backend/data/silk_market.json` file
2. Restart the backend server (it will recreate the database with sample data)

## Verification Checklist

- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Backend server running (`npm start` in backend directory)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Frontend server running (`npm run dev` in frontend directory)
- [ ] Database file exists at `backend/data/silk_market.db`
- [ ] Can access `http://localhost:5173` in browser
- [ ] Dashboard shows data (not error message)

## Testing the API

You can test the backend API directly:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test cocoon locations
curl http://localhost:5000/api/cocoon/locations

# Test silk locations
curl http://localhost:5000/api/silk/locations
```

If these return JSON data, your backend is working correctly!

