import HttpException from '../exceptions/error';

class UnableToAuthenticateException extends HttpException {
  constructor(){
    super(401, `Please authenticate`);
  }
}

export default UnableToAuthenticateException;
