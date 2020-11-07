import { Request, Response, NextFunction } from "express";

export function loggerMiddleWare(request: Request, response: Response, next: NextFunction){
  console.log(`${request.method} ${request.path}`)
  next();
}

module.exports = {
  loggerMiddleWare
}
