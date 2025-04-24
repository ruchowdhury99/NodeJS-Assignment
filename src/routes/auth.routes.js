
//---------------------------USER AUTHENTICATION ROUTES---------------------------//

import { Router } from 'express';
import { register, signIn, getProfile, signOut } from '../controllers/auth.controller.js';
import { verify } from '../middleware/auth.middleware.js';

const router = Router();

// To register a new manager
router.post('/register', register);

// Sign in an existing manager
router.post('/signin', signIn);

// Get the logged-in manager's profile
router.get('/profile', verify, getProfile);

// Sign out the logged-in manager and delete their JWT token from the database
router.post('/signout', verify, signOut);

export default router;