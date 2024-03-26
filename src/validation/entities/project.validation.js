const yup = require("yup");
export const createProjectSchema = yup.object({
    body: yup.object({
        name: yup.string().required(),
        description: yup.string().required(),
        startDate: yup.string().required(),
        customerId: yup.number().required()
    })
});
export const updateProjectSchema = yup.object({
    body: yup.object({
        name: yup.string().required(),
        description: yup.string().required(),
        startDate: yup.string().required(),
        customerId: yup.number().required()
    })
})