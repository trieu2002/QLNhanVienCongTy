const yup = require("yup");
export const createRoleSchema = yup.object({
    body: yup.array().of(yup.object().shape({
        url: yup.string().required('Url không được để trống').max(255),
        description: yup.string().required('Mô tả phòng ban không được để trống').max(255)
    }))

})
export const updateRoleSchema = yup.object({
    body: yup.object({
        url: yup.string().required('Url không được để trống').max(255),
        description: yup.string().required('Mô tả phòng ban không được để trống').max(255)
    })
})