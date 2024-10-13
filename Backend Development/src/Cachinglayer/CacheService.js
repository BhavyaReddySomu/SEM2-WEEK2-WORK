const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
    console.error('Redis error:', err);
});

exports.cacheUser = (userId, user) => {
    client.setex(userId, 3600, JSON.stringify(user));
};

exports.getUserFromCache = (userId, callback) => {
    client.get(userId, (err, result) => {
        if (err) {
            callback(err, null);
        }
        callback(null, JSON.parse(result));
    });
};
