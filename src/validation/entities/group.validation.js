const yup = require("yup");
export const createGroupSchema = yup.object({
    body: yup.object({
        name: yup.string().required('Tên phòng ban không được để trống').max(255),
        description: yup.string().required('Mô tả phòng ban không được để trống').max(255)
    })
});
export const updateGroupSchema = yup.object({
    body: yup.object({
        name: yup.string().required('Tên phòng ban không được để trống').max(255),
        description: yup.string().required('Mô tả phòng ban không được để trống').max(255)
    })
});
