import { Router, Request, Response, NextFunction } from 'express';
import User from '../models/user';
import Controller from '../interface/Controller.interface';
import auth from '../middleware/auth';
import HttpException from '../exceptions/error';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException';
import IncorrectCredentialsException from '../exceptions/IncorrectCredentialsException';

class UserController implements Controller {
  public path = '/users';
  public router = Router();

  constructor(){
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.post(`${this.path}/login`, this.loginUser);
    this.router.post(`${this.path}/logout`, auth, this.logoutUser);
    this.router.post(this.path, this.createUser);
    this.router.get(`${this.path}/:id`, auth, this.getUserById);
    this.router.patch(`${this.path}/:id`, auth, this.updateUser);
    this.router.delete(`${this.path}/:id`, auth, this.deleteUser);
  }

  loginUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = await User.findByCredentials(request.body.email, request.body.password);
      const token = await user.generateAuthToken();
      response.status(200).send({ user, token });
    } catch (e) {
      next(new IncorrectCredentialsException());
      response.status(400).send(e);

      // TODO make this into your own error
    }
  }

  logoutUser = async(request: any, response: Response, next: NextFunction) => {
    try {
      request.user.tokens = request.user.tokens.filter(token => {
        return token.token !== request.token;
      })

      // //TODO - move all this!
      await request.user.save()
      response.sendStatus(200);
    } catch (e) {
      next(new HttpException(500, "Unable to logout user"))
    }
  }

  createUser = async (request: Request, response, next: NextFunction) => {
    try {
      const user = new User(request.body);
      await user.save(user);
      const token = await user.generateAuthToken();
      //TODO - Move all of this to services
      response.status(201).send({ user, token });
    } catch (error) {
      next(new HttpException(400, "Unable to create user"));
    }
  }

  getUserById = async (request: any, response: Response, next: NextFunction) => {
    try {
      response.status(200).send({ user: request.user });
    } catch (e) {
      next(new HttpException(400, "Unable to get user"));
    }
  }

  updateUser = async (request, response: Response, next: NextFunction) => {
    const _id = request.params.id;
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    // TODO - Too much logic, move to services

    if (!isValidOperation){
      next(new HttpException(400, "Invalid Updates"));
    }
    
    try {
      const user = request.user;
      updates.forEach((update) => request.user[update] = request.body[update]);
      // TODO - Again too much logic, move to services
      await user.save();

      //TODO - move these additional settings to another file
      if (!user){
        return next(new ResourceNotFoundException('User', _id));
      }

      response.status(404).send(user);
    } catch(e) {
      next(new HttpException(400, "Unable to update user"));
    }
  }

  deleteUser = async (request, response: Response, next: NextFunction) => {
    try {
      // TODO - How do you prevent people from sending a request to delete a user that is not them?
      await User.findByIdAndDelete(request.user._id)
      response.sendStatus(200);
    } catch (e) {
      next(new HttpException(400, "Unable to delete user"));
    }
  }
}

module.exports = UserController;
