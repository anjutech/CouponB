import jwt from 'jsonwebtoken';
import redis from '../db/redishClient.js';
import { generateToken } from '../utility/jwtUtils.js';


export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const redisData = await redis.get(token);

    if (!redisData) {
          //  return res.status(401).json({ success: false, error: 'Session expired. Please login again.' });
      const newToken = await generateToken(decoded); 
      req.newToken = newToken;
      res.setHeader('x-refresh-token', newToken);
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};
