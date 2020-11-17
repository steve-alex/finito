import { Router, Request, Response, NextFunction} from 'express';
import Controller from '../interface/Controller.interface';
import Task from '../models/task';
import auth from '../middleware/auth';
import HttpException from '../exceptions/error';
const TaskService = require('../services/task.service');

class TaskController implements Controller {
  public path = '/tasks';
  public router = Router();
  public taskService = new TaskService();

  constructor(){
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.post(this.path, auth, this.createTask);
    this.router.get(`${this.path}/:id`, auth, this.getTaskById);
    this.router.get(`${this.path}`, auth, this.getTasks);
    this.router.patch(`${this.path}/:id`, auth, this.updateTask);
    this.router.delete(`${this.path}/:id`, auth, this.deleteTask);
  }

  createTask = async (request: any, response: Response, next: NextFunction) => {
    try {
      const updatedTask = request.body;
      const userId = request.user._id;
      const task = await this.taskService.createTask(updatedTask, userId);
      response.status(201).send(task);
    } catch (error) {
      next(error);
    }
  }

  getTaskById = async (request: any, response: Response, next: NextFunction) => {
    try {
      const taskId = request.params.id;
      const userId = request.user._id;
      const task = await this.taskService.getTaskById(taskId, userId)
      response.status(200).send(task);
    } catch (error) {
      next(error)
    }
  }

  getTasks = async (request: any, response: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.getTasks(request.user, request.query)
      response.status(200).send(tasks);
    } catch (error) {
      next(error)
    }
  }

  updateTask = async (request: any, response: Response, next: NextFunction) => {
    try {
      const updatedTask = request.body;  
      const taskId = request.params.id;
      const userId = request.user._id;
      const task = await this.taskService.updateTask(updatedTask, taskId, userId);
      response.status(200).send(task);
    } catch(error) {
      next(error);
    }
  }

  deleteTask = async (request: any, response: Response, next: NextFunction) => {
    try {
      const taskId = request.params.id;
      const userId = request.user._id;
      await this.taskService.deleteTask(taskId, userId);
      response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
