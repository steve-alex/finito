import { Router, Request, Response, NextFunction} from 'express';
import Controller from '../interface/Controller.interface';
import auth from '../middleware/auth';
import RequestDTO from '../interface/RequestDTO.interface';
import { taskService } from '../services/services';

class TaskController implements Controller {
  public path = '/tasks';
  public router = Router();

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

  createTask = async (request: RequestDTO, response: Response, next: NextFunction) => {
    const updatedTask = request.body;
    const userId = request.user._id;

    try {
      const task = await taskService.createTask(updatedTask, userId);
      response.status(201).send(task);
    } catch (error) {
      next(error);
    }
  }

  getTaskById = async (request: RequestDTO, response: Response, next: NextFunction) => {
    const taskId = request.params.id;
    const userId = request.user._id;

    try {
      const task = await taskService.getTaskById(taskId, userId)
      response.status(200).send(task);
    } catch (error) {
      next(error)
    }
  }

  getTasks = async (request: RequestDTO, response: Response, next: NextFunction) => {
    try {
      const tasks = await taskService.getTasks(request.user, request.query)
      response.status(200).send(tasks);
    } catch (error) {
      next(error)
    }
  }

  updateTask = async (request: RequestDTO, response: Response, next: NextFunction) => {
    const updatedTask = request.body;  
    const taskId = request.params.id;
    const userId = request.user._id;

    try {
      const task = await taskService.updateTask(updatedTask, taskId, userId);
      response.status(200).send(task);
    } catch(error) {
      next(error);
    }
  }

  deleteTask = async (request: RequestDTO, response: Response, next: NextFunction) => {
    const taskId = request.params.id;
    const userId = request.user._id;

    try {
      await taskService.deleteTask(taskId, userId);
      response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default TaskController;
