import mongoose, { Schema, Document } from 'mongoose';

export interface IArea extends Document {
  _id: mongoose.ObjectId,
  name: string,
  owner: mongoose.ObjectId,
}

const AreaSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

AreaSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'area'
})

const Area = mongoose.model<IArea>('Area', AreaSchema);

export default Area;
