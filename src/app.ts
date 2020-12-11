import express  from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import DBConnectionSettings from './interface/DbConnectionSettings.interface';
import errorMiddleware from './middleware/error';
import loggerMiddleWare from "./middleware/logger";
import UserController from './api/user';
import TaskController from './api/task';
import AreaController from './api/area';
import ProjectController from './api/project';
require('dotenv').config();


class App {
  private connectionUrl: string = process.env.CONNECTION_URL;
  private dbConnectionSettings: DBConnectionSettings = { useUnifiedTopology: true, useNewUrlParser: true };
  public app: express.Application;
  public port: number;

  constructor(port: number){
    this.app = express();
    this.port = port;

    this.connectToDatabase()
    this.initializeMiddleware();
    this.initializeControllers();
  }

  public listen(){
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    })
  }

  private connectToDatabase(){
    mongoose.connect(this.connectionUrl, this.dbConnectionSettings)
    //TODO - Consider how this step would work with CI/CD!
  }

  private initializeMiddleware(){
    this.app.use(express.json());
    this.app.use(loggerMiddleWare);
    this.app.use(errorMiddleware);
    this.app.use(cors())
  }

  private initializeControllers(){
    //TODO - Dependancy injection?!
    this.app.use(new UserController().router);
    this.app.use(new TaskController().router);
    this.app.use(new AreaController().router);
    this.app.use(new ProjectController().router);
  }
}

export default App;
