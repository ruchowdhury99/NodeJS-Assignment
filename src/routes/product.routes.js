
//---------------------------------PRODUCTS API ROUTES-----------------------------------//

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


// To create a new product
router.post('/products', verify, createProduct);

// To get all products
router.get('/products', verify, listProducts);

// To get a single product by ID
router.get('/products/:id', verify, getProduct);

// To update a product by ID
router.put('/products/:id', verify, updateProduct);

// To delete a product by ID
router.delete('/products/:id', verify, deleteProduct);

export default router;
