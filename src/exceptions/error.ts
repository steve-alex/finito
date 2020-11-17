class HttpException extends Error {
  httpCode: number;
  name: string;
  // description: string;

  constructor(httpCode: number, name: string){
    super();

    Object.setPrototypeOf(this, new.target.prototype)

    this.httpCode = httpCode;
    this.name = name;

    Error.captureStackTrace(this)
    //TODO - test this out across the application
  };

}

export default HttpException;
