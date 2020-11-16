import { NextFunction } from "connect";
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Task = require("../models/task");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }, 
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value: string){
      if (!validator.isEmail(value)){
        throw new Error('Email is not valid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value: string){
      if (value.length < 7){
        throw new Error('Password must be atleast 6 characters long');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value: number){
      if (value < 0){
        throw new Error()
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.virtual('areas', {
  ref: 'Area',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}

userSchema.pre('save', async function(next: NextFunction) {
  const user = this;

  if (user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre('remove', async function(next: NextFunction) {
  const user = this;
  Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model('User', userSchema, 'users'); 

export default User;
