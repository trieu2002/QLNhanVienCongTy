export const ValidationMiddleware = (schema) = async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            params: req.params,
            query: req.query
        }, {
            abortEarly: false
        });
        return next();
    } catch (error) {
        console.log('<<<<<<< error >>>>>>>', error);
    }
}