import express from 'express';
import db from '../config/database.js';

const router = express.Router();

/**
 * GET /api/cocoon
 * Fetch all cocoon rates
 * Public endpoint - no authentication required
 */
router.get('/', (req, res) => {
  try {
    const rows = db.cocoon.getAll();
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching cocoon rates:', error);
    res.status(500).json({ error: 'Failed to fetch cocoon rates', details: error.message });
  }
});

/**
 * GET /api/cocoon/locations
 * Get unique locations with aggregated data
 * Returns location-wise statistics
 */
router.get('/locations', (req, res) => {
  try {
    const rows = db.cocoon.getLocations();
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).json({ error: 'Failed to fetch location data', details: error.message });
  }
});

/**
 * GET /api/cocoon/monthly
 * Get monthly aggregated data for charts
 * Returns data grouped by month and location
 */
router.get('/monthly', (req, res) => {
  try {
    const { type = 'average' } = req.query; // type can be: highest, average, minimum
    const rows = db.cocoon.getMonthly(type);
    res.json(rows || []);
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ error: 'Failed to fetch monthly data', details: error.message });
  }
});

export default router;
