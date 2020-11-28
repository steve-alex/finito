import HttpException from '../exceptions/error';

class ResourceNotFoundException extends HttpException {
  constructor(resource: string, id: string){
    super(404, `${resource} with id ${id} not found`);
  }
}

export default ResourceNotFoundException;
