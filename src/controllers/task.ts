import express = require('express');
import { Task } from '../models/task';
import Controller from '../interface/Controller.interface';

class TaskController implements Controller {
  public path = '/tasks';
  public router = express.Router()

  constructor(){
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.post(this.path, this.createTask);
    this.router.get(`${this.path}/:id`, this.getTaskById)
    this.router.patch(`${this.path}/:id`, this.updateTask)
    this.router.delete(`${this.path}/:id`, this.deleteTask)
  }

  createTask = async (request: express.Request, response: express.Response) => {
    const task = new Task(request.body);

    try {
      await task.save()
      response.status(201).send(task);
    } catch (e) {
      response.status(400).send(e);
    }
  }

  getTaskById = async (request: express.Request, response: express.Response) => {
    const _id = request.params.id;

    try {
      const task = await Task.findById(_id);
      response.status(200).send(task);
    } catch (e) {
      response.status(500).send(e);
    }
  }

  updateTask = async (request: express.Request, response: express.Response) => {
    const _id = request.params.id;
    const updates = Object.keys(request.body);
    const allowedUpdates = ['header', 'description', 'date', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    // TODO - move all of this into a new place? Some kind of helper folder?

    if (!isValidOperation){
      // TODO - Does this even need to be here? What is the chance that the frontend will send an invalid update?
      return response.status(400).send({ error: 'Invalid Updates'})
    }

    try {
      const task = await Task.findByIdAndUpdate(_id, request.body, { new: true });
      response.status(200).send(task);
    } catch(e) {
      response.status(500).send(e);
    }
  }

  deleteTask = async (request: express.Request, response: express.Response) => {
    const _id = request.params.id;
    
    try {
      await Task.findByIdAndDelete(_id)
      response.sendStatus(200);
    } catch (e) {
      response.status(500).send(e);
    }
  }
}

module.exports = TaskController;
