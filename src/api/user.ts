import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import Controller from '../interface/Controller.interface';
import HttpException from '../exceptions/error';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException'

class UserController implements Controller {
  public path = '/users';
  public router = Router();

  constructor(){
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.post(`${this.path}/login`, this.loginUser);
    this.router.post(`${this.path}/logout`, this.logoutUser);
    this.router.post(this.path, this.createUser);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.patch(`${this.path}/:id`, this.updateUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
  }

  loginUser = async (request: Request, response: Response) => {
    try {
      const user = await User.findByCredentials(request.body.email, request.body.password);
      response.status(200).send(user);
    } catch (e) {
      response.status(400).send();
    }
  }

  logoutUser = async(request: Request, response: Response) => {
  }

  createUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = new User(request.body);
      await user.save();
      response.status(201).send(user);
    } catch (error) {
      next(new HttpException(400, "Unable to create user"));
    }
  }

  getUserById = async (request: Request, response: Response, next: NextFunction) => {
    const _id = request.params.id;

    try {
      const user = await User.findById(_id);

      if (!user){
        return next(new ResourceNotFoundException('User', _id));
      }

      response.status(200).send(user);
    } catch (e) {
      next(new HttpException(400, "Unable to get user"));
    }
  }

  updateUser = async (request: Request, response: Response, next: NextFunction) => {
    const _id = request.params.id;
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    // TODO - Too much logic, move to services

    if (!isValidOperation){
      next(new HttpException(400, "Invalid Updates"));
    }
    
    try {
      const user = await User.findById(_id);
      updates.forEach((update) => user[update] = request.body[update]);
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

  deleteUser = async (request: Request, response: Response, next: NextFunction) => {
    const _id = request.params.id;
    
    try {
      await User.findByIdAndDelete(_id)
      response.sendStatus(200);
    } catch (e) {
      next(new HttpException(400, "Unable to delete user"));
    }
  }
}

module.exports = UserController;