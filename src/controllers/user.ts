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

  loginUser = (request: Request, response: Response) => {
  }

  logoutUser = (request: Request, response: Response) => {
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
    // TODO - move all of this into a new place? Some kind of helper folder?

    if (!isValidOperation){
      next(new HttpException(400, "Invalid Updates"));
    }
    
    try {
      const user = await User.findByIdAndUpdate(_id, request.body, {new: true, runValidators: true, useFindAndModify: false});
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