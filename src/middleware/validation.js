export const ValidationMiddleware = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        }, { abortEarly: false });
        return next();
    } catch (err) {
        return res.status(400).json({
            message: 'BadRequest',
            statusCode: 400,
            errors: err?.errors
        });
    }
};