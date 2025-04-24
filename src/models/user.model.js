
//-------------------------------------------USER SCHEMA-------------------------------------------//

import mongoose from 'mongoose';
const { Schema, model } = mongoose;  // Destructuring Schema and model from mongoose


// Defining and designing the User schema with necessary fields

const userSchema = new Schema({

  username: {
    type: String,
    required: true,
    unique: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  middleName: {
    type: String,
    default: ''
  },

  lastName: {
    type: String,
    required: true,
  },

  passwordHash: {                
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  phone: {
    type: String,
    unique: true,
    required: true,
  },

  role: {
    type: String,
    enum: ['Manager'],
    default: 'Manager'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


export default model('User', userSchema);