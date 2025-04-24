
//------------------------------------STOCK API ROUTES----------------------------------//

import { Router } from 'express';
import { createStock, getStockDetails } from '../controllers/stock.controller.js';
import { verify } from '../middleware/auth.middleware.js';

const router = Router();

// To Create a new stock
router.post('/stock', verify, createStock);

// To get stock details
router.get('/stockDetails', verify, getStockDetails);
export default router;