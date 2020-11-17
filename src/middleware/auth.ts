import { Request, Response, NextFunction } from 'express';
require('dotenv').config()
const jwt = require('jsonwebtoken');
import User from '../models/user';
import HttpException from '../exceptions/error';

const auth = async (request, response: Response, next: NextFunction) => {
  try {
    const token = request.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'temp');
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user){
      next(new HttpException(404, 'Unable to get user'));
    }

    request.token = token;
    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default auth;
