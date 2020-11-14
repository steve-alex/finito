import HttpException from '../exceptions/error';

class IncorrectCredentialsException extends HttpException {
  constructor(){
    super(401, `Username or password is valid`);
  }
}

export default IncorrectCredentialsException;
