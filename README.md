Finito-api is an api for a task management application.
This project was built to answer all the questions I had about building a stable, production-ready API. Along the way, I got to explore lots of cool new technology and learn some important lessons.



I couldn't have done it myself and was heavily inspired by the following resources -
1. https://12factor.net/
2. https://github.com/goldbergyoni/nodebestpractices
3. https://www.google.com/



Funky Features Include:
* API authentication with JSON Web Tokens through middleware.
* Caching with expensive requests using Redis Cache.
* Cloud database connection using mongoDB Cloud Atlas. 
* Continuous deployment to Heroku when a GitHub action is detected, courtesy of Travis CI and a (fingers cross) passing Jest test suite.
