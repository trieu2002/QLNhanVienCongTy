import { catchAsyncError } from "../../middleware/catchAsyncError";
import RoleService from "../../service/entities/role.service";

const RoleController = {
    getRoles: catchAsyncError(async function (req, res) {
        const data = await RoleService.getRoles(req.query, res);
        return data;
    }),
    createRoles: catchAsyncError(async function (req, res) {
        const data = await RoleService.createRoles(req.body, res);
        return data;
    }),
    updateRole: catchAsyncError(async function (req, res) {
        const data = await RoleService.updateRole(req.params.roleId, req.body, res);
        return data;
    }),
    deleteRole: catchAsyncError(async function (req, res) {
        const data = await RoleService.deleteRole(req.params.roleId, res);
        return data;
    }),
    getByGroup: catchAsyncError(async function (req, res) {
        const data = await RoleService.getByGroup(req.params.groupId, res);
        return data;
    }),
    assignRoleToGroup: catchAsyncError(async function (req, res) {
        const data = await RoleService.assignRoleToGroup(req.body, res);
        return data;
    })
};
export default RoleController;