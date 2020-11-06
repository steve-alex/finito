import express = require('express');
import { User } from '../models/user';

class UserController {
  public path = '/users';
  public router = express.Router();

  constructor(){
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.post(`${this.path}/login`, this.loginUser)
    this.router.post(`${this.path}/logout`, this.logoutUser)
    this.router.post(this.path, this.createUser);
    this.router.get(`${this.path}/:id`, this.getUserById)
    this.router.patch(`${this.path}/:id`, this.updateUser)
    this.router.delete(`${this.path}/:id`, this.deleteUser)
  }

  loginUser = (request: express.Request, response: express.Response) => {
  }

  logoutUser = (request: express.Request, response: express.Response) => {
  }

  createUser = (request: express.Request, response: express.Response) => {
    const user = new User(request.body);

    user.save()
      .then(() => {
        // TODO - update all the statuses to the right ones!
        response.status(200).send(user)
      })
      .catch((err) => {
        response.status(400).send(err)
      })
  }

  getUserById = (request: express.Request, response: express.Response) => {
    const _id = request.params.id;

    User.findById(_id)
      .then((user) => {
        response.send(user);
      })
      .catch((err) => {
        response.status(400).send(err)
      })
  }

  updateUser = (request: express.Request, response: express.Response) => {
    const _id = request.params.id;

    User.findByIdAndUpdate(_id, request.body, { new: true })
      .then((user) => {
        response.send(user)
      })
      .catch((err) => {
        response.status(400).send(err)
      }) 
  }

  deleteUser = (request: express.Request, response: express.Response) => {
    const _id = request.params.id;
    
    User.findByIdAndDelete(_id)
      .then((resp) => {
        response.sendStatus(200);
      })
      .catch((err) => {
        response.sendStatus(404);
      })
  }
}

module.exports = UserController;