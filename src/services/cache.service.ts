const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

export const RedisClient = redis.createClient(process.env.REDIS_URL);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.useCache = function() {
  this.useCachedValue = true;
  return this;
  // Returning this makes this function chainable
}

mongoose.Query.prototype.exec = async function() {
  const collection = this.mongooseCollection.name;
  const result = await exec.apply(this, arguments)

  if (this.useCachedValue){
    const userKey = JSON.stringify(this.getQuery().owner);
    const resultKey = JSON.stringify(
      Object.assign({}, this.getQuery(), this.getOptions(), { collection })
    );

    RedisClient.hget = util.promisify(RedisClient.hget)
    const cachedValue = await RedisClient.hget(userKey || null, resultKey || null);
    
    if (cachedValue){
      const doc = JSON.parse(cachedValue);
      return Array.isArray(doc)
        ? doc.map(d => new this.model(d))
        : new this.model(doc);
    }
    
    RedisClient.hset(userKey, resultKey, JSON.stringify(result), 'EX', 100);
  }
  
  return result;
}

export function clearCache(hashKey: any){
  RedisClient.del(JSON.stringify(hashKey));
}

module.exports =  {
  RedisClient,
  clearCache
};