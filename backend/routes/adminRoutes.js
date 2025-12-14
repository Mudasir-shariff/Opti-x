import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';
import { verifyAdminSimple } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/admin/login
 * Verify admin password
 * Note: This is a simple implementation. In production, use JWT tokens.
 * This route is public and does not require authentication.
 */
router.post('/login', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'No authorization header provided' });
    }

    const providedPassword = authHeader.replace('Bearer ', '');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (providedPassword !== adminPassword) {
      return res.status(401).json({ success: false, error: 'Invalid admin password' });
    }

    res.json({ success: true, message: 'Admin authenticated' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// All other admin routes require authentication
router.use(verifyAdminSimple);

// ========== COCOON RATES ADMIN ROUTES ==========

/**
 * POST /api/admin/cocoon
 * Add new cocoon rate entry
 */
router.post('/cocoon', [
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('max_price').isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  body('avg_price').isFloat({ min: 0 }).withMessage('Avg price must be a positive number'),
  body('min_price').isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { location, date, max_price, avg_price, min_price, quantity } = req.body;

    const result = db.cocoon.insert({
      location,
      date,
      max_price: parseFloat(max_price),
      avg_price: parseFloat(avg_price),
      min_price: parseFloat(min_price),
      quantity: parseFloat(quantity)
    });

    res.status(201).json({
      success: true,
      message: 'Cocoon rate added successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error adding cocoon rate:', error);
    res.status(500).json({ error: 'Failed to add cocoon rate' });
  }
});

/**
 * PUT /api/admin/cocoon/:id
 * Update existing cocoon rate entry
 */
router.put('/cocoon/:id', [
  body('location').optional().trim().notEmpty(),
  body('date').optional().isISO8601(),
  body('max_price').optional().isFloat({ min: 0 }),
  body('avg_price').optional().isFloat({ min: 0 }),
  body('min_price').optional().isFloat({ min: 0 }),
  body('quantity').optional().isFloat({ min: 0 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = {};
    
    // Only include valid fields
    Object.keys(req.body).forEach(key => {
      if (['location', 'date', 'max_price', 'avg_price', 'min_price', 'quantity'].includes(key)) {
        if (key.includes('price') || key === 'quantity') {
          updates[key] = parseFloat(req.body[key]);
        } else {
          updates[key] = req.body[key];
        }
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const result = db.cocoon.update(id, updates);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cocoon rate not found' });
    }

    res.json({ success: true, message: 'Cocoon rate updated successfully' });
  } catch (error) {
    console.error('Error updating cocoon rate:', error);
    res.status(500).json({ error: 'Failed to update cocoon rate' });
  }
});

/**
 * DELETE /api/admin/cocoon/:id
 * Delete cocoon rate entry
 */
router.delete('/cocoon/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.cocoon.delete(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cocoon rate not found' });
    }

    res.json({ success: true, message: 'Cocoon rate deleted successfully' });
  } catch (error) {
    console.error('Error deleting cocoon rate:', error);
    res.status(500).json({ error: 'Failed to delete cocoon rate' });
  }
});

// ========== SILK PRICES ADMIN ROUTES ==========

/**
 * POST /api/admin/silk
 * Add new silk price entry
 */
router.post('/silk', [
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('date').isISO8601().withMessage('Valid date is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { location, price, date } = req.body;

    const result = db.silk.insert({
      location,
      price: parseFloat(price),
      date
    });

    res.status(201).json({
      success: true,
      message: 'Silk price added successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error adding silk price:', error);
    res.status(500).json({ error: 'Failed to add silk price' });
  }
});

/**
 * PUT /api/admin/silk/:id
 * Update existing silk price entry
 */
router.put('/silk/:id', [
  body('location').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('date').optional().isISO8601()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (['location', 'price', 'date'].includes(key)) {
        if (key === 'price') {
          updates[key] = parseFloat(req.body[key]);
        } else {
          updates[key] = req.body[key];
        }
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const result = db.silk.update(id, updates);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Silk price not found' });
    }

    res.json({ success: true, message: 'Silk price updated successfully' });
  } catch (error) {
    console.error('Error updating silk price:', error);
    res.status(500).json({ error: 'Failed to update silk price' });
  }
});

/**
 * DELETE /api/admin/silk/:id
 * Delete silk price entry
 */
router.delete('/silk/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.silk.delete(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Silk price not found' });
    }

    res.json({ success: true, message: 'Silk price deleted successfully' });
  } catch (error) {
    console.error('Error deleting silk price:', error);
    res.status(500).json({ error: 'Failed to delete silk price' });
  }
});

export default router;
