// import jwt from 'jsonwebtoken';
// const JWT_SECRET = process.env.JWT_SECRET;

// export function verify(req, res, next) {

//     const auth = req.headers.authorization?.split(' ');

//     if(auth?.[0] !== 'Bearer' || !auth[1]) {
//         return res.status(401).json({ status: 401, error: 'Authorization header missing' });
//     }


//     try {
//         req.user = jwt.verify(auth[1], JWT_SECRET);
//         next();
//     } catch(error) {
//         return res.status(401).json({ status: 401, error: 'Invalid token' });
//     }
// };

import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../utils/blacklist.js";

export const verify = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ status: 401, error: "Authorization header missing" });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ status: 401, error: "Token not provided" });

  if (isTokenBlacklisted(token)) {
    return res.status(403).json({ status: 403, error: "Token has been invalidated. Please sign in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ status: 403, error: "Invalid or expired token" });
  }
};