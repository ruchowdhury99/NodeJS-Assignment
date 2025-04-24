
//-------------------------------------------STOCKS SCHEMA-------------------------------------------//

// Defining the Stock schema with fields for each stock entry

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const stockSchema = new Schema({
  product: {
     type: Schema.Types.ObjectId,
     ref: 'Product',
     required: true
  },
  productName: { 
    type: String, 
    required: true 
  },
  consumerName: { 
    type: String, 
    required: true 
  },
  supplierName: { 
    type: String, 
    required: true 
  },
  dateOfEntry: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  sellingPrice: { 
    type: Number, 
    required: true 
  },
  cashier: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['Available','OutOfStock','Reserved','Damaged'],
    required: true
  }
});

export default model('Stock', stockSchema);