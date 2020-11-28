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
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  project: {
    type: mongoose.ObjectId,
    ref: 'Project'
  }
}, {
  timestamps: true
})

const Task = mongoose.model('Task', TaskSchema);

export default Task;