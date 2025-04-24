import { Router } from 'express';
import { createBlog, listBlogs, getBlog } from '../controllers/blog.controller.js';
import { verify } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/blogs',     verify, createBlog);
router.get('/blogs/all',  verify, listBlogs);
router.get('/blog/:id',   verify, getBlog);

export default router;