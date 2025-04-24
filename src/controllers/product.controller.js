import Product from '../models/product.model.js';

/**
 * POST /products
 * Create a new product.
 */
export async function createProduct(req, res, next) {
  try {
    const { name, sku, costPrice, sellPrice } = req.body;
    if (!name || !sku || costPrice == null || sellPrice == null) {
      return res.status(400).json({ status: 400, message: 'Missing required fields' });
    }
    const exists = await Product.findOne({ sku });
    if (exists) {
      return res.status(409).json({ status: 409, message: 'SKU already exists' });
    }
    const product = await Product.create({ name, sku, costPrice, sellPrice });
    res.status(201).json({ status: 201, data: product });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /products
 * List all products.
 */
export async function listProducts(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ status: 200, data: products });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /products/:id
 * Get one product by its ID.
 */
export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ status: 404, message: 'Product not found' });
    res.json({ status: 200, data: product });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /products/:id
 * Update product details.
 */
export async function updateProduct(req, res, next) {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ status: 404, message: 'Product not found' });
    res.json({ status: 200, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /products/:id
 * Remove a product.
 */
export async function deleteProduct(req, res, next) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: 404, message: 'Product not found' });
    //res.status(204).end();

    return res.status(204).json({
        status: 204,
        message: "Product deleted successfully"
    });
  } catch (err) {
    next(err);
  }
}