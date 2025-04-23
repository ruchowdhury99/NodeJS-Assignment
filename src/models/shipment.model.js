// import mongoose from "mongoose";
// const { Schema, model } = mongoose;

// const shipmentSchema = new Schema({
//   shipmentId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   product: {
//     type: Schema.Types.ObjectId,
//     ref: "Product",
//     required: true
//   },
//   productName: {
//     type: String,
//     required: true
//   },
//   supplierId: {
//     type: Schema.Types.ObjectId,
//     ref: "Supplier"
//   },
//   supplierName: {
//     type: String
//   },
//   quantity: {
//     type: Number,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   deliveryDate: {
//     type: Date,
//     required: true
//   },
//   shipperId: {
//     type: Schema.Types.ObjectId,
//     ref: "Shipper"
//   },
//   shipperName: {
//     type: String
//   },
//   shipmentDestination: {
//     type: String,
//     required: true
//   },
//   shipmentStatus: {
//     type: String,
//     enum: ["Completed","In-Transit","Pending","Failed"],
//     required: true
//   },
//   lat: {
//     type: Number
//   },
//   long: {
//     type: Number
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default model("Shipment", shipmentSchema);


import mongoose from "mongoose";
const { Schema, model } = mongoose;

const shipmentSchema = new Schema({
  shipmentId: {
    type: String,
    required: true,
    unique: true
  },
  // Accept plain IDs as strings instead of ObjectId references
  productId: {
    type: String,
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