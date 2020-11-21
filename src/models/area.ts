const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

AreaSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'parentArea'
})

const Area = mongoose.model('Area', AreaSchema);

export default Area;