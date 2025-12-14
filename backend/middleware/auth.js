import bcrypt from 'bcryptjs';

/**
 * Middleware to verify admin password with bcrypt (for production use)
 * Checks if the request has a valid admin password in the Authorization header
 * Note: This requires the admin password to be stored as a bcrypt hash
 */
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    // Extract password from "Bearer password" format
    const providedPassword = authHeader.replace('Bearer ', '');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = process.env.ADMIN_PASSWORD_HASH; // Should be set in production

    // If hashed password is available, use bcrypt comparison
    if (hashedPassword) {
      const isValid = await bcrypt.compare(providedPassword, hashedPassword);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid admin password' });
      }
    } else {
      // Fallback to simple comparison for development
      if (providedPassword !== adminPassword) {
        return res.status(401).json({ error: 'Invalid admin password' });
      }
    }

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Simple password verification (for development)
 * In production, use proper hashing
 */
export const verifyAdminSimple = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    const providedPassword = authHeader.replace('Bearer ', '');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (providedPassword !== adminPassword) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

