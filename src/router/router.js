import express from 'express';
import { ValidationMiddleware } from '../middleware/validation';
import { LoginSchema, RegisterSchema } from '../validation/auth/auth';
import { AuthController } from '../controller/auth/auth.controller';
import { checkAuthGuard, checkAuthGuardPermission } from '../middleware/jwt-guard';
import UserController from '../controller/entities/user.controller';
import { createUserSchema, isValidID } from '../validation/entities/user.validation';
const router = express.Router();
const version = ['v1', 'v2'];
const initRoutes = (app) => {
    /**
     * Config middle chung
     */
    router.all("*", checkAuthGuard, checkAuthGuardPermission);
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
    router.get('/user/view', UserController.getListUsers);
    router.get('/user/viewById/:userId', ValidationMiddleware(isValidID), UserController.getUserById)
    router.post('/user/create', ValidationMiddleware(createUserSchema), UserController.createUser);
    router.delete('/user/delete/:userId', ValidationMiddleware(isValidID), UserController.deleteUser)
    return app.use('/api/v1', router);
};
export default initRoutes;