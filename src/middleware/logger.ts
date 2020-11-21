import { Request, Response, NextFunction } from "express";

function loggerMiddleWare(request: Request, response: Response, next: NextFunction){
  console.log(`${request.method} ${request.path}`)
  next();
}

export default loggerMiddleWare;
