import express from 'express';
import configViewEngine from './src/config/viewEngiene';
import initRoutes from './src/router/router';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config();
const app = express();
// config view engine
configViewEngine(app);
// confg middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
// config router
initRoutes(app);
// connectDB();
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log('<<<<<<< Serser is running >>>>>>>', PORT);
});