import express from 'express';
import mongoose from 'mongoose';
import { loggerMiddleWare } from "./middleware/logger";
const userController = require('./controllers/user');
const taskController = require('./controllers/task');

interface DBConnectionSettings {
  useUnifiedTopology: boolean,
  useNewUrlParser: boolean
}
// TODO - move this

class App {
  private connectionUrl: string = 'mongodb://127.0.0.1:27017/finito-api';
  // TODO - put this in process.env file
  private dbConnectionSettings: DBConnectionSettings = { useUnifiedTopology: true, useNewUrlParser: true };
  // TODO - put this in its own settings/config file 
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
