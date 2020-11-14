import { Router, Request, Response, NextFunction} from 'express';
import Controller from '../interface/Controller.interface';
import { Task } from '../models/task';
import HttpException from '../exceptions/error';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException'

class TaskController implements Controller {
  public path = '/tasks';
  public router = Router();

  constructor(){
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.post(this.path, this.createTask);
    this.router.get(`${this.path}/:id`, this.getTaskById);
    this.router.patch(`${this.path}/:id`, this.updateTask);
    this.router.delete(`${this.path}/:id`, this.deleteTask);
  }

  createTask = async (request: Request, response: Response, next: NextFunction) => {
    const task = new Task(request.body);

    try {
      await task.save();
      response.status(201).send(task);
    } catch (e) {
      next(new HttpException(400, 'Unable to create task'));
    }
  }

  getTaskById = async (request: Request, response: Response, next: NextFunction) => {
    const _id = request.params.id;

    try {
      const task = await Task.findById(_id);

      if (!task){
        return next(new ResourceNotFoundException('Task', _id));
      }

      response.status(200).send(task);
    } catch (e) {
      next(new HttpException(400, 'Unable to get task'))
    }
  }

  updateTask = async (request: Request, response: Response, next: NextFunction) => {
    const _id = request.params.id;
    const updates = Object.keys(request.body);
    const allowedUpdates = ['header', 'description', 'date', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    // TODO - move all of this into a new place? Some kind of helper folder?

    if (!isValidOperation){
      return next(new HttpException(400, "Invalid updates"));
    }
    //TODO - Should I be type checking the request.body with an interface?

    try {
      const task = await Task.findById(_id);
      updates.forEach((update) => task[update] = request.body[update]);
      await task.save();

      if (!task){
        return next(new ResourceNotFoundException('Task', _id));
      }

      response.status(200).send(task);
    } catch(e) {
      next(new HttpException(400, "Unable to update task"));
    }
  }

  deleteTask = async (request: Request, response: Response, next: NextFunction) => {
    const _id = request.params.id;
    
    try {
      const task = await Task.findByIdAndDelete(_id)

      if (!task){
        return next(new ResourceNotFoundException('Task', _id));
      }
      
      response.sendStatus(200);
    } catch (e) {
      next(new HttpException(400, "Unable to delete task"));
    }
  }
}

module.exports = TaskController;
