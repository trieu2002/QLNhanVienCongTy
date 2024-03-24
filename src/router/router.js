import express from 'express';
import { ValidationMiddleware } from '../middleware/validation';
import { LoginSchema, RegisterSchema } from '../validation/auth/auth';
import { AuthController } from '../controller/auth/auth.controller';
const router = express.Router();
const version = ['v1', 'v2'];
const initRoutes = (app) => {
    /**
     * Module Auth
     */
    router.post('/auth/login', ValidationMiddleware(LoginSchema), AuthController.login);
    router.post('/auth/register', ValidationMiddleware(RegisterSchema), AuthController.register);
    router.post('/auth/logout', AuthController.logout);
    router.get('/auth/account', AuthController.account);
    /**
     * Module User
     */
    return app.use('/api/v1', router);
};
export default initRoutes;