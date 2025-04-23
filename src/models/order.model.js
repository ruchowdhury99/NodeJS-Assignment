import mongoose from "mongoose";
const { Schema, model } = mongoose;

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