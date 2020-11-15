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
  parentArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area'
  }
})

const Project = mongoose.model('Project', ProjectSchema);

export default Project