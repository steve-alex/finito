const mongoose = require('mongoose');
const validator = require('validator');

export const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  }, 
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value: string){
      if (!validator.isEmail(value)){
        throw new Error('Email is not valid');
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
  }
})

exports = {
  User
}
