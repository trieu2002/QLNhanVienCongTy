const { Sequelize } = require('sequelize');
import winston from 'winston';
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + './src/config/config.js')[env];
console.log('<<<<<<< config >>>>>>>', config);
const logger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'somefile.log' }),
    ],
});

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, null, {
    host: process.env.DB_SERVER_LOCAL,
    dialect: process.env.DB_MYSQL,
    port: process.env.DB_PORT,
    logging: (msg) => logger.info(msg),

});
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Connection has been established successfully.')
        console.log('Connection has been established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database: ', err)
    } finally {
        sequelize.close()
    }
};
export default connectDB;