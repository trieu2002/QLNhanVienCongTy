import GroupService from "../../service/entities/group.service"
import { catchAsyncError } from "../../middleware/catchAsyncError";
const GroupController = {
    getGroups: catchAsyncError(async function (req, res) {
        const data = await GroupService.getGroups(res, req.query);
        return data;
    }),
    createGroup: catchAsyncError(async function (req, res) {
        const data = await GroupService.createGroup(req.body, res);
        return data;
    }),
    updateGroup: catchAsyncError(async function (req, res) {
        const data = await GroupService.updateGroup(req.params.groupId, req.body, res);
        return data;
    }),
    deleteGroup: catchAsyncError(async function (req, res) {
        const data = await GroupService.deleteGroup(req.params.groupId, res);
        return data;
    })
};
export default GroupController;