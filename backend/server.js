import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cocoonRoutes from './routes/cocoonRoutes.js';
import silkRoutes from './routes/silkRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { initializeDatabase, testConnection } from './config/database.js';

// Load environment variables
dotenv.config();

// Initialize database
try {
  initializeDatabase();
  testConnection();
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/cocoon', cocoonRoutes);
app.use('/api/silk', silkRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Silk Market API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

