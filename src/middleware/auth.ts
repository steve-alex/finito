import { Request, Response, NextFunction } from 'express';
require('dotenv').config()
const jwt = require('jsonwebtoken');
import User from '../models/user';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException';
import UnableToAuthenticateException from '../exceptions/UnableToAuthenticateException';

const auth = async (request, response: Response, next: NextFunction) => {
  try {
    const token = request.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'temp');
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user){
      throw new ResourceNotFoundException('User', decoded._id);
    }

    request.token = token;
    request.user = user;
    next();
  } catch (e) {
    next(new UnableToAuthenticateException())
  }
}

export default auth;
