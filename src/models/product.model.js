
//-----------------------------------------PRODUCT SCHEMA-----------------------------------------//

// Importing mongoose and define the Product schema and model.

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellPrice: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Product', productSchema);