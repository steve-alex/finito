import { Router, Request, Response, NextFunction} from 'express';
import Controller from '../interface/Controller.interface';
import Area from '../models/area';
import auth from '../middleware/auth';
import HttpException from '../exceptions/error';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException'


class AreaController implements Controller {
  public path = '/areas';
  public router = Router();

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
    const task = new Area({
      ...request.body,
      owner: request.user._id
    })

    try {
      await task.save();
      response.status(201).send(task);
    } catch (e) {
      next(new HttpException(400, 'Unable to create area'));
    }
  }

  getAreaById = async (request: any, response: Response, next: NextFunction) => {
    const _id = request.params.id;

    try {
      const area = await Area.findOne({ _id, owner: request.user._id });

      if (!area){
        return next(new ResourceNotFoundException('Area', _id));
      }

      response.status(200).send(area);
    } catch (e) {
      next(new HttpException(400, 'Unable to get area'))
    }
  }

  updateArea = async (request: any, response: Response, next: NextFunction) => {
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
      const area = await Area.findOne({ _id, owner: request.user._id });

      if (!area){
        return next(new ResourceNotFoundException('Area', _id));
      }

      updates.forEach((update) => area[update] = request.body[update]);
      await area.save();
      response.status(200).send(area);
    } catch(e) {
      next(new HttpException(400, "Unable to update area"));
    }
  }

  deleteArea = async (request: any, response: Response, next: NextFunction) => {
    const _id = request.params.id;
    
    try {
      const task = await Area.findOne({ _id, owner: request.user._id });

      if (!task){
        return next(new ResourceNotFoundException('Area', _id));
      }
      
      response.sendStatus(200);
    } catch (e) {
      next(new HttpException(400, "Unable to delete Area"));
    }
  }
}

module.exports = AreaController;
