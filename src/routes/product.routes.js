import { Router } from 'express';
import {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { verify } from '../middleware/auth.middleware.js';

const router = Router();

router.post  ('/products',      verify, createProduct);
router.get    ('/products',      verify, listProducts);
router.get    ('/products/:id',  verify, getProduct);
router.put    ('/products/:id',  verify, updateProduct);
router.delete ('/products/:id',  verify, deleteProduct);

export default router;
