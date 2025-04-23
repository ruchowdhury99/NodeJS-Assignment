
import { Router } from 'express';
import { createTask } from '../controllers/task.controller.js';
import { verify } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/tasks', verify, createTask);
export default router;