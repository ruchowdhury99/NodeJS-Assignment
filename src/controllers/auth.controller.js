import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { blacklistToken } from '../utils/blacklist.js';

const JWT_SECRET    = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '8h';

export async function register(req, res, next) {
  try {
    const { username, password, firstName, middleName = '', lastName, email, phone } = req.body;
    if (!username || !password || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({ status: 400, message: 'Missing required fields' });
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(409).json({
        status: 409,
        message: existing.username === username
          ? 'Username already taken'
          : 'Email already registered'
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      passwordHash,
      firstName,
      middleName,
      lastName,
      email,
      phone
    });

    const token = jwt.sign(
      { sub: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: 201,
      message: 'Registration successful',
      token,
      data: {
        username: user.username,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function signIn(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ status: 401, message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ status: 401, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ status: 200, token });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.sub).select('-passwordHash -__v');
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }
    res.json({
      status: 200,
      message: 'Profile details fetched successfully',
      data: {
        username: user.username,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function signOut(req, res, next) {
    const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(400).json({ status: 400, error: "Authorization header missing" });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(400).json({ status: 400, error: "Token missing" });

  blacklistToken(token); // mark it as invalid
  return res.status(200).json({
    status: 200,
    message: "Logged out successfully"
  });
}