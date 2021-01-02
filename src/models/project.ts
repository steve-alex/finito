import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  _id: mongoose.ObjectId,
  name: string,
  owner: mongoose.ObjectId,
  area: mongoose.ObjectId,
}

const ProjectSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  area: {
    type: Schema.Types.ObjectId,
    ref: 'Area'
  }
})

ProjectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
})

const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project
