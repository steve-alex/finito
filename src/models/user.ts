const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
})

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}

userSchema.methods.generateAuthToken = async function(){
  const user = this;

  console.log('user', user);
  
  const token = jwt.sign({ _id: user._id.toString() }, 'temp')

  user.tokens = user.tokens.concat({ token })
  await user.save();
  
  // TODO - Create a new file
  return token;
}

userSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user){
    throw new Error('User not found');
    //TODO - Could this be thrown inside a next()?
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch){
    throw new Error('Unable to login');
  }

  return user;
}

userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema); 

export default User;
