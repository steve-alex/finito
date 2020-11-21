import { Router, Request, Response, NextFunction} from 'express';
import Controller from '../interface/Controller.interface';
import auth from '../middleware/auth';
import AreaService from '../services/area.service';

class AreaController implements Controller {
  public path = '/areas';
  public router = Router();
  public areaService = new AreaService;

  constructor(){
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.post(this.path, auth, this.createArea);
    this.router.get(`${this.path}/:id`, auth, this.getAreaById);
    this.router.patch(`${this.path}/:id`, auth, this.updateArea);
    this.router.delete(`${this.path}/:id`, auth, this.deleteArea);
  }

  createArea = async (request: any, response: Response, next: NextFunction) => {
    const name = request.body.name;
    const userId = request.user._id;

    try {
      const area = await this.areaService.createArea(name, userId);
      response.status(201).send(area);
    } catch (error) {
      next(error);
    }
  }

  getAreaById = async (request: any, response: Response, next: NextFunction) => {
    const areaId = request.params.id;
    const userId = request.user._id

    try {
      const area = await this.areaService.getAreaById(areaId, userId);
      response.status(200).send(area);
    } catch (error) {
      next(error)
    }
  }

  updateArea = async (request: any, response: Response, next: NextFunction) => {
    const updatedArea = request.body;
    const areaId = request.params.id;
    const userId = request.user._id;

    try {
      const area = await this.areaService.updateArea(updatedArea, areaId, userId);
      response.status(200).send(area);
    } catch(error) {
      next(error);
    }
  }

  deleteArea = async (request: any, response: Response, next: NextFunction) => {
    const areaId = request.params.id;
    const userId = request.user._id;

    try {
      await this.areaService.deleteArea(areaId, userId);
      response.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default AreaController;
