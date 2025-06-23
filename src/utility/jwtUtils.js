import redis from "../db/redishClient.js";
import jwt from "jsonwebtoken";
export const generateToken = async (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '7D' });
  
  await redis.set(token, JSON.stringify(payload), 'EX', 604800); // 60*60=3600 sec = 1h, (7 * 24 * 60 * 60=604800 for 7D

  return token;
};


