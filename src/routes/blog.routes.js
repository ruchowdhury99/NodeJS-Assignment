
//------------------------------------ BLOG API ROUTES ------------------------------------//

import { Router } from 'express';
import { createBlog, listBlogs, getBlog } from '../controllers/blog.controller.js';
import { verify } from '../middleware/auth.middleware.js';

const router = Router();

// To create a new blog post
router.post('/blogs', verify, createBlog);

// To list all blog posts
router.get('/blogs/all', verify, listBlogs);

// To get a single blog post by its ID
router.get('/blog/:id', verify, getBlog);

export default router;