
//-------------------------------------PRODUCT CONTROLLERS-------------------------------------//

// 1. Create a new product
// 2. List all products
// 3. Get a single product by ID
// 4. Update a product by ID
// 5. Delete a product by ID


import Product from '../models/product.model.js';


// 1. Create a new product

// POST - {baseurl}/products

export async function createProduct(req, res, next) {
  try {

    // Fetch the required fields from the request body

    const { name, sku, costPrice, sellPrice } = req.body;
    if (!name || !sku || costPrice == null || sellPrice == null) {
      return res.status(400).json({ status: 400, message: 'Missing required fields' });
    }

    // Check if the SKU already exists

    const exists = await Product.findOne({ sku });
    if (exists) {
      return res.status(409).json({ status: 409, message: 'SKU already exists' });
    }

    // Create a new product with the provided details and save it to the database

    const product = await Product.create({ 
      name, 
      sku,
      costPrice,
      sellPrice });

    res.status(201).json({ status: 201, data: product });
  } catch (err) {
    next(err);
  }
}

// 2. List all products

// GET - {baseurl}/products

export async function listProducts(req, res, next) {
  try {

    // Fetch all products from the database and sort them in descending order based on creation date

    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ status: 200, data: products });
  } catch (err) {
    next(err);
  }
}


// 3. Get a single product by ID

// GET - {baseurl}/products/:id

export async function getProduct(req, res, next) {
  try {

    // Fetch the productId from the request parameters
    //  and fetch the corresponding product from the database

    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ status: 404, message: 'Product not found' });

    res.json({ status: 200, data: product });
  } catch (err) {
    next(err);
  }
}


// 4. Update a product by ID

// PUT - {baseurl}/products/:id

export async function updateProduct(req, res, next) {
  try {

    // Fetch the productId from the request parameters to be updated

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


// 5. Delete a product by ID

// DELETE - {baseurl}/products/:id

export async function deleteProduct(req, res, next) {
  try {

    // Fetch the productId from the request parameters to be deleted

    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: 404, message: 'Product not found' });

    //res.status(204).end();

    return res.status(200).json({
        status: 200,
        message: "Product deleted successfully"
    });
  } catch (err) {
    next(err);
  }
}