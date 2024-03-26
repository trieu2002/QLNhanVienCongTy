import statusCode from '../../enum/statusCode';
import BadRequestException from '../../exception/BadRequest';
import NotFoundException from '../../exception/NotFound';
import ServerInternalErrorException from '../../exception/ServerError';
import successResponse from '../../helper/successResponse';
import db from '../../models/index';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import GroupService from './group.service';
dotenv.config();
const RoleService = {
    async getRoles(rawData, res) {
        let { page, pageSize, search, sortBy, sortOrder } = rawData;
        let conditionQueries = {};
        let current = +page ? +page : 1;
        let limit = +pageSize ? +pageSize : 3;
        let offset = (current - 1) * limit;
        if (!sortOrder || !sortBy) {
            sortBy = 'createdAt';
            sortOrder = 'ASC';
        }
        if (search) {
            conditionQueries = {
                [Op.or]: [
                    {
                        url: {
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
        let roles = await db.Role.findAll({ raw: true });
        console.log('<<<<<<< sortBy >>>>>>>', sortBy);
        console.log('<<<<<<< sortOrder >>>>>>>', sortOrder);
        let rolePage = await db.Role.findAll({
            where: conditionQueries,
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder.toUpperCase()]],
            raw: true,

        });
        const _cloneDeep = [...roles];
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
            groups: rolePage
        });
    },
    async createRoles(roles, res) {
        //lấy ra tất cả các phòng quyền
        let rolesCurrent = await db.Role.findAll({
            raw: true,
            attribute: ['url', 'description'],
            raw: true
        });
        console.log('<<<<<<< rolesCurrent >>>>>>>', rolesCurrent);
        let persists = roles.filter(({ url: url1 }) => !rolesCurrent.some(({ url: url2 }) => url1 === url2));
        console.log('<<<<<<< persists >>>>>>>', persists);
        if (!persists || persists.length === 0) {
            throw new BadRequestException(statusCode['BAD_REQUEST'], 'BadRequest', 'Khồng thể thêm quyền đã tồn tại');
        };
        const [count] = await db.Role.bulkCreate(persists);
        if (count === 0) {
            throw new ServerInternalErrorException(statusCode['INTERNAL_SERVER_ERROR'], 'Server internal error', 'Có lỗi xáy ra');
        }
        return successResponse(res, statusCode['CREATED'], `Thêm thành công ${persists.length} quyền!`);
    },
    async updateRole(roleid, rawData, res) {
        const roleFound = await this.findById(roleid);
        const { url, description } = rawData;
        if (!roleFound) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'NotFound', "Không tìm thấy quyền dể cập nhât!");
        }
        const [count] = await db.Role.update({
            url, description
        }, {
            where: { id: roleid }
        });
        if (count === 0) {
            throw new ServerInternalErrorException(statusCode['INTERNAL_SERVER_ERROR'], 'Server internal error', 'Có lỗi xảy ra vui lòng liên hệ !');
        }
        return successResponse(res, statusCode['OK'], 'Update a role');
    },
    async deleteRole(roleid, res) {
        const roleFound = await this.findById(roleid);
        if (!roleFound) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'NotFound', "Không tìm thấy quyền xóa!");
        };
        const foundUrl = roleFound ?? roleFound?.url;
        console.log('<<<<<<< foundUrl >>>>>>>', foundUrl);
        if (foundUrl?.url === process.env.CREATE_USER || foundUrl?.url === process.env.CREATE_ROLE || foundUrl?.url === process.env.CREATE_GROUP || foundUrl?.url === process.env.CREATE_PROJECT) {
            throw new BadRequestException(statusCode['BAD_REQUEST'], 'BadRequest', "Không thể xóa quyền này");
        };
        const [count] = await db.Role.destroy({
            where: { id: roleid }
        });
        if (count === 0) {
            throw new ServerInternalErrorException(statusCode['INTERNAL_SERVER_ERROR'], 'Server internal error', 'Có lỗi xảy ra vui lòng liên hệ !');
        }
        return successResponse(res, statusCode['OK'], 'delete a role');
    },
    async findById(id) {
        const found = await db.Role.findOne({
            where: { id: id },
            raw: true
        });
        return found;
    },
    async getByGroup(groupId, res) {
        const found = await GroupService.findById(groupId);
        console.log('<<<<<<< found >>>>>>>', found);
        if (!found) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'NotFound', "Không tìm thấy nhóm!");
        };

        let roles = await db.Group.findOne({
            where: { id: groupId },
            attributes: ['id', 'name', 'description'],
            include: [{ model: db.Role, attributes: ['id', 'url', 'description'], through: { attributes: [] } }]
        })
        console.log('<<<<<<< roles >>>>>>>', roles);
        return successResponse(res, statusCode['OK'], 'get role by group a role', roles);
    },
    async assignRoleToGroup(data) {
        // data={groupId,groupRole:[{groupId,roleId},{}]}
        await db.Group_Role.destroy({
            where: {
                groupId: data.groupId
            }
        });
        await db.Group_Role.bulkCreate(data.groupRole);
        return successResponse(res, statusCode['OK'], 'get role by group a role');

    }

};
export default RoleService;