const redis = require('redis')
const util = require('util');
const client = redis.createClient(process.env.REDIS_URL);
const RedisClient = util.promisify(client.get);
// promisify takes any function with a callback argument and turns it into a promise

export default RedisClient;
