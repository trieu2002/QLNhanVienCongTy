import { redisClient } from '../config/connectRedis';
const setCacheWithTime = async (key, data, time) => {
    await redisClient.setEx(key, time, data);
};
export const cacheMiddleware = (time) => async (req, res, next) => {
    const currentPath = req.path;
    await redisClient.get(currentPath, (err, data) => {
        if (err) return null;
        if (data !== null) {
            res.send(data);
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                setCacheWithTime(key, body, time);
                res.sendResponse(body);
            };
            next();
        }
    })
}