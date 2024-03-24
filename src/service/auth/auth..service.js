import ConflictException from '../../exception/Conflict';
import db from '../../models/index';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import StatusCode from '../../enum/statusCode';
import BadRequestException from '../../exception/BadRequest';
import { SALT } from '../../const/const';
import successResponse from '../../helper/successResponse';
const jwt = require('jsonwebtoken');
import dotenv from 'dotenv';
dotenv.config();
export const AuthService = {
    async findByEmailOrPhone(email_or_phone) {
        return await db.User.findOne({
            where: {
                [Op.or]: [
                    {
                        phonenumber: email_or_phone
                    },
                    {
                        email: email_or_phone
                    }
                ]
            },
            raw: true,
            attributes: { exclude: ['createdAt', 'createdAt'] },
        })
    },
    async login(rawData, res) {
        const { email_or_phone, password } = rawData;
        const user = await this.findByEmailOrPhone(email_or_phone);
        if (user) {
            const passwordHash = user.password;
            const isVerifyPassword = this.verifyPassword(password, passwordHash);
            if (isVerifyPassword === true) {
                const _cloneDeep = { ...user }; // Tạo bản sao của user
                delete _cloneDeep.password; // Xóa trường password từ bản sao
                let roles = await this.getGroupWithRoles(_cloneDeep);
                // create token
                const payload = {
                    email: _cloneDeep.email,
                    username: _cloneDeep.username,
                    roles,
                    expiresIn: 60 * 60 * 1000
                }
                let token = this.createTokenWithJWT(payload);
                res.cookie('access_token', token, { httpOnly: true, maxAge: 60 * 60 * 60 * 1000 });
                return successResponse(res, StatusCode.OK, 'Login Success', {
                    access_token: token,
                    roles
                });
            }
        }
        throw new BadRequestException(StatusCode['BAD_REQUEST'], 'BadRequest', 'Email/Phonenumber or Mật khẩu không chính xác.Vui lòng thử lại!');
    },
    async register(rawData, res) {
        const { email, password, username, gender, address, phonenumber } = rawData;
        console.log('<<<<<<< phonenumber >>>>>>>', phonenumber);
        let users = await db.User.findAll();
        console.log('<<<<<<< users >>>>>>>', users);
        const [emailExist, phoneExist] = await Promise.all([this.checkEmailExist(email), this.checkPhonenumberExist(phonenumber)]);
        if (emailExist === true) {
            throw new ConflictException(StatusCode['CONFLICT'], 'Conflict', 'Email đã tồn tại.Vui lòng chọn tài khoản khác để đăng kí!')
        }
        if (phoneExist === true) {
            throw new ConflictException(StatusCode['CONFLICT'], 'Conflict', 'Số điện thoại đã tồn tại.Vui lòng chọn tài khoản khác để đăng kí!')
        }
        let hashPassword = this.hashPassword(password);
        let user = await db.User.create({
            email, password: hashPassword, username, gender, address, phonenumber,
        });
        // return data to client
        return successResponse(res, StatusCode.OK, 'Create a new user success');

    },
    async checkPhonenumberExist(phonenumber) {
        const isExist = await db.User.findOne({
            where: { phonenumber }
        });
        if (isExist) {
            return true;
        }
        return false;
    },
    async checkEmailExist(email) {
        const isExist = await db.User.findOne({
            where: { email }
        });
        if (isExist) {
            return true;
        }
        return false;
    },
    hashPassword(password) {
        const salt = bcrypt.genSaltSync(SALT);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    },
    verifyPassword(passowrd, hash) {
        const comaprePassword = bcrypt.compareSync(passowrd, hash);
        return !!comaprePassword; // return true or false
    },
    createTokenWithJWT(payload) {
        let token = null;
        let key = process.env.JWT_TOKEN_SECRET_KEY;

        try {
            token = jwt.sign(payload, key);
        } catch (error) {
            console.log('<<<<<<< error >>>>>>>', error);
        }
        return token;
    },
    async getGroupWithRoles(user) {
        let roles = await db.Group.findOne({
            where: { id: user.groupId },
            attributes: ['id', 'name', 'description'],
            include: [{ model: db.Role, attributes: ['id', 'url', 'description'], through: { attributes: [] } }]
        })
        return roles ? roles : []
    },
    verifyToken(token) {
        let data = null;
        let key = process.env.JWT_TOKEN_SECRET_KEY;
        try {
            let decode = jwt.verify(token, key);
            data = decode;
        } catch (error) {
            console.log('<<<<<<< error >>>>>>>', error);
        }
        return data;
    },
    getAccount(req, res) {
        return successResponse(res, StatusCode['OK'], 'Get Account success', req.user);
    },
    logout(req, res) {
        if (req.cookies) {
            res.clearCookie('access_token');
            return successResponse(res, StatusCode['OK'], 'Logout user', null);
        }
    }


}