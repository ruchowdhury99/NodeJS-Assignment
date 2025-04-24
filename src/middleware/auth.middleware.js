import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../utils/blacklist.js";

// Used to verify the JWT token
export const verify = (req, res, next) => {

  // Check if the Authorization header exists and has a valid JWT token. 
  // If not, return a 401 status and an error message.

  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ status: 401, error: "Authorization header missing" });

  // Split the authorization header and get the JWT token. 
  // If the token is missing, return a 401 status and an error message.

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ status: 401, error: "Token not provided" });

  // Check if the token is blacklisted. If it is, return a 403 status and an error message.

  if (isTokenBlacklisted(token)) {
    return res.status(403).json({ status: 403, error: "Token has been invalidated. Please sign in again." });
  }

  // If the token is valid, then we decode it and attach the user data to the request object.
  // If the token is invalid, expired, or malformed, then we return a 403 status and an error message. 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ status: 403, error: "Invalid or expired token" });
  }
};