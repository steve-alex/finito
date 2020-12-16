const redis = require('redis')
const util = require('util');

const RedisClient = redis.createClient(process.env.REDIS_URL);
RedisClient.get = util.promisify(RedisClient.get)



export default RedisClient;

// promisify takes any function with a callback argument and turns it into a promise

// export default RedisClient;
