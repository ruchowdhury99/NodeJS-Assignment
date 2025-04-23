import { Router } from 'express';
import { register, signIn, getProfile, signOut } from '../controllers/auth.controller.js';
import { verify } from '../middleware/auth.middleware.js';

const router = Router();

// Register a new manager
// POST /register
router.post('/register', register);

// Sign in an existing manager
// POST /signin
router.post('/signin', signIn);

// Get the logged-in manager's profile
// GET /profile
// Header: Authorization: Bearer <token>
router.get('/profile', verify, getProfile);

router.post('/signout', verify, signOut);

export default router;