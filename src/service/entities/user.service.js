import statusCode from '../../enum/statusCode';
import successResponse from '../../helper/successResponse';
import db from '../../models/index';
import { Op } from 'sequelize';
import { AuthService } from '../../service/auth/auth..service';
import ConflictException from '../../exception/Conflict';
import ForbiddenException from '../../exception/Forbidden';
import NotFoundException from '../../exception/NotFound';
const UserService = {
    async getListUsers(query, res) {
        let { page, pageSize, search, sortBy, sortOrder } = query;
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
                        email: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        username: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        phonenumber: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ]
            };
        }

        let users = await db.User.findAll({ raw: true });
        console.log('<<<<<<< sortBy >>>>>>>', sortBy);
        console.log('<<<<<<< sortOrder >>>>>>>', sortOrder);
        let userPage = await db.User.findAll({
            where: conditionQueries,
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder.toUpperCase()]],
            raw: true,
            attributes: { exclude: ['password', 'GroupId'] }

        });
        const _cloneDeep = [...users];
        console.log('<<<<<<< _cloneDeep >>>>>>>', _cloneDeep.length);
        let total = _cloneDeep.length;
        let pages = Math.ceil(_cloneDeep.length / limit);
        let meta = {
            current,
            pageSize: limit,
            pages,
            total
        };

        return successResponse(res, statusCode['OK'], 'Get user by paging', {
            meta,
            users: userPage
        });

    },
    async getUserById(id, res) {
        let user = await db.User.findOne({
            where: { id },
            raw: true,
            attributes: ['id', 'username', 'address', 'gender', 'email', 'phonenumber']
        });
        console.log('<<<<<<< user >>>>>>>', user);
        if (!user) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'NotFound', 'Không tìm thấy người dùng!');
        }
        return successResponse(res, statusCode['OK'], 'Get user by id', user);

    },
    async createUser(rawData, res) {
        const { email, password, username, gender, address, phonenumber, groupId } = rawData;
        // check email/ phonenumber
        const [emailExist, phoneExist] = await Promise.all([AuthService.checkEmailExist(email), AuthService.checkPhonenumberExist(phonenumber)]);
        if (emailExist === true) {
            throw new ConflictException(statusCode['CONFLICT'], 'Conflict', 'Email đã tồn tại.Vui lòng chọn tài khoản khác để đăng kí!')
        }
        if (phoneExist === true) {
            throw new ConflictException(statusCode['CONFLICT'], 'Conflict', 'Số điện thoại đã tồn tại.Vui lòng chọn tài khoản khác để đăng kí!')
        }
        const group = await db.Group.findOne({
            where: { id: groupId },
            raw: true
        });
        let id = group ?? group?.id;
        let user = await db.User.create({
            email, password: AuthService.hashPassword(password), username, gender, address, phonenumber, id,
        });
        let obj = user.get({ plain: true });
        console.log('<<<<<<< obj >>>>>>>', obj);
        obj.password = undefined;
        obj.id = undefined;
        return successResponse(res, statusCode['OK'], 'Create new a user', obj);
    },
    async updateUser(userId, rawData, res) {
        const { email, username, gender, address, phonenumber, groupId } = rawData;
        const [emailExist, phoneExist] = await Promise.all([AuthService.checkEmailExist(email), AuthService.checkPhonenumberExist(phonenumber)]);
        if (emailExist === true) {
            throw new ConflictException(statusCode['CONFLICT'], 'Conflict', 'Email đã tồn tại.Vui lòng chọn tài khoản khác để đăng kí!')
        }
        if (phoneExist === true) {
            throw new ConflictException(statusCode['CONFLICT'], 'Conflict', 'Số điện thoại đã tồn tại.Vui lòng chọn tài khoản khác để đăng kí!')
        };
        const found = await db.User.findOne({ where: { id: userId }, raw: true });
        if (!found) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'NotFound', 'Không tìm thấy người dùng để cập nhật!');
        }

        const group = await db.Group.findOne({
            where: { id: groupId },
            raw: true
        });
        let id = group ?? group?.id;
        await db.User.update({
            email,
            username,
            gender,
            address,
            phonenumber,
            groupId
        }, {
            where: { id }
        });

        return successResponse(res, statusCode['OK'], 'Update new a user');
    },
    async deleteUser(id, res) {
        let user = await db.User.findOne({
            where: { id },
            raw: true,
            nest: true,
            attributes: ['id', 'username', 'address', 'gender', 'email', 'phonenumber', 'groupId'],
            include: [{ model: db.Group, attributes: ['id', 'name'] }]
        });

        let notAccessAdmin = user?.Group?.name;

        if (!user) {
            throw new NotFoundException(statusCode['NOTFOUND'], 'NotFound', 'Không tìm thấy người dùng!');
        };
        if (notAccessAdmin === 'Admin') {
            throw new ForbiddenException(statusCode['FORBIDDEN'], 'Forbidden', 'Không thể xóa người dùng là quản trị viên!');
        }
        await db.User.destroy({
            where: { id }
        });
        return successResponse(res, statusCode['OK'], 'Remove user success', user);

    },

};
export default UserService;