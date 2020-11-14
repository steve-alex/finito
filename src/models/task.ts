const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  header: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false
  }
})

export const Task = mongoose.model('Task', TaskSchema);

exports = {
  Task
}