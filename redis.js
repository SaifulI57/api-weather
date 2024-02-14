import Redis from "ioredis";
const redisUri = "rediss://default:AVNS_cnwZwYZgOsqmDvm8XT-@redis-sweple-sweple.a.aivencloud.com:12778";
const redis = new Redis(redisUri);
redis.set("key", "hello world");

redis.del("Jawa timur").then(function (result) {
    console.log(`The value of key is: ${result}`);
    redis.disconnect();
});
