import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Access denied: No token provided');
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in your environment
    req.userId = decoded.user_id; // Attach user ID to the request object
    next();
  } catch (err) {
    logger.error('Invalid token');
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export default authenticateToken;
