import express = require('express');
import { Task } from '../models/task';

class TaskController{
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

  createTask = (request: express.Request, response: express.Response) => {
    const task = new Task(request.body);
    console.log('task', task);
    task.save()
      .then(() => {
        // TODO - update all the statuses to the right ones!
        response.status(200).send(task)
      })
      .catch((err) => {
        response.status(400).send(err)
      })
  }

  getTaskById = (request: express.Request, response: express.Response) => {
    const _id = request.params.id;

    Task.findById(_id)
      .then((task) => {
        response.send(task);
      })
      .catch((err) => {
        response.status(400).send(err)
      })
  }

  updateTask = (request: express.Request, response: express.Response) => {
    const _id = request.params.id;

    Task.findByIdAndUpdate(_id, request.body, { new: true })
      .then((task) => {
        response.send(task)
      })
      .catch((err) => {
        response.status(400).send(err)
      }) 
  }

  deleteTask = (request: express.Request, response: express.Response) => {
    const _id = request.params.id;
    
    Task.findByIdAndDelete(_id)
      .then((resp) => {
        response.sendStatus(200);
      })
      .catch((err) => {
        response.sendStatus(404);
      })
  }
}

module.exports = TaskController;