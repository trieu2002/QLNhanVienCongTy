import express from 'express';
import configViewEngine from './src/config/viewEngiene';
import initRoutes from './src/router/router';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './src/config/connectDB';
import { errorHandler } from './src/middleware/errors';
const app = express();
// config view engine
configViewEngine(app);
connectDB();
// confg middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// config router
initRoutes(app);
app.use(errorHandler);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log('<<<<<<< Serser is running >>>>>>>', PORT);
});