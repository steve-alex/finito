import express = require("express");

export function loggerMiddleWare(request: express.Request, response: express.Response, next){
  console.log(`${request.method} ${request.path}`)
  next();
}

module.exports = {
  loggerMiddleWare
}