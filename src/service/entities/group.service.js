import statusCode from "../../enum/statusCode";
import ConflictException from "../../exception/Conflict";
import NotFoundException from "../../exception/NotFound";
import ServerInternalErrorException from "../../exception/ServerError";
import successResponse from "../../helper/successResponse";
import db from '../../models/index';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import BadRequestException from "../../exception/BadRequest";
dotenv.config();
const GroupService = {
    async getGroups(res, rawData) {
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
        let groups = await db.Group.findAll({ raw: true });
        console.log('<<<<<<< sortBy >>>>>>>', sortBy);
        console.log('<<<<<<< sortOrder >>>>>>>', sortOrder);
        let groupPage = await db.Group.findAll({
            where: conditionQueries,
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder.toUpperCase()]],
            raw: true,

        });
        const _cloneDeep = [...groups];
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
            groups: groupPage
        });
    },
    async createGroup(rawData, res) {
        let { name, description } = rawData;
        let nameExist = await this.findByName(name);
        if (nameExist === true) {
            throw new ConflictException(statusCode['CONFLICT'], 'Conflict', 'Tên không ban đã tồn tại.Vui lòng chọn phòng khác!')
        };
        await db.Group.create({
            name, description
        });

        return successResponse(res, statusCode['CREATED'], 'Create a new group',)
    },
    async updateGroup(groupId, rawData, res) {
        let { name, description } = rawData;
        const groupFound = await this.findById(groupId);
        if (!groupFound) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'Notfound', "Không tìm thấy phòng ban này để cập nhật");
        }

        let nameExist = await this.findByName(name);
        if (nameExist === true) {
            throw new ConflictException(statusCode['CONFLICT'], 'Conflict', 'Tên không ban đã tồn tại.Vui lòng chọn phòng khác!')
        };
        let [count] = await db.Group.update({
            name, description
        }, {
            where: { id: groupId }
        });
        if (count === 0) {
            throw new ServerInternalErrorException(statusCode['INTERNAL_SERVER_ERROR'], 'Server internal error', 'Có lỗi xảy ra trong quá trình cập nhật')
        }

        return successResponse(res, statusCode['OK'], 'Update a group');

    },
    async deleteGroup(groupId, res) {
        const groupFound = await this.findById(groupId);
        if (!groupFound) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'Notfound', "Không tìm thấy phòng ban này để xóa!");
        };
        const nameGroup = groupFound ?? groupFound?.name;
        if (nameGroup?.name === process.env.ADMIN_NAME_GROUP_ROOT) {
            throw new BadRequestException(statusCode['BAD_REQUEST'], 'BadRequest', 'Không thể xóa phòng Admin!');
        }
        const count = await db.Group.destroy({
            where: {
                id: groupId
            }
        });
        if (count === 0) {
            throw new ServerInternalErrorException(statusCode['INTERNAL_SERVER_ERROR'], 'Server internal error', 'Có lỗi xảy ra trong quá trình xóa')
        }
        return successResponse(res, statusCode['OK'], 'Delete a group');
    },
    findByIdGroup() {

    },
    async findByName(name) {
        let group = await db.Group.findOne({
            where: { name }
        });
        if (group) {
            return true;
        }
        return false;
    },
    async findById(id) {
        const found = await db.Group.findOne({
            where: {
                id: id
            },
            raw: true
        });
        return found;
    },

};
export default GroupService;