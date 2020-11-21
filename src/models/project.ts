const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area'
  }
})

ProjectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
})

const Project = mongoose.model('Project', ProjectSchema);

export default Project