import { Router, Request, Response, NextFunction} from 'express';
import Controller from '../interface/Controller.interface';
import auth from '../middleware/auth';
import HttpException from '../exceptions/error';
import ProjectService from '../services/project.service';
import RequestDTO from '../interface/RequestDTO.interface';

class ProjectController implements Controller {
  public path = '/projects';
  public router = Router();
  public projectService = new ProjectService();

  constructor(){
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.post(this.path, auth, this.createProject);
    this.router.get(`${this.path}/:id`, auth, this.getProjectById);
    this.router.patch(`${this.path}/:id`, auth, this.updateProject);
    this.router.delete(`${this.path}/:id`, auth, this.deleteProject);
  }

  createProject = async (request: RequestDTO, response: Response, next: NextFunction) => {
    const projectDetails = request.body;
    const userId = request.user._id;

    try {
      const project = await this.projectService.createProject(projectDetails, userId);
      response.status(201).send(project);
    } catch (error) {
      next(error);
    }
  }

  getProjectById = async (request: RequestDTO, response: Response, next: NextFunction) => {
    const projectId = request.params.id;
    const userId = request.user._id;

    try {
      const project = await this.projectService.getProjectById(projectId, userId);
      response.status(200).send(project);
    } catch (error) {
      next(error)
    }
  }

  updateProject = async (request: RequestDTO, response: Response, next: NextFunction) => {
    const updatedProject = request.body;
    const projectId = request.params.id;
    const userId = request.user._id;

    console.log('Updated Project: ', updatedProject);

    try {
      const project = await this.projectService.updateProject(updatedProject, projectId, userId);
      response.status(200).send(project);
    } catch(error) {
      next(error);
    }
  }

  deleteProject = async (request: RequestDTO, response: Response, next: NextFunction) => {
    const projectId = request.params.id;
    const userId = request.user._id;
    
    try {
      await this.projectService.deleteProject(projectId, userId);
      response.sendStatus(200);
    } catch (e) {
      next(new HttpException(400, "Unable to delete Project"));
    }
  }
}

export default ProjectController;
