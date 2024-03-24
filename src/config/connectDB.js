const { Sequelize } = require('sequelize');
import dotenv from 'dotenv';
dotenv.config();

var env = process.env.NODE_ENV || 'development';
console.log('<<<<<<< env >>>>>>>', env);


// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_SERVER_LOCAL,
    dialect: process.env.DB_MYSQL,
    port: process.env.DB_PORT,

});
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database: ', error)
    }
};
export default connectDB;