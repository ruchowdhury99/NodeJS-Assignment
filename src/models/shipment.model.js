
//--------------------------------------------SHIPMENT SCHEMA--------------------------------------------//

import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Defining and designing the Shipment schema with necessary fields

const shipmentSchema = new Schema({
  shipmentId: {
    type: String,
    required: true,
    unique: true
  },

    productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  productName: {
    type: String,
    required: true
  },
  supplierId: {
    type: String
  },
  supplierName: {
    type: String
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  shipperId: {
    type: String
  },
  shipperName: {
    type: String
  },
  shipmentDestination: {
    type: String,
    required: true
  },
  shipmentStatus: {
    type: String,
    enum: ["Completed","In-Transit","Pending","Failed"],
    required: true
  },
  lat: Number,
  long: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model("Shipment", shipmentSchema);
