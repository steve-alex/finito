import express = require('express');
import { User } from '../models/user';
import Controller from '../interface/Controller.interface';

class UserController implements Controller {
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

  createUser = async (request: express.Request, response: express.Response) => {
    try {
      const user = new User(request.body);
      await user.save()
      response.status(201).send(user);
    } catch (e) {
      response.status(400).send(e);
    }
  }

  getUserById = async (request: express.Request, response: express.Response) => {
    const _id = request.params.id;

    try {
      const user = await User.findById(_id)

      if (!user){
        response.sendStatus(404);
      }

      response.status(200).send(user);
    } catch (e) {
      response.status(400).send(e);
    }
  }

  updateUser = async (request: express.Request, response: express.Response) => {
    const _id = request.params.id;
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    // TODO - move all of this into a new place? Some kind of helper folder?

    if (!isValidOperation){
      // TODO - Does this even need to be here? What is the chance that the frontend will send an invalid update?
      return response.status(400).send({ error: 'Invalid Updates'})
    }
    
    try {
      const user = await User.findByIdAndUpdate(_id, request.body, {new: true, runValidators: true, useFindAndModify: false});
      //TODO - move these additional settings to another file
      if (!user){
        return response.sendStatus(404);
      }

      response.status(404).send(user);
    } catch(e) {
      response.status(400).send(e);
    }
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