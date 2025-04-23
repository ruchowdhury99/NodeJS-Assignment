import { Router } from 'express';
import { createStock, getStockDetails } from '../controllers/stock.controller.js';
import { verify } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/stock',         verify, createStock);
router.get('/stockDetails',   verify, getStockDetails);
export default router;