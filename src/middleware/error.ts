import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/error';

function errorMiddleware(
  error: HttpException, request: Request, response: Response, next: NextFunction
){
  const status = error.httpCode || 500;
  const message = error.message || "Black software magic has occured, try again later";

  response.status(status).send({
   status: status,
   message: message 
  })
}

export default errorMiddleware;