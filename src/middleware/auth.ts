import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
import User from '../models/user';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException';

const auth = async (request, response: Response, next: NextFunction) => {
  try {
    const token = request.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'temp');
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    //TODO - you are accessing the user from the DB twice - fix! Pass down with response
    //This would request you to create a new request interface
    //Should this logic all be in the business layer?
    if (!user){
      throw new ResourceNotFoundException('User', decoded._id);
    }

    request.token = token;
    request.user = user;
    next();
  } catch (e) {
    response.status(401).send({ error: 'Please authenticate' })
    //TODO - Update this to proper error object?
  }
}

export default auth;
