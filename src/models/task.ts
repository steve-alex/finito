import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  _id: mongoose.ObjectId,
  header: string,
  description: string,
  date: Date,
  completed: boolean,
  owner: mongoose.ObjectId,
  project: mongoose.ObjectId,
}

const TaskSchema = new Schema({
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

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
