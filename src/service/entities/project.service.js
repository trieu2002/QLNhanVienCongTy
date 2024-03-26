import statusCode from '../../enum/statusCode';
import ConflictException from '../../exception/Conflict';
import NotFoundException from '../../exception/NotFound';
import ServerInternalErrorException from '../../exception/ServerError';
import successResponse from '../../helper/successResponse';
import db from '../../models/index';
import UserService from './user.service';
const ProjectService = {
    async getProjects(rawData, res) {
        let { page, pageSize, search, sortBy, sortOrder } = rawData;
        let conditionQueries = {};
        let current = +page ? +page : 1;
        let limit = +pageSize ? +pageSize : 3;
        let offset = (current - 1) * limit;
        if (!sortOrder || !sortBy) {
            sortBy = 'createdAt';
            sortOrder = 'DESC';
        }
        if (search) {
            conditionQueries = {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        description: {
                            [Op.like]: `%${search}%`
                        }
                    },
                ]
            };
        }
        let projects = await db.Project.findAll({ raw: true });
        console.log('<<<<<<< sortBy >>>>>>>', sortBy);
        console.log('<<<<<<< sortOrder >>>>>>>', sortOrder);
        let projectPage = await db.Project.findAll({
            where: conditionQueries,
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder.toUpperCase()]],
            raw: true,

        });
        const _cloneDeep = [...projects];
        console.log('<<<<<<< _cloneDeep >>>>>>>', _cloneDeep.length);
        let total = _cloneDeep.length;
        let pages = Math.ceil(_cloneDeep.length / limit);
        let meta = {
            current,
            pageSize: limit,
            pages,
            total
        };

        return successResponse(res, statusCode['OK'], 'Get group by paging', {
            meta,
            projects: projectPage
        });
    },
    async createProject(rawData, res) {
        const { name, description, startDate, customerId } = rawData;
        const nameExist = await this.findByName(name);
        if (nameExist) {
            throw new ConflictException(statusCode['CONFLICT'], 'Conflict', 'Tên dự án đã tồn tại.Vui lòng chọn đề tài khác!')
        };
        const isCustomerIdExist = await UserService.findById(customerId);
        if (!isCustomerIdExist) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'NotFound', 'Không tìm thấy người dùng này!')
        };
        const [count] = await db.Project.create({
            name, description, startDate, customerId
        });
        if (count === 0) {
            throw new ServerInternalErrorException(statusCode['INTERNAL_SERVER_ERROR'], "Error", 'Có lỗi xảy ra khi thêm');
        }
        return successResponse(res, statusCode['CREATED'], 'Create a new project',);
        // add vào project
    },
    async updateProject(projectId, rawData, res) {
        const { name, description, startDate, customerId } = rawData;
        const nameExist = await this.findByName(name);
        if (nameExist) {
            throw new ConflictException(statusCode['CONFLICT'], 'Conflict', 'Tên dự án đã tồn tại.Vui lòng chọn đề tài khác!')
        };
        const isCustomerIdExist = await UserService.findById(customerId);
        if (!isCustomerIdExist) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'NotFound', 'Không tìm thấy người dùng này!')
        };
        const [count] = await db.Project.update({
            name, description, startDate, customerId
        }, {
            where: { id: projectId }
        })
        if (count === 0) {
            throw new ServerInternalErrorException(statusCode['INTERNAL_SERVER_ERROR'], "Error", 'Có lỗi xảy ra khi thêm');
        }
        return successResponse(res, statusCode['OK'], 'Update a new project',);
    },
    async deleteProject(projectId, res) {
        const projectExist = await this.findById(projectId);
        if (!projectExist) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'NotFound', 'Không tìm thấy dự án này!')
        };
        const [count] = await db.Project.destroy({
            where: { id: projectId }
        })
        if (count === 0) {
            throw new ServerInternalErrorException(statusCode['INTERNAL_SERVER_ERROR'], "Error", 'Có lỗi xảy ra khi thêm');
        }
        return successResponse(res, statusCode['OK'], 'Delete a new project',);
    },
    async findByName(name) {
        const persists = await db.Project.findOne({
            where: { name }
        });
        return persists;
    },
    async findById(id) {
        const persists = await db.Project.findOne({
            where: { id: id }
        });
        return persists;
    }
};
export default ProjectService;