
// ---------------------------------USER CONTROLLER------------------------------------------------

// 1. Register a new user
// 2. Login / SignIn a user
// 3. Display the profile of the logged-in user
// 4. Logout / SignOut a user

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { blacklistToken } from '../utils/blacklist.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '12h';

// 1. Registering a new user and hashing the password

export async function register(req, res, next) {

  // Checking if all required fields are provided

  try {
    const { username, password, firstName, middleName = '', lastName, email, phone } = req.body;

    if (!username || !password || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({ status: 400, message: 'Missing required fields' });
    }

    // Checking if user is already registered with the provided username or email
    // If so, return an error message

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(409).json({
        status: 409,
        message: existing.username === username
          ? 'Username already taken'
          : 'Email already registered'
      });
    }

    // Hashing the password before saving the user in the database

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Creating and saving the new user in the database

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

    // If registration is successful, return a success message with user credentials and profile data

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

// 2. Logging in / signing in a user

export async function signIn(req, res, next) {

  try {

    // Fetching the username and password from the request body
    // If the credentials are invalid, return an error message

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ status: 401, message: 'Invalid credentials' });
    }

    // Checking if the provided password matches the hashed password in the database
    // If not, return an error message

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ status: 401, message: 'Invalid credentials' });
    }

    // If login is successful, return a success message with a JWT token 

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

// 3. Displaying the profile of the logged-in user

export async function getProfile(req, res, next) {

  try {

    // Fetching the logged-in user's profile data from the database
    // If the user is not found, return an error message

    const user = await User.findById(req.user.sub).select('-passwordHash -__v');
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }

    // If the user's profile data is fetched successfully, returned it as a response

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

// 4. Logout / SignOut a user

export async function signOut(req, res, next) {

  // Checking if the user is authenticated

  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(400).json({ status: 400, error: "Authorization header missing" });

  // Extracting the token from the authorization header 

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(400).json({ status: 400, error: "Token missing" });

  // if token is valid, blacklisted the token and return a success message

  blacklistToken(token); 
  
  return res.status(200).json({
    status: 200,
    message: "Logged out successfully"
  });
}