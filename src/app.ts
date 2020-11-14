import express  from 'express';
import mongoose from 'mongoose';
import DBConnectionSettings from './interface/DbConnectionSettings.interface';
import errorMiddleware from './middleware/error';
import { loggerMiddleWare } from "./middleware/logger";
const userController = require('./api/user');
const taskController = require('./api/task');

class App {
  private connectionUrl: string = 'mongodb://127.0.0.1:27017/finito-api';
  // TODO - put this in process.env file
  private dbConnectionSettings: DBConnectionSettings = { useUnifiedTopology: true, useNewUrlParser: true };
  // TODO - put this in its own settings folder
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
    this.app.use(new userController().router);
    this.app.use(new taskController().router);
    // this.app.use(projectRouter);
    // this.app.use(areaRouter);
  }

  public listen(){
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    })
  }
}

export default App;
