import redis from 'redis';
export const redisClient = redis.createClient({
    host: 'localhost', // Địa chỉ host của Redis server
    port: 6379,
});
// Khi kết nối thành công
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

// Khi xảy ra lỗi kết nối
redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});
