import UserService from '../../service/entities/user.service';
import { catchAsyncError } from '../../middleware/catchAsyncError';
const UserController = {
    getListUsers: catchAsyncError(async function (req, res) {
        const data = await UserService.getListUsers(req.body, res);
        return data;
    }),
    getUserById: catchAsyncError(async function (req, res) {
        const data = await UserService.getUserById(req.params.userId, res);
        return data;
    }),
    createUser: catchAsyncError(async function (req, res) {
        const data = await UserService.createUser(req.body, res);
        return data;
    }),
    updateUser: catchAsyncError(async function (req, res) {
        const data = await UserService.updateUser(req.params.userId, req.body, res);
        return data;
    }),
    deleteUser: catchAsyncError(async function (req, res) {
        const data = await UserService.deleteUser(req.params.userId, res);
        return data;
    }),
};
export default UserController;