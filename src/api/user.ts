import { Router, Request, Response, NextFunction } from 'express';
import User from '../models/user';
import Controller from '../interface/Controller.interface';
import auth from '../middleware/auth';
import UserService from '../services/user.service';
// import any from '../interface/RequestDTO.interface';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  public userService = new UserService();

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

  loginUser = async (request: any, response: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.userService.authenticateUserCredentials(request.body.email, request.body.password);
      response.status(200).send({ user, token });
    } catch (error) {
      next(error);
    }
  }

  logoutUser = async(request: any, response: Response, next: NextFunction) => {
    try {
      await this.userService.refreshCurrentSessionToken(request.user, request.token);
      response.sendStatus(200);
    } catch (error) {
      next(error)
    }
  }

  createUser = async (request: any, response: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.userService.createUser(request.body);
      response.status(201).send({ user, token });
    } catch (error) {
      next(error);
    }
  }

  getUserById = async (request: any, response: Response, next: NextFunction) => {
    try {
      response.status(200).send({ user: request.user });
    } catch (error) {
      next(error);
    }
  }

  updateUser = async (request: any, response: Response, next: NextFunction) => {
    try {
      const user = await this.userService.updateUser(request.body, request.user);
      response.status(200).send(user);
    } catch(error) {
      next(error);
    }
  }

  deleteUser = async (request: any, response: Response, next: NextFunction) => {
    try {
      // TODO - How do you prevent people from sending a request to delete a user that is not them?
      await User.findByIdAndDelete(request.user._id)
      response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
