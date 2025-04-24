
//--------------------------------TASK API ROUTES----------------------------------//

import { Router } from 'express';
import { createTask } from '../controllers/task.controller.js';
import { verify } from '../middleware/auth.middleware.js';

const router = Router();

// To create a new task
router.post('/tasks', verify, createTask);



export default router;