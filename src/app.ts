import express  from 'express';
import mongoose from 'mongoose';
import DBConnectionSettings from './interface/DbConnectionSettings.interface';
import errorMiddleware from './middleware/error';
import loggerMiddleWare from "./middleware/logger";
import UserController from './api/user';
import TaskController from './api/task';
import AreaController from './api/area';
import ProjectController from './api/project';

class App {
  private connectionUrl: string = 'mongodb://127.0.0.1:27017/finito-api';
  private dbConnectionSettings: DBConnectionSettings = { useUnifiedTopology: true, useNewUrlParser: true };
  public app: express.Application;
  public port: number;

  constructor(port: number){
    this.app = express();
    this.port = port;

    this.connectToDatabase()
    this.initializeMiddlewares();
    this.initializeControllers();
  }

  private connectToDatabase(){
    mongoose.connect(this.connectionUrl, this.dbConnectionSettings)
    // TODO - make all of this come from process.env file, refactor for cloud db
  }

  private initializeMiddlewares(){
    this.app.use(express.json());
    this.app.use(loggerMiddleWare);
    this.app.use(errorMiddleware);
  }

  private initializeControllers(){
    this.app.use(new UserController().router);
    this.app.use(new TaskController().router);
    this.app.use(new AreaController().router);
    this.app.use(new ProjectController().router);
  }

  public listen(){
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    })
  }
}

export default App;
