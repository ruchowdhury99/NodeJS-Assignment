
//-----------------------------------BLOG SCHEMA-----------------------------------//

// Designed the blog schema with the required fields

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

export default model('Blog', blogSchema)