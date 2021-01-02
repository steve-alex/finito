import { Request } from 'express';
import { IUser } from '../models/user';

/*
Request Data Transfer Object
This interface extends the express Request interface with a user and token value. 
These properties added onto the incoming request in the auth middleware
*/
interface RequestDTO extends Request {
  user: IUser,
  token: string
}

export default RequestDTO;
