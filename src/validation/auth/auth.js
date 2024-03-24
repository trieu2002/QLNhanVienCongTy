const yup = require("yup");
export const EMAIL_REGX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PHONE_REGEX = /^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/;

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