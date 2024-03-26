import { EMAIL_REGX, PHONE_REGEX } from "../../const/const";
const yup = require("yup");
export const createUserSchema = yup.object({
    body: yup.object({
        email: yup.string().required('Email khồng được để trống').matches(EMAIL_REGX, 'Email không đúng định dạng'),
        password: yup.string().required("Mật khẩu không được để trống"),
        gender: yup.number().required('Giới tính không được đẻ trống'),
        username: yup.string().required("Họ tên không được để trống"),
        address: yup.string().required("Địa chỉ không được để trống"),
        phonenumber: yup.string().required('Số điện thoại không được để trống').matches(PHONE_REGEX, 'Số điện thoại không đúng định dạng'),
        groupId: yup.number().required('Nhóm không được để trống')
    })
})
export const isValidID = yup.object({
    params: yup.object({
        userId: yup.number('Id là số').required('Id là bắt buộc')
    })
})
export const updateUserSchema = yup.object({
    body: yup.object({
        email: yup.string().required('Email khồng được để trống').matches(EMAIL_REGX, 'Email không đúng định dạng'),
        gender: yup.number().required('Giới tính không được đẻ trống'),
        username: yup.string().required("Họ tên không được để trống"),
        address: yup.string().required("Địa chỉ không được để trống"),
        phonenumber: yup.string().required('Số điện thoại không được để trống').matches(PHONE_REGEX, 'Số điện thoại không đúng định dạng'),
        groupId: yup.number().required('Nhóm không được để trống')
    })
})