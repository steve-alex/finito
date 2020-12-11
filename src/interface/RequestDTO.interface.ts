import { Request } from 'express';
import User from './User.interface';

/*
Request Data Transfer Object
This interface extends the express Request interface with a user and token value. 
These properties added onto the incoming request in the auth middleware
*/
interface RequestDTO extends Request {
  user: User,
  token: String
}
// TODO - Is this even right? Should I be containing some information here about request itself?
// Does this prevent information about the request going through? Hmmm...

export default RequestDTO;
