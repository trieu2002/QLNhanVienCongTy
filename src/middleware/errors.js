export const errorHandler = (err, req, res, next) => {
    let errCode = err?.errCode || 500;
    let message = err?.message ?? "Server internal error";
    let errors = {};
    switch (err?.errCode) {
        case 400:
            
            break;
        case 401:

            break;
        case 403:

            break;

        case 404:

            break;
        case 409:

            break;
        default:
            break;
    }
    return res.status(err?.errCode).json({
        statusCode: err?.errCode,
        message: err?.message,
        errors: err?.errors
    })
}