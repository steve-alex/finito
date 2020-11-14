import { Router, Request, Response, NextFunction } from 'express';
import User from '../models/user';
import Controller from '../interface/Controller.interface';
import auth from '../middleware/auth';
import HttpException from '../exceptions/error';
import IncorrectCredentialsException from '../exceptions/IncorrectCredentialsException';
const UserService = require('../services/user.service');

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

  loginUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const [user, token] = await this.userService.authenticateUserCredentials(request.body.email, request.body.password);
      response.status(200).send({ user, token });
    } catch (error) {
      next(new IncorrectCredentialsException());
    }
  }

  logoutUser = async(request: any, response: Response, next: NextFunction) => {
    try {
      await this.userService.refreshJwtTokens(request);
      response.sendStatus(200);
    } catch (e) {
      next(new HttpException(500, "Unable to logout user"))
    }
  }

  createUser = async (request: Request, response, next: NextFunction) => {
    try {
      const [user, token] = await this.userService.createUser(request.body);
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
    try {
      const user = await this.userService.updateUser(request.body, request.user);
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
