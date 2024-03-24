import { AuthService } from "../../service/auth/auth..service";
import { catchAsyncError } from '../../middleware/catchAsyncError';

export const AuthController = {
    register: catchAsyncError(async function (req, res) {
        const data = await AuthService.register(req.body, res);
        return data;
    }),
    login: catchAsyncError(async function (req, res) {
        const data = await AuthService.login(req.body, res);
        return data;
    }),
    logout(req, res) {
        // Logic for logout
        const data = AuthService.logout(req, res);
        return data;
    },
    account(req, res) {
        // Logic for account
        const data = AuthService.getAccount(req, res);
        return data;
    }
};
