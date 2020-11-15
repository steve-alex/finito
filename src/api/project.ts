import { Router, Request, Response, NextFunction} from 'express';
import Controller from '../interface/Controller.interface';
import Project from '../models/project';
import auth from '../middleware/auth';
import HttpException from '../exceptions/error';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException'


class ProjectController implements Controller {
  public path = '/projects';
  public router = Router();

  constructor(){
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.post(this.path, auth, this.createProject);
    this.router.get(`${this.path}/:id`, auth, this.getProjectById);
    this.router.patch(`${this.path}/:id`, auth, this.updateProject);
    this.router.delete(`${this.path}/:id`, auth, this.deleteProject);
  }

  createProject = async (request: any, response: Response, next: NextFunction) => {
    const task = new Project({
      ...request.body,
      owner: request.user._id
    })

    try {
      await task.save();
      response.status(201).send(task);
    } catch (e) {
      next(new HttpException(400, 'Unable to create project'));
    }
  }

  getProjectById = async (request: any, response: Response, next: NextFunction) => {
    const _id = request.params.id;

    try {
      const project = await Project.findOne({ _id, owner: request.user._id });

      if (!project) {
        return next(new ResourceNotFoundException('Project', _id));
      }

      response.status(200).send(project);
    } catch (e) {
      next(new HttpException(400, 'Unable to get project'))
    }
  }

  updateProject = async (request: any, response: Response, next: NextFunction) => {
    const _id = request.params.id;
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    // TODO - move all of this into a new place? Some kind of helper folder?

    if (!isValidOperation){
      return next(new HttpException(400, "Invalid updates"));
    }
    //TODO - Should I be type checking the request.body with an interface?

    try {
      const project = await Project.findOne({ _id, owner: request.user._id });

      if (!project){
        return next(new ResourceNotFoundException('Project', _id));
      }

      updates.forEach((update) => project[update] = request.body[update]);
      await project.save();
      response.status(200).send(project);
    } catch(e) {
      next(new HttpException(400, "Unable to update project"));
    }
  }

  deleteProject = async (request: any, response: Response, next: NextFunction) => {
    const _id = request.params.id;
    
    try {
      const task = await Project.findOne({ _id, owner: request.user._id });

      if (!task){
        return next(new ResourceNotFoundException('Project', _id));
      }
      
      response.sendStatus(200);
    } catch (e) {
      next(new HttpException(400, "Unable to delete Project"));
    }
  }
}

module.exports = ProjectController;
