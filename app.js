import express from 'express';
import configViewEngine from './src/config/viewEngiene';
import initRoutes from './src/router/router';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
configViewEngine(app);
initRoutes(app);
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log('<<<<<<< Serser is running >>>>>>>', PORT);
})