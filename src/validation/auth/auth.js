import { EMAIL_REGX, PHONE_REGEX } from "../../const/const";

const yup = require("yup");


export const LoginSchema = yup.object({
    body: yup.object({
        email_or_phone: yup.string()
            .required('Email / Phone is required')
            .test('email_or_phone', 'Email / Phone is invalid', (value) => {
                return validateEmail(value) || validatePhone(value);
            }),
        password: yup.string().required('Mật khẩu không được để trống')
    })
});

const validateEmail = (email) => {
    return yup.string().required('Email không được để trống').matches(EMAIL_REGX, 'Email không đúng định dạng').isValidSync(email)
};

const validatePhone = (phone) => {
    return yup.string().required('Số điện thoại không được để trống').matches(PHONE_REGEX, 'Số điện thoại không đúng định dạng').isValidSync(phone)

};
export const RegisterSchema = yup.object().shape({
    body: yup.object({
        email: yup.string().required('Email khồng được để trống').matches(EMAIL_REGX, 'Email không đúng định dạng'),
        password: yup.string().required("Mật khẩu không được để trống"),
        gender: yup.number().required('Giới tính không được đẻ trống'),
        username: yup.string().required("Họ tên không được để trống"),
        address: yup.string().required("Địa chỉ không được để trống"),
        phonenumber: yup.string().required('Số điện thoại không được để trống').matches(PHONE_REGEX, 'Số điện thoại không đúng định dạng')
    })
})