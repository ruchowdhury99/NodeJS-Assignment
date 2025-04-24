
//----------------------------------------ORDER SCHEMA-----------------------------------------//

import mongoose from "mongoose";
const { Schema, model } = mongoose;


// OrderItem sub-schema to store item name and quantity

const orderItemSchema = new Schema({
    
  itemName: { 
    type: String,
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true
  }
}, { _id: false });


// Order schema to store order details
// Also indicates the status of the order (Active or Inactive)

const orderSchema = new Schema({
  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true,
  },
  items: {
    type: [orderItemSchema],
    default: []
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

export default model("Order", orderSchema);