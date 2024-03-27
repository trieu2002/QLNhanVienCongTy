import express from 'express';
import configViewEngine from './src/config/viewEngiene';
import initRoutes from './src/router/router';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import i18n from 'i18n'; // Import i18n
dotenv.config();
import connectDB from './src/config/connectDB';
import { errorHandler } from './src/middleware/errors';
import { localize } from './src/middleware/localize';

const app = express();
// config view engine
configViewEngine(app);
connectDB();
// confg middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
/**
 * Config language
 */
app.use(localize);

// Cấu hình i18n
i18n.configure({
    locales: ['en', 'vi'],
    directory: __dirname + '/src/languages', // Sử dụng đường dẫn tuyệt đối
    updateFiles: false,
    extension: '.json',
    indent: '',
    defaultLocale: 'vi'
});

// config router
initRoutes(app);
app.use(errorHandler);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log('<<<<<<< Server is running >>>>>>>', PORT);
});
