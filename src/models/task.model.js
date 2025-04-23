import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const taskSchema = new Schema({
  taskType: { type: String, required: true },
  assignee: { type: String, required: true },
  priorityLevel: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  location: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model('Task', taskSchema);