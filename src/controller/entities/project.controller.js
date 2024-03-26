import { catchAsyncError } from "../../middleware/catchAsyncError";
import ProjectService from "../../service/entities/project.service";
const ProjectController = {
    getProjects: catchAsyncError(async function (req, res) {
        const data = await ProjectService.getProjects(req.query, res);
        return data;
    }),
    createProject: catchAsyncError(async function (req, res) {
        const data = await ProjectService.createProject(req.body, res);
        return data;
    }),
    updateProject: catchAsyncError(async function (req, res) {
        const data = await ProjectService.updateProject(req.params.projectId, req.body, res);
        return data;
    }),
    deleteProject: catchAsyncError(async function (req, res) {
        const data = await ProjectService.deleteProject(req.params.projectId, res);
        return data;
    })
};
export default ProjectController;