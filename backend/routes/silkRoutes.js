import express from 'express';
import db from '../config/database.js';

const router = express.Router();

/**
 * GET /api/silk
 * Fetch all silk prices
 * Public endpoint - no authentication required
 */
router.get('/', (req, res) => {
  try {
    const rows = db.silk.getAll();
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching silk prices:', error);
    res.status(500).json({ error: 'Failed to fetch silk prices', details: error.message });
  }
});

/**
 * GET /api/silk/locations
 * Get latest silk prices by location
 */
router.get('/locations', (req, res) => {
  try {
    const rows = db.silk.getLocations();
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching location silk prices:', error);
    res.status(500).json({ error: 'Failed to fetch location silk prices', details: error.message });
  }
});

export default router;
