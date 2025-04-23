import mongoose from 'mongoose';
const { Schema, model } = mongoose;  // destructure Schema and model

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  passwordHash: {                // renamed to match your controllers
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
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

// // optional virtual for full name
// userSchema.virtual('fullName').get(function() {
//   return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(' ');
// });

export default model('User', userSchema);