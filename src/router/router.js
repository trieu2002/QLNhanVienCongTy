import express from 'express';
import { ValidationMiddleware } from '../middleware/validation';
import { LoginSchema, RegisterSchema } from '../validation/auth/auth';
import { AuthController } from '../controller/auth/auth.controller';
import { checkAuthGuard, checkAuthGuardPermission } from '../middleware/jwt-guard';
import UserController from '../controller/entities/user.controller';
import { createUserSchema, isValidID, updateUserSchema } from '../validation/entities/user.validation';
import GroupController from '../controller/entities/group.controller';
import { createGroupSchema, updateGroupSchema } from '../validation/entities/group.validation';
import RoleController from '../controller/entities/role.controller';
import { createRoleSchema, updateRoleSchema } from '../validation/entities/role.validation';
import ProjectController from '../controller/entities/project.controller';
import { createProjectSchema, updateProjectSchema } from '../validation/entities/project.validation';
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
    router.put('/user/update/:userId', ValidationMiddleware(updateUserSchema), UserController.updateUser);
    /**
     * Module Group
     */
    router.get('/group/view', GroupController.getGroups);
    router.post('/group/create', ValidationMiddleware(createGroupSchema), GroupController.createGroup);
    router.put('/group/update/:groupId', ValidationMiddleware(updateGroupSchema), GroupController.updateGroup);
    router.delete('/group/delete/:groupId', GroupController.deleteGroup);
    /**
     * Module Role
     */
    router.get('/role/view', RoleController.getRoles);
    router.post('/role/create', ValidationMiddleware(createRoleSchema), RoleController.createRoles);
    router.put('/role/update/:roleId', ValidationMiddleware(updateRoleSchema), RoleController.updateRole);
    router.delete('/role/delete/:roleId', RoleController.deleteRole);
    router.get('/role/by-group/:groupId', RoleController.getByGroup);
    router.post('/role/assign-group', RoleController.assignRoleToGroup);
    /**
     * Module Project
     */
    router.get('/project/view', ProjectController.getProjects);
    router.post('/project/create', ValidationMiddleware(createProjectSchema), ProjectController.createProject)
    router.put('/project/update/:projectId', ValidationMiddleware(updateProjectSchema), ProjectController.updateProject);
    router.delete('/project/delete/:projectId', ProjectController.deleteProject);
    return app.use('/api/v1', router);
};
export default initRoutes;